package expo.modules.image.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class ImageProgressEvent(viewId: Int, private val mBytesWritten: Long, private val mContentLength: Long, private val mDone: Boolean) : Event<ImageProgressEvent?>(viewId) {
  override fun getEventName(): String {
    return EVENT_NAME
  }

  override fun dispatch(rctEventEmitter: RCTEventEmitter) {
    val eventData = Arguments.createMap()
    eventData.putInt("loaded", mBytesWritten.toInt())
    eventData.putInt("total", mContentLength.toInt())
    rctEventEmitter.receiveEvent(viewTag, eventName, eventData)
  }

  companion object {
    const val EVENT_NAME = "onProgress"
  }
}