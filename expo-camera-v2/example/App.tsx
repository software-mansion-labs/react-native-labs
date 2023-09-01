import { useEffect } from 'react';
import { CameraScreen } from './CameraScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider>
      <CameraScreen />
      <StatusBar translucent style="light" />
    </SafeAreaProvider>
  );
}

