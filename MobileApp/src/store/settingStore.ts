// stores/settingsStore.ts
import { makeAutoObservable } from "mobx";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

class SettingsStore {
  darkMode: boolean = false;
  pushNotifications: boolean = true;
  emailReminders: boolean = true;
  biometricsEnabled: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadSettings();
  }

  async loadSettings() {
    // Load from SecureStore (non-sensitive)
    const darkMode = await SecureStore.getItemAsync("darkMode_pref");
    const pushNotifications =
      await SecureStore.getItemAsync("pushNotifications_pref");
    const emailReminders = await SecureStore.getItemAsync("emailReminders_pref");
    const biometricsEnabled =
      await SecureStore.getItemAsync("biometricsEnabled");

    this.darkMode = darkMode === "true";
    this.pushNotifications = pushNotifications === "true";
    this.emailReminders = emailReminders === "true";
    this.biometricsEnabled = biometricsEnabled === "true";
  }

  async setDarkMode(value: boolean) {
    this.darkMode = value;
    await SecureStore.setItemAsync("darkMode_pref", String(value));
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
