import { action, makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import { AxiosInstance } from "axios";
import { Course } from "../types/Course";
import {
  CompletedFeedbackFromDB,
  CompletedFeedbackListConfigItem,
  FeedbackRatings,
} from "../types/Feedback";
import {
  generateConfigArrayFromCompletedFeedbacks,
  processToDate,
} from "../util/course";

class FeedbackStore {
  rootStore: RootStore;
  api: AxiosInstance;

  currentFeedbackCourse: Course | null = null;
  courseFeedbackInSearchModal: Course | null = null;

  pendingFeedbacks: Course[] = [];
  completedFeedbacks: CompletedFeedbackListConfigItem[] = [];
  allCourses: Course[] = [];

  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.api = rootStore.apiClient.instance;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get pendingCount(): number {
    return this.pendingFeedbacks.length;
  }

  setCurrentFeedbackCourse = (course: Course | null) => {
    this.currentFeedbackCourse = course;
  };

  setCourseFeedbackInSearchModal = (value: Course | null) => {
    this.courseFeedbackInSearchModal = value;
  };

  @action
  setIsLoading = (val: boolean) => {
    this.isLoading = val;
  };

  loadPendingCourses = async (): Promise<void> => {
    this.setIsLoading(true);

    try {
      const { data } =
        await this.rootStore.apiClient.instance.get(`/feedback/pending`);

      runInAction(() => {
        this.pendingFeedbacks = [
          ...data.map((item: Course) => ({
            ...item,
            deadline: processToDate(item.deadline),
          })),
        ];
      });
    } catch (error) {
      console.error("Load pending courses error:", error);
    } finally {
      this.setIsLoading(false);
    }
  };

  loadCompletedFeedbacks = async (): Promise<void> => {
    this.setIsLoading(true);

    try {
      const { data } =
        await this.rootStore.apiClient.instance.get(`/feedback/completed`);

      this.completedFeedbacks = generateConfigArrayFromCompletedFeedbacks(
        data as CompletedFeedbackFromDB[],
      );
    } catch (error) {
      console.error("Load completed feedbacks error:", error);
    } finally {
      this.setIsLoading(false);
    }
  };

  loadAllCourses = async (): Promise<void> => {
    this.setIsLoading(true);
    try {
      const { data } = await this.rootStore.apiClient.instance.get(`/courses`);

      runInAction(() => {
        this.allCourses = [...data];
      });
    } catch (error) {
      console.error("Load pending courses error:", error);
    } finally {
      this.setIsLoading(false);
    }
  };

  fetchCourseStats = async (courseId: string) => {
    this.setIsLoading(true);
    try {
      const response = await this.rootStore.apiClient.instance.get(
        `/feedback/${courseId}/stats`,
      );

      // setCourseStats(response.data);
    } catch (error) {
      console.error("fetchCourseStats error:", error.response?.data || error);
    } finally {
      this.setIsLoading(false);
    }
  };

  submitFeedback = async (feedbackData: FeedbackRatings): Promise<void> => {
    this.setIsLoading(true);
    try {
      if (this.currentFeedbackCourse === null)
        throw new Error("No FeedbackCourse data");
      const feedbackJson = JSON.stringify(feedbackData);
      await this.rootStore.apiClient.instance.post(`/feedback/submit`, {
        ratings: feedbackJson,
        feedbackId: this.currentFeedbackCourse.id,
      });
    } catch (error) {
      console.error("Submit feedback error:", error);
      throw error;
    } finally {
      this.setIsLoading(false);
    }
  };
}

export default FeedbackStore;
