import ReactNativeWidgetExtension from "./ReactNativeWidgetExtensionModule";

export const startActivity = (...args: any): string | null => {
  if (!ReactNativeWidgetExtension.areActivitiesEnabled()) {
    return null;
  }

  const activityId = ReactNativeWidgetExtension.startActivity(...args);

  return activityId;
};

export const updateActivity = (activityId: string, ...args: any) => {
  if (!ReactNativeWidgetExtension.areActivitiesEnabled()) {
    return;
  }

  return ReactNativeWidgetExtension.updateActivity(activityId, ...args);
};

export const endActivity = (activityId: string, ...args: any) => {
  if (!ReactNativeWidgetExtension.areActivitiesEnabled()) {
    return;
  }

  return ReactNativeWidgetExtension.endActivity(activityId, ...args);
};

export const areActivitiesEnabled = ReactNativeWidgetExtension.areActivitiesEnabled;