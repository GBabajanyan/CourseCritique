export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  degree: string;
  year: string;
  phone: string;
  studentId: string;
  joinDate: string;
  feedbacksGiven?: number;
  feedbacksToFill?: number;
}

export type SemesterType = "Fall" | "Spring" | "Summer";

export type BiometricLoginType = "Face ID" | "Touch ID" | "none";

export type UserBadgeType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
};
