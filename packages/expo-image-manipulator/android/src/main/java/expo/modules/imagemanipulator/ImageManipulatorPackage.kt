package expo.modules.imagemanipulator

import android.content.Context
import org.unimodules.core.BasePackage
import org.unimodules.core.ExportedModule

class ImageManipulatorPackage : BasePackage() {
  override fun createExportedModules(context: Context): List<ExportedModule> {
    return listOf(ImageManipulatorModule(context) as ExportedModule)
  }
}
