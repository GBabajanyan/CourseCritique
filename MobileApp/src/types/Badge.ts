export type badgIdType =
  | "first_feedback"
  | "feedback_rookie"
  | "feedback_enthusiast"
  | "feedback_veteran"
  | "feedback_master"
  | "feedback_legend"
  | "semester_streak"
  | "year_streak"
  | "early_bird"
  | "last_minute_hero"
  | "consistent_contributor"
  | "loyal_alumnus"
  | "detail_oriented"
  | "thoughtful_critic"
  | "strengths_spotter"
  | "balanced_reviewer"
  | "honest_voice"
  | "cheerleader"
  | "comprehensive_reviewer"
  | "star_rater"
  | "quality_contributor"
  | "elite_reviewer"
  | "most_helpful"
  | "instructors_choice"
  | "infinity_gauntlet"
  | "well_rounded"
  | "business_lunch"
  | "upperclassman"
  | "foundation_builder"
  | "lab_rat"
  | "math_whiz"
  | "humanities_scholar"
  | "professors_pet"
  | "phased_out"
  | "complete_package"
  | "pioneer"
  | "midnight_owl"
  | "procrastinator"
  | "grammar_police"
  | "quote_me_on_this"
  | "time_traveler"
  | "completionist";

export type badgeSection = "milestones" | "quality" | "diversity" | "bonus";

export type Badge = {
  id: badgIdType;
  name: string;
  description: string;
  icon: string;
  section: badgeSection;
  rarity?: "common" | "rare" | "epic" | "legendary";
  max_progress: number;
  section_order: number;
  earned?: boolean;
  progress?: number;
};

export type grouppedBadges = Record<badgeSection, Badge[]>;

export interface badgeContext {
  // Milestones
  total: number;

  // Streaks
  semesterStreak: number;
  yearStreak: number;

  // Quality metrics
  detailed_feedbacks: number;
  strengthsCount: number;
  balancedCount: number;
  lowRatingCount: number;
  highRatingCount: number;
  comprehensiveCount: number;
  usedFullScale: boolean;

  // Instructor-related
  maxInstructorFeedback: number;
  // mostHelpfulCount: number;
  // instructorsChoiceCount: number;
  // topTenPercent: boolean;
  // topOnePercent: boolean;

  // Time-based
  early_bird: boolean;
  midnightOwl: boolean;
  deadlineSubmissions: number;

  // Diversity
  departments: Set<string>;
  upperLevelCount: number;
  lowerLevelCount: number;
  engineeringCount: number;
  mathCount: number;
  humanitiesCount: number;
  businessCount: number;

  // Phase completion
  phasesCompleted: number;
  coursesWithAllPhases: number;

  // Special
  isPioneer: boolean;
  // timeTraveler: boolean;
  // perfectGrammarCount: number;
  // quotedCount: number;
  allBadgesEarned: boolean;
}

export type badgeInfo = {
  earned: boolean;
  progress?: number;
};
