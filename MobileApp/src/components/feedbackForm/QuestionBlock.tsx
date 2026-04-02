import React from "react";
import { View, Text, TextInput } from "react-native";
import RatingScale from "./RatingScale";
import { FEEDBACK_VALUES_BY_TYPE } from "@/src/constants/feedbackForm";
import { Colors } from "@/src/constants/colors";
const { NAVY } = Colors;

interface QuestionBlockProps {
  label: string;
  type: "5" | "3" | "thumb" | "text";
  value?: number;
  onChange: (val: number | string) => void;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  label,
  type,
  value,
  onChange,
}) => {
  const showRatingValue =
    type !== "text" &&
    value !== undefined &&
    FEEDBACK_VALUES_BY_TYPE[type][value];

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 24, color: NAVY }}>{`${label}:`}</Text>
      {type === "text" ? (
        <TextInput
          placeholder="Enter your feedback here..."
          multiline
          numberOfLines={4}
          onChangeText={onChange}
          style={{
            minHeight: 150,
            justifyContent: "flex-start",
            textAlignVertical: "top", // Crucial for Android
            padding: 10,
            fontSize: 16,
          }}
        />
      ) : (
        <RatingScale
          type={type}
          iconSize={40}
          value={value}
          onChange={onChange}
        />
      )}
      <Text
        style={{
          fontSize: 14,
          color: "#666",
          textAlign: "right",
          marginTop: 4,
          display: showRatingValue ? "flex" : "none",
        }}
      >
        {showRatingValue ? FEEDBACK_VALUES_BY_TYPE[type][value] : ""}
      </Text>
    </View>
  );
};

export default QuestionBlock;
