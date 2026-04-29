import { makeAutoObservable } from "mobx";
import * as SecureStore from "expo-secure-store";
import {
  Notification,
  NotificationType,
  ScheduleNotificationOptions,
} from "../types/User";
import * as Notifications from "expo-notifications";
import { DisplayableNotificationTypes } from "../constants";
import { Platform } from "react-native";
import { wrapStoreMethods } from "../util/errorHandler";
import { RootStore } from ".";

class NotificationsStore {
  displayNotifications: Notification[] = [];
  private notificationMaps = {
    deadline: {} as Record<string, string>,
    last_chance: {} as Record<string, string>,
    early_bird: {} as Record<string, string>,
  };
  weeklyNotificationId: string = "";

  constructor(rootStore: RootStore) {
    wrapStoreMethods(this, rootStore, { showReport: true });
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadNotifications = async () => {
    const stored = await SecureStore.getItemAsync("notifications");
    if (stored) {
      this.displayNotifications = JSON.parse(stored);
    }
  };

  getNotifications = () => {
    return this.displayNotifications;
  };

  saveNotifications = async () => {
    await SecureStore.setItemAsync(
      "notifications",
      JSON.stringify(this.displayNotifications),
    );
  };

  //Manage Notifications shown to user(bell icon at home page)
  addNotification = async (notif: Notifications.Notification) => {
    const { title, data, body } = notif.request.content;
    const { type, ...dataWithNoType } = data as { type: NotificationType };
    if (!DisplayableNotificationTypes.includes(type)) return;
    const newNotification = {
      title: title ?? "",
      body: body ?? "",
      type: type || "undefined",
      data: dataWithNoType,
      id: notif.request.identifier,
      displayId: Date.now().toString(),
    };

    this.displayNotifications.unshift(newNotification);
    await this.saveNotifications();
  };

  clearAllNotifications = async () => {
    this.displayNotifications = [];
    await this.saveNotifications();
  };

  removeNotification = async (id: string) => {
    this.displayNotifications = this.displayNotifications.filter(
      (n) => n.displayId !== id,
    );
    await this.saveNotifications();
  };

  //Manage notification scheduling
  manageFeedbackNotifications = async (
    feedbackId: string,
    options: ScheduleNotificationOptions,
  ) => {
    const SchedulableNotificationTypes = Object.keys(
      this.notificationMaps,
    ) as (keyof typeof this.notificationMaps)[];
    for (const type of SchedulableNotificationTypes) {
      if (this.notificationMaps[type][feedbackId]) continue;

      const notificationId = await this.scheduleNotification(type, options);
      if (notificationId)
        this.notificationMaps[type][feedbackId] = notificationId;
    }
  };

  manageWeeklyNotifications = async () => {
    if (this.weeklyNotificationId) return;
    const notificationId = await this.scheduleNotification("weekly_reminder");
    if (notificationId) this.weeklyNotificationId = notificationId;
  };

  scheduleNotification = async (
    type: NotificationType,
    options: ScheduleNotificationOptions = {},
  ): Promise<string | null> => {
    const { courseCode, courseName, deadlineDate, startDate, badgeName } =
      options;

    let title = "";
    let body = "";
    let triggerDate: Date | null = null;
    switch (type) {
      case "deadline":
        if (!deadlineDate) return null;
        triggerDate = new Date(deadlineDate);
        triggerDate.setHours(9, 0, 0);
        title = `📝 Feedback Due: ${courseCode}`;
        body = `Submit feedback for ${courseName} by end of day.`;
        break;

      case "last_chance":
        if (!deadlineDate) return null;
        triggerDate = new Date(deadlineDate);
        triggerDate.setDate(triggerDate.getDate() - 1);
        triggerDate.setHours(17, 0, 0);
        title = `⚠️ Last Chance: ${courseCode}`;
        body = `Feedback for ${courseName} closes tomorrow!`;
        break;

      case "early_bird":
        if (!startDate) return null;
        triggerDate = new Date(startDate);
        triggerDate.setHours(10, 0, 0);
        title = `🐦 Early Bird: ${courseCode}`;
        body = `Submit feedback today to earn the Early Bird badge!`;
        break;

      case "weekly_reminder":
        title = `📚 Weekly Reminder`;
        body = `Check your pending course feedbacks.`;
        break;

      case "achievement":
        title = `🏆 Achievement Unlocked!`;
        body = badgeName
          ? `You earned the "${badgeName}" badge!`
          : `You've reached a new milestone!`;
        triggerDate = null; // Send immediately
        break;

      case "thank_you":
        title = `🙏 Thank You!`;
        body = courseCode
          ? `Your feedback for ${courseCode} helps improve future courses.`
          : `Thanks for sharing your feedback!`;
        triggerDate = null; // Send immediately
        break;

      default:
        return null;
    }

    let notificationId: string;
    if (triggerDate && triggerDate > new Date()) {
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type, ...options },
        },
        trigger:
          Platform.OS === "ios"
            ? {
                date: triggerDate,
                type: Notifications.SchedulableTriggerInputTypes.DATE,
              }
            : {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
                channelId: "deadlines",
              },
      });
    } else if (triggerDate === null) {
      notificationId = await Notifications.scheduleNotificationAsync({
        content: { title, body, data: { type, ...options } },
        trigger:
          type === "weekly_reminder"
            ? {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: 1, // Monday
                hour: 10,
                minute: 0,
                channelId: Platform.OS === "android" ? "reminders" : undefined,
              }
            : null,
      });
    } else {
      return null;
    }
    return notificationId;
  };

  cancelFeedbackNotifications = async (feedbackId: string) => {
    const SchedulableNotificationTypes = Object.keys(
      this.notificationMaps,
    ) as (keyof typeof this.notificationMaps)[];
    for (const type of SchedulableNotificationTypes) {
      const id = this.notificationMaps[type][feedbackId];
      if (id) {
        await Notifications.cancelScheduledNotificationAsync(id);
        delete this.notificationMaps[type][feedbackId];
      }
    }
  };

  cancelWeeklyNotification = async () => {
    await Notifications.cancelScheduledNotificationAsync(
      this.weeklyNotificationId,
    );
  };

  cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync(); //cancel everything scheduled and weekly
    this.notificationMaps = {
      deadline: {} as Record<string, string>,
      last_chance: {} as Record<string, string>,
      early_bird: {} as Record<string, string>,
    };
    this.weeklyNotificationId = "";
    await Notifications.setBadgeCountAsync(0);
  };

  async updateNotificationsBadge() {
    const badgeCount = this.displayNotifications.length;
    await Notifications.setBadgeCountAsync(badgeCount);
  }
}

export default NotificationsStore;
