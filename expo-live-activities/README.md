## react-native-widget-extension-fork

Fork was created as a POC for live activities for expo apps. Original repository: https://github.com/bndkt/react-native-widget-extension

Expo config plugin to add widgets and live activities to a React Native app

The widgets still need to be written in Swift (I think there's no way around that). But you can simply add a folder with Swift files to a React Native project (see folder \LiveActivitiesWidget in this repository for examples) and then add the plugin via:

```sh
npx expo install react-native-widget-extension
```

And add the following config to app.json (where widgetsFolder is the path to the folder with the Swift files):

```json
"expo": {
    "name": "my-app",
    "plugins": [
        [
            "react-native-widget-extension",
            { "frequentUpdates": true, "widgetsFolder": "LiveActivityWidget" },
        ],
    ]
}
```

Then in React land, you can use the following:

```typescript
import {
  areActivitiesEnabled,
  startActivity,
  updateActivity,
  endActivity,
} from "react-native-widget-extension";

startActivity("4343", "$32.23", driverName, 47, 43);
```

## Fork changes

- introduce more generic functions to update and end activity
- allow multiple activities running for one app in the same time (changed API to require activityId in order to update only specific activity for given app)

## Plugin configuration options

- frequentUpdates (boolean, default: false): Depending on this param, NSSupportsLiveActivitiesFrequentUpdates will be set
- widgetsFolder (string, default: "widgets"): Path from the project root to the folder containing the Swift widget files
- deploymentTarget (string, default: "16.2"): The minimum deployment target for the app

## Example

For a minimal example app, see the folder **example**. Example code for widgets can be found in the \*\*\LiveActivityWidget\_\_ folder.

Some background on how the **LiveActivityWidget** example works:

- Assets.xcassets and Info.plist: Automatically created by Xcode when you create a widget
- Attributes.swift: The ActivityAttributes for the Live Activity are defined here. By default, this file should be named "Attributes.swift".
- Module.swift: This file defined the native module that can then be used from React land to start/stop/update the live activity. By default, this file should be named "Module.swift".
- The rest of the folder can be Swift files that define widgets, views, etc. and can be named and divided between files however you want.

## Deployment Target

By default, this module adds a minimum deployment target of iOS 16.2, because otherwise Swift compilation fails if you try to use Live Activities. If you want to support earliert versions of iOS, you can manually set the deployment target via plugin config:

```json
"expo": {
    "name": "my-app",
    "plugins": [
        [
            "react-native-widget-extension",
            { "deploymentTarget": "14.0" },
        ],
    ]
}
```

If you do this and you still use Live Activities in Swift, you have to make sure to guard the code that can only run on iOS 16.2 and later like this:

```swift
import SwiftUI
import WidgetKit

@main
struct PizzaDeliveryWidgetBundle: WidgetBundle {
    var body: some Widget {
        PizzaDeliveryWidgets()

        if #available(iOS 16.2, *) {
            PizzaDeliveryLiveActivity()
        }
    }
}
```

and

```swift
@available(iOS 16.2, *)
struct LockScreenLiveActivityView: View {
    ...
}
```
