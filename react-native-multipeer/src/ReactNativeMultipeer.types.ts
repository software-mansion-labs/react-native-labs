export type PeerBrowserEventPayload = {
  displayName: string;
  id: string;
};

export type DataEventPayload = {
  peerId: string;
  data: string;
};