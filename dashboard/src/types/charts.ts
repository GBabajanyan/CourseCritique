export type Distribution = Record<number, number>;

export type LikertBarProps = {
  distribution: Distribution;
  mean: number;
  total: number;
};
export type HistogramProps = {
  distribution: Distribution;
};

type QuestionStats = {
  mean: number;
  count: number;
  distribution: Distribution;
};

export type FeedbackDistributionCardProps = {
  stats: QuestionStats;
  style?: React.CSSProperties;
};
