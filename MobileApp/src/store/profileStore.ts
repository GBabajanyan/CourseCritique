import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { User } from "../types/User";
import { wrapStoreMethods } from "../util/errorHandler";
class ProfileStore {
  rootStore: RootStore;

  userProfile: User | null = null;
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    wrapStoreMethods(this, rootStore, { showReport: true });
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getProfileData = async (): Promise<void> => {
    this.isLoading = true;
    const { user: userData } =
      await this.rootStore.apiClient.instance.get("/profile/me");

    if (userData) {
      this.userProfile = { ...this.userProfile, ...userData };
    }
    this.isLoading = false;
  };

  // Update user profile
  updateProfile = async (userData: Partial<User>): Promise<void> => {
    this.isLoading = true;

    // const { user: userData } = await axios.get(
    //   "http://localhost:8000/auth/user_data"
    // );
    if (userData) {
      this.userProfile = { ...this.userProfile, ...userData };
    }
    this.isLoading = false;
  };

  getUser = () => {
    return this.userProfile;
  };

  // Set user data (called after login)
  setUser = (user: User) => {
    this.userProfile = user;
  };

  // Clear user data (on logout)
  clearUser = () => {
    this.userProfile = null;
  };

  // Update feedback counts
  updateFeedbackStats = (given: number, toFill: number) => {
    if (this.userProfile) {
      this.userProfile.feedbacksGiven = given;
      this.userProfile.feedbacksToFill = toFill;
    }
  };
}

export default ProfileStore;
