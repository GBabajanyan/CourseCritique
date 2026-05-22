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
    if (!resp || !Object.keys(resp).length) continue;

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
                  stats: computeStats(questionBuckets[question], {
                    maxValue: ratingMaxValues[question],
                  }),
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
    0.25 * result.sections.course_design.bayesian +
    0.25 * result.sections.materials.bayesian +
    0.25 * result.sections.engagement.bayesian +
    0.15 * result.sections.support.bayesian +
    0.1 * result.sections.outcomes.bayesian;

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

const computeStats = (values, { priorWeight = 8, maxValue = 1 } = {}) => {
  const n = values.length;

  const minValue = maxValue === 1 ? 0 : 1;

  // prior centered in normalized middle
  const priorMean = minValue + 0.5 * (maxValue - minValue);

  const sum = values.reduce((a, b) => a + b, 0);
  const bayesian = (sum + priorMean * priorWeight) / (n + priorWeight);

  const normalizedBayesian = (bayesian - minValue) / (maxValue - minValue);

  const CCScore = 1 + normalizedBayesian * 9;

  if (n === 0) {
    return {
      mean: 0,
      variance: 0,
      bayesian,
      CCScore,
      count: n,
    };
  }

  const mean = sum / n;

  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;

  return {
    mean,
    bayesian,
    CCScore,
    variance,
    count: n,
  };
};
