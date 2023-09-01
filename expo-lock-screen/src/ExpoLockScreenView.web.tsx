import * as React from 'react';

import { ExpoLockScreenViewProps } from './ExpoLockScreen.types';

export default function ExpoLockScreenView(props: ExpoLockScreenViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
