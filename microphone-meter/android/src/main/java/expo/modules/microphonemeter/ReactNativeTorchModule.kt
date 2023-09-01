package expo.modules.microphonemeter

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ReactNativeTorchModule : Module() {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {

        Name("ReactNativeTorch")

        Function("turnOn"){}
        Function("turnOff"){}
        Function("setIntensity"){}
    }
}
