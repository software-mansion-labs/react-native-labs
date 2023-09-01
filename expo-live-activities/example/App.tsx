import {
  useCallback,
  useRef,
  useState,
} from "../../expo-lock-screen/node_modules/@types/react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  areActivitiesEnabled,
  startActivity as _startActivity,
  updateActivity as _updateActivity,
  endActivity as _endActivity,
} from "react-native-widget-extension-local";

function useLiveAcitivites() {
  const activitiesMapRef = useRef(new Map<string, string>());

  const startActivity = useCallback(
    ({
      totalAmount,
      orderNumber,
      driverName,
      minutes,
      seconds,
    }: {
      totalAmount: string;
      orderNumber: string;
      driverName: string;
      minutes: number;
      seconds: number;
    }): string | null => {
      if (!areActivitiesEnabled()) {
        return null;
      }

      const activityId = _startActivity(
        totalAmount,
        orderNumber,
        driverName,
        minutes,
        seconds
      );

      if (!activityId) {
        return null;
      }

      activitiesMapRef.current.set(orderNumber, activityId);

      return activityId;
    },
    []
  );

  const updateActivity = useCallback(
    ({
      orderNumber,
      driverName,
      minutes,
      seconds,
    }: {
      orderNumber: string;
      driverName: string;
      minutes: number;
      seconds: number;
    }) => {
      if (
        !areActivitiesEnabled() ||
        !activitiesMapRef.current.has(orderNumber)
      ) {
        return;
      }

      const activityId = activitiesMapRef.current.get(orderNumber);

      if (!activityId)
        return console.warn(
          `No activity found for order number ${orderNumber}`
        );

      return _updateActivity(activityId, driverName, minutes, seconds);
    },
    []
  );

  const endActivity = useCallback(
    ({
      orderNumber,
      driverName,
    }: {
      orderNumber: string;
      driverName: string;
    }) => {
      if (!areActivitiesEnabled()) {
        return;
      }

      const activityId = activitiesMapRef.current.get(orderNumber);

      if (!activityId)
        return console.warn(
          `No activity found for order number ${orderNumber}`
        );

      activitiesMapRef.current.delete(orderNumber);
      return _endActivity(activityId, driverName);
    },
    []
  );

  return {
    startActivity,
    updateActivity,
    endActivity,
  };
}

export default function TabTwoScreen() {
  const [driverName, setDriverName] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState("");
  const { startActivity, updateActivity, endActivity } = useLiveAcitivites();
  return (
    <View style={styles.container}>
      <Text>Live Activities: {areActivitiesEnabled() ? "✅" : "❌"}</Text>
      {areActivitiesEnabled() && (
        <>
          <View style={{ marginTop: 30, marginBottom: 15 }}>
            <Text>Driver:</Text>
            <TextInput
              placeholder="Driver"
              style={{
                backgroundColor: "white",
                borderColor: "lightgray",
                borderWidth: 1,
                padding: 5,
                width: 200,
              }}
              value={driverName}
              onChangeText={setDriverName}
            />
          </View>
          <View style={{ marginBottom: 15 }}>
            <Text>Order number:</Text>
            <TextInput
              placeholder="Order number"
              style={{
                backgroundColor: "white",
                borderColor: "lightgray",
                borderWidth: 1,
                padding: 5,
                width: 200,
              }}
              value={orderNumber}
              onChangeText={setOrderNumber}
            />
          </View>
          <Button
            title="Start activity"
            onPress={() => {
              startActivity({
                orderNumber,
                totalAmount: "$32.23",
                driverName,
                minutes: 2,
                seconds: 30,
              });
            }}
          />
          <Button
            title="Update activity"
            onPress={() => {
              updateActivity({
                orderNumber,
                driverName,
                minutes: 0,
                seconds: 0,
              });
            }}
          />
          <Button
            title="End activity"
            onPress={() => {
              endActivity({ orderNumber, driverName });
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
