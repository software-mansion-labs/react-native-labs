import * as React from "../../expo-lock-screen/node_modules/@types/react";

import { LinkPreviewViewProps } from "./LinkPreview.types";

export default function LinkPreviewView(props: LinkPreviewViewProps) {
  return (
    <div>
      <span>{props.url}</span>
    </div>
  );
}
