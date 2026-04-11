import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function scheduleDeadlineNotification(
  courseCode: string,
  courseName: string,
  deadlineDate: Date,
  feedbackId: string,
) {
  const trigger = new Date(deadlineDate);
  trigger.setHours(9, 0, 0); // 9 AM on deadline day

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `📝 Feedback Reminder: ${courseCode}`,
      body: `Don't forget to submit your feedback for ${courseName}. Deadline: ${deadlineDate.toLocaleDateString()}`,
      data: {
        type: "feedback_deadline",
        feedbackId,
        courseCode,
        url: "/courses/pending",
      },
      badge: 1,
    },
    trigger: {
      date: trigger,
      channelId: Platform.OS === "android" ? "deadlines" : undefined,
    },
  });
  return notificationId; // Expo returns a unique ID
}

export async function scheduleWeeklyReminder(courseCount: number) {
  if (courseCount === 0) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `📚 You have ${courseCount} pending feedback${courseCount > 1 ? "s" : ""}`,
      body: "Take a moment to share your course experience before the deadline.",
      data: { type: "weekly_reminder", url: "/courses" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // Monday
      hour: 10,
      minute: 0,
      channelId: Platform.OS === "android" ? "deadlines" : undefined,
    },
  });
}

export async function cancelDeadlineNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
