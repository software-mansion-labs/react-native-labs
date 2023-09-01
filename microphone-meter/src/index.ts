import { EventEmitter, Subscription } from "expo-modules-core";

// Import the native module. On web, it will be resolved to ReactNativeMicrophoneMeter.web.ts
// and on native platforms to ReactNativeMicrophoneMeter.ts
import ReactNativeMicrophoneMeter from "./ReactNativeMicrophoneMeterModule";
import ReactNativeTorch from "./ReactNativeTorchModule";
import { OnVolumeChangePayload } from "./ReactNativeMicrophoneMeter.types";

const emitter = new EventEmitter(ReactNativeMicrophoneMeter);

function addOnVolumeChangeListener(
  listener: (event: OnVolumeChangePayload) => void
): Subscription {
  return emitter.addListener<OnVolumeChangePayload>("onVolumeChange", listener);
}

ReactNativeMicrophoneMeter.addOnVolumeChangeListener =
  addOnVolumeChangeListener;

export { ReactNativeMicrophoneMeter, ReactNativeTorch };
