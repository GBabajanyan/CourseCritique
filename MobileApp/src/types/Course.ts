import { FeedbackPhase } from "./Feedback";

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  feedbackPhase: FeedbackPhase;
  deadline: string;
  startDate: string;
  department?: string;
  credits?: number;
  avg_rating?: number;
}

export interface SectionHeader {
  type: "header";
  title: string;
  count: number;
  isCollapsed: boolean;
}

export interface CourseItem {
  type: "item";
  course: Course;
}

export type FlashListItem = SectionHeader | CourseItem;

export interface EventType {
  id: number;
  title: string;
  time: string;
  date?: Date;
}
