export interface Course {
  id: string; //course id
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  credits?: number;
  department: string;
  ratingStats?: any;
  feedbacks_completed?: number;
  open_feedbacks?: {
    advice_future_gen: string[];
    strengths: string[];
    improvements: string[];
  };
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
