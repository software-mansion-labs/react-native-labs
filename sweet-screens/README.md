# sweet-screens

Incomplete PoC porting `react-native-screens` to Expo Modules API on iOS.

In short, this module maps the React hierarchy created in JavaScript as the native view hierarchy under a UINavigationController.

https://github.com/software-mansion-labs/react-native-labs/assets/39658211/22b7dd94-979d-4328-b1fd-24773d0f4f06



## Features

The PoC consists of 2 modules:
- `ScreenStackView`
- `ScreenView`

### ScreenView 

ScreenView has a `UIViewController` controller field whose view is connected as a subview to the native view hierarchy.
It takes the react children passed in JS and attaches it under the UIViewController to retain the JSX children. 

### ScreenStackView

ScreenStackView is a `UINavigationController` delegate which catches the react children passed in JS (which need to be of type ScreenView), makes a _reactSubviews array out of it and presents it as view controllers.

## Whats missing

There's no communication between the JS layer and the native layer in the code whatsoever.
In react-native-screens it's achieved by overriding plenty of methods used to manage react subviews such as `reactSubviews()`, `reactSuperview()`, and `reactViewController()`.
In the end that would require the library to manage the view hierarchy all by itself.
