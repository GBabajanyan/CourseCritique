import { badgeRules } from "../constants/badges";
import { badgeContext, grouppedBadges, Badge } from "../types/Badge";
import { CompletedFeedbackFromDB } from "../types/Feedback";
import { semesterByMonthNumber } from "./general";

export const getBadgesBySection = (badges: Badge[]) => {
  const groupByObject = badges.reduce((acc, badge) => {
    if (acc[badge.section] === undefined) acc[badge.section] = [];
    acc[badge.section].push(badge);
    return acc;
  }, {} as grouppedBadges);

  return groupByObject;
};

export const updateBadgeProgress = (badge: Badge, ctx: badgeContext) => {
  if (!badgeRules[badge.id]) return badge;
  const { earned, progress } = badgeRules[badge.id](ctx);
  const newBadge = { ...badge, earned, progress };
  return newBadge;
};

const getSemesterOrder = (dateStr: string): number => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth();
  const semester = semesterByMonthNumber(month);

  const semesterMap = { Spring: 1, Summer: 2, Fall: 3 };
  return year * 10 + semesterMap[semester];
};

export const calculateSemesterStreak = (
  feedbacks: CompletedFeedbackFromDB[],
): number => {
  const semesterOrders = [
    ...new Set(feedbacks.map((f) => getSemesterOrder(f.submittedDate))),
  ].sort((a, b) => a - b);

  let semesterStreak = 0;
  let currentStreak = 0;
  let lastOrder = 0;

  for (const order of semesterOrders) {
    if (currentStreak === 0 || order === lastOrder + 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    semesterStreak = Math.max(semesterStreak, currentStreak);
    lastOrder = order;
  }

  return semesterStreak;
};

export const calculateYearStreak = (
  feedbacks: CompletedFeedbackFromDB[],
): number => {
  const years = [
    ...new Set(feedbacks.map((f) => new Date(f.submittedDate).getFullYear())),
  ].sort((a, b) => a - b);

  let maxStreak = 0;
  let currentStreak = 0;
  let lastYear = 0;

  for (const year of years) {
    if (currentStreak === 0 || year === lastYear + 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    maxStreak = Math.max(maxStreak, currentStreak);
    lastYear = year;
  }

  return maxStreak;
};
