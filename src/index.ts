import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoCameraV2.web.ts
// and on native platforms to ExpoCameraV2.ts
import { CameraV2NativeModule } from "./ExpoCameraV2NativeModule";
import { CameraV2Preview } from "./ExpoCameraV2NativeView";
import {
  ChangeEventPayload,
  CameraV2PreviewProps,
  Camera,
} from "./ExpoCameraV2.types";
import { useMemo } from "react";

// Get the native constant value.
export const PI = CameraV2NativeModule.PI;

export function hello(): string {
  return CameraV2NativeModule.hello();
}

export async function setValueAsync(value: string) {
  return await CameraV2NativeModule.setValueAsync(value);
}

const emitter = new EventEmitter(
  CameraV2NativeModule ?? NativeModulesProxy.ExpoCameraV2
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export function useCameraV2(): Camera {
  return useMemo(() => {
    return new CameraV2NativeModule.Camera();
  }, []);
}

export {
  CameraV2Preview,
  CameraV2PreviewProps,
  ChangeEventPayload,
  Camera,
};
