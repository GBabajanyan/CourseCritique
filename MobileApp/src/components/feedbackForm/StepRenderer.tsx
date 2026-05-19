import React from "react";
import { View } from "react-native";
import QuestionBlock from "./QuestionBlock";
import { FeedbackRatings, form_config_step } from "@/src/types/Feedback";

interface StepRendererProps {
  step: form_config_step;
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
            required={q.required??false}
            onChange={(v) => update(q.key, v)}
          />
        ))}
      </View>
    </View>
  );
};

export default StepRenderer;
