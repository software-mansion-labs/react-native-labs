import * as React from 'react';

import { ExpoSuperTorchViewProps } from './ExpoSuperTorch.types';

export default function ExpoSuperTorchView(props: ExpoSuperTorchViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
