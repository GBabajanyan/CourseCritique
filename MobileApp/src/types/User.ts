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
  is_pioneer?: boolean;
}

export type SemesterType = "Fall" | "Spring" | "Summer";

export type BiometricLoginType = "Face ID" | "Touch ID" | "none";

export interface Notification {
  id: string;
  displayId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: any;
}

export type NotificationType =
  | "deadline"
  | "last_chance"
  | "early_bird"
  | "weekly_reminder"
  | "achievement"
  | "thank_you";

export interface ScheduleNotificationOptions {
  courseCode?: string;
  courseName?: string;
  deadlineDate?: Date;
  startDate?: Date;
  badgeName?: string;
}
