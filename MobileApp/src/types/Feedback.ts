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