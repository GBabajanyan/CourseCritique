import { localeDateOptions, phaseNames } from "../constants";
import { departmentColors, phaseColors } from "../constants/colors";
import { FeedbackPhase } from "../types/Feedback";

export const processToDate = (fullDate: any) =>
  new Date(fullDate).toLocaleDateString("en-CA", localeDateOptions);

export const semesterByMonthNumber = (n: number) => {
  if (n <= 5) return "Spring";
  if (n <= 9) return "Summer";
  return "Fall";
};

export const isTheDateBetween = (
  selectedDate: string,
  startDate: string,
  deadline: string,
): boolean => {
  const selectedDateTimestamp = new Date(selectedDate);
  return (
    selectedDateTimestamp >= new Date(startDate) &&
    selectedDateTimestamp <= new Date(deadline)
  );
};

export const getPhaseDisplayName = (phase: FeedbackPhase): string =>
  phaseNames[phase];

export const getPhaseColor = (phase: FeedbackPhase): string => {
  return phaseColors[phase];
};

export const getDepartmentColor = (department = "default"): string => {
  return departmentColors[department];
};

