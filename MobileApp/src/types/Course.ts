import { FeedbackPhase } from "./Feedback";

export type Course = {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  deadline: string;
  feedbackPhase: FeedbackPhase;
  department?: string;
  credits?: number;
  avg_rating?: number;
};

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
