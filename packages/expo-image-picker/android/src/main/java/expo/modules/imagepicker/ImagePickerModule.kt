package expo.modules.imagepicker

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import com.theartofdev.edmodo.cropper.CropImage
import expo.modules.imagepicker.ImagePickerOptions.Companion.optionsFromMap
import expo.modules.imagepicker.exporters.CompressionImageExporter
import expo.modules.imagepicker.exporters.CropImageExporter
import expo.modules.imagepicker.exporters.ImageExporter
import expo.modules.imagepicker.exporters.RawImageExporter
import expo.modules.imagepicker.fileproviders.CacheFileProvider
import expo.modules.imagepicker.fileproviders.CropFileProvider
import expo.modules.imagepicker.tasks.ImageResultTask
import expo.modules.imagepicker.tasks.VideoResultTask
import org.unimodules.core.ExportedModule
import org.unimodules.core.ModuleRegistry
import org.unimodules.core.Promise
import org.unimodules.core.interfaces.ActivityEventListener
import org.unimodules.core.interfaces.ActivityProvider
import org.unimodules.core.interfaces.ExpoMethod
import org.unimodules.core.interfaces.services.UIManager
import org.unimodules.core.utilities.FileUtilities.generateOutputPath
import org.unimodules.interfaces.imageloader.ImageLoader
import org.unimodules.interfaces.permissions.Permissions
import org.unimodules.interfaces.permissions.PermissionsResponse
import org.unimodules.interfaces.permissions.PermissionsResponseListener
import org.unimodules.interfaces.permissions.PermissionsStatus
import java.io.IOException
import java.lang.RuntimeException
import java.lang.ref.WeakReference

class ImagePickerModule(private val mContext: Context,
                        val moduleRegistryPropertyDelegate: ModuleRegistryPropertyDelegate = ModuleRegistryPropertyDelegate())
  : ExportedModule(mContext), ActivityEventListener {

  private var mCameraCaptureURI: Uri? = null
  private var mPromise: Promise? = null
  private var mPickerOptions: ImagePickerOptions? = null

  private val mExperienceActivity: WeakReference<Activity> by moduleRegistry { activityProvider: ActivityProvider ->
    WeakReference(activityProvider.currentActivity)
  }
  private val mImageLoader: ImageLoader by moduleRegistry()
  private val mUIManager: UIManager by moduleRegistry()
  private val mPermissions: Permissions by moduleRegistry()

  override fun onCreate(moduleRegistry: ModuleRegistry) {
    moduleRegistryPropertyDelegate.onCreate(moduleRegistry)
  }

  private val experienceActivity: Activity?
    get() = mExperienceActivity.get()

  override fun getName() = "ExponentImagePicker"

  @ExpoMethod
  fun requestCameraRollPermissionsAsync(promise: Promise) {
    Permissions.askForPermissionsWithPermissionsManager(mPermissions, promise, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE)
  }

  @ExpoMethod
  fun getCameraRollPermissionsAsync(promise: Promise) {
    Permissions.getPermissionsWithPermissionsManager(mPermissions, promise, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE)
  }

  @ExpoMethod
  fun requestCameraPermissionsAsync(promise: Promise) {
    Permissions.askForPermissionsWithPermissionsManager(mPermissions, promise, Manifest.permission.CAMERA)
  }

  @ExpoMethod
  fun getCameraPermissionsAsync(promise: Promise) {
    Permissions.getPermissionsWithPermissionsManager(mPermissions, promise, Manifest.permission.CAMERA)
  }

  // NOTE: Currently not reentrant / doesn't support concurrent requests
  @ExpoMethod
  fun launchCameraAsync(options: Map<String, Any?>, promise: Promise) {
    val pickerOptions = optionsFromMap(options, promise) ?: return

    val activity = experienceActivity.ifNull {
      promise.reject(ImagePickerConstants.ERR_MISSING_ACTIVITY, ImagePickerConstants.MISSING_ACTIVITY_MESSAGE)
      return
    }

    val intentType = if (pickerOptions.mediaTypes == MediaTypes.VIDEOS) MediaStore.ACTION_VIDEO_CAPTURE else MediaStore.ACTION_IMAGE_CAPTURE
    val cameraIntent = Intent(intentType)
    cameraIntent.resolveActivity(activity.application.packageManager).ifNull {
      promise.reject(IllegalStateException("Error resolving activity"))
      return
    }

    val permissionsResponseHandler = PermissionsResponseListener { permissionsResponse: Map<String, PermissionsResponse> ->
      if (permissionsResponse[Manifest.permission.WRITE_EXTERNAL_STORAGE]?.status == PermissionsStatus.GRANTED
        && permissionsResponse[Manifest.permission.CAMERA]?.status == PermissionsStatus.GRANTED) {
        launchCameraWithPermissionsGranted(promise, cameraIntent, pickerOptions)
      } else {
        promise.reject(SecurityException("User rejected permissions"))
      }
    }

    mPermissions.askForPermissions(permissionsResponseHandler, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.CAMERA)
  }

  private fun launchCameraWithPermissionsGranted(promise: Promise, cameraIntent: Intent, pickerOptions: ImagePickerOptions) {
    val imageFile = createOutputFile(
      mContext.cacheDir,
      if (pickerOptions.mediaTypes == MediaTypes.VIDEOS) ".mp4" else ".jpg"
    ).ifNull {
      promise.reject(IOException("Could not create image file."))
      return
    }

    mCameraCaptureURI = uriFromFile(imageFile)

    val activity = experienceActivity.ifNull {
      promise.reject(ImagePickerConstants.ERR_MISSING_ACTIVITY, ImagePickerConstants.MISSING_ACTIVITY_MESSAGE)
      return
    }

    mPromise = promise
    mPickerOptions = pickerOptions

    if (pickerOptions.videoMaxDuration > 0) {
      cameraIntent.putExtra(MediaStore.EXTRA_DURATION_LIMIT, pickerOptions.videoMaxDuration)
    }

    // camera intent needs a content URI but we need a file one
    cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, contentUriFromFile(imageFile, activity.application))
    startActivityOnResult(cameraIntent, ImagePickerConstants.REQUEST_LAUNCH_CAMERA, promise)
  }

  // NOTE: Currently not reentrant / doesn't support concurrent requests
  @ExpoMethod
  fun launchImageLibraryAsync(options: Map<String, Any?>, promise: Promise) {
    val pickerOptions = optionsFromMap(options, promise) ?: return

    val libraryIntent = Intent().apply {
      when (pickerOptions.mediaTypes) {
        MediaTypes.IMAGES -> type = "image/*"
        MediaTypes.VIDEOS -> type = "video/*"
        MediaTypes.ALL -> {
          type = "*/*"
          putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "video/*"))
        }
      }

      action = Intent.ACTION_GET_CONTENT
    }

    mPromise = promise
    mPickerOptions = pickerOptions

    startActivityOnResult(libraryIntent, ImagePickerConstants.REQUEST_LAUNCH_IMAGE_LIBRARY, promise)
  }

  /**
   * Starts the crop intent.
   *
   * @param promise Promise which will be rejected if something goes wrong
   * @param uri Uri to file which will be cropped
   * @param type Media type of source file
   * @param needGenerateFile Tells if generating a new file is needed
   * @param pickerOptions Additional options
   */
  private fun startCropIntent(promise: Promise, uri: Uri, type: String, needGenerateFile: Boolean, pickerOptions: ImagePickerOptions) {
    var extension = ".jpg"
    var compressFormat = Bitmap.CompressFormat.JPEG
    // if the image is created by camera intent we don't need a new path - it's been already saved
    when {
      type.contains("png") -> {
        compressFormat = Bitmap.CompressFormat.PNG
        extension = ".png"
      }
      type.contains("gif") -> {
        // If we allow editing, the result image won't ever be a GIF as the cropper doesn't support it.
        // Let's convert to PNG in such case.
        extension = ".png"
        compressFormat = Bitmap.CompressFormat.PNG
      }
      type.contains("bmp") -> {
        // If we allow editing, the result image won't ever be a BMP as the cropper doesn't support it.
        // Let's convert to PNG in such case.
        extension = ".png"
        compressFormat = Bitmap.CompressFormat.PNG
      }
      !type.contains("jpeg") -> {
        Log.w(ImagePickerConstants.TAG, "Image type not supported. Falling back to JPEG instead.")
        extension = ".jpg"
      }
    }

    val fileUri: Uri = try {
      if (needGenerateFile) {
        uriFromFilePath(generateOutputPath(mContext.cacheDir, ImagePickerConstants.CACHE_DIR_NAME, extension))
      } else {
        uri
      }
    } catch (e: IOException) {
      promise.reject(ImagePickerConstants.ERR_CAN_NOT_OPEN_CROP, ImagePickerConstants.CAN_NOT_OPEN_CROP_MESSAGE, e)
      return
    }

    val cropImageBuilder = CropImage.activity(uri).apply {
      pickerOptions.forceAspect?.let { (x, y) ->
        setAspectRatio((x as Number).toInt(), (y as Number).toInt())
        setFixAspectRatio(true)
        setInitialCropWindowPaddingRatio(0f)
      }

      setOutputUri(fileUri)
      setOutputCompressFormat(compressFormat)
      setOutputCompressQuality(pickerOptions.quality)
    }

    startActivityOnResult(cropImageBuilder.getIntent(context), CropImage.CROP_IMAGE_ACTIVITY_REQUEST_CODE, promise)
  }

  private fun handleOnActivityResult(promise: Promise, activity: Activity, requestCode: Int, resultCode: Int, intent: Intent?, pickerOptions: ImagePickerOptions) {
    if (resultCode != Activity.RESULT_OK) {
      promise.resolve(Bundle().apply {
        putBoolean("cancelled", true)
      })
      return
    }

    val contentResolver = activity.application.contentResolver

    if (requestCode == CropImage.CROP_IMAGE_ACTIVITY_REQUEST_CODE) {
      val result = CropImage.getActivityResult(intent)
      val exporter = CropImageExporter(result.rotation, result.cropRect, pickerOptions.isBase64)
      ImageResultTask(promise, result.uri, contentResolver, CropFileProvider(result.uri), pickerOptions.isExif, exporter).execute()
      return
    }

    val uri = (if (requestCode == ImagePickerConstants.REQUEST_LAUNCH_CAMERA) mCameraCaptureURI else intent?.data)
      .ifNull {
        promise.reject(ImagePickerConstants.ERR_MISSING_URL, ImagePickerConstants.MISSING_URL_MESSAGE)
        return
      }

    val type = getType(contentResolver, uri).ifNull {
      promise.reject(ImagePickerConstants.ERR_CAN_NOT_DEDUCE_TYPE, ImagePickerConstants.CAN_NOT_DEDUCE_TYPE_MESSAGE)
      return
    }

    if (type.contains("image")) {
      if (pickerOptions.isAllowsEditing) {
        // if the image is created by camera intent we don't need a new file - it's been already saved
        val needGenerateFile = requestCode != ImagePickerConstants.REQUEST_LAUNCH_CAMERA
        startCropIntent(promise, uri, type, needGenerateFile, pickerOptions)
        return
      }

      val exporter: ImageExporter = if (pickerOptions.quality == ImagePickerConstants.DEFAULT_QUALITY) {
        RawImageExporter(contentResolver, pickerOptions.isBase64)
      } else {
        CompressionImageExporter(mImageLoader, pickerOptions.quality, pickerOptions.isBase64)
      }


      ImageResultTask(promise, uri, contentResolver, CacheFileProvider(mContext.cacheDir, deduceExtension(type)), pickerOptions.isExif, exporter).execute()
      return
    }

    try {
      val metadataRetriever = MediaMetadataRetriever().apply {
        setDataSource(mContext, uri)
      }
      VideoResultTask(promise, uri, contentResolver, CacheFileProvider(mContext.cacheDir, ".mp4"), metadataRetriever).execute()
    } catch (e: RuntimeException) {
      e.printStackTrace()
      promise.reject(ImagePickerConstants.ERR_CAN_NOT_EXTRACT_METADATA, ImagePickerConstants.CAN_NOT_EXTRACT_METADATA_MESSAGE, e)
      return
    }
  }

  override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
    if (experienceActivity != null
      && activity === experienceActivity
      && mPromise != null
      && mPickerOptions != null) {
      mUIManager.unregisterActivityEventListener(this)
      handleOnActivityResult(mPromise!!, activity, requestCode, resultCode, data, mPickerOptions!!)
    }
  }

  private fun startActivityOnResult(intent: Intent, requestCode: Int, promise: Promise) {
    mUIManager.registerActivityEventListener(this)

    experienceActivity
      .ifNull {
        promise.reject(ImagePickerConstants.ERR_MISSING_ACTIVITY, ImagePickerConstants.MISSING_ACTIVITY_MESSAGE)
        return
      }
      .startActivityForResult(intent, requestCode)
  }

  override fun onNewIntent(intent: Intent) = Unit


}
