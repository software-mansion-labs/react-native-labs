import { requireNativeViewManager } from "expo-modules-core";
import * as React from "../../expo-lock-screen/node_modules/@types/react";

import { LinkPreviewViewProps } from "./LinkPreview.types";

const NativeView: React.ComponentType<LinkPreviewViewProps> =
  requireNativeViewManager("LinkPreview");

export default function LinkPreviewView(props: LinkPreviewViewProps) {
  return <NativeView {...props} />;
}
