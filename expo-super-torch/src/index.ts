import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoSuperTorch.web.ts
// and on native platforms to ExpoSuperTorch.ts
import ExpoSuperTorchModule from "./ExpoSuperTorchModule";
import ExpoSuperTorchView from "./ExpoSuperTorchView";
import { OrientationModeConfig } from "./ExpoSuperTorch.types";

export async function fireTorch() {
  return await ExpoSuperTorchModule.fireTorch();
}

export async function stopTorch() {
  return await ExpoSuperTorchModule.stopTorch();
}

export async function toggleTorch() {
  return await ExpoSuperTorchModule.toggleTorch();
}

export async function getTorchIntensity() {
  return await ExpoSuperTorchModule.getTorchIntensity();
}

export async function enableOrientationMode(
  config: OrientationModeConfig = {
    pitchMin: -0.1,
    pitchMax: 0.1,
    rollMin: -0.1,
    rollMax: 0.1,
  }
) {
  return await ExpoSuperTorchModule.enableOrientationMode(config);
}

export async function disableOrientationMode() {
  return await ExpoSuperTorchModule.disableOrientationMode();
}

export { ExpoSuperTorchView };

export const Pi = ExpoSuperTorchModule.Pi;
