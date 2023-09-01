package expo.modules.camerav2

import android.content.Context
import android.util.Log
import android.view.Surface
import android.widget.Toast
import androidx.camera.core.AspectRatio
import androidx.camera.core.CameraInfo
import androidx.camera.core.CameraSelector
import androidx.camera.core.CameraState
import androidx.camera.core.ImageCapture
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.concurrent.futures.await
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.sharedobjects.SharedObject
import kotlinx.coroutines.launch

internal class Camera(private val context: Context, private val appContext: AppContext) : SharedObject(), LifecycleOwner {

  private var preview: Preview? = null
  private var imageCapture: ImageCapture? = null
  private var camera: androidx.camera.core.Camera? = null
  private var cameraProvider: ProcessCameraProvider? = null


  private val TAG = "ExpoCamera"
  private val screenAspectRatio = AspectRatio.RATIO_4_3
  private val rotation = Surface.ROTATION_0

  private var lensFacing: Int = CameraSelector.LENS_FACING_BACK
  private val lifecycleRegistry = LifecycleRegistry(this)

  init {
    appContext.mainQueue.launch {
      lifecycleRegistry.currentState = Lifecycle.State.STARTED
      setUpCamera()
    }
  }

  private suspend fun setUpCamera() {
    cameraProvider = ProcessCameraProvider.getInstance(context).await()
  }

  private fun removeCameraStateObservers(cameraInfo: CameraInfo) {
    cameraInfo.cameraState.removeObservers(this)
  }

  private fun observeCameraState(cameraInfo: CameraInfo) {
    cameraInfo.cameraState.observe(this) { cameraState ->
      run {
        when (cameraState.type) {
          CameraState.Type.PENDING_OPEN -> {
            // Ask the user to close other camera apps
            Toast.makeText(context,
              "CameraState: Pending Open",
              Toast.LENGTH_SHORT).show()
          }
          CameraState.Type.OPENING -> {
            // Show the Camera UI
            Toast.makeText(context,
              "CameraState: Opening",
              Toast.LENGTH_SHORT).show()
          }
          CameraState.Type.OPEN -> {
            // Setup Camera resources and begin processing
            Toast.makeText(context,
              "CameraState: Open",
              Toast.LENGTH_SHORT).show()
          }
          CameraState.Type.CLOSING -> {
            // Close camera UI
            Toast.makeText(context,
              "CameraState: Closing",
              Toast.LENGTH_SHORT).show()
          }
          CameraState.Type.CLOSED -> {
            // Free camera resources
            Toast.makeText(context,
              "CameraState: Closed",
              Toast.LENGTH_SHORT).show()
          }
        }
      }

      cameraState.error?.let { error ->
        when (error.code) {
          // Open errors
          CameraState.ERROR_STREAM_CONFIG -> {
            // Make sure to setup the use cases properly
            Toast.makeText(context,
              "Stream config error",
              Toast.LENGTH_SHORT).show()
          }
          // Opening errors
          CameraState.ERROR_CAMERA_IN_USE -> {
            // Close the camera or ask user to close another camera app that's using the
            // camera
            Toast.makeText(context,
              "Camera in use",
              Toast.LENGTH_SHORT).show()
          }
          CameraState.ERROR_MAX_CAMERAS_IN_USE -> {
            // Close another open camera in the app, or ask the user to close another
            // camera app that's using the camera
            Toast.makeText(context,
              "Max cameras in use",
              Toast.LENGTH_SHORT).show()
          }
          CameraState.ERROR_OTHER_RECOVERABLE_ERROR -> {
            Toast.makeText(context,
              "Other recoverable error",
              Toast.LENGTH_SHORT).show()
          }
          // Closing errors
          CameraState.ERROR_CAMERA_DISABLED -> {
            // Ask the user to enable the device's cameras
            Toast.makeText(context,
              "Camera disabled",
              Toast.LENGTH_SHORT).show()
          }
          CameraState.ERROR_CAMERA_FATAL_ERROR -> {
            // Ask the user to reboot the device to restore camera function
            Toast.makeText(context,
              "Fatal error",
              Toast.LENGTH_SHORT).show()
          }
          // Closed errors
          CameraState.ERROR_DO_NOT_DISTURB_MODE_ENABLED -> {
            // Ask the user to disable the "Do Not Disturb" mode, then reopen the camera
            Toast.makeText(context,
              "Do not disturb mode enabled",
              Toast.LENGTH_SHORT).show()
          }
        }
      }
    }
  }

  fun attachPreview(view: ExpoCameraV2Preview) {
    bindCameraPreviewUseCase(view)
  }

  private fun bindCameraPreviewUseCase(view: ExpoCameraV2Preview) {
    val cameraProvider = cameraProvider ?: throw IllegalStateException("Camera initialization failed.")
    val cameraSelector = CameraSelector.Builder().requireLensFacing(lensFacing).build()

    // Preview
    preview = Preview.Builder()
      // We request aspect ratio but no resolution
      .setTargetAspectRatio(screenAspectRatio)
      // Set initial target rotation
      .setTargetRotation(rotation)
      .build()

    imageCapture = ImageCapture.Builder()
      .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
      // We request aspect ratio but no resolution to match preview config, but letting
      // CameraX optimize for whatever specific resolution best fits our use cases
      .setTargetAspectRatio(screenAspectRatio)
      // Set initial target rotation, we will have to call this again if rotation changes
      // during the lifecycle of this use case
      .setTargetRotation(rotation)
      .build()

    // Must unbind the use-cases before rebinding them
    cameraProvider.unbindAll()

    if (camera != null) {
      // Must remove observers from the previous camera instance
      removeCameraStateObservers(camera!!.cameraInfo)
    }

    try {
      // Attach the viewfinder's surface provider to preview use case
      preview?.setSurfaceProvider(view.cameraXPreview.surfaceProvider)

      // A variable number of use-cases can be passed here -
      // camera provides access to CameraControl & CameraInfo
      camera = cameraProvider.bindToLifecycle(
        this, cameraSelector, preview, imageCapture)

      observeCameraState(camera?.cameraInfo!!)
    } catch (exc: Exception) {
      Log.e(TAG, "Use case binding failed", exc)
    }
  }

  override val lifecycle: Lifecycle
    get() = lifecycleRegistry

}
