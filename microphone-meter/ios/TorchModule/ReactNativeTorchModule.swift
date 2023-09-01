import ExpoModulesCore

internal class TorchModuleFailed: Exception {
  override var reason: String {
    "Torch Module failed"
  }
}

public class ReactNativeTorchModule: Module {
  var device: AVCaptureDevice?

  private func getDevice() -> AVCaptureDevice {
    if (self.device == nil) {
      self.device = AVCaptureDevice.default(for: .video)
    }
    return self.device!
  }
  
  private func setTorchMode(mode: AVCaptureDevice.TorchMode) throws {
    let device = getDevice()
    do {
      try device.lockForConfiguration()
      device.torchMode = mode
      device.unlockForConfiguration()
    } catch {
      throw TorchModuleFailed()
    }
  }
  
  private func setTorchIntensity(intensity: Double) throws {
    let device = getDevice()
    do {
      try device.lockForConfiguration()
      try device.setTorchModeOn(level: Float(intensity))
      device.unlockForConfiguration()
    } catch {
      throw TorchModuleFailed()
    }
  }

  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ReactNativeTorch')` in JavaScript.
    Name("ReactNativeTorch")

    Function("turnOn") {
      try setTorchMode(mode: .on)
    }

    Function("turnOff") {
      try setTorchMode(mode: .off)
    }

    Function("setIntensity") { (intensity: Double) in
      try setTorchIntensity(intensity: intensity)
    }
  }
}
