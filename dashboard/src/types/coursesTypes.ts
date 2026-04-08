export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  instructor: string;
  credits: number;
  department: string;
  total_students?: number;
  feedback_completed?: number;
  pending_feedbacks?: number;
  avg_rating?: number;
  description?: string;
}

export interface ColumnConfig {
  key: string;
  title: string;
  className?: string;
  render: (
    value: any,
    record?: Course,
    onView?: (id: string) => void,
  ) => React.ReactNode;
}

export interface Student {
  studentId: string;
  name: string;
  email: string;
  year: string;
  enrolled_at: string;
}

export interface FeedbackPhase {
  phase: string;
  deadline: any;
  startDate: any;
}
