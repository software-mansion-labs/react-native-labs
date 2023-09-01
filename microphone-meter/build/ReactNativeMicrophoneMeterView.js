import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
const NativeView = requireNativeViewManager('ReactNativeMicrophoneMeter');
export default function ReactNativeMicrophoneMeterView(props) {
    return React.createElement(NativeView, { ...props });
}
//# sourceMappingURL=ReactNativeMicrophoneMeterView.js.map