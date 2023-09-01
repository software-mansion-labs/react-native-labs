import { Subscription } from 'expo-modules-core';
import { useEffect, useRef, useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';


import { ReactNativeMicrophoneMeter, ReactNativeTorch } from 'react-native-microphone-meter';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor, useAnimatedReaction, interpolate } from 'react-native-reanimated';

const INTERVAL = 50
export default function App() {
  const audioListener = useRef<Subscription>()
  const animatedVolume = useSharedValue(-120) // -120 db means silence
  const volumes = useRef<number[]>([])
  const [bottomLoudnessValue, setBottomLoudnessValue] = useState(-30)
  const [topLoudnessValue, setTopLoudnessValue] = useState(0)

  const onVolumeChange = ({ db }: { db: number }) => {
    animatedVolume.value = withTiming(db, { duration: INTERVAL })
    const intensity = interpolate(animatedVolume.value, [bottomLoudnessValue, topLoudnessValue], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    try {
      if (intensity === 0 ){
        ReactNativeTorch.turnOff()  
      } else {
        ReactNativeTorch.setIntensity(intensity)
      }
    } catch (e) {
      // do nothing on error
    }
  };

  const startMonitoringAudio = async () => {
    try {
      if (Platform.OS  === 'android') {
        await ReactNativeMicrophoneMeter.askForPermissions();
      }
      audioListener.current?.remove()
      audioListener.current = ReactNativeMicrophoneMeter.addOnVolumeChangeListener(onVolumeChange)
      ReactNativeMicrophoneMeter.startMonitoringAudio(INTERVAL)
    } catch (e) {
      console.log(e);
    }
  };

  const stopMonitoringAudio = () => {
    volumes.current = [];
    audioListener.current?.remove();
    try {
      ReactNativeMicrophoneMeter.stopMonitoringAudio()
      ReactNativeTorch.turnOff()
      animatedVolume.value = -120
    } catch (e) {
      console.log(e);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(animatedVolume.value, [bottomLoudnessValue, topLoudnessValue], ['gray', 'white'])
  }), [])

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Button
        title='Start Monitoring'
        onPress={startMonitoringAudio}
        color="violet"
      />
      <Button
        title='Stop Monitoring'
        onPress={stopMonitoringAudio}
        color="violet"
      />
      <Button
        title='Turn torch on'
        onPress={() => ReactNativeTorch.turnOn()}
        color="violet"
      />
      <Button
        title='Turn torch off'
        onPress={() => ReactNativeTorch.turnOff()}
        color="violet"
      />
      <View style={{ height: 50 }}/>
      <Text>Meter bottom intensity ({bottomLoudnessValue})</Text>
      <Slider
        style={{width: 200, height: 80}}
        minimumValue={-120}
        maximumValue={-1}
        value={bottomLoudnessValue}
        minimumTrackTintColor="white"
        maximumTrackTintColor="blue"
        onValueChange={(value) => {
          try {
            setBottomLoudnessValue(value)
          } catch (e) {
            console.log(e)
          }
        }}
      />

      <Text>Meter top intensity ({ topLoudnessValue })</Text>
      <Slider
        style={{width: 200, height: 80}}
        minimumValue={-119}
        maximumValue={0}
        value={topLoudnessValue}
        minimumTrackTintColor="red"
        maximumTrackTintColor="white"
        onValueChange={(value) => {
          try {
            setTopLoudnessValue(value)
          } catch (e) {
            console.log(e)
          }
        }}
      />
      <Text>Torch intensity:</Text>
      <Slider
        style={{width: 200, height: 80}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={(value) => {
          try {
            ReactNativeTorch.setIntensity(value);
          } catch (e) {
            console.log(e);
          }
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
