import { FORM_CONFIG, ratingMaxValues } from "../constants/feedbackAnalysis.js";

export const getFeedbackStats = (feedbackResponses, questionStats = true) => {
  const result = {
    sections: Object.fromEntries(
      Object.entries(FORM_CONFIG).map(([section, questions]) => {
        return [
          section,
          {
            questions: Object.fromEntries(
              questions.map((q) => {
                const questionBucket = {};
                const isBoolean = ratingMaxValues[q] === 1;
                if (isBoolean) return [q, { 0: 0, 1: 0 }];
                for (let key = 1; key <= ratingMaxValues[q]; key++) {
                  questionBucket[key] = 0;
                }
                return [q, questionBucket];
              }),
            ),
          },
        ];
      }),
    ),
    overall: {
      score: null,
      count: 0,
    },
  };

  const sectionBuckets = Object.fromEntries(
    Object.keys(FORM_CONFIG).map((key) => [key, []]),
  );
  const questionBuckets = Object.fromEntries(
    Object.keys(ratingMaxValues).map((key) => [key, []]),
  );

  let count = 0;
  for (const resp of feedbackResponses) {
    if (!resp) continue;

    count++;
    const v = normalizeValues(resp);
    Object.keys(result.sections).forEach((section) => {
      sectionBuckets[section].push(
        average(FORM_CONFIG[section].map((q) => v[q])),
      );
      FORM_CONFIG[section].forEach(
        (course) =>
          (result.sections[section]["questions"][course][resp[course]] += 1),
      );
    });
    if (!questionStats) continue;
    Object.keys(questionBuckets).forEach((key) => {
      questionBuckets[key].push(resp[key]);
    });
  }

  const sectionStats = {};
  for (const key in sectionBuckets) {
    result.sections[key] = {
      ...computeStats(sectionBuckets[key]),
      questions: questionStats
        ? Object.fromEntries(
            Object.entries(result.sections[key].questions).map(
              ([question, distribution]) => [
                question,
                {
                  stats: computeStats(questionBuckets[question]),
                  distribution,
                },
              ],
            ),
          )
        : undefined,
    };
  }

  if (!result.sections.course_design) {
    return { sectionStats: null, overall: null };
  }

  const overall =
    (0.25 *
      result.sections.course_design.bayesian *
      result.sections.course_design.count +
      0.25 *
        result.sections.materials.bayesian *
        result.sections.materials.count +
      0.25 *
        result.sections.engagement.bayesian *
        result.sections.engagement.count +
      0.15 * result.sections.support.bayesian * result.sections.support.count +
      0.1 *
        result.sections.outcomes.bayesian *
        result.sections.outcomes.count) /
    count; //total

  result.overall = { score: overall, count };
  return result;
};

const normalizeValues = (feedback) => {
  const r = {};
  Object.entries(feedback).forEach(([key, value]) => {
    if (typeof value !== "number") return;
    const maxValue = ratingMaxValues[key];
    if (maxValue == null) return;
    const minValue = maxValue === 1 ? 0 : 1;
    r[key] = (value - minValue) / (maxValue - minValue);
  });
  return r;
};

const average = (arr) => {
  const valid = arr.filter((v) => typeof v === "number");
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
};

const computeStats = (values, { priorMean = 0.5, priorWeight = 8 } = {}) => {
  const n = values.length;
  if (n === 0) return null;

  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;

  const stdDev = Math.sqrt(variance);

  const bayesian = (sum + priorMean * priorWeight) / (n + priorWeight);

  return {
    mean,
    bayesian,
    variance,
    stdDev,
    count: n,
  };
};
