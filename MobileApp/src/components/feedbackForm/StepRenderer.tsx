import React from "react";
import { View } from "react-native";
import QuestionBlock from "./QuestionBlock";
import { FeedbackRatings } from "@/src/store/feedbackStore";

interface StepRendererProps {
  step: any;
  data: FeedbackRatings | null;
  update: (key: keyof FeedbackRatings, value: any) => void;
}

const StepRenderer: React.FC<StepRendererProps> = ({ step, data, update }) => {
  return (
    <View>
      <View style={{ gap: 20 }}>
        {step.questions.map((q) => (
          <QuestionBlock
            key={q.key}
            label={q.label}
            type={q.type}
            value={data?.[q.key]}
            onChange={(v) => update(q.key, v)}
          />
        ))}
      </View>
    </View>
  );
};

export default StepRenderer;
