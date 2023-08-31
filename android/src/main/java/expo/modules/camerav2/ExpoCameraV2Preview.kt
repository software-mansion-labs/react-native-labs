package expo.modules.camerav2

import android.content.Context
import android.view.ViewGroup
import androidx.camera.view.PreviewView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class ExpoCameraV2Preview(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  val cameraXPreview = PreviewView(context)

  init {
    addView(cameraXPreview, ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
    ))
  }
}
