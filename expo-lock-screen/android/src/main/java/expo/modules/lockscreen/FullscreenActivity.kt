package expo.modules.lockscreen

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TableLayout
import androidx.appcompat.app.AppCompatActivity
import expo.modules.lockscreen.databinding.ActivityFullscreenBinding

class FullscreenActivity : AppCompatActivity() {
  private lateinit var dots: Array<ViewGroup>
  private lateinit var binding: ActivityFullscreenBinding

  private val pinBuilder = StringBuilder()

  private val showRunnable = Runnable { show() }

  @SuppressLint("ClickableViewAccessibility")
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = ActivityFullscreenBinding.inflate(layoutInflater)
    showRunnable.run()

    val tableLayout = findViewById<TableLayout>(R.id.table)
    val buttons = getAllButtons(tableLayout)

    buttons.forEach { button ->
      button.setOnClickListener {
        handleButtonClick(button)
      }

      if (button.tag == "delete") {
        button.setOnLongClickListener {
          handlePinClear()
          true
        }
      }
    }
  }

  private fun getAllButtons(parent: ViewGroup): List<Button> {
    val buttons = mutableListOf<Button>()
    for (i in 0 until parent.childCount) {
      val child = parent.getChildAt(i)

      if (child is Button) {
        buttons.add(child)
      } else if (child is ViewGroup) {
        buttons.addAll(getAllButtons(child))
      }
    }
    return buttons
  }

  private fun show() {
    supportActionBar?.hide()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.insetsController?.hide(WindowInsets.Type.statusBars())
    } else {
      window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN
    }

    setContentView(R.layout.activity_fullscreen)

    val dotHolder = findViewById<LinearLayout>(R.id.dotHolder)
    dots = Array(DOTS_COUNT) {
      layoutInflater.inflate(R.layout.dot_view, dotHolder, false).also {
        dotHolder.addView(it)
      } as ViewGroup
    }
  }

  private fun onPinModified(newPin: String, oldPin: String = "") {
    val animatorSet = AnimatorSet()

    dots.forEachIndexed { index, dot ->
      val fill = dot.findViewById<View>(R.id.dot_fill)

      val isFilled = index < newPin.length
      val wasFilled = index < oldPin.length

      if (isFilled == wasFilled) {
        return@forEachIndexed
      }

      val value = if (isFilled) 1f else 0f
      val opacityAnimator = ObjectAnimator.ofFloat(fill, "alpha", value)
      val scaleXAnimator = ObjectAnimator.ofFloat(fill, "scaleX", value)
      val scaleYAnimator = ObjectAnimator.ofFloat(fill, "scaleY", value)

      animatorSet.playTogether(opacityAnimator, scaleXAnimator, scaleYAnimator)
    }

    animatorSet.start()
  }

  private fun handleButtonClick(button: Button) {
    val prevPin = pinBuilder.toString()

    when (button.tag) {
      "delete" -> {
        // Delete the last character from enteredPin
        if (pinBuilder.isNotEmpty()) {
          pinBuilder.delete(pinBuilder.length - 1, pinBuilder.length)
        }
      }
      "bio" -> {
        // You can handle any operations needed to be done when the bio button is clicked here
        // TODO: Handle bio button click
      }
      else -> {
        // Concatenate button's text to enteredPin only if the limit has not been reached
        if (pinBuilder.length < DOTS_COUNT) {
          pinBuilder.append(button.text)
        }
      }
    }

    // Update the dots
    onPinModified(pinBuilder.toString(), prevPin)
  }

  private fun handlePinClear() {
    val prevPin = pinBuilder.toString()
    pinBuilder.clear()
    onPinModified(pinBuilder.toString(), prevPin)
  }

  companion object {
    const val DOTS_COUNT = 4
    const val ANIMATION_DURATION = 300L
  }
}