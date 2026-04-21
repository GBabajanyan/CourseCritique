import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { makeAutoObservable } from "mobx";
import { ThemeMode } from "../theme/ThemeProvider";
import { SemesterType } from "../types/User";
import { processToDate, semesterByMonthNumber } from "../util/general";

class SettingsStore {
  theme: ThemeMode = "system";
  pushNotifications: boolean = true;
  emailReminders: boolean = true;
  biometricsEnabled: boolean = false;

  currentDate: string;
  currentYear: number;
  currentSemester: SemesterType;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    const now = new Date();
    this.currentDate = processToDate(now);
    this.currentYear = now.getFullYear();
    this.currentSemester = semesterByMonthNumber(now.getMonth());
    this.loadSettings();
  }

  async loadSettings() {
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
    const pushNotifications = await SecureStore.getItemAsync(
      "pushNotifications_pref",
    );
    const emailReminders = await SecureStore.getItemAsync(
      "emailReminders_pref",
    );
    const biometricsEnabled =
      await SecureStore.getItemAsync("biometricsEnabled");

    this.theme = theme;
    this.pushNotifications = pushNotifications === "true";
    this.emailReminders = emailReminders === "true";
    this.biometricsEnabled = biometricsEnabled === "true";
  }

  async setSettingsTheme(value: ThemeMode) {
    this.theme = value;
    await SecureStore.setItemAsync("theme_pref", value);
  }

  async setPushNotifications(value: boolean) {
    this.pushNotifications = value;
    await SecureStore.setItemAsync("pushNotifications_pref", String(value));
  }

  async setEmailReminders(value: boolean) {
    this.emailReminders = value;
    await SecureStore.setItemAsync("emailReminders_pref", String(value));
  }

  toggleBiometrics = async () => {
    const biometricNewStatus = !this.biometricsEnabled;
    const theWord = biometricNewStatus ? "Enable" : "Disable";
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: ` ${theWord} biometric login`,
      });
      if (result.success) {
        await this.setBiometricsEnabled(biometricNewStatus);
        return biometricNewStatus;
      }
    } catch (error) {
      console.log(` ${theWord} biometrics error:`, error);
      throw error;
    }
  };

  async setBiometricsEnabled(value: boolean) {
    this.biometricsEnabled = value;
    await SecureStore.setItemAsync("biometricsEnabled", String(value));
  }
}

export default SettingsStore;
