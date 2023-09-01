import React from "react";
import { StyleSheet, Text, View } from "react-native";

import * as SweetScreens from "sweet-screens";

function FirstScreen() {
  return (
    <View style={[styles.container, { backgroundColor: "cyan" }]}>
      <View style={styles.box} />
      <Text>First screen</Text>
    </View>
  );
}

function SecondScreen() {
  return (
    <View style={[styles.container, { backgroundColor: "magenta" }]}>
      <View style={styles.box} />
      <Text>Second screen</Text>
    </View>
  );
}

function ThirdScreen() {
  return (
    <View style={[styles.container, { backgroundColor: "yellow" }]}>
      <View style={styles.box} />
      <Text>Third screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <SweetScreens.ScreenStack>
      <SweetScreens.Screen name="First">
        <FirstScreen />
      </SweetScreens.Screen>
      <SweetScreens.Screen name="Second">
        <SecondScreen />
      </SweetScreens.Screen>
      <SweetScreens.Screen name="Third">
        <ThirdScreen />
      </SweetScreens.Screen>
    </SweetScreens.ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "50%",
    height: "50%",
    backgroundColor: "tomato",
  },
});
