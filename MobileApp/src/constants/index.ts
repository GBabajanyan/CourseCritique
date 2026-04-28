import { FeedbackPhase } from "../types/Feedback";

export const monthNames: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const dayNames: string[] = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export const phaseNames: Record<FeedbackPhase, string> = {
  addDrop: "Add/Drop Impressions",
  midterm: "Post Midterm",
  finals: "Pre-Final",
};

export const localeDateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const DisplayableNotificationTypes = [
  "deadline",
  "last_chance",
  "early_bird",
  "achievement",
];
