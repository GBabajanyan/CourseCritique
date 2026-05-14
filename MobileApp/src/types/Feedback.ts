import { StyleProp, ViewStyle } from "react-native";
import { Course } from "./Course";

export type FeedbackPhase = "addDrop" | "midterm" | "finals";
export type Rating5 = 1 | 2 | 3 | 4 | 5 | undefined;
export type Rating3 = 1 | 2 | 3 | undefined;
export type Thumb = 0 | 1 | undefined; // 0 = down, 1 = up

export interface FeedbackData {
  avgRating: number;
  comments?: string;
  improvements: string;
  wouldRecommend: Thumb;
}

export type FeedbackRatings = {
  course_pace: Rating3;
  course_load: Rating3;
  class_organization: Rating3;

  course_materials: Rating3;
  assignment_instructions: Rating5;
  grading_rubrics: Rating3;

  class_management: Rating5;
  student_participation: Rating3;
  in_class_queries: Rating5;
  concern_learning: Rating5;

  availability: Rating3;
  feedback_on_assignments: Rating3;
  inspires_motivation: Rating3;

  substantial_learning: Thumb;
  take_another_course: Thumb;

  open_feedback?: string;
  strengths?: string;
  improvements?: string;
};

export interface PendingFeedback extends Course {
  deadline: string;
  startDate: string;
  feedbackPhase: FeedbackPhase;
  //id turns into feedback id
}
export interface CompletedFeedback extends Course {
  feedbackPhase: FeedbackPhase;
  submittedDate?: string;
  startDate?: string;
  deadline?: string;
  feedbackData?: FeedbackData;
  //id turns into feedback id
}
export interface CompletedFeedbackFromDB extends Course {
  feedbackPhase: FeedbackPhase;
  submittedDate: string;
  startDate: string;
  deadline: string;
  feedbackData: FeedbackRatings;
  //id turns into feedback id
}

export type CompletedFeedbackListConfigItem = Record<
  number,
  Record<string, CompletedFeedback[]>
>;

type CompletedCourseFeedbackCardType = {
  item: CompletedFeedback;
  type: "completed";
};
type StatInfoCourseFeedbackCardType = {
  item: Course;
  type: "statsInfo";
};

type CourseFeedbackCardBaseType = {
  isExpanded?: boolean;
  onToggle?: () => void;
  style?: StyleProp<ViewStyle>;
};

export type CourseFeedbackCardType =
  | (CompletedCourseFeedbackCardType & CourseFeedbackCardBaseType)
  | (StatInfoCourseFeedbackCardType & CourseFeedbackCardBaseType);

export type openFeedbackType =
  | "advice_future_gen"
  | "strengths"
  | "improvements";

export type OpenFeedbackTabProps = {
  open_feedbacks?: Record<
    openFeedbackType,
    { submittedDate: string; feedback: string }[]
  >;
};
