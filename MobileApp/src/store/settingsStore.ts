import * as LocalAuthentication from "expo-local-authentication";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { makeAutoObservable } from "mobx";
import { Alert } from "react-native";
import { RootStore } from ".";
import { ThemeMode } from "../theme/ThemeProvider";
import { SemesterType } from "../types/User";
import { processToDate, semesterByMonthNumber } from "../util/general";
import { wrapStoreMethods } from "../util/errorHandler";

class SettingsStore {
  theme: ThemeMode = "system";
  inAppNotifications: boolean = true;
  emailReminders: boolean = true;
  biometricsEnabled: boolean = false;

  currentDate: string;
  currentYear: number;
  currentSemester: SemesterType;

  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    wrapStoreMethods(this, rootStore, { showReport: true });
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = rootStore;
    const now = new Date();
    this.currentDate = processToDate(now);
    this.currentYear = now.getFullYear();
    this.currentSemester = semesterByMonthNumber(now.getMonth());

    this.loadSettings();
    this.checkNotificationPermissions();
  }

  loadSettings = async () => {
    const theme = await SecureStore.getItemAsync("theme_pref").then((res) => {
      switch (res) {
        case "light":
          return "light";
        case "dark":
          return "dark";
        default:
          return "system";
      }
    });
    const inAppNotifications = await SecureStore.getItemAsync(
      "inAppNotifications_pref",
    );
    const emailReminders = await SecureStore.getItemAsync(
      "emailReminders_pref",
    );
    const biometricsEnabled =
      await SecureStore.getItemAsync("biometricsEnabled");

    this.theme = theme;
    this.inAppNotifications = inAppNotifications === "true";
    this.emailReminders = emailReminders === "true";
    this.biometricsEnabled = biometricsEnabled === "true";
  };

  checkNotificationPermissions = async () => {
    const { status } = (await Notifications.getPermissionsAsync()) as {
      status: string;
    };

    // If permissions not granted, force disable
    if (
      status !== Notifications.PermissionStatus.GRANTED &&
      this.inAppNotifications
    ) {
      this.inAppNotifications = false;
      await SecureStore.setItemAsync("inAppNotifications_pref", "false");
    }
  };

  setSettingsTheme = async (value: ThemeMode) => {
    this.theme = value;
    await SecureStore.setItemAsync("theme_pref", value);
  };

  setinAppNotifications = async (value: boolean) => {
    this.inAppNotifications = value;
    await SecureStore.setItemAsync("inAppNotifications_pref", String(value));

    const {
      cancelAllNotifications,
      manageFeedbackNotifications,
      manageWeeklyNotifications,
      updateNotificationsBadge,
    } = this.rootStore.notificationsStore;

    if (!value) {
      await cancelAllNotifications();
      return;
    }

    const { status: currentStatus } =
      (await Notifications.getPermissionsAsync()) as {
        status: string;
      };

    if (currentStatus !== Notifications.PermissionStatus.GRANTED) {
      const { status: newStatus } =
        (await Notifications.requestPermissionsAsync()) as {
          status: string;
        };

      if (newStatus !== Notifications.PermissionStatus.GRANTED) {
        // ❌ Revert the setting if permission denied
        this.inAppNotifications = false;
        await SecureStore.setItemAsync("inAppNotifications_pref", "false");

        Alert.alert(
          "Permission needed",
          "Please enable notifications in settings to receive reminders.",
          [{ text: "OK" }],
        );
        return;
      }
    }
    const { pendingCount } = this.rootStore.feedbackStore;
    if (pendingCount > 0)
      for (const feedback of this.rootStore.feedbackStore.pendingFeedbacks) {
        const { id, courseCode, courseName, startDate, deadline } = feedback;
        await manageFeedbackNotifications(id, {
          courseCode: courseCode,
          courseName: courseName,
          startDate: new Date(startDate),
          deadlineDate: new Date(deadline),
        });
      }
    await manageWeeklyNotifications();
    await updateNotificationsBadge();
  };

  setEmailReminders = async (value: boolean) => {
    this.emailReminders = value;
    await SecureStore.setItemAsync("emailReminders_pref", String(value));
  };

  toggleBiometrics = async () => {
    const biometricNewStatus = !this.biometricsEnabled;
    const theWord = biometricNewStatus ? "Enable" : "Disable";
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: ` ${theWord} biometric login`,
    });
    if (result.success) {
      await this.setBiometricsEnabled(biometricNewStatus);
      return biometricNewStatus;
    }
  };

  setBiometricsEnabled = async (value: boolean) => {
    this.biometricsEnabled = value;
    await SecureStore.setItemAsync("biometricsEnabled", String(value));
  };
}

export default SettingsStore;
