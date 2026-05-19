import React from "react";
import { Divider, Tooltip } from "antd";
import { DataSpreadIndicatorProps } from "../../../types/charts";

const DataSpreadIndicator: React.FC<DataSpreadIndicatorProps> = ({
  mean,
  variance,
  scaleLength,
}) => {
  const stdev = Math.sqrt(variance);
  const meanPosition = mean / scaleLength;

  const minScore = 1;
  const maxScore = scaleLength;
  const range = maxScore - minScore;

  const toPosition = (score: number) => (score - minScore) / range;

  const meanMinusStdevPos = toPosition(Math.max(minScore, mean - stdev));
  const meanPlusStdevPos = toPosition(Math.min(maxScore, mean + stdev));
  const clampedMinPos = Math.max(0, meanMinusStdevPos);
  const clampedMaxPos = Math.min(1, meanPlusStdevPos);
  const spreadWidth = clampedMaxPos - clampedMinPos;
  const adjustedMeanPos = Math.max(
    clampedMinPos,
    Math.min(clampedMaxPos, meanPosition),
  );
  const meanRelativePosition =
    spreadWidth > 0 ? (adjustedMeanPos - clampedMinPos) / spreadWidth : 0.5;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: `${100 * meanMinusStdevPos}%`,
        height: "50%",
        width: `${100 * spreadWidth}%`,
        background: `linear-gradient(
  90deg,
  #8c8c8c00 0%,
  #8c8c8cB3 ${100 * meanRelativePosition}%,
  #8c8c8c00 100%
)`,
        borderLeft: meanMinusStdevPos > 0 ? `1px dashed #666` : "none",
        borderRight: meanPlusStdevPos < 1 ? `1px dashed #666` : "none",
        pointerEvents: "none",
      }}
    >
      <Tooltip title="Average response" placement="topLeft" arrow={false}>
        <Divider
          vertical
          style={{
            height: "120%",
            backgroundColor: "#000",
            margin: 0,
            transform: "scaleX(2)",
            position: "absolute",
            left: `${100 * meanRelativePosition}%`,
            top: "-10%",
          }}
        />
      </Tooltip>
    </div>
  );
};

export default DataSpreadIndicator;
