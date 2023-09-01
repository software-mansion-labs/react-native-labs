import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoFlashlight.web.ts
// and on native platforms to ExpoFlashlight.ts
import ExpoFlashlightModule from "./ExpoFlashlightModule";
import ExpoFlashlightView from "./ExpoFlashlightView";
import {
  ChangeEventPayload,
  ExpoFlashlightViewProps,
} from "./ExpoFlashlight.types";

export function getTorchLevel() {
  return ExpoFlashlightModule.getTorchLevel();
}

export function hasFlashlight() {
  return ExpoFlashlightModule.hasFlashlight();
}

export function isFlashlightActive() {
  return ExpoFlashlightModule.isFlashlightActive();
}

export function isFlashlightAvailable(): string {
  return ExpoFlashlightModule.isFlashlightAvailable();
}

export function setFlashlightState(state: boolean) {
  return ExpoFlashlightModule.setFlashlightState(state);
}

export function setFlashlightLevel(level: number) {
  return ExpoFlashlightModule.setFlashlightLevel(level);
}

export { ExpoFlashlightView, ExpoFlashlightViewProps, ChangeEventPayload };
