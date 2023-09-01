import { requireNativeModule } from "expo-modules-core";
import type { ExpoSuperTorchModule } from "./ExpoSuperTorch.types";

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.

const module = requireNativeModule("ExpoSuperTorch") as ExpoSuperTorchModule;
export default module;
