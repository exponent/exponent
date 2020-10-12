package expo.modules.notifications.service.delegates

import android.app.NotificationManager
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Parcel
import android.service.notification.StatusBarNotification
import android.util.Log
import android.util.Pair
import androidx.core.app.NotificationManagerCompat
import expo.modules.notifications.notifications.enums.NotificationPriority
import expo.modules.notifications.notifications.interfaces.NotificationsReconstructor
import expo.modules.notifications.notifications.interfaces.NotificationsScoper
import expo.modules.notifications.notifications.model.Notification
import expo.modules.notifications.notifications.model.NotificationBehavior
import expo.modules.notifications.notifications.model.NotificationContent
import expo.modules.notifications.notifications.model.NotificationRequest
import expo.modules.notifications.notifications.presentation.builders.ExpoNotificationBuilder
import expo.modules.notifications.notifications.service.NotificationsHelper
import expo.modules.notifications.notifications.service.SharedPreferencesNotificationCategoriesStore
import expo.modules.notifications.service.interfaces.PresentationDelegate
import org.json.JSONException
import org.json.JSONObject
import java.util.*

open class ExpoPresentationDelegate(
  protected val context: Context,
  protected val notificationsReconstructor: NotificationsReconstructor = NotificationsScoper.create(context).createReconstructor()
) : PresentationDelegate {
  companion object {
    protected const val ANDROID_NOTIFICATION_ID = 0

    /**
     * Tries to parse given identifier as an internal foreign notification identifier
     * created by us in {@link NotificationsHelper#getInternalIdentifierKey(StatusBarNotification)}.
     *
     * @param identifier String identifier of the notification
     * @return Pair of (notification tag, notification id), if the identifier could be parsed. null otherwise.
     */
    fun parseNotificationIdentifier(identifier: String): Pair<String?, Int>? {
      val parsedIdentifier = Uri.parse(identifier)
      try {
        if (NotificationsHelper.INTERNAL_IDENTIFIER_SCHEME == parsedIdentifier.scheme && NotificationsHelper.INTERNAL_IDENTIFIER_AUTHORITY == parsedIdentifier.authority) {
          val tag = parsedIdentifier.getQueryParameter(NotificationsHelper.INTERNAL_IDENTIFIER_TAG_KEY)
          val id = Objects.requireNonNull(parsedIdentifier.getQueryParameter(NotificationsHelper.INTERNAL_IDENTIFIER_ID_KEY))!!.toInt()
          return Pair(tag, id)
        }
      } catch (e: NullPointerException) {
        Log.e("expo-notifications", "Malformed foreign notification identifier: $identifier", e)
      } catch (e: NumberFormatException) {
        Log.e("expo-notifications", "Malformed foreign notification identifier: $identifier", e)
      } catch (e: UnsupportedOperationException) {
        Log.e("expo-notifications", "Malformed foreign notification identifier: $identifier", e)
      }
      return null
    }
  }

  override fun presentNotification(notification: Notification, behavior: NotificationBehavior?) {
    val tag = notification.notificationRequest.identifier
    NotificationManagerCompat.from(context).notify(tag, ANDROID_NOTIFICATION_ID, createNotification(notification, behavior))
  }

  /**
   * Callback called to fetch a collection of currently displayed notifications.
   *
   * **Note:** This feature is only supported on Android 23+.
   *
   * @return A collection of currently displayed notifications.
   */
  override fun getAllPresentedNotifications(): Collection<Notification> {
    // getActiveNotifications() is not supported on platforms below Android 23
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return emptyList()
    }
    val notifications: MutableCollection<Notification> = ArrayList()
    val activeNotifications = (context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).activeNotifications
    for (statusBarNotification in activeNotifications) {
      val notification = getNotification(statusBarNotification)
      if (notification != null) {
        notifications.add(notification)
      }
    }
    return notifications
  }

  override fun dismissNotifications(identifiers: Collection<String>) {
    identifiers.forEach { identifier ->
      val foreignNotification = parseNotificationIdentifier(identifier)
      if (foreignNotification != null) {
        // Foreign notification identified by us
        NotificationManagerCompat.from(context).cancel(foreignNotification.first, foreignNotification.second)
      } else {
        // Let's hope it's our notification, we have no reason to believe otherwise
        NotificationManagerCompat.from(context).cancel(identifier, ANDROID_NOTIFICATION_ID)
      }
    }

  }

  override fun dismissAllNotifications() {
    NotificationManagerCompat.from(context).cancelAll()
  }

  protected fun createNotification(notification: Notification, notificationBehavior: NotificationBehavior?): android.app.Notification {
    return NotificationsScoper.create(context).createBuilderCreator().get(context, SharedPreferencesNotificationCategoriesStore(context)).also {
      it.setNotification(notification)
      it.setAllowedBehavior(notificationBehavior)
    }.build()
  }

  protected open fun getNotification(statusBarNotification: StatusBarNotification): Notification? {
    val notification = statusBarNotification.notification
    val notificationRequestByteArray = notification.extras.getByteArray(ExpoNotificationBuilder.EXTRAS_MARSHALLED_NOTIFICATION_REQUEST_KEY)
    if (notificationRequestByteArray != null) {
      try {
        val parcel = Parcel.obtain()
        parcel.unmarshall(notificationRequestByteArray, 0, notificationRequestByteArray.size)
        parcel.setDataPosition(0)
        val request: NotificationRequest = notificationsReconstructor.reconstructNotificationRequest(parcel)
        parcel.recycle()
        val notificationDate = Date(statusBarNotification.postTime)
        return Notification(request, notificationDate)
      } catch (e: Exception) {
        // Let's catch all the exceptions -- there's nothing we can do here
        // and we'd rather return an array without a single, invalid notification
        // than throw an exception and return none.
        val message = "Could not have unmarshalled NotificationRequest from (${statusBarNotification.tag}, ${statusBarNotification.id})."
        Log.e("expo-notifications", message)
      }
    } else {
      // It's not our notification. Let's do what we can.
      val content = NotificationContent.Builder()
        .setTitle(notification.extras.getString(android.app.Notification.EXTRA_TITLE))
        .setText(notification.extras.getString(android.app.Notification.EXTRA_TEXT))
        .setSubtitle(notification.extras.getString(android.app.Notification.EXTRA_SUB_TEXT)) // using deprecated field
        .setPriority(NotificationPriority.fromNativeValue(notification.priority)) // using deprecated field
        .setVibrationPattern(notification.vibrate) // using deprecated field
        .setSound(notification.sound)
        .setAutoDismiss(notification.flags and android.app.Notification.FLAG_AUTO_CANCEL != 0)
        .setSticky(notification.flags and android.app.Notification.FLAG_ONGOING_EVENT != 0)
        .setBody(fromBundle(notification.extras))
        .build()
      val request = NotificationRequest(getInternalIdentifierKey(statusBarNotification), content, null)
      return Notification(request, Date(statusBarNotification.postTime))
    }
    return null
  }

  protected open fun fromBundle(bundle: Bundle): JSONObject? {
    val json = JSONObject()
    for (key in bundle.keySet()) {
      try {
        json.put(key, JSONObject.wrap(bundle[key]))
      } catch (e: JSONException) {
        // can't do anything about it apart from logging it
        Log.d("expo-notifications", "Error encountered while serializing Android notification extras: " + key + " -> " + bundle[key], e)
      }
    }
    return json
  }

  /**
   * Creates an identifier for given [StatusBarNotification]. It's supposed to be parsable
   * by [parseNotificationIdentifier].
   *
   * @param notification Notification to be identified
   * @return String identifier
   */
  protected open fun getInternalIdentifierKey(notification: StatusBarNotification): String? {
    val builder = Uri.parse(NotificationsHelper.INTERNAL_IDENTIFIER_SCHEME + "://" + NotificationsHelper.INTERNAL_IDENTIFIER_AUTHORITY).buildUpon()
    if (notification.tag != null) {
      builder.appendQueryParameter(NotificationsHelper.INTERNAL_IDENTIFIER_TAG_KEY, notification.tag)
    }
    builder.appendQueryParameter(NotificationsHelper.INTERNAL_IDENTIFIER_ID_KEY, Integer.toString(notification.id))
    return builder.toString()
  }
}
