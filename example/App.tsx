import { StyleSheet, Text, View } from 'react-native';

import * as LinkPreview from 'link-preview';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{LinkPreview.hello()}</Text>
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
