import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import {useEffect, useState} from 'react';
import Slider from '@react-native-community/slider';

import * as Torch from 'expo-torch';

export default function App() {
  const [torchLevelsArray, setTorchLevelsArray] = useState<number[]>([]);

  const initAndroidTorchLevelsArray = async() => {
    const torchMaxStrength = await Torch.getMaxLevel();
    const levelsArray = [...Array(torchMaxStrength)].map((item, index) => {
      return index + 1;
    });
    setTorchLevelsArray(levelsArray);
  }

  const logTorchLevels = async() => {
    const torchMaxStrength = await Torch.getMaxLevel();
    const torchStrength = await Torch.getCurrentLevel();
    const defaultTorchStrength = await Torch.getDefaultLevel();
    console.log({defaultTorchStrength, torchMaxStrength, torchStrength});
  }

  const turnOn = () => {
    Torch.setMode(true);
  }

  const turnOff = () => {
    Torch.setMode(false);
  }

  useEffect(() => {
    logTorchLevels();
    if(Platform.OS === 'android'){
      initAndroidTorchLevelsArray();
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text></Text>
      <TouchableOpacity style={styles.rect} onPress={Torch.toggle}>
        <Text>Toggle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rect} onPress={turnOn}>
        <Text>Turn on</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rect} onPress={turnOff}>
        <Text>Turn off</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rect} onPress={logTorchLevels}>
        <Text>Log torch levels</Text>
      </TouchableOpacity>
      {Platform.OS === 'android'
      ? <View style={{flexDirection: 'row'}}>
        {torchLevelsArray.map((val) => {
          return <TouchableOpacity style={[styles.torchLevelRect, { backgroundColor:'yellow' }]} onPress={() => Torch.turnOnWithLevel(val)}>
            <Text style={{fontSize: 30}}>{val}</Text>
          </TouchableOpacity>
        })}
      </View>
      : <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
        onValueChange={(value) => {
          Torch.turnOnWithLevel(value)
        }}
        minimumTrackTintColor="#00FF00"
        maximumTrackTintColor="#000000"
      />}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    alignItems:'center'
  },
  rect: { paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, alignItems:'center', margin: 10 },
  torchLevelRect: {
    paddingVertical: 5, paddingHorizontal: 5, borderWidth: 1, alignItems:'center', margin: 5
  }
});
