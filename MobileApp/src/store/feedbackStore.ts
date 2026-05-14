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
import { wrapStoreMethods } from "../util/errorHandler";

class FeedbackStore {
  rootStore: RootStore;

  currentFeedbackCourse: PendingFeedback | null = null;
  courseFeedbackInSearchModal: Course | null = null;

  pendingFeedbacks: PendingFeedback[] = [];
  completedFeedbacks: CompletedFeedbackListConfigItem[] = [];
  completedFeedbacksCount: number = 0;
  allCourses: Course[] = [];

  notificationIds: Record<string, string> = {};

  pendingCalendar: MarkedDates = {};

  isPageLoading: boolean = false;
  isModalLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    wrapStoreMethods(this, rootStore, { showReport: true });
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
    this.setIsPageLoading(false);
  };

  loadPendingCoursesForHome = async (): Promise<void> => {
    await this.loadPendingCourses()
      .then(async () => {
        this.setIsPageLoading(true);
        const { inAppNotifications: notifsEnabled } =
          this.rootStore.settingsStore;
        const {
          manageFeedbackNotifications,
          manageWeeklyNotifications,
          updateNotificationsBadge,
        } = this.rootStore.notificationsStore;

        this.pendingCalendar = {} as MarkedDates;
        const today = processToDate(new Date());
        this.pendingCalendar[today] = { selected: true };

        const colorIndicesToExclude: Set<number> = new Set();

        this.pendingFeedbacks.forEach(async (feedback) => {
          const { id, courseCode, courseName, startDate, deadline } = feedback;

          const startDateTimestamp = new Date(startDate);
          const deadlineTimestamp = new Date(deadline);

          let randomIndex = Math.round(Math.random() * 7);
          while (colorIndicesToExclude.has(randomIndex)) {
            randomIndex = Math.round(Math.random() * 7);
          }
          colorIndicesToExclude.add(randomIndex);
          //create calendar config
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

          //Manage notifications
          if (!notifsEnabled) return;

          await manageFeedbackNotifications(id, {
            courseCode: courseCode,
            courseName: courseName,
            startDate: new Date(startDate),
            deadlineDate: new Date(deadline),
          });
        });
        if (!notifsEnabled) return;
        if (this.pendingCount) await manageWeeklyNotifications();
        await updateNotificationsBadge();
      })
      .then(() => this.setIsPageLoading(false));
  };

  loadCompletedFeedbacks = async (): Promise<void> => {
    this.setIsPageLoading(true);

    const { data } =
      await this.rootStore.apiClient.instance.get(`/feedback/completed`);
    const { rows, rowCount } = data;
    this.completedFeedbacks = generateConfigArrayFromCompletedFeedbacks(
      rows as CompletedFeedbackFromDB[],
    );
    this.completedFeedbacksCount = rowCount;
    this.setIsPageLoading(false);
  };

  loadAllCourses = async (): Promise<void> => {
    this.setIsPageLoading(true);
    const { data } = await this.rootStore.apiClient.instance.get(`/courses`);
    runInAction(() => {
      this.allCourses = [...data];
    });
    this.setIsPageLoading(false);
  };

  fetchCourseStats = async (courseCode: string, limit?: number | "All") => {
    this.setIsModalLoading(true);
    try {
      const index = this.allCourses.findIndex(
        (x) => x.courseCode === courseCode,
      );

      if (index === -1) return null;

      const { id } = this.allCourses[index];
      const endpoint =
        limit && limit !== "All"
          ? `/feedback/${id}/stats?limit=${limit}`
          : `/feedback/${id}/stats`;

      const { data } = await this.rootStore.apiClient.instance.get(endpoint);
      const { feedbacks_completed, ratingStats, open_feedbacks } = data;

      this.allCourses[index] = {
        ...this.allCourses[index],
        feedbacks_completed,
        open_feedbacks,
        ratingStats,
      };

      return this.allCourses[index];
    } finally {
      this.setIsModalLoading(false);
    }
  };

  submitFeedback = async (feedbackData: FeedbackRatings): Promise<void> => {
    this.setIsPageLoading(true);
    if (this.currentFeedbackCourse === null)
      throw new Error("No FeedbackCourse data");

    const { id } = this.currentFeedbackCourse;
    const feedbackJson = JSON.stringify(feedbackData);

    await this.rootStore.apiClient.instance.post(`/feedback/submit`, {
      ratings: feedbackJson,
      feedbackId: this.currentFeedbackCourse.id,
    });

    await this.loadPendingCoursesForHome();
    await this.loadCompletedFeedbacks();
    await this.rootStore.profileStore.checkBadges(true);

    if (this.rootStore.settingsStore.inAppNotifications) {
      const {
        cancelWeeklyNotification,
        cancelFeedbackNotifications,
        updateNotificationsBadge,
      } = this.rootStore.notificationsStore;
      if (!this.pendingCount) await cancelWeeklyNotification();
      await cancelFeedbackNotifications(id);
      await updateNotificationsBadge();
    }
    this.setIsPageLoading(false);
  };
}

export default FeedbackStore;
