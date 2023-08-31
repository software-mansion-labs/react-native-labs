package expo.modules.camerav2

import android.content.Context
import android.util.Log
import android.view.Surface
import androidx.camera.core.AspectRatio
import androidx.camera.core.CameraInfo
import androidx.camera.core.CameraSelector
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
  private val TAG = "ExpoCamera"

  private var preview: Preview? = null
  private var camera: androidx.camera.core.Camera? = null
  private var cameraProvider: ProcessCameraProvider? = null

  private var lensFacing: Int = CameraSelector.LENS_FACING_BACK

  private val lifecycleRegistry = LifecycleRegistry(this)

  init {
    appContext.mainQueue.launch {
      setUpCamera()
    }
//    reactContext.addLifecycleEventListener(object : LifecycleEventListener {
//      override fun onHostResume() {
//        hostLifecycleState = Lifecycle.State.RESUMED
//        updateLifecycleState()
//        // workaround for https://issuetracker.google.com/issues/147354615, preview must be bound on resume
//        update(propsThatRequireSessionReconfiguration)
//      }
//      override fun onHostPause() {
//        hostLifecycleState = Lifecycle.State.CREATED
//        updateLifecycleState()
//      }
//      override fun onHostDestroy() {
//        hostLifecycleState = Lifecycle.State.DESTROYED
//        updateLifecycleState()
//        cameraExecutor.shutdown()
//        takePhotoExecutor.shutdown()
//        recordVideoExecutor.shutdown()
//        reactContext.removeLifecycleEventListener(this)
//      }
//    })
  }

  private suspend fun setUpCamera() {
    cameraProvider = ProcessCameraProvider.getInstance(context).await()

    // Build and bind the camera use cases
    bindCameraUseCases()
  }

  private fun bindCameraUseCases() {
    val screenAspectRatio = AspectRatio.RATIO_4_3
    val rotation = Surface.ROTATION_0

    // CameraProvider
    val cameraProvider = cameraProvider
      ?: throw IllegalStateException("Camera initialization failed.")

    // CameraSelector
    val cameraSelector = CameraSelector.Builder().requireLensFacing(lensFacing).build()

    // Preview
    preview = Preview.Builder()
      // We request aspect ratio but no resolution
      .setTargetAspectRatio(screenAspectRatio)
      // Set initial target rotation
      .setTargetRotation(rotation)
      .build()

//    // ImageCapture
//    imageCapture = ImageCapture.Builder()
//      .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
//      // We request aspect ratio but no resolution to match preview config, but letting
//      // CameraX optimize for whatever specific resolution best fits our use cases
//      .setTargetAspectRatio(screenAspectRatio)
//      // Set initial target rotation, we will have to call this again if rotation changes
//      // during the lifecycle of this use case
//      .setTargetRotation(rotation)
//      .build()

    // Must unbind the use-cases before rebinding them
    cameraProvider.unbindAll()

    if (camera != null) {
      // Must remove observers from the previous camera instance
      removeCameraStateObservers(camera!!.cameraInfo)
    }

    try {
      // A variable number of use-cases can be passed here -
      // camera provides access to CameraControl & CameraInfo
//      camera = cameraProvider.bindToLifecycle(
//        appContext.currentActivity, cameraSelector, preview)
//
//      // Attach the viewfinder's surface provider to preview use case
//      preview?.setSurfaceProvider(fragmentCameraBinding.viewFinder.surfaceProvider)
//      observeCameraState(camera?.cameraInfo!!)
    } catch (exc: Exception) {
      Log.e(TAG, "Use case binding failed", exc)
    }
  }

  private fun removeCameraStateObservers(cameraInfo: CameraInfo) {
//    cameraInfo.cameraState.removeObservers(viewLifecycleOwner)
  }

  private fun observeCameraState(cameraInfo: CameraInfo) {
//    cameraInfo.cameraState.observe(viewLifecycleOwner) { cameraState ->
//      run {
//        when (cameraState.type) {
//          CameraState.Type.PENDING_OPEN -> {
//            // Ask the user to close other camera apps
//            Toast.makeText(context,
//              "CameraState: Pending Open",
//              Toast.LENGTH_SHORT).show()
//          }
//          CameraState.Type.OPENING -> {
//            // Show the Camera UI
//            Toast.makeText(context,
//              "CameraState: Opening",
//              Toast.LENGTH_SHORT).show()
//          }
//          CameraState.Type.OPEN -> {
//            // Setup Camera resources and begin processing
//            Toast.makeText(context,
//              "CameraState: Open",
//              Toast.LENGTH_SHORT).show()
//          }
//          CameraState.Type.CLOSING -> {
//            // Close camera UI
//            Toast.makeText(context,
//              "CameraState: Closing",
//              Toast.LENGTH_SHORT).show()
//          }
//          CameraState.Type.CLOSED -> {
//            // Free camera resources
//            Toast.makeText(context,
//              "CameraState: Closed",
//              Toast.LENGTH_SHORT).show()
//          }
//        }
//      }
//
//      cameraState.error?.let { error ->
//        when (error.code) {
//          // Open errors
//          CameraState.ERROR_STREAM_CONFIG -> {
//            // Make sure to setup the use cases properly
//            Toast.makeText(context,
//              "Stream config error",
//              Toast.LENGTH_SHORT).show()
//          }
//          // Opening errors
//          CameraState.ERROR_CAMERA_IN_USE -> {
//            // Close the camera or ask user to close another camera app that's using the
//            // camera
//            Toast.makeText(context,
//              "Camera in use",
//              Toast.LENGTH_SHORT).show()
//          }
//          CameraState.ERROR_MAX_CAMERAS_IN_USE -> {
//            // Close another open camera in the app, or ask the user to close another
//            // camera app that's using the camera
//            Toast.makeText(context,
//              "Max cameras in use",
//              Toast.LENGTH_SHORT).show()
//          }
//          CameraState.ERROR_OTHER_RECOVERABLE_ERROR -> {
//            Toast.makeText(context,
//              "Other recoverable error",
//              Toast.LENGTH_SHORT).show()
//          }
//          // Closing errors
//          CameraState.ERROR_CAMERA_DISABLED -> {
//            // Ask the user to enable the device's cameras
//            Toast.makeText(context,
//              "Camera disabled",
//              Toast.LENGTH_SHORT).show()
//          }
//          CameraState.ERROR_CAMERA_FATAL_ERROR -> {
//            // Ask the user to reboot the device to restore camera function
//            Toast.makeText(context,
//              "Fatal error",
//              Toast.LENGTH_SHORT).show()
//          }
//          // Closed errors
//          CameraState.ERROR_DO_NOT_DISTURB_MODE_ENABLED -> {
//            // Ask the user to disable the "Do Not Disturb" mode, then reopen the camera
//            Toast.makeText(context,
//              "Do not disturb mode enabled",
//              Toast.LENGTH_SHORT).show()
//          }
//        }
//      }
//    }
  }

  fun attachPreview(view: ExpoCameraV2Preview) {

  }

  override val lifecycle: Lifecycle
    get() = lifecycleRegistry

  private var hostLifecycleState = Lifecycle.State.INITIALIZED

//  private fun updateLifecycleState() {
//    val lifecycleBefore = lifecycleRegistry.currentState
//    if (hostLifecycleState == Lifecycle.State.RESUMED) {
//      // Host Lifecycle (Activity) is currently active (RESUMED), so we narrow it down to the view's lifecycle
//      if (isActive && isAttachedToWindow) {
//        lifecycleRegistry.currentState = Lifecycle.State.RESUMED
//      } else {
//        lifecycleRegistry.currentState = Lifecycle.State.CREATED
//      }
//    } else {
//      // Host Lifecycle (Activity) is currently inactive (STARTED or DESTROYED), so that overrules our view's lifecycle
//      lifecycleRegistry.currentState = hostLifecycleState
//    }
//    Log.d(TAG, "Lifecycle went from ${lifecycleBefore.name} -> ${lifecycleRegistry.currentState.name} (isActive: $isActive | isAttachedToWindow: $isAttachedToWindow)")
//  }

}
