import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HistogramProps } from "../types/charts";
import { FEEDBACK_VALUES_BY_TYPE } from "../constants/feedbackConfig";

const HIST_COLORS = ["#ff4d4f", "#ffa940", "#a493f0", "#73d13d", "#389e0d"];

const Histogram: React.FC<HistogramProps> = ({ distribution }) => {
  const distrEntries = Object.entries(distribution);
  const scaleLength = distrEntries.length;
  const feedbackValues = FEEDBACK_VALUES_BY_TYPE[distrEntries.length];
  const colors =
    scaleLength === 5
      ? HIST_COLORS
      : scaleLength === 3
        ? [HIST_COLORS[1], HIST_COLORS[2], HIST_COLORS[3]]
        : [HIST_COLORS[0], HIST_COLORS[4]];
  const histogramData = distrEntries.map(([label, count], i) => ({
    value: feedbackValues[label],
    count,
    fill: colors[i],
  }));

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
      
    >
      <BarChart
        data={histogramData}
        margin={{
          top: 0,
          right: 0,
          left: -40,
          bottom: 0,
        }}
      >
        <XAxis dataKey="value" fontSize={12}  />
        <YAxis allowDecimals={false} />
        <Tooltip labelStyle={{ justifyContent: "center" }} />

        <Bar dataKey="count">
          {histogramData.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Histogram;
