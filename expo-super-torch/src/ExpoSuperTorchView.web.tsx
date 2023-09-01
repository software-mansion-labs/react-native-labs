import * as React from "../../expo-lock-screen/node_modules/@types/react";

import { ExpoSuperTorchViewProps } from "./ExpoSuperTorch.types";

export default function ExpoSuperTorchView(props: ExpoSuperTorchViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
