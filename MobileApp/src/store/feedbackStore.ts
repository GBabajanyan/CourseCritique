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
  PendingFeedback,
} from "../types/Feedback";
import { generateConfigArrayFromCompletedFeedbacks } from "../util/course";
import { processToDate } from "../util/general";

class FeedbackStore {
  rootStore: RootStore;
  api: AxiosInstance;

  currentFeedbackCourse: PendingFeedback | null = null;
  courseFeedbackInSearchModal: Course | null = null;

  pendingFeedbacks: PendingFeedback[] = [];
  completedFeedbacks: CompletedFeedbackListConfigItem[] = [];
  completedFeedbacksCount: number = 0;
  allCourses: Course[] = [];

  pendingCalendar: MarkedDates = {};

  isPageLoading: boolean = false;
  isModalLoading: boolean = false;

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

  setCurrentFeedbackCourse = (course: PendingFeedback | null) => {
    this.currentFeedbackCourse = course;
  };

  setCourseFeedbackInSearchModal = (value: Course | null) => {
    this.courseFeedbackInSearchModal = value;
  };

  @action
  setIsPageLoading = (val: boolean) => {
    this.isPageLoading = val;
  };

  @action
  setIsModalLoading = (val: boolean) => {
    this.isModalLoading = val;
  };

  loadLoggingData = async () => {
    await Promise.all([
      this.loadPendingCoursesForHome(),
      this.loadCompletedFeedbacks(),
      this.loadAllCourses(),
    ]);
  };

  loadPendingCourses = async (): Promise<void> => {
    this.setIsPageLoading(true);

    try {
      const { data } =
        await this.rootStore.apiClient.instance.get(`/feedback/pending`);

      runInAction(() => {
        this.pendingFeedbacks = [
          ...data.map((item: PendingFeedback) => ({
            ...item,
            startDate: processToDate(item.startDate),
            deadline: processToDate(item.deadline),
          })),
        ];
      });
    } catch (error) {
      console.error("Load pending courses error:", error);
    } finally {
      this.setIsPageLoading(false);
    }
  };

  loadPendingCoursesForHome = async (): Promise<void> => {
    await this.loadPendingCourses()
      .then(async () => {
        this.setIsPageLoading(true);

        this.pendingCalendar = {} as MarkedDates;
        const today = processToDate(new Date());
        this.pendingCalendar[today] = { selected: true };
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
      .finally(() => this.setIsPageLoading(false));
  };

  loadCompletedFeedbacks = async (): Promise<void> => {
    this.setIsPageLoading(true);

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
      this.setIsPageLoading(false);
    }
  };

  loadAllCourses = async (): Promise<void> => {
    this.setIsPageLoading(true);
    try {
      const { data } = await this.rootStore.apiClient.instance.get(`/courses`);
      runInAction(() => {
        this.allCourses = [...data];
      });
    } catch (error) {
      console.error("Load pending courses error:", error);
    } finally {
      this.setIsPageLoading(false);
    }
  };

  fetchCourseStats = async (courseCode: string) => {
    this.setIsModalLoading(true);
    try {
      const index = this.allCourses.findIndex(
        (x) => x.courseCode === courseCode,
      );

      if (index === -1) return null;

      const { id } = this.allCourses[index];
      const { data } = await this.rootStore.apiClient.instance.get(
        `/feedback/${id}/stats`,
      );

      this.allCourses[index] = {
        ...this.allCourses[index],
        stats: data,
      };

      return this.allCourses[index];
    } catch (error) {
      console.error("fetchCourseStats error:", error.response?.data || error);
      return null;
    } finally {
      this.setIsModalLoading(false);
    }
  };

  submitFeedback = async (feedbackData: FeedbackRatings): Promise<void> => {
    this.setIsPageLoading(true);
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
      this.setIsPageLoading(false);
    }
  };
}

export default FeedbackStore;
