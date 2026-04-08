import { Badge, BADGES } from "../mock/badges";

export type grouppedBadges = {
  milestones: Badge[];
  quality: Badge[];
  diversity: Badge[];
  bonus: Badge[];
};

export const groupBadgesBySection = () => {
  const sections = [...new Set(BADGES.map((badge) => badge.section))];
  const groupByObject: grouppedBadges = {};
  sections.forEach((section) => {
    groupByObject[section] = [];
  });
  BADGES.map((badge) => groupByObject[badge.section].push(badge));
  return groupByObject;
};

// Get badges by section
export const getBadgesBySection = (section: string) => {
  return BADGES.filter((badge) => badge.section === section);
};

// Get badge by ID
export const getBadgeById = (id: string) => {
  return BADGES.find((badge) => badge.id === id);
};

// Get user's earned badges (example)
export const getUserEarnedBadges = (userBadgeIds: string[]) => {
  return BADGES.filter((badge) => userBadgeIds.includes(badge.id));
};

// Calculate progress percentage
export const getBadgeProgress = (
  badge: (typeof BADGES)[0],
  currentCount: number,
) => {
  if (!badge.maxProgress) return null;
  return Math.min(100, (currentCount / badge.maxProgress) * 100);
};
