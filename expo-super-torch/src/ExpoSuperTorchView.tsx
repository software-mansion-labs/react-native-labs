import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";

import { ExpoSuperTorchViewProps } from "./ExpoSuperTorch.types";
import { fireTorch, stopTorch } from ".";

const NativeView: React.ComponentType<ExpoSuperTorchViewProps> =
  requireNativeViewManager("ExpoSuperTorch");

export default function ExpoSuperTorchView(props: ExpoSuperTorchViewProps) {
  const { children, ...otherProps } = props;
  const ref = React.useRef();
  React.useEffect(() => {
    fireTorch();
    return () => {
      stopTorch();
    };
  }, []);
  return <NativeView {...props}>{children}</NativeView>;
}
