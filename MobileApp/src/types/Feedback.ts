import { StyleProp, ViewStyle } from "react-native";
import { Course } from "./Course";

export type FeedbackPhase = "addDrop" | "midterm" | "finals";
export type Rating5 = 1 | 2 | 3 | 4 | 5 | undefined;
export type Rating3 = 1 | 2 | 3 | undefined;
export type Thumb = 0 | 1 | undefined; // 0 = down, 1 = up
export type RatingType = "5" | "3" | "thumb" | "text";
export interface FeedbackData {
  advice_future_gen?: string;
  strengths?: string;
  improvements?: string;
  take_another_course: Thumb;
}

export type FeedbackRatings = {
  course_pace: Rating3 | "error";
  course_load: Rating3 | "error";
  class_organization: Rating3 | "error";

  course_materials: Rating3 | "error";
  assignment_instructions: Rating5 | "error";
  grading_rubrics: Rating3 | "error";

  class_management: Rating5 | "error";
  student_participation: Rating3 | "error";
  in_class_queries: Rating5 | "error";
  concern_learning: Rating5 | "error";

  availability: Rating3 | "error";
  feedback_on_assignments: Rating3 | "error";
  inspires_motivation: Rating3 | "error";

  substantial_learning: Thumb | "error";
  take_another_course: Thumb | "error";

  advice_future_gen?: string | "error";
  strengths?: string | "error";
  improvements?: string | "error";
};

export type form_config_question = {
  key: keyof FeedbackRatings;
  label: string;
  type: RatingType;
  short?: string;
  required?: boolean;
};
export type form_config_step = {
  key: string;
  title: string;
  questions: form_config_question[];
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
  feedbackData: FeedbackData;
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
