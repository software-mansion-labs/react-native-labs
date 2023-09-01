import ExpoModulesCore
import UIKit

class ScreenStackView: ExpoView, UINavigationControllerDelegate {
  let controller = UINavigationController()
  var _reactSubviews: [ScreenView] = []
  
  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    controller.delegate = self
    
    addSubview(controller.view)
  }
  
  override func reactSetFrame(_ frame: CGRect) {
    controller.view.setNeedsUpdateConstraints()
  }
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    guard let subview = subview as? ScreenView else {
      print("ScreenStack only accepts children of type ScreenView")
      return
    }
    
//    super.insertReactSubview(subview, at: atIndex)
    
//    subview._reactSuperview = self
    _reactSubviews.insert(subview, at: atIndex)
  }
  
//  override func removeReactSubview(_ subview: UIView!) {
  
//    _reactSubviews = _reactSubviews.filter {
//      $0.reactTag == subview.reactTag
//    }
//    print(subview)
//  }
  
  private func updateControllers() {
    let controllers = _reactSubviews.map {
      $0.controller
    }
    
    controller.setViewControllers(controllers, animated: true)
  }
  
  override func didMoveToWindow() {
    super.didMoveToWindow()

    updateControllers()
  }
  
  override func didUpdateReactSubviews() {
    super.didUpdateReactSubviews()
    updateControllers()

    print(_reactSubviews)
  }
  
  
//  override func reactSubviews() -> [UIView]! {
//    return _reactSubviews
//  }
//
//  override func reactViewController() -> UIViewController! {
//    return controller
//  }
}
    
