import React from "react";
import { View } from "react-native";
import { FeedbackRatingsObject } from "@/src/types/Feedback";
import QuestionBlock from "./QuestionBlock";

interface StepRendererProps {
  step: any;
  data: FeedbackRatingsObject;
  update: (key: keyof FeedbackRatingsObject, value: any) => void;
}

const StepRenderer: React.FC<StepRendererProps> = ({ step, data, update }) => {
  return (
    <View>
      <View style={{ gap: 24 }}>
        {step.questions.map((q) => (
          <QuestionBlock
            key={q.key}
            label={q.label}
            type={q.type}
            value={data[q.key]}
            onChange={(v) => update(q.key, v)}
          />
        ))}
      </View>
    </View>
  );
};

export default StepRenderer;
