package abi42_0_0.expo.modules.imagemanipulator

import android.content.Context
import android.graphics.Bitmap.CompressFormat
import java.io.File
import java.io.IOException
import java.util.*

internal object FileUtils {
  @Throws(IOException::class)
  fun generateRandomOutputPath(context: Context, compressFormat: CompressFormat): String {
    val directory = File("${context.cacheDir.toString()}${File.separator}ImageManipulator")
    ensureDirExists(directory)
    return "${directory.toString()}${File.separator}${UUID.randomUUID().toString()}${toExtension(compressFormat)}"
  }

  @Throws(IOException::class)
  private fun ensureDirExists(dir: File): File {
    if (!(dir.isDirectory || dir.mkdirs())) {
      throw IOException("Couldn't create directory '$dir'")
    }
    return dir
  }

  private fun toExtension(compressFormat: CompressFormat): String {
    return when (compressFormat) {
      CompressFormat.JPEG -> ".jpeg"
      CompressFormat.PNG -> ".png"
      else -> ".jpeg"
    }
  }
}
