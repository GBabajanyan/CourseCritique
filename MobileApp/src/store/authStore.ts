import * as SecureStore from "expo-secure-store";
import { makeAutoObservable, runInAction } from "mobx";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import { RootStore } from ".";
import { BiometricLoginType, User } from "../types/User";
import { wrapStoreMethods } from "../util/errorHandler";

class AuthStore {
  rootStore: RootStore;

  isAuthenticated: boolean = false;
  isLoading: boolean = false;

  isBiometricAvailable: boolean = false;
  biometricType: BiometricLoginType = "none";

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    wrapStoreMethods(this, rootStore, { showReport: true });
    makeAutoObservable(this, {}, { autoBind: true });
    this.initializeAuth();
  }

  initializeAuth = async () => {
    this.toggleIsLoading();
    await this.checkBiometricSupport();
    await this.checkAuthStatus();
    this.toggleIsLoading();
  };

  toggleIsLoading = () => (this.isLoading = !this.isLoading);

  setIsBiometricAvailable = (value: boolean) =>
    (this.isBiometricAvailable = value);

  checkAuthStatus = async () => {
    const token =
      await this.rootStore.apiClient.instance.defaults.headers.common[
        "Authorization"
      ];

    runInAction(() => {
      this.isAuthenticated = !!token;
    });
  };

  doRefreshToken = async (
    refreshToken: string,
  ): Promise<{ userProfile: User }> => {
    const response = await this.rootStore.apiClient.instance.post(
      `/auth/refresh`,
      {
        refreshToken,
      },
    );

    const {
      authToken,
      refreshToken: newRefreshToken,
      userProfile,
    } = response.data;

    await this.rootStore.apiClient.setAuthTokens(authToken, newRefreshToken);
    return { userProfile };
  };

  checkBiometricSupport = async () => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const isBiometricsEnabled =
      (await SecureStore.getItemAsync("biometricsEnabled")) === "true";
    const isCompatible =
      (await LocalAuthentication.hasHardwareAsync()) &&
      isBiometricsEnabled &&
      !!refreshToken;
    this.setIsBiometricAvailable(isCompatible);

    if (this.isBiometricAvailable) {
      const authTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (
        authTypes.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        )
      ) {
        this.biometricType = "Face ID";
      } else if (
        authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
      ) {
        this.biometricType = "Touch ID";
      }
    }
  };

  login = async (login: string, password: string): Promise<void> => {
    this.toggleIsLoading();
    const response = await this.rootStore.apiClient.instance.post(
      `/auth/user_login`,
      {
        login,
        password,
      },
    );
    const { authToken, refreshToken, user } = response.data;
    await this.rootStore.apiClient.setAuthTokens(authToken, refreshToken);
    runInAction(() => {
      this.isAuthenticated = true;
    });

    await this.handleAfterLoginLoads(user);
    this.toggleIsLoading();
  };

  biometricLogin = async () => {
    this.toggleIsLoading();
    if (!this.isBiometricAvailable) {
      throw new Error("Biometrics not available");
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: `Authenticate with ${this.biometricType || "biometrics"}`,
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    if (result.success) {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (!refreshToken) {
        Alert.alert("Error", "Please login with password first");
        throw new Error(
          "Biometric auth Failed:Please login with password first",
        );
      }

      const { userProfile } = await this.doRefreshToken(refreshToken);

      this.handleAfterLoginLoads(userProfile);
    }
    this.toggleIsLoading();
  };

  logout = async () => {
    this.toggleIsLoading();
    await this.rootStore.settingsStore.setBiometricsEnabled(false);
    this.setIsBiometricAvailable(false);
    await this.rootStore.notificationsStore.cancelAllNotifications(); //scheduled
    await this.rootStore.notificationsStore.clearAllNotifications(); //fired
    await this.rootStore.apiClient.logout();
    this.rootStore.profileStore.clearUser();
    this.toggleIsLoading();
  };

  handleUnauthorized = (): void => {
    runInAction(() => {
      this.isAuthenticated = false;
    });
    this.rootStore.profileStore.clearUser();
  };

  handleAfterLoginLoads = async (userProfile?: User) => {
    if (userProfile) this.rootStore.profileStore.setUser(userProfile);
    const areNotifsEnabled = this.rootStore.settingsStore.inAppNotifications;
    if (areNotifsEnabled)
      await this.rootStore.notificationsStore.loadNotifications();
    await this.rootStore.feedbackStore.loadLoggingData();
    await this.rootStore.profileStore.fetchBadges();
    await this.rootStore.profileStore.checkBadges();
    await this.checkAuthStatus();
  };
}

export default AuthStore;
