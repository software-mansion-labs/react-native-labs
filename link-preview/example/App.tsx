import { Platform, SafeAreaView, StyleSheet } from "react-native";

import LinkPreview from "./src/LinkPreview";
import React from "../../expo-lock-screen/node_modules/@types/react";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "ios" && <LinkPreview />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
