package expo.modules.lockscreen

import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoLockScreenModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoLockScreen")

    Function("show") { title: String?, message: String? ->
      if (FullscreenActivity.isActive) {
        return@Function
      }
      val currentActivity = appContext.currentActivity ?: throw Exception("No current activity")
      val fullScreenIntent = Intent(currentActivity, FullscreenActivity::class.java)
      fullScreenIntent.putExtra("title", title)
      fullScreenIntent.putExtra("message", message)
      currentActivity.startActivity(fullScreenIntent)
    }

    AsyncFunction("initialize") {
      val currentActivity = appContext.currentActivity ?: throw Exception("No current activity")
      val mainIntent = Intent(currentActivity, MainActivity::class.java)
      currentActivity.startActivity(mainIntent)
    }
  }
}
