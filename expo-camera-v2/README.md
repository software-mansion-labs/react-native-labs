# expo-camera-v2

React Native Camera Module that allows building stock-like cameras apps

At this moment this library is Proof of Concept and is not ready for production use.

There's only Android implementation at this moment as this was the core idea of this library.

Navigate to [`example`](./example) directory and try it out.

## API

At this very moment only 2 key things are somehow done:
- [x] preview connection with camera sensor
- [x] taking picture

THe novelty technical aspects for this library:
- [x] decoupling `Preview` component (RN Native View exposed via Expo Modules API) and `camera` object (SharedObject from Expo Modules API) that controls the camera behaviour and actions (e.g. taking picture action)
- [x] wrapping Android CameraX API in React Native - successor for legacy Camera1 API used in original `expo-camera` library 


### Installation & further development

1. Learn about [Expo Modules API from App.js workshops](https://hackmd.io/gYH9xz-oR2ai0Yih8if50w) or [Expo Modules API docs](https://docs.expo.dev/modules/module-api/)
1. Install all dependencies:
  > `yarn` in root directory
  > `yarn` in `exmaple` dirctory
  > `pod install` in `ios` directory
1. Start `exmaple` project on Android and have fun

