import * as React from 'react';

import { LinkPreviewViewProps } from './LinkPreview.types';

export default function LinkPreviewView(props: LinkPreviewViewProps) {
  return (
    <div>
      <span>{props.url}</span>
    </div>
  );
}
