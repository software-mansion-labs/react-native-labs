import { requireNativeViewManager } from "expo-modules-core";
import React, { Ref } from "../../expo-lock-screen/node_modules/@types/react";

import { Camera, CameraV2PreviewProps } from "./ExpoCameraV2.types";

export type CameraV2PreviewRef = {
  readonly setCameraAsync: (camera: Camera) => Promise<void>;
};

const NativeView: React.ComponentType<
  Omit<CameraV2PreviewProps, "nativeRef"> & {
    ref?: Ref<CameraV2PreviewRef>;
  }
> = requireNativeViewManager("ExpoCameraV2");

export function CameraV2Preview({ nativeRef, ...props }: CameraV2PreviewProps) {
  return <NativeView ref={nativeRef} {...props} />;
}
