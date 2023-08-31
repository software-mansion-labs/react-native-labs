import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoCameraV2.web.ts
// and on native platforms to ExpoCameraV2.ts
import ExpoCameraV2Module from './ExpoCameraV2Module';
import ExpoCameraV2View from './ExpoCameraV2View';
import { ChangeEventPayload, ExpoCameraV2ViewProps } from './ExpoCameraV2.types';

// Get the native constant value.
export const PI = ExpoCameraV2Module.PI;

export function hello(): string {
  return ExpoCameraV2Module.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoCameraV2Module.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoCameraV2Module ?? NativeModulesProxy.ExpoCameraV2);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoCameraV2View, ExpoCameraV2ViewProps, ChangeEventPayload };
