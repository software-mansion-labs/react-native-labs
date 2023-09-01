package expo.modules.lockscreen

import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoLockScreenModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoLockScreen")

    Function("show") { title: String?, message: String? ->
      val currentActivity = appContext.currentActivity ?: throw Exception("No current activity")
      val intent = Intent(currentActivity, FullscreenActivity::class.java)
      intent.putExtra("title", title)
      intent.putExtra("message", message)
      currentActivity.startActivity(intent)
    }
  }
}
