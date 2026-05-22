import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { CompletedFeedbackFromDB } from "../types/Feedback";
import { User } from "../types/User";
import {
  calculateSemesterStreak,
  calculateYearStreak,
  updateBadgeProgress,
} from "../util/badgeUtils";
import { wrapStoreMethods } from "../util/errorHandler";
import { badgeContext, Badge } from "../types/Badge";
import { isLowerLevel, isUpperLevel } from "../util/course";
class ProfileStore {
  rootStore: RootStore;

  userProfile: User | null = null;
  userBadges: Badge[] = [];

  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    wrapStoreMethods(this, rootStore, { showReport: true });
    makeAutoObservable(this, {}, { autoBind: true });
  }

  upadateProfileData = async (): Promise<void> => {
    this.isLoading = true;
    const { user: userData } = (
      await this.rootStore.apiClient.instance.get("/profile/me")
    ).data;

    if (userData) {
      this.userProfile = { ...this.userProfile, ...userData };
    }
    this.isLoading = false;
  };

  fetchBadges = async () => {
    const { data: rows } =
      await this.rootStore.apiClient.instance.get("/profile/badges");
    this.userBadges = rows;
  };

  buildBadgeContext = (
    completedFeedbacks: CompletedFeedbackFromDB[],
  ): badgeContext => {
    const totalCompleted = completedFeedbacks.length;

    const departments = new Set(completedFeedbacks.map((f) => f.department));

    const phasesPerCourse = new Map<string, Set<string>>();
    completedFeedbacks.forEach((f) => {
      if (!phasesPerCourse.has(f.courseCode)) {
        phasesPerCourse.set(f.courseCode, new Set());
      }
      phasesPerCourse.get(f.courseCode)!.add(f.feedbackPhase);
    });

    const phasesCompleted = Array.from(phasesPerCourse.values()).filter(
      (phases) => phases.size === 3,
    ).length;
    const coursesWithAllPhases = phasesCompleted;

    const instructorCounts = completedFeedbacks.reduce(
      (acc, f) => {
        acc[f.instructor] = (acc[f.instructor] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const maxInstructorFeedback = Math.max(
      0,
      ...Object.values(instructorCounts),
    );

    // Quality
    const early_bird = completedFeedbacks.length && completedFeedbacks.every(
      (f) => f.submittedDate === f.startDate,
    );

    const detailed_feedbacks = completedFeedbacks.filter(
      (f) => (f.feedbackData?.advice_future_gen?.length || 0) > 574,
    ).length;

    const strengthsCount = completedFeedbacks.filter(
      (f) => (f.feedbackData?.strengths?.length || 0) > 50,
    ).length;

    const balancedCount = completedFeedbacks.filter(
      (f) =>
        (f.feedbackData?.strengths?.length || 0) > 50 &&
        (f.feedbackData?.improvements?.length || 0) > 50,
    ).length;

    const lowRatingCount = completedFeedbacks.filter((f) => {
      const {
        advice_future_gen,
        strengths,
        improvements,
        ...enumerableRatings
      } = f.feedbackData || {};
      const ratings = Object.values(enumerableRatings || {}).filter(
        (v) => !!v && v !== "error",
      );
      return Math.max(...ratings) === 2;
    }).length;

    const highRatingCount = completedFeedbacks.filter((f) => {
      const {
        advice_future_gen,
        strengths,
        improvements,
        ...enumerableRatings
      } = f.feedbackData || {};
      const ratings = Object.values(enumerableRatings || {}).filter(
        (v) => !!v && v !== "error",
      );
      return Math.min(...ratings) === 5;
    }).length;

    const comprehensiveCount = completedFeedbacks.filter(
      (f) =>
        f.feedbackData?.advice_future_gen &&
        f.feedbackData?.strengths &&
        f.feedbackData?.improvements,
    ).length;

    const usedFullScale = completedFeedbacks.some((f) => {
      const {
        advice_future_gen,
        strengths,
        improvements,
        ...enumerableRatings
      } = f.feedbackData || {};
      const ratings = Object.values(enumerableRatings || {}).filter(
        (v) => !!v && v !== "error",
      );
      return Math.max(...ratings) === 5 && Math.min(...ratings) === 1;
    });

    // Time-based
    const midnightOwl = completedFeedbacks.some((f) => {
      const hour = new Date(f.submittedDate).getHours();
      return hour >= 0 && hour < 6;
    });

    const deadlineSubmissions = completedFeedbacks.filter(
      (f) => f.submittedDate === f.deadline,
    ).length;

    // Course level tracking
    const upperLevelCount = completedFeedbacks.filter((f) =>
      isUpperLevel(f.courseCode),
    ).length;

    const lowerLevelCount = completedFeedbacks.filter((f) =>
      isLowerLevel(f.courseCode),
    ).length;

    const engineeringCount = completedFeedbacks.filter((f) =>
      f.department?.toLowerCase().includes("cse"),
    ).length;

    const mathCount = completedFeedbacks.filter((f) =>
      f.department?.toLowerCase().includes("cs"),
    ).length;

    const humanitiesCount = completedFeedbacks.filter(
      (f) =>
        f.department?.toLowerCase().includes("chss") ||
        f.department?.toLowerCase().includes("ec"),
    ).length;

    const businessCount = completedFeedbacks.filter(
      (f) =>
        f.department?.toLowerCase().includes("bus") ||
        f.department?.toLowerCase().includes("econ"),
    ).length;

    // Semester streak calculation (requires grouping by semester-year)
    const semesterStreak = calculateSemesterStreak(completedFeedbacks);
    const yearStreak = calculateYearStreak(completedFeedbacks);

    const isPioneer = this.userProfile?.is_pioneer || false;

    return {
      total: totalCompleted,
      departments,
      maxInstructorFeedback,
      early_bird,
      detailed_feedbacks,
      midnightOwl,
      deadlineSubmissions,
      phasesCompleted,
      coursesWithAllPhases,
      strengthsCount,
      balancedCount,
      lowRatingCount,
      highRatingCount,
      comprehensiveCount,
      usedFullScale,
      upperLevelCount,
      lowerLevelCount,
      engineeringCount,
      mathCount,
      humanitiesCount,
      businessCount,
      semesterStreak,
      yearStreak,
      // Placeholders for instructor-curated badges
      // topTenPercent: false,
      // topOnePercent: false,
      // mostHelpfulCount: 0,
      // instructorsChoiceCount: 0,
      // perfectGrammarCount: 0,
      // quotedCount: 0,
      isPioneer,
      // timeTraveler: false,
      allBadgesEarned: false,
    };
  };

  checkBadges = async (notifications: boolean = false) => {
    await this.upadateProfileData();
    const { data } =
      await this.rootStore.apiClient.instance.get(`/feedback/completed`);
    const { rows: completedFeedbacks } = data as {
      rows: CompletedFeedbackFromDB[];
    };

    const ctx = this.buildBadgeContext(completedFeedbacks);

    let newBadges: Badge[];
    if (notifications && this.rootStore.settingsStore.inAppNotifications) {
      newBadges = this.userBadges.map((b) => {
        let badgeUpd = updateBadgeProgress(b, ctx);
        if (!b.earned && badgeUpd.earned) {
          this.rootStore.notificationsStore.scheduleNotification(
            "achievement",
            {
              badgeName: badgeUpd.name,
            },
          );
        }
        return badgeUpd;
      });
    } else {
      newBadges = this.userBadges.map((b) => updateBadgeProgress(b, ctx));
    }
    this.userBadges = newBadges.sort(
      (a, b) => a.section_order - b.section_order,
    );
  };

  getBadgeById = (id: string) => {
    return this.userBadges.find((badge) => badge.id === id);
  };

  getEarnedBadges = () => this.userBadges.filter((b) => b.earned);

  getLockedBadges = () => this.userBadges.filter((b) => !b.earned);

  getBadgesLength = () => this.userBadges.length;

  setUser = (user: User) => {
    this.userProfile = user;
  };

  // Clear user data (on logout)
  clearUser = () => {
    this.userProfile = null;
  };
}

export default ProfileStore;
