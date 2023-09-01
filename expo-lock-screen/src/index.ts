import ExpoLockScreenModule from "./ExpoLockScreenModule";
import {
  ChangeEventPayload,
  ExpoLockScreenViewProps,
} from "./ExpoLockScreen.types";

export const show = (title?: string, message?: string) => {
  ExpoLockScreenModule.show(title, message);
};

export const initialize = () => {
  ExpoLockScreenModule.initialize();
};

export { ExpoLockScreenViewProps, ChangeEventPayload };
