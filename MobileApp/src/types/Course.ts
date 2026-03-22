import { FeedbackPhase } from "./Feedback";

export type Course = {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  deadline: string;
  feedbackPhase: FeedbackPhase;
};
