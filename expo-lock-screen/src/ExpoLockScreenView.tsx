import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoLockScreenViewProps } from './ExpoLockScreen.types';

const NativeView: React.ComponentType<ExpoLockScreenViewProps> =
  requireNativeViewManager('ExpoLockScreen');

export default function ExpoLockScreenView(props: ExpoLockScreenViewProps) {
  return <NativeView {...props} />;
}
