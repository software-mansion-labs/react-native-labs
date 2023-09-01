import ExpoModulesCore

public class ScreenStackModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenStack")
    
    View(ScreenStackView.self) {
    }
  }
}
