import ExpoModulesCore
import UIKit

class Screen : UIViewController {
  
//  override func viewDidDisappear(_ animated: Bool) {
//    super.viewDidDisappear(animated)
//  }
}

class ScreenView: ExpoView {
  let controller = Screen()
//  var _reactSuperview: UIView? = nil
  
  var name = "Mleko" {
    didSet {
      controller.title = name
    }
  }
  
  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    
    addSubview(controller.view)
  }
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertReactSubview(subview, at: atIndex)
    controller.view = subview
  }
  
//  override func reactViewController() -> UIViewController! {
//    return controller
//  }
//
//  override func reactSuperview() -> UIView! {
//    return _reactSuperview
//  }

}
