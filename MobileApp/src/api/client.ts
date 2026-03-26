// api/ApiClient.ts
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import * as SecureStore from "expo-secure-store";

interface TokenRefreshPromise {
  resolve: (value1: string) => void;
  reject: (reason?: any) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: TokenRefreshPromise[] = [];
  private onUnauthorized: (() => void) | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    });

    this.setupInterceptors();
  }

  //Getters
  private async getAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("authToken");
  }

  private async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("refreshToken");
  }

  //Setters
  setOnUnauthorized(callback: () => void): void {
    this.onUnauthorized = callback;
  }

  //Boolean
  private isAuthError(error: AxiosError): boolean {
    return error.response?.status === 401;
  }

  private isRefreshEndpoint(url?: string): boolean {
    return url?.includes("/auth/refresh") ?? false;
  }

  //Actions
  private queueRequest(originalRequest: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.refreshQueue.push({
        resolve: (authToken: string) => {
          console.log("ads");

          originalRequest.headers.Authorization = `Bearer ${authToken}`;
          console.log("asafsg");
          resolve(this.client(originalRequest));
        },
        reject,
      });
    });
  }

  private processQueue(
    error: any = null,
    authToken: string | null = null,
  ): void {
    this.refreshQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (authToken) {
        promise.resolve(authToken);
      }
    });
    this.refreshQueue = [];
  }

  private async refreshToken(): Promise<any> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post(
      `${this.client.defaults.baseURL}/auth/refresh`,
      { refreshToken },
    );

    const { authToken, refreshToken: newRefreshToken } = response.data;
    await this.setAuthTokens(authToken, newRefreshToken);

    return { authToken, refreshToken: newRefreshToken };
  }

  private async clearTokens(clearRefreshToken = true): Promise<void> {
    await SecureStore.deleteItemAsync("authToken");
    if (clearRefreshToken) await SecureStore.deleteItemAsync("refreshToken");
    delete this.client.defaults.headers.common["Authorization"];
  }

  private async handleUnauthorized(): Promise<void> {
    await this.clearTokens(false);
    if (this.onUnauthorized) {
      this.onUnauthorized();
    }
  }

  //Actual Logic
  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      this.requestOnFulfilledInterceptor,
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => response,
      this.responseOnRejectInterceptor,
    );
  }

  private requestOnFulfilledInterceptor = async (
    config: InternalAxiosRequestConfig,
  ) => {
    const token = await this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  };

  private responseOnRejectInterceptor = async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      !originalRequest ||
      originalRequest._retry ||
      !this.isAuthError(error)
    ) {
      return Promise.reject(error);
    }

    if (this.isRefreshEndpoint(originalRequest.url)) {
      await this.handleUnauthorized();
      return Promise.reject(error);
    }

    if (this.isRefreshing) {
      return this.queueRequest(originalRequest);
    }

    return this.refreshAndRetry(originalRequest);
  };

  private async refreshAndRetry(
    originalRequest: CustomAxiosRequestConfig,
  ): Promise<unknown> {
    this.isRefreshing = true;
    originalRequest._retry = true;

    try {
      const { authToken, refreshToken } = await this.refreshToken();
      const requestParams = JSON.parse(originalRequest.data);
      originalRequest.data = requestParams["refreshToken"]
        ? { ...requestParams, refreshToken }
        : originalRequest.data;
      originalRequest.headers.Authorization = `Bearer ${authToken}`;

      this.processQueue(null, authToken);
      return this.client(originalRequest);
    } catch (error) {
      this.processQueue(error, null);
      await this.handleUnauthorized();
      return Promise.reject(error);
    } finally {
      this.isRefreshing = false;
    }
  }

  // Public methods
  get instance(): AxiosInstance {
    return this.client;
  }

  async setAuthTokens(authToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    this.client.defaults.headers.common["Authorization"] =
      `Bearer ${authToken}`;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (refreshToken) {
        await this.client.post(
          `${this.client.defaults.baseURL}/auth/user_logout`,
          { refreshToken },
        );
      }

      await this.clearTokens();

      if (this.onUnauthorized) {
        this.onUnauthorized();
      }
    } catch (error) {
      if (isAxiosError(error))
        console.error("Axios error: ", error.response?.data);
      else console.error("Logout error:", error);
      throw error;
    }
  }
}

export default ApiClient;
