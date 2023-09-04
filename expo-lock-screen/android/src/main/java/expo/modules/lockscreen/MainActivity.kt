package expo.modules.lockscreen

import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
  override fun onUserLeaveHint() {
    super.onUserLeaveHint()
    if (!FullscreenActivity.isActive) {
      val intent = intent
      intent.setClass(this, FullscreenActivity::class.java)
      startActivity(intent)
    }
  }
}