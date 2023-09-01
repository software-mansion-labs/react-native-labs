package expo.modules.lockscreen

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TableLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import expo.modules.lockscreen.databinding.ActivityFullscreenBinding


class FullscreenActivity : AppCompatActivity() {
  private lateinit var dots: Array<ViewGroup>
  private lateinit var binding: ActivityFullscreenBinding

  private val pinBuilder = StringBuilder()
  private var isKeyboardLocked = false
  private var isErrorShown = false

  private val showRunnable = Runnable { show() }
  private val hideRunnable = Runnable { hide() }

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

    setText()
  }

  override fun onDestroy() {
    super.onDestroy()
    hide()
  }

  private fun setText() {
    val title = intent.getStringExtra("title")
    val message = intent.getStringExtra("message")

    if (title == null && message == null) {
      return
    }
    val titleComponent = findViewById<TextView>(R.id.lockTitle)
    val messageComponent = findViewById<TextView>(R.id.lockMessage)

    titleComponent.text = title
    messageComponent.text = message
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
    isActive = true
    // TODO - hide status bar and navigation bar
    setContentView(R.layout.activity_fullscreen)

    val dotHolder = findViewById<LinearLayout>(R.id.dotHolder)
    dots = Array(DOTS_COUNT) {
      layoutInflater.inflate(R.layout.dot_view, dotHolder, false).also {
        dotHolder.addView(it)
      } as ViewGroup
    }
  }

  private fun hide() {
    isActive = false
    // TODO - show status bar and navigation bar (better: restore previous state)
    finish()
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

    animatorSet.addListener(object : AnimatorListenerAdapter() {
      override fun onAnimationEnd(animation: Animator) {
        if (newPin.length == DOTS_COUNT) validatePin()
      }
    })

    animatorSet.start()
  }

  private fun handleButtonClick(button: Button) {
    if (isKeyboardLocked) {
      return
    } else if (isErrorShown) {
      isErrorShown = false
      animateErrorMessage(false)
    }
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

  private fun validatePin() {
    isKeyboardLocked = true
    if (pinBuilder.toString() == CORRECT_PIN) {
      hideRunnable.run()
    } else {
      // Dots shake animation
      val animatorSet = AnimatorSet()
      dots.forEach { dot ->
        val shakeAnimator = ObjectAnimator.ofFloat(dot, "translationX", -10f, 10f, -10f, 10f, -10f, 10f, 0f)
        animatorSet.playTogether(shakeAnimator)
      }
      animatorSet.start()

      // Show error message
      isErrorShown = true
      animateErrorMessage(true)
      vibratePhone()

      // Clear enteredPin after animation ends
      animatorSet.addListener(object : AnimatorListenerAdapter() {
        override fun onAnimationEnd(animation: Animator) {
          handlePinClear()
        }
      })
    }
  }

  private fun vibratePhone() {
    if (Build.VERSION.SDK_INT >= 26) {
      (getSystemService(VIBRATOR_SERVICE) as Vibrator).vibrate(VibrationEffect.createOneShot(200, VibrationEffect.DEFAULT_AMPLITUDE))
    } else {
      (getSystemService(VIBRATOR_SERVICE) as Vibrator).vibrate(200)
    }
  }

  private fun animateErrorMessage(show: Boolean) {
    val errorMessage = findViewById<TextView>(R.id.errorMessage)

    val translationY = if (show) 0f else -50f
    val alpha = if (show) 1f else 0f

    val slideDownAnimator = ObjectAnimator.ofFloat(errorMessage, "translationY", translationY)
    val opacityAnimator = ObjectAnimator.ofFloat(errorMessage, "alpha", alpha)

    val errorAnimatorSet = AnimatorSet()
    errorAnimatorSet.playTogether(slideDownAnimator, opacityAnimator)
    errorAnimatorSet.start()
  }

  private fun handlePinClear() {
    isKeyboardLocked = false
    val prevPin = pinBuilder.toString()
    pinBuilder.clear()
    onPinModified(pinBuilder.toString(), prevPin)
  }

  companion object {
    var isActive = false
    const val DOTS_COUNT = 4
    const val CORRECT_PIN = "1234" // TODO: Move to keystore
  }
}