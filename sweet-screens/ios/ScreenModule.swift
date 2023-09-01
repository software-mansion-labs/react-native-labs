import ExpoModulesCore

public class ScreenModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Screen")
    
    View(ScreenView.self) {
      Prop("name") { (view: ScreenView, name: String) in
        view.name = name
      }
    }
  }
}
