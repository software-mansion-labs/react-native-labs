import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

// import { SweetScreensViewProps } from './SweetScreens.types';

const ScreenView: React.ComponentType =
  requireNativeViewManager('Screen');

export default function Screen(props: any) {
  return <ScreenView {...props} style={{flex: 1}}/>;
}
