import * as React from 'react';

import { ExpoCameraV2ViewProps } from './ExpoCameraV2.types';

export default function ExpoCameraV2View(props: ExpoCameraV2ViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
