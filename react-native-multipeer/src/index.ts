import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReactNativeMultipeer.web.ts
// and on native platforms to ReactNativeMultipeer.ts
import ReactNativeMultipeerModule from './ReactNativeMultipeerModule';
import { DataEventPayload, PeerBrowserEventPayload } from './ReactNativeMultipeer.types';


export function init(displayName: string) {
  return ReactNativeMultipeerModule.init(displayName);
}

export function startAdvertising() {
  return ReactNativeMultipeerModule.startAdvertising();
}
export function startBrowsing() {
  return ReactNativeMultipeerModule.startBrowsing();
}
export function stopAdvertising() {
  return ReactNativeMultipeerModule.stopAdvertising();
}
export function stopBrowsing() {
  return ReactNativeMultipeerModule.stopBrowsing();
}

export function invitePeer(id: string) {
  return ReactNativeMultipeerModule.invitePeer(id);
}

export function acceptInvitation(id: string) {
  return ReactNativeMultipeerModule.acceptInvitation(id);
}

export function cancelInvitation(id: string) {
  return ReactNativeMultipeerModule.cancelInvitation(id);
}

export function sendData(id: string, data: Uint8Array, type: number) {
  return ReactNativeMultipeerModule.sendData(id, data, type);
}

export function disconnect(id: string) {
  return ReactNativeMultipeerModule.disconnect(id);
}

const emitter = new EventEmitter(ReactNativeMultipeerModule ?? NativeModulesProxy.ReactNativeMultipeer);

export function onPeerFound(listener: (event: PeerBrowserEventPayload) => void): Subscription {
  return emitter.addListener<PeerBrowserEventPayload>('onPeerFound', listener);
}

export function onPeerLost(listener: (event: PeerBrowserEventPayload) => void): Subscription {
  return emitter.addListener<PeerBrowserEventPayload>('onPeerLost', listener);
}

export function onInvite(listener: (event: PeerBrowserEventPayload) => void): Subscription {
  return emitter.addListener<PeerBrowserEventPayload>('onInvite', listener);
}

export function onPeerConnected(listener: (event: PeerBrowserEventPayload) => void): Subscription {
  return emitter.addListener<PeerBrowserEventPayload>('onPeerConnected', listener);
}

export function onPeerDisconnected(listener: (event: PeerBrowserEventPayload) => void): Subscription {
  return emitter.addListener<PeerBrowserEventPayload>('onPeerDisconnected', listener);
}

export function onDataReceived(listener: (event: DataEventPayload) => void): Subscription {
  return emitter.addListener<DataEventPayload>('onDataReceived', listener);
}
export { PeerBrowserEventPayload };
