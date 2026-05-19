export type Distribution = Record<number, number>;

export type LikertBarProps = {
  distribution: Distribution;
  mean: number;
  variance: number;
  colors: string[];
};

export type DataSpreadIndicatorProps = {
  mean: number;
  variance: number;
  scaleLength: number;
};
export type HistogramProps = {
  distribution: Distribution;
  colors: string[];
};

type QuestionStats = {
  mean: number;
  count: number;
  variance: number;
  distribution: Distribution;
};

export type FeedbackDistributionCardProps = {
  stats: QuestionStats;
  style?: React.CSSProperties;
};
