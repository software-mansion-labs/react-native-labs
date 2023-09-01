import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { LinkPreviewViewProps } from './LinkPreview.types';

const NativeView: React.ComponentType<LinkPreviewViewProps> =
  requireNativeViewManager('LinkPreview');

export default function LinkPreviewView(props: LinkPreviewViewProps) {
  return <NativeView {...props} />;
}
