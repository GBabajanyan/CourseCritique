import { Collapse } from "antd";
import React, { useState } from "react";
import { COLORS, GRAPH_COLORS } from "../constants/colors";
import { FeedbackDistributionCardProps } from "../types/charts";
import Histogram from "./Histogram";
import LikertBar from "./LikertBar/LikertBar";

const FeedbackDistributionCard: React.FC<FeedbackDistributionCardProps> = ({
  stats,
  style = {},
}) => {
  const [cardTitle, setCardTitle] = useState<
    "Likert Row" | "Frequency Distribution"
  >("Likert Row");
  const scaleLength = Object.keys(stats.distribution).length;

  const colors =
    scaleLength === 5
      ? GRAPH_COLORS
      : scaleLength === 3
        ? [GRAPH_COLORS[1], GRAPH_COLORS[2], GRAPH_COLORS[3]]
        : [GRAPH_COLORS[0], GRAPH_COLORS[4]];

  return (
    <div
      style={{
        padding: 16,
        paddingBottom: 32,
        border: `0.5px solid ${COLORS.NAVY}`,
        borderRadius: 12,
        marginBottom: 16,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <strong style={{ fontSize: "16px", color: COLORS.NAVY }}>
          {cardTitle}
        </strong>
      </div>
      <Collapse
        ghost
        onChange={(key) =>
          setCardTitle(key.length ? "Frequency Distribution" : "Likert Row")
        }
        items={[
          {
            label: (
              <LikertBar
                distribution={stats.distribution}
                mean={stats.mean}
                variance={stats.variance}
                colors={colors}
              />
            ),
            showArrow: false,
            children: (
              <Histogram distribution={stats.distribution} colors={colors} />
            ),
            style: { display: "flex", flexDirection: "column-reverse" },
            styles: { header: { padding: 0 }, title: { width: "100%" } },
          },
        ]}
      />
    </div>
  );
};

export default FeedbackDistributionCard;
