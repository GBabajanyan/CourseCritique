import React, { useState } from "react";
import LikertBar from "./LikertBar";
import Histogram from "./Histogram";
import { FeedbackDistributionCardProps } from "../types/charts";
import { Collapse } from "antd";

const FeedbackDistributionCard: React.FC<FeedbackDistributionCardProps> = ({
  stats,
  style = {},
}) => {
  const [cardTitle, setCardTitle] = useState<
    "Likert Row" | "Frequency Distribution"
  >("Likert Row");

  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #ddd",
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
          marginBottom: 8,
        }}
      >
        <strong>{cardTitle}</strong>

        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span> Mean: {stats.mean.toFixed(2)}</span>
          <span> Total feedbacks: {stats.count}</span>
        </span>
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
                total={stats.count}
              />
            ),
            showArrow: false,
            children: <Histogram distribution={stats.distribution} />,
            style: { display: "flex", flexDirection: "column-reverse" },
            styles: { header: { padding: 0 } },
          },
        ]}
      />
    </div>
  );
};

export default FeedbackDistributionCard;
