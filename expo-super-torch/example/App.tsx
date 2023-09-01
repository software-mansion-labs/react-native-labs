import React from "../../expo-lock-screen/node_modules/@types/react";
import { Button, StyleSheet, Text, View } from "react-native";

import * as ExpoSuperTorch from "expo-super-torch";
import Slider from "@react-native-community/slider";

export default function App() {
  const [torchIntensity, setTorchIntensity] = React.useState(0);

  const [yawMin, setYawMin] = React.useState(-ExpoSuperTorch.Pi);
  const [yawMax, setYawMax] = React.useState(ExpoSuperTorch.Pi);
  const [pitchMin, setPitchMin] = React.useState(-ExpoSuperTorch.Pi / 2);
  const [pitchMax, setPitchMax] = React.useState(ExpoSuperTorch.Pi / 2);
  const [rollMin, setRollMin] = React.useState(-ExpoSuperTorch.Pi);
  const [rollMax, setRollMax] = React.useState(ExpoSuperTorch.Pi);

  const [isBoxVisible, setIsBoxVisible] = React.useState(false);

  async function handleTorchIntensity() {
    try {
      const torchIntensity = await ExpoSuperTorch.getTorchIntensity();
      setTorchIntensity(torchIntensity);
    } catch (error: any) {
      setTorchIntensity(error.toString());
      console.log(error.toString());
    }
  }

  async function handleFireTorch() {
    await ExpoSuperTorch.fireTorch();
  }

  async function handleStopTorch() {
    await ExpoSuperTorch.stopTorch();
  }

  async function handleToggleTorch() {
    await ExpoSuperTorch.toggleTorch();
  }

  async function handleEnableOrientationMode() {
    const config = {
      yawMin,
      yawMax,
      pitchMin,
      pitchMax,
      rollMin,
      rollMax,
    };
    await ExpoSuperTorch.enableOrientationMode(config);
  }

  async function handleEnableDefaultOrientationMode() {
    await ExpoSuperTorch.enableOrientationMode();
  }

  return (
    <View style={styles.container}>
      <Button title="Fire Torch" onPress={handleFireTorch} />
      <Button title="Stop torch" onPress={handleStopTorch} />
      <Button title="Toggle torch (WIP)" onPress={handleToggleTorch} />
      <Button title="Get torch intensity" onPress={handleTorchIntensity} />
      <Text style={styles.textStyle}>{torchIntensity}</Text>
      <Button
        title="Enable default orientation mode"
        onPress={handleEnableDefaultOrientationMode}
      />
      <Button
        title="Enable orientation mode"
        onPress={handleEnableOrientationMode}
      />
      <Button
        title="Disable orientation mode"
        onPress={ExpoSuperTorch.disableOrientationMode}
      />
      <>
        <Text>
          Minimal yaw: {((yawMin * 180) / ExpoSuperTorch.Pi).toFixed(0)}deg
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={-ExpoSuperTorch.Pi}
          maximumValue={ExpoSuperTorch.Pi}
          value={-ExpoSuperTorch.Pi}
          onValueChange={(value) => {
            setYawMin(value);
          }}
        />
        <Text>
          Maximal yaw: {((yawMax * 180) / ExpoSuperTorch.Pi).toFixed(0)}deg
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={-ExpoSuperTorch.Pi}
          maximumValue={ExpoSuperTorch.Pi}
          value={ExpoSuperTorch.Pi}
          onValueChange={(value) => {
            setYawMax(value);
          }}
        />
        <Text>
          Minimal pitch: {((pitchMin * 180) / ExpoSuperTorch.Pi).toFixed(0)}deg
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={-ExpoSuperTorch.Pi / 2}
          maximumValue={ExpoSuperTorch.Pi / 2}
          value={-ExpoSuperTorch.Pi / 2}
          onValueChange={(value) => {
            setPitchMin(value);
          }}
        />
        <Text>
          Maximal pitch: {((pitchMax * 180) / ExpoSuperTorch.Pi).toFixed(0)}deg
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={-ExpoSuperTorch.Pi / 2}
          maximumValue={ExpoSuperTorch.Pi / 2}
          value={ExpoSuperTorch.Pi / 2}
          onValueChange={(value) => {
            setPitchMax(value);
          }}
        />
        <Text>
          Minimal roll: {((rollMin * 180) / ExpoSuperTorch.Pi).toFixed(0)}deg
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={-ExpoSuperTorch.Pi}
          maximumValue={ExpoSuperTorch.Pi}
          value={-ExpoSuperTorch.Pi}
          onValueChange={(value) => {
            setRollMin(value);
          }}
        />
        <Text>
          Maximal roll: {((rollMax * 180) / ExpoSuperTorch.Pi).toFixed(0)}deg
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={-ExpoSuperTorch.Pi}
          maximumValue={ExpoSuperTorch.Pi}
          value={ExpoSuperTorch.Pi}
          onValueChange={(value) => {
            setRollMax(value);
          }}
        />
      </>
      <Button
        title={"Toggle box"}
        onPress={() => {
          console.log(isBoxVisible);
          setIsBoxVisible(!isBoxVisible);
        }}
      />
      {isBoxVisible ? (
        <ExpoSuperTorch.ExpoSuperTorchView
          style={[styles.container, styles.subContainer]}
        >
          <Text>I'm in a superb wrapper</Text>
        </ExpoSuperTorch.ExpoSuperTorchView>
      ) : null}
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
  textStyle: {
    padding: 2,
    borderRadius: 5,
    borderWidth: 1,
  },
  slider: {
    width: 300,
    height: 40,
  },
  subContainer: {
    flex: undefined,
    backgroundColor: "#eae",
  },
});
