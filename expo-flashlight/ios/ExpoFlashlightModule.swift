import ExpoModulesCore


public class ExpoFlashlightModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
    
  enum TorchError: Error {
      case noTorchAvailable
      case torchCouldNotBeUsed
      case torchBrightnessError
  }
    let device = AVCaptureDevice.default(for: AVMediaType.video)
    
    func setFlashlightState(value: Bool) throws {
        guard let device, device.isTorchAvailable else {
            throw TorchError.noTorchAvailable
        }
        
          do {
              try device.lockForConfiguration()
              device.torchMode = value ? .on : .off
              device.unlockForConfiguration()
          } catch {
              throw TorchError.torchCouldNotBeUsed
          }
    }
    
    func getTorchLevel() ->  Float {
        if let device  {
             return device.torchLevel;
        }
        return 0;
    }
    
  public func definition() -> ModuleDefinition {
    Name("ExpoFlashlight")
    
      
      Function("hasFlashlight") { () -> Bool in
         if let device  {
              return device.hasTorch;
         }
         return false;
      }
      
      Function("isFlashlightActive") { () -> Bool in
          return getTorchLevel() > 0
      }
    
      Function("isFlashlightAvailable") { () -> Bool in
         if let device  {
              return device.isFlashAvailable;
         }
         return false;
      }
      
      Function("getTorchLevel") {
          getTorchLevel()
      }
      
      Function("setFlashlightState") { (value: Bool) in
          do {
              try setFlashlightState(value: value)
          } catch {
              throw TorchError.noTorchAvailable
          }
          
      }
      
      Function("setFlashlightLevel") { (level: Double) in
          guard let device, device.hasTorch else {
              throw TorchError.noTorchAvailable
          }
          do {
              if level <= 0 {
                try setFlashlightState(value: false)
              } else {
                  try device.lockForConfiguration()
                  defer {
                      device.unlockForConfiguration()
                  }
                  
                  if level > 1 {
                      try device.setTorchModeOn(level: AVCaptureDevice.maxAvailableTorchLevel)
                  } else {
                      try device.setTorchModeOn(level: Float(level))
                  }
              }
          } catch {
              throw TorchError.torchBrightnessError
          }
     }
    
    View(ExpoFlashlightView.self) {}
  }
}
