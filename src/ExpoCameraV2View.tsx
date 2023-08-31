import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoCameraV2ViewProps } from './ExpoCameraV2.types';

const NativeView: React.ComponentType<ExpoCameraV2ViewProps> =
  requireNativeViewManager('ExpoCameraV2');

export default function ExpoCameraV2View(props: ExpoCameraV2ViewProps) {
  return <NativeView {...props} />;
}
