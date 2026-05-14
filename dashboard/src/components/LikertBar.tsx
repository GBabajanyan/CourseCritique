import React from "react";
import { FEEDBACK_VALUES_BY_TYPE } from "../constants/feedbackConfig";
import { LikertBarProps } from "../types/charts";
import { Divider, Tooltip } from "antd";

const COLORS = ["#ff4d4f", "#ffa940", "#a493f0", "#73d13d", "#389e0d"];

const LikertBar: React.FC<LikertBarProps> = ({ distribution, mean, total }) => {
  const scaleLength = Object.keys(distribution).length;

  const colors =
    scaleLength === 5
      ? COLORS
      : scaleLength === 3
        ? [COLORS[1], COLORS[2], COLORS[3]]
        : [COLORS[0], COLORS[4]];

  const feedbackValues = FEEDBACK_VALUES_BY_TYPE[scaleLength];

  // Highest count used for opacity normalization
  const maxCount = Math.max(...Object.values(distribution));
  // Equal-width semantic segments
  const data = Object.entries(feedbackValues).map(([value, label], index) => {
    const count = distribution[Number(value)] ?? 0;
    return {
      x: index,
      width: 1,
      label,
      value: Number(value),
      count,
      // opacity: maxCount === 0 ? 0.15 : Math.max(count / maxCount, 0.15),
    };
  });
  const meanPosition = mean / scaleLength;

  return (
    <div
      style={{
        width: "100%",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        className="Likert"
        style={{
          width: "100%",
          height: "50%",
          borderRadius: "20px",
          backgroundColor: "#d4d9e0",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {Object.entries(feedbackValues).map(([key, value],i) => {
          return (
            <div
              key={key}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colors[i],
                display: "flex",
                flex: 1,
                opacity: (distribution[Number(key)] ?? 0) / maxCount || 0.15,
              }}
            ></div>
          );
        })}
        <Tooltip title="Average response" placement="topLeft" arrow={false}>
          <Divider
            vertical
            style={{
              height: "70%",
              backgroundColor: "#000",
              margin: 0,
              transform: "scaleX(2)",
              position: "absolute",
              left: `${100 * meanPosition}%`,
              top: "-10%",
            }}
          />
        </Tooltip>
      </div>
      <div
        className="Likert"
        style={{
          width: "100%",
          height: "50%",
          display: "flex",
        }}
      >
        {Object.entries(feedbackValues).map(([key, value], i) => (
          <span
            key={key}
            style={{
              fontSize: "14px",
              color: "#4b5563",
              lineHeight: 1.5,
              display: "flex",
              flex: 1,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {`${value}(${distribution[Number(key)]})`}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LikertBar;
