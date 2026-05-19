import { FEEDBACK_VALUES_BY_TYPE } from "@/src/constants/feedbackForm";
import { useColors } from "@/src/hooks/useColors";
import React from "react";
import { Text, TextInput, View } from "react-native";
import RatingScale from "./RatingScale";
import { RatingType } from "@/src/types/Feedback";

interface QuestionBlockProps {
  label: string;
  type: RatingType;
  value?: number | string;
  required: boolean;
  onChange: (val: number | string) => void;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  label,
  type,
  value,
  required,
  onChange,
}) => {
  const { NAVY, TEXT_SECONDARY, TEXT, SURFACE, BORDER } = useColors();

  const showRatingValue =
    type !== "text" &&
    value !== undefined &&
    FEEDBACK_VALUES_BY_TYPE[type][value];

  return (
    <View
      style={{
        backgroundColor: SURFACE,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 8,
        borderRadius: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            flexShrink: 1,
            color: NAVY,
            textAlign: type === "thumb" ? "center" : "left",
          }}
        >
          {`${label}:`}
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: "red",
            display: required ? "flex" : "none",
          }}
        >
          {`*`}
        </Text>
      </View>

      {type === "text" ? (
        <TextInput
          placeholder="Enter your feedback here..."
          multiline
          numberOfLines={4}
          onChangeText={onChange}
          placeholderTextColor={TEXT_SECONDARY}
          style={{
            minHeight: 150,
            justifyContent: "flex-start",
            textAlignVertical: "top", // Crucial for Android
            color: TEXT,
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
