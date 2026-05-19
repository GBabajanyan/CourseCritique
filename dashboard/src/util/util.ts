import { FEEDBACK_VALUES_BY_TYPE } from "../constants/feedbackConfig";
import { Distribution } from "../types/charts";

export const getAverageAnswer = (mean: number, scaleLength: number): string => {
  const labels = FEEDBACK_VALUES_BY_TYPE[scaleLength];
  const scores = Object.keys(labels)
    .map(Number)
    .sort((a, b) => a - b);

  const minScore = scores[0];
  const maxScore = scores[scores.length - 1];

  // Normalize mean to 0-1 range
  const normalized = mean / maxScore;
  // const normalized = (mean - minScore) / (maxScore - minScore);

  // Handle edge case at exactly 1.0
  if (normalized >= 1.0) {
    return labels[maxScore];
  }

  // Calculate bucket size and index
  const bucketSize = 1 / scaleLength;
  const bucketIndex = Math.floor(normalized / bucketSize);

  // Map to actual score value
  const scoreValue = minScore + bucketIndex;

  return labels[scoreValue];
};

export const describeVariance = ({
  mean,
  variance,
  scaleLength,
}: {
  mean: number;
  variance: number;
  scaleLength: number;
}): string => {
  const maxVariance = Math.pow(scaleLength - 1, 2) / 4; // maximum possible variance

  const normalizedVariance = variance / maxVariance;

  // Mean interpretation
  const consensus = getAverageAnswer(mean, scaleLength);
  if (normalizedVariance < 0.33) {
    return `High Agreement - ${consensus} `;
  } else if (normalizedVariance < 0.67) {
    return "Mixed Opinions";
  } else {
    return "Polarized";
  }
};

export const describeDistribution = (distribution: Distribution): string => {
  const scaleLength = Object.keys(distribution).length;

  let low = 0;
  let mid = 0;
  let high = 0;

  if (scaleLength === 2) {
    low = distribution[1] ?? 0;
    high = distribution[2] ?? 0;
  } else if (scaleLength === 3) {
    low = distribution[1] ?? 0;
    mid = distribution[2] ?? 0;
    high = distribution[3] ?? 0;
  } else if (scaleLength === 5) {
    low = (distribution[1] ?? 0) + (distribution[2] ?? 0);
    mid = distribution[3] ?? 0;
    high = (distribution[4] ?? 0) + (distribution[5] ?? 0);
  } else return "Unsupported scale length.";

  const total = low + mid + high;
  if (total === 0) return "No ratings available.";

  const lowRatio = low / total;
  const midRatio = mid / total;
  const highRatio = high / total;

  if (highRatio > 0.7)
    return "Ratings heavily concentrate toward higher values.";

  if (lowRatio > 0.7) return "Ratings heavily concentrate toward lower values.";

  if (lowRatio > 0.3 && highRatio > 0.3 && midRatio < 0.2)
    return "Responses appear polarized.";

  return "Ratings are relatively balanced.";
};
