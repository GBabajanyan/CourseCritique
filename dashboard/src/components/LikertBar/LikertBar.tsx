import React from "react";
import { FEEDBACK_VALUES_BY_TYPE } from "../../constants/feedbackConfig";
import { LikertBarProps } from "../../types/charts";
import DataSpreadIndicator from "./DataSpreadIndicator/DataSpreadIndicator";

const LikertBar: React.FC<LikertBarProps> = ({
  distribution,
  mean,
  variance,
  colors,
}) => {
  const scaleLength = Object.keys(distribution).length;
  const feedbackValues = FEEDBACK_VALUES_BY_TYPE[scaleLength];

  const maxCount = Math.max(...Object.values(distribution));

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
        style={{
          width: "100%",
          height: "50%",
          borderRadius: "20px",
          backgroundColor: "#d4d9e0",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {Object.entries(feedbackValues).map(([key, value], i) => {
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
            />
          );
        })}

        <DataSpreadIndicator
          mean={mean}
          variance={variance}
          scaleLength={scaleLength}
        />
      </div>
      <div
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
              display: "flex",
              flex: 1,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {`${value}\u200B(${distribution[Number(key)]})`}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LikertBar;
