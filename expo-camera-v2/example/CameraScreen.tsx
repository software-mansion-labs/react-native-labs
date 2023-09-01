import { FontAwesome } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useCameraV2,
  CameraV2Preview,
  CameraV2PreviewRef,
  requestCameraPermissionsAsync,
} from "expo-camera-v2";
import { useCallback, useEffect, useState } from "react";

function useCameraPermissions() {
  const [result, setResult] = useState(false);
  useEffect(() => {
    (async () => {
      const result = await requestCameraPermissionsAsync();
      setResult(result.granted);
    })();
  }, []);

  return result;
}

export function CameraScreen() {
  const { top } = useSafeAreaInsets();

  const permissionGranted = useCameraPermissions();

  const camera = useCameraV2();

  const previewRef = useCallback<
    (current: CameraV2PreviewRef) => Promise<void>
  >(
    async (node) => {
      if (node !== null) {
        await node.setCameraAsync(camera);
      }
    },
    [camera]
  );

  const takePhoto = useCallback(async () => {
    const result = await camera.takePictureAsync();
    Alert.alert(result);
  }, []);

  if (!permissionGranted) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: top, justifyContent: "center", alignContent: "center" },
        ]}
      >
        <Text style={{ color: "white" }}>Camera permissions not granted</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ControlButtons />
      <CameraV2Preview nativeRef={previewRef} style={{ flex: 1 }} />
      <ModeSelect />
      <ShutterButton onPress={takePhoto} />
    </View>
  );
}

function ShutterButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.shutterButtonContainer}>
      <TouchableOpacity style={styles.shutterButton} onPress={onPress} />
    </View>
  );
}

const MODE_BUTTONS = [/*{ title: "PHOTO" }, { title: "VIDEO" }*/] as const;

function ModeSelect() {
  return (
    <View style={styles.modeButtons}>
      {MODE_BUTTONS.map(({ title }) => (
        <TouchableOpacity key={title} style={styles.modeButton}>
          <Text style={styles.modeButtonText}>{title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const CONTROL_BUTTONS = [
  // { name: "cog" },
  // { name: "bolt" },
  // { name: "clock-o" },
  // { name: "square-o" },
  // { name: "square" },
  // { name: "magic" },
] as const;

function ControlButtons() {
  return (
    <View style={styles.controlButtons}>
      {CONTROL_BUTTONS.map(({ name }) => (
        <TouchableOpacity key={name} style={styles.controlButton}>
          <FontAwesome name={name} size={30} color="white" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  controlButtons: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  controlButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: "gray",
  },
  modeButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
  },
  modeButton: {
    padding: 10,
  },
  modeButtonText: {
    color: "white",
  },
  shutterButtonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  shutterButton: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 40,
  },
});
