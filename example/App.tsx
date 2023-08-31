import { StyleSheet, Text, View } from 'react-native';

import * as ExpoLockScreen from 'expo-lock-screen';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoLockScreen.hello()}</Text>
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
