import { Subscription, requireNativeModule } from "expo-modules-core";
import { OnVolumeChangePayload } from "./ReactNativeMicrophoneMeter.types";

interface ReactNativeMicrophoneMeterModule {
  readonly startMonitoringAudio: (interval: number) => void;
  readonly stopMonitoringAudio: () => void;
  readonly askForPermissions: () => Promise<void>;

  startObserving?: () => void;
  stopObserving?: () => void;

  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
  addOnVolumeChangeListener: (
    listener: (event: OnVolumeChangePayload) => void
  ) => Subscription;
}

export default requireNativeModule<ReactNativeMicrophoneMeterModule>(
  "ReactNativeMicrophoneMeter"
);
