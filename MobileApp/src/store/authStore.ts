import * as SecureStore from "expo-secure-store";
import { makeAutoObservable, runInAction } from "mobx";
import { User } from "./userStore";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import { RootStore } from ".";
import { BiometricLoginType } from "../types/User";

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

  checkBiometricsEnabled = async () =>
    (await SecureStore.getItemAsync("biometricsEnabled")) === "true";

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

  doRefreshToken = async (refreshToken: string) => {
    try {
      const response = await this.rootStore.apiClient.instance.post(
        `http://localhost:8000/auth/refresh`,
        {
          refreshToken,
        },
      );

      const { authToken, refreshToken: newRefreshToken, user } = response.data;
      await this.rootStore.apiClient.setAuthTokens(authToken, newRefreshToken);
      return user;
    } catch (error: any) {
      console.error("AuthStore doRefreshToken error", error);
      await this.rootStore.apiClient.logout();
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

  enableBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable biometric login",
      });
      if (result.success) {
        await SecureStore.setItemAsync("biometricsEnabled", "true");
      }
    } catch (error) {
      console.error("Enable biometrics error:", error);
    }
  };

  disableBiometrics = async () => {
    try {
      await SecureStore.deleteItemAsync("biometricsEnabled");
    } catch (error) {
      console.error("Disable biometrics error:", error);
    }
  };

  login = async (
    login: string,
    password: string,
  ): Promise<{ success: boolean }> => {
    this.toggleIsLoading();
    try {
      const response = await this.rootStore.apiClient.instance.post(
        `http://localhost:8000/auth/user_login`,
        {
          login,
          password,
        },
      );
      const { authToken, refreshToken, user } = response.data;
      await this.rootStore.apiClient.setAuthTokens(authToken, refreshToken);

      this.rootStore.userStore.setUser(user);
      runInAction(() => {
        this.currentUser = user;
        this.isAuthenticated = true;
      });
      return { success: true };
    } catch (error: any) {
      console.log("Login error: ", error.message);
      return { success: false };
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

      const { user } = await this.doRefreshToken(refreshToken);
      this.rootStore.userStore.setUser(user);
      runInAction(() => {
        this.currentUser = user;
      });
      this.checkAuthStatus();
    } catch (error: any) {
      console.log("Biometric login error:", error?.message);
    } finally {
      this.toggleIsLoading();
    }
  };

  logout = async () => {
    this.toggleIsLoading();
    try {
      await this.rootStore.apiClient.logout();
      await this.checkBiometricSupport();
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
}

export default AuthStore;
