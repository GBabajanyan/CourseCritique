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

export type Rating5 = 1 | 2 | 3 | 4 | 5 | undefined;
export type Rating3 = 1 | 2 | 3 | undefined;
export type Thumb = 0 | 1 | undefined; // 0 = down, 1 = up
