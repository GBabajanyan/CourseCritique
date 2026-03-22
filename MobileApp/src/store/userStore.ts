import axios from "axios";
import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

export interface User {
  id: string;
  refreshToken: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  degree: string;
  year: string;
  studentId: string;
  joinDate: string;
  feedbacksGiven?: number;
  feedbacksToFill?: number;
  currentSemester?: string;
}

class UserStore {
  user: User | null = null;
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
  }

  getUserData = async (): Promise<User | null> => {
    this.isLoading = true;

    try {
      const { user: userData } = await axios.get(
        "http://localhost:8000/auth/user_data",
      );
      
      if (userData) {
        this.user = { ...this.user, ...userData };
      }
    } catch (error) {
      console.error("Get user data error:", error);
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
        this.user = { ...this.user, ...userData };
      }
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    } finally {
      this.isLoading = false;
    }
  };

  // Set user data (called after login)
  setUser = (user: User | null) => {
    this.user = user;
  };

  // Clear user data (on logout)
  clearUser = () => {
    this.user = null;
  };

  // Update feedback counts
  updateFeedbackStats = (given: number, toFill: number) => {
    if (this.user) {
      this.user.feedbacksGiven = given;
      this.user.feedbacksToFill = toFill;
    }
  };
}

export default UserStore;
