import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider, useStore } from "../store/StoreProvider";
import { ThemeProvider } from "../theme/ThemeProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
  }),
});

const _layout = observer(() => {
  const router = useRouter();
  const { authStore, feedbackStore, settingsStore, notificationsStore } =
    useStore();
  const { isAuthenticated } = authStore;
  const { setCurrentFeedbackCourse } = feedbackStore;
  const { inAppNotifications } = settingsStore;
  const { addNotification, updateNotificationsBadge } = notificationsStore;

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);
  const channelCreated = useRef(false);
  const pendingFeedbacksRef = useRef(feedbackStore.pendingFeedbacks);

  useEffect(() => {
    pendingFeedbacksRef.current = feedbackStore.pendingFeedbacks;
  }, [feedbackStore.pendingFeedbacks]);

  useEffect(() => {
    // Android channel setup
    if (
      !channelCreated.current &&
      inAppNotifications &&
      Platform.OS === "android"
    ) {
      Notifications.setNotificationChannelAsync("deadlines", {
        name: "Feedback Deadlines",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
      channelCreated.current = true;
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        if (!inAppNotifications) return;

        await addNotification(notification);
        await updateNotificationsBadge();
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const { data } = response.notification.request.content;

          if (!data) return;
          switch (data.type) {
            case "deadline":
            case "last_chance":
            case "early_bird":
              if (data?.feedbackId) {
                const pendingCourse = pendingFeedbacksRef.current.find(
                  (value) => value.id === data.feedbackId,
                );
                if (pendingCourse) {
                  setCurrentFeedbackCourse(pendingCourse);
                  router.push("/feedback/Pending/FeedbackForm");
                } else {
                  router.replace("/feedback/Pending");
                }
              }
              break;
            case "weekly_reminder":
              router.replace("/(protected)/(tabs)/feedback/Pending");
              break;
            case "thank_you":
              router.replace("/(protected)/(tabs)/feedback/Completed");
              break;
            case "achievement":
              router.push("/(protected)/(tabs)/profile/allBadges");
              break;
            default:
              break;
          }
          await updateNotificationsBadge();
        },
      );

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [inAppNotifications]);

  return (
    <StoreProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              animation: "none",
            }}
          >
            <Stack.Protected guard={!!isAuthenticated}>
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false }}
              />
            </Stack.Protected>

            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="Login" options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </StoreProvider>
  );
});

export default _layout;
