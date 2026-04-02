type CourseFeedbackType = {
  submitted: boolean;
  totalScore: number | null;
  rating: number;
  comments: string;
  improvements: string;
  wouldRecommend: boolean;
};

type FeedbackPhase = "week1" | "week3" | "midterm" | "week12" | "finals";
export { CourseFeedbackType, FeedbackPhase };

export interface Feedback {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  submittedDate: string;
  feedbackPhase: string;
  rating: number;
  understanding: number;
  engagement: number;
  organization: number;
  comments: string;
  strengths: string;
  improvements: string;
  wouldRecommend: boolean;
}


export type Rating5 = 1 | 2 | 3 | 4 | 5;
export type Rating3 = 1 | 2 | 3;
export type Thumb = 0 | 1; // 0 = down, 1 = up

export interface FeedbackRatingsObject {
  course_pace: Rating5;
  course_load: Rating5;
  class_organization: Rating5;

  course_materials: Rating5;
  assignment_instructions: Rating5;
  grading_rubrics: Rating5;

  class_management: Rating5;
  student_participation: Rating5;
  in_class_queries: Rating5;
  concern_learning: Rating5;

  availability: Rating3;
  feedback_on_assignments: Rating3;
  inspires_motivation: Rating3;

  substantial_learning: Thumb;
  take_another_course: Thumb;

  open_feedback: string;
}