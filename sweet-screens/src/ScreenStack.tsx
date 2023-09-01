import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

// import { SweetScreensViewProps } from './SweetScreens.types';

const ScreenStackView: React.ComponentType =
  requireNativeViewManager('ScreenStack');

export default function ScreenStack(props: any) {
  return <ScreenStackView {...props} style={{flex: 1}}/>;
}
