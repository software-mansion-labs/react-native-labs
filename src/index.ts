import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoLockScreen.web.ts
// and on native platforms to ExpoLockScreen.ts
import ExpoLockScreenModule from './ExpoLockScreenModule';
import ExpoLockScreenView from './ExpoLockScreenView';
import { ChangeEventPayload, ExpoLockScreenViewProps } from './ExpoLockScreen.types';

// Get the native constant value.
export const PI = ExpoLockScreenModule.PI;

export function hello(): string {
  return ExpoLockScreenModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoLockScreenModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoLockScreenModule ?? NativeModulesProxy.ExpoLockScreen);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoLockScreenView, ExpoLockScreenViewProps, ChangeEventPayload };
