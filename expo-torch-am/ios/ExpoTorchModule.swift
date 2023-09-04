import ExpoModulesCore

internal class NoCameraAccessException : Exception {
  override var reason: String {
    "No access to camera"
  }
}

internal class InvalidLevelRangeException : Exception {
  override var reason: String {
    "Invalid torch level range - it has to be between (0,1]"
  }
}

internal class TorchNotAvailableException : Exception {
  override var reason: String {
    "Torch is not available"
  }
}

public class ExpoTorchModule: Module {
  lazy var device = AVCaptureDevice.default(for: .video)
  
  public func definition() -> ModuleDefinition {
    Name("ExpoTorch")
    
    Function("getMaxLevel") {
      return AVCaptureDevice.maxAvailableTorchLevel;
    }
    
    Function("getCurrentLevel") { () -> Double in
      return Double(device?.torchLevel ?? 0.0);
    }
    
    AsyncFunction("turnOnWithLevel") { (level: Float) in
      guard let device else {
        throw NoCameraAccessException()
      }
      guard device.hasTorch else {
        throw TorchNotAvailableException();
      }
      
      try device.lockForConfiguration()
      if(level > 0 && level <= 1){
        try device.setTorchModeOn(level: level)
      } else {
        throw InvalidLevelRangeException();
      }
      device.unlockForConfiguration()
    }
    
    AsyncFunction("setMode") { (value: Bool) in
      guard let device else {
        throw NoCameraAccessException()
      }
      guard device.hasTorch else {
        throw TorchNotAvailableException()
      }
      
      try device.lockForConfiguration()
      if value == true {
        device.torchMode = .on
      } else {
        device.torchMode = .off
      }
      device.unlockForConfiguration()
    }
    
    AsyncFunction("toggle") { () in
      guard let device else {
        throw NoCameraAccessException()
      }
      guard device.hasTorch else {
        throw TorchNotAvailableException()
      }
      
      try device.lockForConfiguration()
      if device.torchMode == .off {
        device.torchMode = .on
      } else {
        device.torchMode = .off
      }
      device.unlockForConfiguration()
    }
  }
}
