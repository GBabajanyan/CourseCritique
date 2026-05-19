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
import { FEEDBACK_VALUES_BY_TYPE } from "../constants/feedbackConfig";
import { HistogramProps } from "../types/charts";

const Histogram: React.FC<HistogramProps> = ({ distribution, colors }) => {
  const distrEntries = Object.entries(distribution);
  const feedbackValues = FEEDBACK_VALUES_BY_TYPE[distrEntries.length];
  const histogramData = distrEntries.map(([label, count], i) => ({
    value: feedbackValues[label],
    count,
    fill: colors[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={histogramData}
        margin={{
          top: 0,
          right: 0,
          left: -40,
          bottom: 0,
        }}
      >
        <XAxis dataKey="value" fontSize={12} />
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
