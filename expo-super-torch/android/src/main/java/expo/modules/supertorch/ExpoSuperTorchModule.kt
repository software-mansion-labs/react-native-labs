package expo.modules.supertorch

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.hardware.SensorManager.*
import android.hardware.camera2.CameraManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.annotation.RequiresApi
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class TooOldAndroidException : CodedException (
  message = "Too old Android (unlucky)"
)

class OrientationModeConfig : Record {
  @Field val yawMin: Double = Double.NEGATIVE_INFINITY
  @Field val yawMax: Double = Double.POSITIVE_INFINITY
  @Field val pitchMin: Double = Double.NEGATIVE_INFINITY
  @Field val pitchMax: Double = Double.POSITIVE_INFINITY
  @Field val rollMin: Double = Double.NEGATIVE_INFINITY
  @Field val rollMax: Double = Double.POSITIVE_INFINITY
}

class ExpoSuperTorchModule : Module() {
  @RequiresApi(Build.VERSION_CODES.TIRAMISU)
  override fun definition() = ModuleDefinition {
    // Silly initialization block
    val context = appContext.reactContext
    val cameraManager = context?.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    val handler = Handler(Looper.getMainLooper())
    val torchCamera = cameraManager.cameraIdList[0]
    var torchState = false;
    val torchCallback = object : CameraManager.TorchCallback() {
      override fun onTorchModeChanged(cameraId: String, enabled: Boolean) {
        super.onTorchModeChanged(cameraId, enabled)
        torchState = enabled
        }
      }
    cameraManager.registerTorchCallback(torchCallback, handler)
    val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    val orientationSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
    var orientationModeEnabled = false
    var currentOrientationListener: SensorEventListener? = null
    // initialization block

    Name("ExpoSuperTorch")

    Constants(
      "Pi" to Math.PI
    )

    AsyncFunction("fireTorch") {
      cameraManager.setTorchMode(torchCamera, true)
    }

    AsyncFunction("stopTorch") {
      cameraManager.setTorchMode(torchCamera, false);
    }

    AsyncFunction("toggleTorch") {
      cameraManager.setTorchMode(torchCamera, !torchState)
    }

    AsyncFunction("getTorchIntensity") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        return@AsyncFunction cameraManager.getTorchStrengthLevel(torchCamera)
      } else {
        throw TooOldAndroidException()
      }
    }

    AsyncFunction("enableOrientationMode") { config: OrientationModeConfig ->
      if(orientationModeEnabled) {
        sensorManager.unregisterListener(currentOrientationListener)
      }
      val sensorEventListener = object : SensorEventListener {
        override fun onSensorChanged(event: SensorEvent) {
          var rotation = FloatArray(9)
          var orientation = FloatArray(3)
          getRotationMatrixFromVector(rotation, event.values)
          getOrientation(rotation, orientation)
          val azimuth = orientation[0]
          val pitch = orientation[1]
          val roll = orientation[2]

          if(config.yawMin < azimuth && azimuth < config.yawMax &&
            config.pitchMin < pitch && pitch < config.pitchMax &&
            config.rollMin < roll && roll < config.rollMax) {
            cameraManager.setTorchMode(torchCamera, true)
          } else {
            cameraManager.setTorchMode(torchCamera, false)
          }
        }

        override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {
          // Ignore accuracy changes
        }
      }

      sensorManager.registerListener(sensorEventListener, orientationSensor, SENSOR_DELAY_FASTEST)
      currentOrientationListener = sensorEventListener
      orientationModeEnabled = true
    }

    AsyncFunction("disableOrientationMode") {
      if (orientationModeEnabled) {
        sensorManager.unregisterListener(currentOrientationListener)
        cameraManager.setTorchMode(torchCamera, false)
        orientationModeEnabled = false
      }
    }

    View(ExpoSuperTorchView::class){}
  }
}
