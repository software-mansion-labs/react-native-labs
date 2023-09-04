import ExpoModulesCore

public class ExpoLockScreenModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoLockScreen')` in JavaScript.
    Name("ExpoLockScreen")
    
    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])
    
    // Defines event names that the module can send to JavaScript.
    Events("onChange")
    
    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }
    
    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }
    
    AsyncFunction("show") {
      show();
    }
    .runOnQueue(.main)
    
    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(ExpoLockScreenView.self) {
      // Defines a setter for the `name` prop.
      Prop("name") { (view: ExpoLockScreenView, prop: String) in
        print(prop)
      }
    }
    
    OnAppBecomesActive {
      show()
    }
    
    OnAppEntersBackground {
      
    }
  }
  var lockscreenVisible = false
  var pinCode = ""
  let correctPin = "1234"
  var circles = (0..<4).map { _ in UIView() }
  var view = UIView(frame: UIScreen.main.bounds)
  let errorLabel = UILabel()
  
  @objc func buttonTapped(_ sender: UIButton) {
    guard let digit = sender.accessibilityLabel else { return }
    
    errorLabel.text = ""
    if digit == "\u{232B}" || digit == "faceid" {
      removeLastDigitIfNotEmpty()
    } else if pinCode.count < 4 {
      appendToPincode(digit)
      checkPincode()
    }
  }
  
  func removeLastDigitIfNotEmpty() {
    if pinCode.isEmpty { return }
    
    pinCode.removeLast()
    let prevCircle = self.circles[self.pinCode.count]
    animateCircle(prevCircle, withColor: UIColor.clear.cgColor)
  }
  
  func appendToPincode(_ digit: String) {
    pinCode += digit
    let selectedCircle = self.circles[self.pinCode.count - 1]
    animateCircle(selectedCircle, withColor: UIColor.white.cgColor)
  }
  
  func checkPincode() {
    if pinCode.count == 4 {
      if pinCode == correctPin {
        lockscreenVisible = false
        removeViewWithAnimation()
        resetPasswordEntry()
      } else {
        displayErrorAndClearPincode()
      }
    }
  }
  
  func removeViewWithAnimation() {
    UIView.animate(withDuration: 0.3, animations: {
      self.view.alpha = 0
    }) { _ in
      self.view.removeFromSuperview()
    }
  }
  
  func resetPasswordEntry() {
    view = UIView(frame: UIScreen.main.bounds)
    circles = (0..<4).map { _ in UIView() }
    pinCode = ""
  }
  
  func displayErrorAndClearPincode() {
    errorLabel.text = "Wrong password"
    for circle in circles {
      animateCircle(circle, withColor: nil)
    }
    pinCode = ""
  }
  
  func animateCircle(_ circle: UIView, withColor color: CGColor?) {
    UIView.animate(withDuration: 0.3) {
      circle.layer.backgroundColor = color
    }
  }
 
  func show() {
    if (lockscreenVisible) { return }
    lockscreenVisible = true
      let titleLabel = UILabel()
    let descriptionLabel = UILabel()
    
      // Configure title label
      titleLabel.text = "Unlock the app"
      titleLabel.font = UIFont.systemFont(ofSize: 28)
      titleLabel.textColor = .white
      titleLabel.textAlignment = .center
      titleLabel.translatesAutoresizingMaskIntoConstraints = false
    
    
      // Configure title label
      descriptionLabel.text = "Enter your Pin number to unlock the app"
      descriptionLabel.font = UIFont.systemFont(ofSize: 16)
      descriptionLabel.textColor = .white
      descriptionLabel.textAlignment = .center
      descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
      
      // Configure error label
    
//      errorLabel.text = "Wrong password"
      errorLabel.font = UIFont.systemFont(ofSize: 16)
      errorLabel.textColor = .red
      errorLabel.textAlignment = .center
      errorLabel.translatesAutoresizingMaskIntoConstraints = false
      
      view.addSubview(titleLabel)
      view.addSubview(descriptionLabel)
      view.addSubview(errorLabel)
    
      view.backgroundColor = .black
      
      let circlesStackView = UIStackView()
      
      circlesStackView.spacing = 20
      circlesStackView.distribution = .fillEqually
      circlesStackView.alignment = .fill
      circlesStackView.axis = .horizontal
      circlesStackView.translatesAutoresizingMaskIntoConstraints = false
  
      
      // Add each circle to the stack view
      for circle in circles {
        circle.layer.borderWidth = 1
        circle.layer.borderColor = UIColor.white.cgColor
        circle.layer.cornerRadius = 8
        circle.translatesAutoresizingMaskIntoConstraints = false
        
        // Define height and width constraints for each circle
        NSLayoutConstraint.activate([
          circle.widthAnchor.constraint(equalToConstant: 16),
          circle.heightAnchor.constraint(equalToConstant: 16)
        ])
        
        circlesStackView.addArrangedSubview(circle)
      }
      
      view.addSubview(circlesStackView)
      
      let buttonsStackView = UIStackView()
      // Create the number button matrix
      let buttons = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["faceid", "0", "\u{232B}"]
      ]
      
      buttonsStackView.translatesAutoresizingMaskIntoConstraints = false
      buttonsStackView.axis = .vertical
      buttonsStackView.distribution = .fillEqually
      buttonsStackView.spacing = 60
      for row in buttons {
        let rowStackView = UIStackView()
        rowStackView.translatesAutoresizingMaskIntoConstraints = false
        rowStackView.axis = .horizontal
        rowStackView.distribution = .fillEqually
        for buttonLabel in row {
          let button = UIButton(type: .system)
          button.setTitle(buttonLabel.count == 1 ? buttonLabel : "", for: .normal)
          if (buttonLabel.count > 1) {
            button.setImage(UIImage(systemName: buttonLabel), for: .normal)
            button.tintColor = .white
          }
          button.accessibilityLabel = buttonLabel
          button.setTitleColor(.white, for: .normal)
          button.titleLabel?.font = UIFont.systemFont(ofSize: 24)
          button.addTarget(self, action: #selector(buttonTapped(_:)), for: .touchUpInside)
          rowStackView.addArrangedSubview(button)
        }
        buttonsStackView.addArrangedSubview(rowStackView)
      }
      
      view.addSubview(buttonsStackView)
      
      // Define how the numeric keypad is displayed
      NSLayoutConstraint.activate([
        // Constraints for the title label
        titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
        titleLabel.bottomAnchor.constraint(equalTo: circlesStackView.topAnchor, constant: -100),
        
        descriptionLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
        descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 10),
        
        // Constraints for the error label
        errorLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
        errorLabel.topAnchor.constraint(equalTo: circlesStackView.bottomAnchor, constant: 20),
        
        circlesStackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
        circlesStackView.bottomAnchor.constraint(equalTo: buttonsStackView.topAnchor, constant: -100),
        
        buttonsStackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
        buttonsStackView.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -100),
        
        buttonsStackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
      ])

      
    if let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }) {
      // Initially set the alpha to 0
      view.alpha = 0.0
      window.addSubview(view)
      window.bringSubviewToFront(view)
      
      // Animate the alpha back to 1 over 0.5 seconds
      UIView.animate(withDuration: 0.3) {
        self.view.alpha = 1.0
      }
    } else {
      print("Unable to find key window.")
    }
  }
}
