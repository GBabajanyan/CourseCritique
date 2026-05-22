export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalFeedbacks: number;
  avgRating: number;
  completionRate: number;
  activeUsers: number;
}

export interface CourseStats {
  id: string;
  course_code: string;
  course_name: string;
  instructor: string;
  department: string;
  total_students: number;
  feedback_count: number;
  pending_count: number;
  completion_rate: number;
}

export interface StudentProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  year: string;
  department: string;
  studentId: string;
  feedbacks_given: number;
  badges_earned: number;
  join_date: string;
}

export interface AnonymousFeedback {
  id: string;
  course_code: string;
  course_name: string;
  feedback_phase: string;
  rating: number;
  comments: string;
  submitted_at: string;
}
