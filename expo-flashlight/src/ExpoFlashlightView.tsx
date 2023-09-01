import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoFlashlightViewProps } from './ExpoFlashlight.types';

const NativeView: React.ComponentType<ExpoFlashlightViewProps> =
  requireNativeViewManager('ExpoFlashlight');

export default function ExpoFlashlightView(props: ExpoFlashlightViewProps) {
  return <NativeView {...props} />;
}
