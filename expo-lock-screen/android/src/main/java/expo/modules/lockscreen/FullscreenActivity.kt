package expo.modules.lockscreen

import androidx.appcompat.app.AppCompatActivity
import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.WindowInsets
import android.widget.LinearLayout
import android.widget.TextView
import expo.modules.lockscreen.databinding.ActivityFullscreenBinding

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 */
class FullscreenActivity : AppCompatActivity() {
  private val visibilityHandler = Handler(Looper.myLooper()!!)

  private lateinit var binding: ActivityFullscreenBinding
  private lateinit var fullscreenContentControls: LinearLayout
  private var isFullscreen: Boolean = false


//  @SuppressLint("InlinedApi")
//  private val hideRunnable = Runnable {
//    // Delayed removal of status and navigation bar
//    if (Build.VERSION.SDK_INT >= 30) {
//      fullscreenContent.windowInsetsController?.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
//    } else {
//      // Note that some of these constants are new as of API 16 (Jelly Bean)
//      // and API 19 (KitKat). It is safe to use them, as they are inlined
//      // at compile-time and do nothing on earlier devices.
//      fullscreenContent.systemUiVisibility =
//        View.SYSTEM_UI_FLAG_LOW_PROFILE or
//                View.SYSTEM_UI_FLAG_FULLSCREEN or
//                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
//                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
//                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
//                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
//    }
//  }
  private val showRunnable = Runnable { show() }

  @SuppressLint("ClickableViewAccessibility")
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = ActivityFullscreenBinding.inflate(layoutInflater)
    showRunnable.run()
  }

  override fun onPostCreate(savedInstanceState: Bundle?) {
    super.onPostCreate(savedInstanceState)
  }

//  private fun toggle() {
//    if (isFullscreen) {
//      hide()
//    } else {
//      show()
//    }
//  }

//  private fun hide() {
//    isFullscreen = true
//
//    // Show the system bar
//    if (Build.VERSION.SDK_INT >= 30) {
//      fullscreenContent.windowInsetsController?.show(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
//    } else {
//      fullscreenContent.systemUiVisibility =
//        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
//                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
//    }
//
//    // Schedule a runnable to remove the status and navigation bar after a delay
//    hideHandler.removeCallbacks(showRunnable)
//    hideHandler.postDelayed(hideRunnable, UI_ANIMATION_DELAY.toLong())
//  }

  private fun show() {
    supportActionBar?.hide()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.insetsController?.hide(WindowInsets.Type.statusBars())
    } else {
      window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN
    }

    setContentView(R.layout.activity_fullscreen)
  }

  companion object {
    /**
     * Whether or not the system UI should be auto-hidden after
     * [AUTO_HIDE_DELAY_MILLIS] milliseconds.
     */
    private const val AUTO_HIDE = true

    /**
     * If [AUTO_HIDE] is set, the number of milliseconds to wait after
     * user interaction before hiding the system UI.
     */
    private const val AUTO_HIDE_DELAY_MILLIS = 3000

    /**
     * Some older devices needs a small delay between UI widget updates
     * and a change of the status and navigation bar.
     */
    private const val UI_ANIMATION_DELAY = 300
  }
}