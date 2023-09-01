export type ChangeEventPayload = {
  value: string;
};

export type LinkPreviewViewProps = {
  url: string;
  onLoad: () => void;
  onStartLoading: () => void;
  style: any;
};
