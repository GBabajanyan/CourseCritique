import * as Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider, useStore } from "../store/StoreProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
  }),
});

const RootLayout = observer(() => {
  const router = useRouter();
  const { authStore, profileStore, feedbackStore } = useStore();
  const { isAuthenticated } = authStore;
  const { savePushToken } = profileStore;
  const { pendingFeedbacks, setCurrentFeedbackCourse } = feedbackStore;

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          alert("Failed to get push token!");
          return;
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const token = await Notifications.getExpoPushTokenAsync({ projectId });

        await savePushToken(token.data);

        // console.log("Expo push token:", token.data);
      } else {
        // alert("Must use physical device for push notifications");
      }
    };

    registerForPushNotifications();

    // Android channel setup
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Add listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log("Notification received while app is open:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log("User tapped notification:", response);
        const data = response.notification.request.content.data;
        if (data?.courseId) {
          const pendingCourse = pendingFeedbacks.filter(
            (value) => value.id === data.courseId,
          );
          if (pendingCourse.length) {
            setCurrentFeedbackCourse(pendingCourse[0]);
            router.push("/feedback/Pending/FeedbackForm");
          }
        }
      });

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <StoreProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ animation: "none" }}>
          <Stack.Protected guard={!!isAuthenticated}>
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="Login" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </SafeAreaProvider>
    </StoreProvider>
  );
});

export default RootLayout;
