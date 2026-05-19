import { makeAutoObservable } from "mobx";
import AuthStore from "./authStore";
import FeedbackStore from "./feedbackStore";
import ProfileStore from "./profileStore";
import ApiClient from "../api/client";
import SettingsStore from "./settingsStore";
import NotificationsStore from "./notificationsStore";

export class RootStore {
  apiClient: ApiClient;
  authStore: AuthStore;
  profileStore: ProfileStore;
  feedbackStore: FeedbackStore;
  settingsStore: SettingsStore;
  notificationsStore: NotificationsStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.apiClient = new ApiClient(
      process.env.API_URL || "http://192.168.1.9:8000",
    );

    this.notificationsStore = new NotificationsStore(this);
    this.settingsStore = new SettingsStore(this);
    this.authStore = new AuthStore(this);
    this.profileStore = new ProfileStore(this);
    this.feedbackStore = new FeedbackStore(this);
    this.apiClient.setOnUnauthorized(() => {
      this.authStore.handleUnauthorized();
    });
  }
}
