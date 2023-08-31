import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoLockScreen.web.ts
// and on native platforms to ExpoLockScreen.ts
import ExpoLockScreenModule from "./ExpoLockScreenModule";
import ExpoLockScreenView from "./ExpoLockScreenView";
import {
  ChangeEventPayload,
  ExpoLockScreenViewProps,
} from "./ExpoLockScreen.types";

export const show = () => {
  ExpoLockScreenModule.show();
  console.log("show");
};

export { ExpoLockScreenView, ExpoLockScreenViewProps, ChangeEventPayload };
