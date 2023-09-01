import * as React from "../../expo-lock-screen/node_modules/@types/react";

import { ExpoFlashlightViewProps } from "./ExpoFlashlight.types";

export default function ExpoFlashlightView(props: ExpoFlashlightViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
