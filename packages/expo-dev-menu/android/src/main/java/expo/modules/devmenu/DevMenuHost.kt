package expo.modules.devmenu

import android.app.Application
import android.content.Context
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage

class DevMenuHost(application: Application) : ReactNativeHost(application) {
  private lateinit var reactPackages: List<ReactPackage>

  fun setPackages(packages: List<ReactPackage>) {
    reactPackages = packages
  }

  override fun getPackages(): MutableList<ReactPackage> = reactPackages.toMutableList()

  override fun getUseDeveloperSupport() = false

  override fun getBundleAssetName() = "EXDevMenuApp.android.js"

  override fun getJSMainModuleName() = "index"

  fun getContext(): Context = super.getApplication()
}
