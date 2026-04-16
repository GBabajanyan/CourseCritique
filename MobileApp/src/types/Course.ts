
export interface Course {
  id: string; //course id
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  credits?: number;
  department?: string;
  stats?: any;
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

