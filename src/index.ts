import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to LinkPreview.web.ts
// and on native platforms to LinkPreview.ts
import LinkPreviewModule from './LinkPreviewModule';
import LinkPreviewView from './LinkPreviewView';
import { ChangeEventPayload, LinkPreviewViewProps } from './LinkPreview.types';

// Get the native constant value.
export const PI = LinkPreviewModule.PI;

export function hello(): string {
  return LinkPreviewModule.hello();
}

export async function setValueAsync(value: string) {
  return await LinkPreviewModule.setValueAsync(value);
}

const emitter = new EventEmitter(LinkPreviewModule ?? NativeModulesProxy.LinkPreview);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { LinkPreviewView, LinkPreviewViewProps, ChangeEventPayload };
