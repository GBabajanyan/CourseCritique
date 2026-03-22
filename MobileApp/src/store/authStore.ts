import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { makeAutoObservable, runInAction } from "mobx";
import { User } from "./userStore";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import { RootStore } from ".";

class AuthStore {
  rootStore: RootStore;
  isAuthenticated: boolean = false;
  currentUser: User | null = null;
  isLoading: boolean = false;
  isBiometricAvailable: boolean = false;
  biometricType: string | null = null;
  refreshToken: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
    this.initializeAuth();
  }

  // Initialize auth on app start
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
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        await this.doRefreshToken(refreshToken);
      }
    } catch (error) {
      console.error("Check credentials error:", error);
    }
  };

  doRefreshToken = async (refreshToken: string) => {
    try {
      const response = await axios.post(`http://localhost:8000/auth/refresh`, {
        refreshToken,
      });

      const { authToken, refreshToken: newRefreshToken, user } = response.data;
      await this.handleSuccessfulAuth(authToken, newRefreshToken, user);
    } catch (error: any) {
      await this.logout();
    }
  };

  handleSuccessfulAuth = async (
    authToken: string,
    refreshToken: string,
    user: User,
  ) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    runInAction(() => {
      this.currentUser = user;
      this.isAuthenticated = true;
    });
  };

  checkBiometricSupport = async () => {
    try {
      const biometricsEnabled =
        await SecureStore.getItemAsync("biometricsEnabled");
      const compatible =
        (await LocalAuthentication.hasHardwareAsync()) &&
        biometricsEnabled === "true";
      this.setIsBiometricAvailable(compatible);

      if (this.isBiometricAvailable) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
          )
        ) {
          this.biometricType = "Face ID";
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          this.biometricType = "Touch ID";
        }
      }
    } catch (error) {
      console.error("Biometric check error:", error);
    }
  };

  enableBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable biometric login",
      });
      if (result.success) {
        await SecureStore.setItemAsync("biometricsEnabled", "true");
        await this.checkAuthStatus();
      }
    } catch (error) {
      console.error("Enable biometrics error:", error);
    }
  };

  disableBiometrics = async () => {
    try {
      await SecureStore.deleteItemAsync("biometricsEnabled");
      await this.checkAuthStatus();
    } catch (error) {
      console.error("Disable biometrics error:", error);
    }
  };

  login = async (
    login: string,
    password: string,
  ): Promise<{ success: boolean; userProfile: User | null }> => {
    this.toggleIsLoading();
    try {
      const response = await axios.post(
        `http://localhost:8000/auth/user_login`,
        {
          login,
          password,
        },
      );
      const { authToken, refreshToken, user } = response.data;

      await this.handleSuccessfulAuth(authToken, refreshToken, user);
      this.rootStore.userStore.setUser(user);
      return { success: true, userProfile: user };
    } catch (error: any) {
      console.log(error.message, "Login error");
      return { success: false, userProfile: null };
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

      await this.doRefreshToken(refreshToken);
    } catch (error: any) {
      console.log("Biometric login error:", error?.message);
    } finally {
      this.toggleIsLoading();
    }
  };

  logout = async () => {
    this.toggleIsLoading();
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      await axios.post(`http://localhost:8000/auth/user_logout`, {
        refreshToken,
      });
      await this.cleanupLocalAuth();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      this.toggleIsLoading();
    }
  };

  private cleanupLocalAuth = async () => {
    delete axios.defaults.headers.common["Authorization"];
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("biometricsEnabled");
    runInAction(() => {
      this.currentUser = null;
      this.isAuthenticated = false;
    });
  };
}

export default AuthStore;
