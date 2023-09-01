import { NativeModulesProxy, EventEmitter } from 'expo-modules-core';
// Import the native module. On web, it will be resolved to ReactNativeMicrophoneMeter.web.ts
// and on native platforms to ReactNativeMicrophoneMeter.ts
import ReactNativeMicrophoneMeterModule from './ReactNativeMicrophoneMeterModule';
import ReactNativeMicrophoneMeterView from './ReactNativeMicrophoneMeterView';
// Get the native constant value.
export const PI = ReactNativeMicrophoneMeterModule.PI;
export function hello() {
    return ReactNativeMicrophoneMeterModule.hello();
}
export async function setValueAsync(value) {
    return await ReactNativeMicrophoneMeterModule.setValueAsync(value);
}
const emitter = new EventEmitter(ReactNativeMicrophoneMeterModule ?? NativeModulesProxy.ReactNativeMicrophoneMeter);
export function addChangeListener(listener) {
    return emitter.addListener('onChange', listener);
}
export { ReactNativeMicrophoneMeterView };
//# sourceMappingURL=index.js.map