import {Platform} from 'react-native';
import ExpoTorchModule from './ExpoTorchModule';

export async function setMode(value: boolean) {
  return await ExpoTorchModule.setMode(value);
}

export async function turnOnWithLevel(value: number) {
  return await ExpoTorchModule.turnOnWithLevel(value);
}

export async function toggle() {
  return await ExpoTorchModule.toggle();
}

export function getMaxLevel(): number {
  if(Platform.OS === 'ios'){
    console.warn(`'getMaxLevel' method not available on iOS`);
    return 0;
  }
  return ExpoTorchModule.getMaxLevel();
}

export function getDefaultLevel(): number {
  if(Platform.OS === 'ios'){
    console.warn(`'getDefaultLevel' method not available on iOS`);
    return 0;
  } else {
    return ExpoTorchModule.getDefaultLevel();
  }
}

export function getCurrentLevel(): number {
  return ExpoTorchModule.getCurrentLevel();
}
