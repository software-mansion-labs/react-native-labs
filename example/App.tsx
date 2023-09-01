import { StyleSheet, Text, View } from 'react-native';

import * as ExpoFlashlight from 'expo-flashlight';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoFlashlight.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
