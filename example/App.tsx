import { StyleSheet, Text, View } from 'react-native';

import * as ExpoCameraV2 from 'expo-camera-v2';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoCameraV2.hello()}</Text>
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
