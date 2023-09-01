import { createPermissionHook, PermissionResponse } from "expo-modules-core";

import { CameraV2NativeModule } from "./ExpoCameraV2NativeModule";
import { CameraV2Preview, CameraV2PreviewRef } from "./ExpoCameraV2NativeView";
import { CameraV2PreviewProps, Camera } from "./ExpoCameraV2.types";
import { useMemo } from "react";

export function useCameraV2(): Camera {
  return useMemo(() => {
    return new CameraV2NativeModule.Camera();
  }, []);
}

export const useCameraPermissions = createPermissionHook({
  requestMethod: CameraV2NativeModule.requestCameraPermissionsAsync,
  getMethod: CameraV2NativeModule.getCameraPermissionsAsync,
});

export function requestCameraPermissionsAsync(): Promise<PermissionResponse> {
  return CameraV2NativeModule.requestCameraPermissionsAsync();
}

export { CameraV2Preview, CameraV2PreviewProps, Camera, CameraV2PreviewRef };
