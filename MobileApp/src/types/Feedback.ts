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
