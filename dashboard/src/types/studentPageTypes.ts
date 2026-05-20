// types/studentTypes.ts
export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  year: string;
  degree: string;
  join_date: string;
  total_feedbacks: number;
}

export interface EnrolledCourse {
  id: string;
  course_code: string;
  course_name: string;
  section: string;
  semester: string;
  year: number;
  feedback_status: "pending" | "completed";
  feedback_phase: string;
}
