import { requireNativeModule } from 'expo-modules-core';


interface ReactNativeTorchModule {
  readonly turnOn: () => void;
  readonly turnOff: () => void;
  readonly setIntensity: (intensity: number) => void;

  startObserving?: () => void;
  stopObserving?: () => void;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default requireNativeModule<ReactNativeTorchModule>('ReactNativeTorch');
