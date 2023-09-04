package expo.modules.torch

import android.content.Context
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import androidx.annotation.RequiresApi
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AndroidTargetException : CodedException(
        message = "Method available since android 13"
)

class CameraManagerNotAvailableException : CodedException(
        message = "Camera manager not available on this device"
)

class LevelOutOfRangeException : CodedException(
        message = "'turnOnWithLevel' method invoked with level out of range of supported by this device. Use value from range [1,maxLevel] - you can get max level using 'getMaxLevel' method. You have to use Int value on Android"
)

class ExpoTorchModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()
  private val cameraManager
    get() = context.getSystemService(Context.CAMERA_SERVICE) as? CameraManager ?: throw CameraManagerNotAvailableException()

  private fun hasTorch(cameraId: String): Boolean {
    val cameraCharacteristics = cameraManager.getCameraCharacteristics(cameraId);
    return cameraCharacteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE) ?: false
  };

  private val cameraId: String
    get() {
      for(id: String in cameraManager.cameraIdList){
        if(hasTorch(id)){
          return id
        }
      }
      return ""
    }

  private val cameraCharacteristics
    get() = cameraManager.getCameraCharacteristics(cameraId);

  private var torchOn: Boolean = false;

  override fun definition() = ModuleDefinition {

    Name("ExpoTorch")

    Function("getMaxLevel", ) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        return@Function cameraCharacteristics.get(CameraCharacteristics.FLASH_INFO_STRENGTH_MAXIMUM_LEVEL)
      } else {
        throw AndroidTargetException()
      }
    }

    Function("getDefaultLevel") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        return@Function cameraCharacteristics.get(CameraCharacteristics.FLASH_INFO_STRENGTH_DEFAULT_LEVEL)
      } else {
        throw AndroidTargetException()
      }
    }

    Function("getCurrentLevel") {
      cameraManager.getTorchStrengthLevel(cameraId)
    }

    AsyncFunction("turnOnWithLevel") { level: Int ->
      var maxLevel: Int;
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        maxLevel = cameraCharacteristics.get(CameraCharacteristics.FLASH_INFO_STRENGTH_MAXIMUM_LEVEL) ?: 1;
      } else {
        throw AndroidTargetException()
      }
      if(level in 1..maxLevel) {
        cameraManager.turnOnTorchWithStrengthLevel(cameraId, level);
        torchOn = true;
      } else {
        throw LevelOutOfRangeException()
      }
    }

    AsyncFunction("setMode") { value: Boolean ->
      cameraManager.setTorchMode(cameraId, value);
      torchOn = value
    }

    AsyncFunction("toggle") {
      cameraManager.setTorchMode(cameraId, !torchOn);
      torchOn = !torchOn
      Unit
    }

  }
}
