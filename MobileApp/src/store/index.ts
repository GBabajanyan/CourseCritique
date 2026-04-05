import { makeAutoObservable } from "mobx";
import AuthStore from "./authStore";
import FeedbackStore from "./feedbackStore";
import ProfileStore from "./profileStore";
import ApiClient from "../api/client";
import SettingsStore from "./settingStore";

export class RootStore {
  apiClient: ApiClient;
  authStore: AuthStore;
  ProfileStore: ProfileStore;
  feedbackStore: FeedbackStore;
  SettingStore: SettingsStore;

  constructor() {
    this.apiClient = new ApiClient(
      process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000",
    );
    this.SettingStore = new SettingsStore();
    this.authStore = new AuthStore(this);
    this.ProfileStore = new ProfileStore(this);
    this.feedbackStore = new FeedbackStore(this);
    this.apiClient.setOnUnauthorized(() => {
      this.authStore.handleUnauthorized();
    });
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
