import axios from "axios";
import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

export interface User {
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  degree: string;
  year: string;
  studentId: string;
  joinDate: string;
  feedbacksGiven?: number;
  feedbacksToFill?: number;
}

class ProfileStore {
  rootStore: RootStore;

  userProfile: User | null = null;
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getProfileData = async (): Promise<void> => {
    this.isLoading = true;

    try {
      const { user: userData } = await this.rootStore.apiClient.instance.get(
        "http://localhost:8000/profile/me",
      );

      if (userData) {
        this.userProfile = { ...this.userProfile, ...userData };
      }
    } catch (error) {
      console.error("Get user data error:", error.response?.data || error.message);
    } finally {
      this.isLoading = false;
    }
  };

  // Update user profile
  updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    this.isLoading = true;

    try {
      // const { user: userData } = await axios.get(
      //   "http://localhost:8000/auth/user_data"
      // );
      const userData: User | null = null;
      if (userData) {
        this.userProfile = { ...this.userProfile, ...userData };
      }
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    } finally {
      this.isLoading = false;
    }
  };

  getUser = () => {
    return this.userProfile;
  };

  // Set user data (called after login)
  setUser = (user: User | null) => {
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
