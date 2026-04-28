import * as SecureStore from "expo-secure-store";
import { makeAutoObservable, runInAction } from "mobx";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import { RootStore } from ".";
import { BiometricLoginType, User } from "../types/User";

class AuthStore {
  rootStore: RootStore;

  isAuthenticated: boolean = false;
  currentUser: User | null = null;
  isLoading: boolean = false;

  isBiometricAvailable: boolean = false;
  biometricType: BiometricLoginType = "none";

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
    this.initializeAuth();
  }

  async initializeAuth() {
    this.toggleIsLoading();
    try {
      await this.checkBiometricSupport();
      await this.checkAuthStatus();
    } catch (error) {
      console.error("Init error:", error);
    } finally {
      this.toggleIsLoading();
    }
  }

  toggleIsLoading = () => (this.isLoading = !this.isLoading);

  setIsBiometricAvailable = (value: boolean) =>
    (this.isBiometricAvailable = value);

  checkAuthStatus = async () => {
    try {
      const token =
        await this.rootStore.apiClient.instance.defaults.headers.common[
          "Authorization"
        ];

      runInAction(() => {
        this.isAuthenticated = !!token;
      });
    } catch (error) {
      console.error("Init error:", error);
    }
  };

  doRefreshToken = async (
    refreshToken: string,
  ): Promise<{ userProfile: User }> => {
    try {
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
    } catch (error: any) {
      await this.rootStore.apiClient.logout();
      throw new Error(
        "AuthStore doRefreshToken error",
        error.response?.data || error.message,
      );
    }
  };

  checkBiometricSupport = async () => {
    try {
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
    } catch (error) {
      console.error("AuthStore Biometric check error:", error);
    }
  };

  login = async (login: string, password: string): Promise<void> => {
    this.toggleIsLoading();
    try {
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
        this.currentUser = user;
        this.isAuthenticated = true;
      });

      await this.handleAfterLoginLoads(user);
    } catch (error: any) {
      console.log("Login error: ", error.message);
      throw error;
    } finally {
      this.toggleIsLoading();
    }
  };

  biometricLogin = async () => {
    this.toggleIsLoading();
    try {
      if (!this.isBiometricAvailable) {
        throw new Error("Biometrics not available");
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate with ${this.biometricType || "biometrics"}`,
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (!result.success) {
        throw new Error("Biometric auth Failed: Biometrics not recognized");
      }

      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (!refreshToken) {
        Alert.alert("Error", "Please login with password first");
        throw new Error(
          "Biometric auth Failed:Please login with password first",
        );
      }

      const { userProfile } = await this.doRefreshToken(refreshToken);

      runInAction(() => {
        this.currentUser = userProfile;
      });
      this.handleAfterLoginLoads(userProfile);
    } catch (error: any) {
      console.log("Biometric login error:", error?.message);
    } finally {
      this.toggleIsLoading();
    }
  };

  logout = async () => {
    this.toggleIsLoading();
    try {
      await this.rootStore.settingsStore.setBiometricsEnabled(false);
      this.setIsBiometricAvailable(false);
      await this.rootStore.notificationsStore.cancelAllNotifications(); //scheduled
      await this.rootStore.notificationsStore.clearAllNotifications(); //fired
      await this.rootStore.apiClient.logout();
    } catch (error: any) {
      Alert.alert("Logout Error occured. Please try to log out again later");
      console.error("Logout API error:", error);
    } finally {
      this.toggleIsLoading();
    }
  };

  handleUnauthorized = (): void => {
    runInAction(() => {
      this.isAuthenticated = false;
      this.currentUser = null;
    });
  };

  handleAfterLoginLoads = async (userProfile?: User) => {
    if (userProfile) this.rootStore.profileStore.setUser(userProfile);
    const areNotifsEnabled = this.rootStore.settingsStore.inAppNotifications;
    if (areNotifsEnabled)
      await this.rootStore.notificationsStore.loadNotifications();
    await this.rootStore.feedbackStore.loadLoggingData();
    await this.checkAuthStatus();
  };
}

export default AuthStore;
