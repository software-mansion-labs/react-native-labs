package expo.modules.camerav2

import android.content.Context
import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import androidx.camera.view.PreviewView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class ExpoCameraV2Preview(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  val cameraXPreview = PreviewView(context)

  init {
    cameraXPreview.installHierarchyFitter()
    addView(cameraXPreview, ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
    ))

    cameraXPreview.setBackgroundColor(Color.BLUE)
  }
}

// React does not trigger onLayout events for dynamically added views (`addView`).
// This fixes that.
// https://github.com/facebook/react-native/issues/17968#issuecomment-633308615
fun ViewGroup.installHierarchyFitter() {
  setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
    override fun onChildViewRemoved(parent: View?, child: View?) = Unit
    override fun onChildViewAdded(parent: View?, child: View?) {
      parent?.measure(
        View.MeasureSpec.makeMeasureSpec(measuredWidth, View.MeasureSpec.EXACTLY),
        View.MeasureSpec.makeMeasureSpec(measuredHeight, View.MeasureSpec.EXACTLY)
      )
      parent?.layout(0, 0, parent.measuredWidth, parent.measuredHeight)
    }
  })
}
