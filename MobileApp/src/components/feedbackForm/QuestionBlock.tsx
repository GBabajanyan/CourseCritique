import React from "react";
import { View, Text, TextInput } from "react-native";
import RatingScale from "./RatingScale";
import { FEEDBACK_VALUES_BY_TYPE } from "@/src/constants/feedbackForm";
import { Colors } from "@/src/constants/colors";
const { NAVY, SUB } = Colors;

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
    <View>
      <Text
        style={{
          fontSize: 24,
          color: NAVY,
          marginBottom: 12,
          textAlign: type === "thumb" ? "center" : "left",
        }}
      >{`${label}:`}</Text>
      {type === "text" ? (
        <TextInput
          placeholder="Enter your feedback here..."
          multiline
          numberOfLines={4}
          onChangeText={onChange}
          placeholderTextColor={SUB}
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
          display: "flex",
          textAlign: type === "thumb" ? "center" : "left",
          marginTop: 12,
        }}
      >
        {showRatingValue ? FEEDBACK_VALUES_BY_TYPE[type][value] : ""}
      </Text>
    </View>
  );
};

export default QuestionBlock;
