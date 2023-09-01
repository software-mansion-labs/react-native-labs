import { Ref } from "react";
import { ViewProps } from "react-native";
import { CameraV2PreviewRef } from "./ExpoCameraV2NativeView";

export type CameraV2PreviewProps = {
  nativeRef?: Ref<CameraV2PreviewRef>;
} & ViewProps;

export type Camera = {
  takePicture(): void;
};
