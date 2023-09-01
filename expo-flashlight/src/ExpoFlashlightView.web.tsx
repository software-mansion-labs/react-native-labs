import * as React from 'react';

import { ExpoFlashlightViewProps } from './ExpoFlashlight.types';

export default function ExpoFlashlightView(props: ExpoFlashlightViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
