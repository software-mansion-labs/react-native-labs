import { Button, StyleSheet, Text, View } from "react-native";

import * as ExpoLockScreen from "expo-lock-screen";

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          ExpoLockScreen.show(
            "The app is locked",
            "Type in your PIN number to unlock"
          );
        }}
        title="Press me"
      />
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
});
