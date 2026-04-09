import { AxiosInstance } from "axios";
import { action, makeAutoObservable, runInAction } from "mobx";
import { MarkedDates } from "react-native-calendars/src/types";
import { RootStore } from ".";
import { feedbackColors } from "../constants/colors";
import { Course } from "../types/Course";
import {
  CompletedFeedbackFromDB,
  CompletedFeedbackListConfigItem,
  FeedbackRatings,
} from "../types/Feedback";
import { generateConfigArrayFromCompletedFeedbacks } from "../util/course";
import { processToDate } from "../util/general";

class FeedbackStore {
  rootStore: RootStore;
  api: AxiosInstance;

  currentFeedbackCourse: Course | null = null;
  courseFeedbackInSearchModal: Course | null = null;

  pendingFeedbacks: Course[] = [];
  completedFeedbacks: CompletedFeedbackListConfigItem[] = [];
  completedFeedbacksCount: number = 0;
  allCourses: Course[] = [];

  pendingCalendar: MarkedDates = {};

  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.api = rootStore.apiClient.instance;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get pendingCount(): number {
    return this.pendingFeedbacks.length;
  }

  switchSelectedDateOnCalendar = (oldDate: string, newDate: string) => {
    this.pendingCalendar[oldDate].selected = false;
    if (!this.pendingCalendar[newDate]) {
      this.pendingCalendar[newDate] = {};
    }
    this.pendingCalendar[newDate].selected = true;
  };

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
            startDate: processToDate(item.startDate),
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

  loadPendingCoursesForHome = async (): Promise<void> => {
    await this.loadPendingCourses()
      .then(async () => {
        this.setIsLoading(true);

        this.pendingCalendar = {} as MarkedDates;
        const indicesToExclude: Set<number> = new Set();
        this.pendingFeedbacks.forEach(({ startDate, deadline }) => {
          const startDateTimestamp = new Date(startDate);
          const deadlineTimestamp = new Date(deadline);
          let randomIndex = Math.round(Math.random() * 7);
          while (indicesToExclude.has(randomIndex)) {
            randomIndex = Math.round(Math.random() * 7);
          }
          indicesToExclude.add(randomIndex);

          for (
            let theDate = startDateTimestamp;
            theDate <= deadlineTimestamp;
            theDate.setDate(theDate.getDate() + 1) //next day
          ) {
            const formattedTheDate = processToDate(theDate);
            if (
              !this.pendingCalendar[formattedTheDate] ||
              !this.pendingCalendar[formattedTheDate].periods
            ) {
              this.pendingCalendar[formattedTheDate] = { periods: [] };
            }
            this.pendingCalendar[formattedTheDate].periods?.push({
              startingDay: formattedTheDate === startDate,
              endingDay: formattedTheDate === deadline,
              color: feedbackColors[randomIndex],
            });
          }
        });
      })
      .catch((error) => {
        console.error("Load pending courses error:", error);
      })
      .finally(() => this.setIsLoading(false));
  };

  loadCompletedFeedbacks = async (): Promise<void> => {
    this.setIsLoading(true);

    try {
      const { data } =
        await this.rootStore.apiClient.instance.get(`/feedback/completed`);
      const { rows, rowCount } = data;
      this.completedFeedbacks = generateConfigArrayFromCompletedFeedbacks(
        rows as CompletedFeedbackFromDB[],
      );
      this.completedFeedbacksCount = rowCount;
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
