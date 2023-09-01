import ExpoSuperTorchModule from "./ExpoSuperTorchModule";

export type ChangeEventPayload = {
  value: string;
};

export type ExpoSuperTorchViewProps = {
  style?: any;
  children?: React.ReactNode;
};

export type OrientationModeConfig = {
  yawMin?: number;
  yawMax?: number;
  pitchMin?: number;
  pitchMax?: number;
  rollMin?: number;
  rollMax?: number;
};

export interface ExpoSuperTorchModule {
  readonly fireTorch: () => Promise<void>;
  readonly stopTorch: () => Promise<void>;
  readonly toggleTorch: () => Promise<void>;
  readonly getTorchIntensity: () => Promise<number>;
  readonly enableOrientationMode: (
    config: OrientationModeConfig
  ) => Promise<void>;
  readonly disableOrientationMode: () => Promise<void>;
  readonly Pi: number;
}
