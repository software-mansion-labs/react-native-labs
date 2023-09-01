import React from "../../expo-lock-screen/node_modules/@types/react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import * as ExpoFlashlight from "expo-flashlight";
import Slider from "@react-native-community/slider";

export default function App() {
  const [flashlightLevel, setFlashlightLevel] = React.useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={styles.title}>Variables</Text>
        <Text>
          Has flashlight: {ExpoFlashlight.hasFlashlight() ? "Yes" : "No"}
        </Text>
        <Text>
          Is avaliable: {ExpoFlashlight.isFlashlightAvailable() ? "Yes" : "No"}
        </Text>
        <Text>
          Is active: {ExpoFlashlight.isFlashlightActive() ? "Yes" : "No"}
        </Text>
        <Text>
          Torch level {Math.floor(ExpoFlashlight.getTorchLevel() * 100) / 100}
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.title}>Turn on/off flashlight</Text>
        <Switch
          value={flashlightLevel > 0}
          onChange={() => {
            const newFlashlightLevel = flashlightLevel > 0 ? 0 : 1;
            ExpoFlashlight.setFlashlightState(newFlashlightLevel > 0);
            setFlashlightLevel(newFlashlightLevel);
          }}
        />
      </View>

      <View style={styles.block}>
        <Text style={styles.title}>Brightness level</Text>
        <Text style={styles.text}>Change flashlight level using slider:</Text>
        <Slider
          value={flashlightLevel}
          onValueChange={(value) => {
            const level = Math.floor(value * 100) / 100;
            setFlashlightLevel(level);
            ExpoFlashlight.setFlashlightLevel(level);
          }}
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="#4169e1"
          maximumTrackTintColor="#ccc"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  block: {
    marginTop: 30,
    alignItems: "center",
  },
  button: {
    width: 50,
    height: 40,
    backgroundColor: "#ccc",
    borderColor: "black",
    borderWidth: 2,
  },
  text: {
    marginBottom: 10,
  },
  title: {
    marginBottom: 10,
    fontWeight: "bold",
  },
});
