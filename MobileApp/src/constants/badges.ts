import {
  badgeContext,
  badgeInfo,
  badgeSection,
  badgIdType,
} from "../types/Badge";

export const allBadgesTraversalOrderBySection: badgeSection[] = [
  "milestones",
  "quality",
  "diversity",
  "bonus",
];

export const badgeRules: Record<badgIdType, (ctx: badgeContext) => badgeInfo> = {
  // Milestones
  first_feedback: ({ total }) => ({ earned: total >= 1, progress: total }),
  feedback_rookie: ({ total }) => ({ earned: total >= 5, progress: total }),
  feedback_enthusiast: ({ total }) => ({ earned: total >= 10, progress: total }),
  feedback_veteran: ({ total }) => ({ earned: total >= 25, progress: total }),
  feedback_master: ({ total }) => ({ earned: total >= 50, progress: total }),
  feedback_legend: ({ total }) => ({ earned: total >= 100, progress: total }),
  semester_streak: ({ semesterStreak }) => ({ earned: semesterStreak >= 3, progress: semesterStreak }),
  year_streak: ({ yearStreak }) => ({ earned: yearStreak >= 2, progress: yearStreak }),
  early_bird: ({ early_bird }) => ({ earned: early_bird, progress: early_bird ? 1 : 0 }),
  last_minute_hero: ({ deadlineSubmissions }) => ({ earned: deadlineSubmissions >= 1, progress: deadlineSubmissions }),
  consistent_contributor: ({ semesterStreak }) => ({ earned: semesterStreak >= 3, progress: semesterStreak }),
  loyal_alumnus: ({ semesterStreak }) => ({ earned: semesterStreak >= 6, progress: semesterStreak }),

  // Quality
  detail_oriented: ({ detailed_feedbacks }) => ({ earned: detailed_feedbacks >= 5, progress: detailed_feedbacks }),
  thoughtful_critic: ({ detailed_feedbacks }) => ({ earned: detailed_feedbacks >= 10, progress: detailed_feedbacks }),
  strengths_spotter: ({ strengthsCount }) => ({ earned: strengthsCount >= 8, progress: strengthsCount }),
  balanced_reviewer: ({ balancedCount }) => ({ earned: balancedCount >= 1, progress: balancedCount }),
  honest_voice: ({ lowRatingCount }) => ({ earned: lowRatingCount >= 1, progress: lowRatingCount }),
  cheerleader: ({ highRatingCount }) => ({ earned: highRatingCount >= 5, progress: highRatingCount }),
  comprehensive_reviewer: ({ comprehensiveCount }) => ({ earned: comprehensiveCount >= 10, progress: comprehensiveCount }),
  star_rater: ({ usedFullScale }) => ({ earned: usedFullScale, progress: usedFullScale ? 1 : 0 }),
  // quality_contributor: ({ topTenPercent }) => ({ earned: topTenPercent, progress: topTenPercent ? 1 : 0 }),
  // elite_reviewer: ({ topOnePercent }) => ({ earned: topOnePercent, progress: topOnePercent ? 1 : 0 }),
  // most_helpful: ({ mostHelpfulCount }) => ({ earned: mostHelpfulCount >= 1, progress: mostHelpfulCount }),
  // instructors_choice: ({ instructorsChoiceCount }) => ({ earned: instructorsChoiceCount >= 1, progress: instructorsChoiceCount }),

  // Diversity
  infinity_gauntlet: ({ departments }) => ({ earned: departments.size >= 5, progress: departments.size }),
  well_rounded: ({ departments }) => ({ earned: departments.size >= 8, progress: departments.size }),
  upperclassman: ({ upperLevelCount }) => ({ earned: upperLevelCount >= 10, progress: upperLevelCount }),
  foundation_builder: ({ lowerLevelCount }) => ({ earned: lowerLevelCount >= 10, progress: lowerLevelCount }),
  lab_rat: ({ engineeringCount }) => ({ earned: engineeringCount >= 5, progress: engineeringCount }),
  math_whiz: ({ mathCount }) => ({ earned: mathCount >= 5, progress: mathCount }),
  humanities_scholar: ({ humanitiesCount }) => ({ earned: humanitiesCount >= 5, progress: humanitiesCount }),
  business_lunch: ({ businessCount }) => ({ earned: businessCount >= 5, progress: businessCount }),
  professors_pet: ({ maxInstructorFeedback }) => ({ earned: maxInstructorFeedback >= 3, progress: maxInstructorFeedback }),
  phased_out: ({ phasesCompleted }) => ({ earned: phasesCompleted >= 3, progress: phasesCompleted }),
  complete_package: ({ coursesWithAllPhases }) => ({ earned: coursesWithAllPhases >= 3, progress: coursesWithAllPhases }),
  pioneer: ({ isPioneer }) => ({ earned: isPioneer, progress: isPioneer ? 1 : 0 }),

  // Bonus
  midnight_owl: ({ midnightOwl }) => ({ earned: midnightOwl, progress: midnightOwl ? 1 : 0 }),
  procrastinator: ({ deadlineSubmissions }) => ({ earned: deadlineSubmissions >= 3, progress: deadlineSubmissions }),
  // grammar_police: ({ perfectGrammarCount }) => ({ earned: perfectGrammarCount >= 1, progress: perfectGrammarCount }),
  // quote_me_on_this: ({ quotedCount }) => ({ earned: quotedCount >= 1, progress: quotedCount }),
  // time_traveler: ({ timeTraveler }) => ({ earned: timeTraveler, progress: timeTraveler ? 1 : 0 }),
  completionist: ({ allBadgesEarned }) => ({ earned: allBadgesEarned, progress: allBadgesEarned ? 1 : 0 }),
};