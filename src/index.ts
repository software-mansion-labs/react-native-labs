import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoFlashlight.web.ts
// and on native platforms to ExpoFlashlight.ts
import ExpoFlashlightModule from './ExpoFlashlightModule';
import ExpoFlashlightView from './ExpoFlashlightView';
import { ChangeEventPayload, ExpoFlashlightViewProps } from './ExpoFlashlight.types';

// Get the native constant value.
export const PI = ExpoFlashlightModule.PI;

export function hello(): string {
  return ExpoFlashlightModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoFlashlightModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoFlashlightModule ?? NativeModulesProxy.ExpoFlashlight);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoFlashlightView, ExpoFlashlightViewProps, ChangeEventPayload };
