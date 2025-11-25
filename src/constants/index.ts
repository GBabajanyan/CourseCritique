import { FeedbackPhase } from "../mock";

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
  week1: "Week 1 Feedback",
  week3: "Week 3 Feedback",
  midterm: "Midterm Feedback",
  week12: "Week 12 Feedback",
  finals: "Final Feedback",
};

export const phaseColors: Record<FeedbackPhase, string> = {
  week1: "#FF6B35",
  week3: "#FFA500",
  midterm: "#007AFF",
  week12: "#28A745",
  finals: "#DC3545",
};
