import { makeAutoObservable } from "mobx";
import AuthStore from "./authStore";
import FeedbackStore from "./feedbackStore";
import UserStore from "./userStore";
import ApiClient from "../api/client";

export class RootStore {
  apiClient: ApiClient;
  authStore: AuthStore;
  userStore: UserStore;
  feedbackStore: FeedbackStore;

  constructor() {
    this.apiClient = new ApiClient(
      process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000",
    );

    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.feedbackStore = new FeedbackStore(this);
    this.apiClient.setOnUnauthorized(() => {
      this.authStore.handleUnauthorized();
    });
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

