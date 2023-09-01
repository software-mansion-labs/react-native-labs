package expo.modules.flashlight

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Context
import android.content.pm.PackageManager
import android.hardware.camera2.CameraAccessException
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.content.getSystemService

class ExpoFlashlightModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  @RequiresApi(Build.VERSION_CODES.M)
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoFlashlight')` in JavaScript.
    Name("ExpoFlashlight")

    var isTorchOn = false

    fun getTorchLevel(): Int {
      val cameraManager = appContext.currentActivity?.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val cameraId = cameraManager.cameraIdList[0]
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && isTorchOn) {
        return cameraManager.getTorchStrengthLevel(cameraId)
      }
      return if(isTorchOn) 1 else 0
    }

    fun hasFlashlight(): Boolean? {
      return appContext.currentActivity?.packageManager?.hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH)
    }

    Function("getTorchLevel") {
      getTorchLevel()
    }

    Function("isFlashlightActive") {
      getTorchLevel() > 0
    }

    Function("hasFlashlight") {
      hasFlashlight()
    }

    Function("isFlashlightAvailable") {
      val cameraManager = appContext.currentActivity?.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val cameraId = cameraManager.cameraIdList[0]
      cameraManager.getCameraCharacteristics(cameraId).get(CameraCharacteristics.FLASH_INFO_AVAILABLE)
    }

    Function("setFlashlightState") { state: Boolean ->
      val cameraManager = appContext.currentActivity?.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val cameraId = cameraManager.cameraIdList[0]
      try {
        cameraManager.setTorchMode(cameraId, state)
        isTorchOn = state
      } catch (e: CameraAccessException) {
        e.printStackTrace()
      }
    }

    Function("setFlashlightLevel") { level: Float ->
      val cameraManager = appContext.currentActivity?.getSystemService(Context.CAMERA_SERVICE) as CameraManager
      val cameraId = cameraManager.cameraIdList[0]
      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU ) {
          val characteristics = cameraManager.getCameraCharacteristics(cameraId)
          val maxTorchLevel = characteristics.get(CameraCharacteristics.FLASH_INFO_STRENGTH_MAXIMUM_LEVEL) ?: 0
          val newTorchLevel = (maxTorchLevel * level).toInt()
          isTorchOn = newTorchLevel > 0
          if(newTorchLevel > 0) {
            cameraManager.turnOnTorchWithStrengthLevel(cameraId, newTorchLevel)
          } else {
            cameraManager.setTorchMode(cameraId, false)
          }
        } else {
          isTorchOn = level > 0
          cameraManager.setTorchMode(cameraId, level > 0 )
        }
      } catch (e: CameraAccessException) {
        e.printStackTrace()
      }
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ExpoFlashlightView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: ExpoFlashlightView, prop: String ->
        println(prop)
      }
    }
  }
}
