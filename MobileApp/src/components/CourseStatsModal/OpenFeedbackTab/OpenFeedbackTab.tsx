import { FORM_CONFIG } from "@/src/constants/feedbackForm";
import { useColors } from "@/src/hooks/useColors";
import { OpenFeedbackTabProps, openFeedbackType } from "@/src/types/Feedback";
import { EvilIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

const OpenFeedbackTab: React.FC<OpenFeedbackTabProps> = ({
  open_feedbacks,
}) => {
  const theme = useColorScheme();
  const { CARD, BACKGROUND, TEXT, TEXT_SECONDARY, BORDER } = useColors();
  const entries = Object.entries(open_feedbacks || {}) as [
    key: openFeedbackType,
    val: { submittedDate: string; feedback: string }[],
  ][];

  const key_to_label_entries = FORM_CONFIG[FORM_CONFIG.length - 1].questions
    .filter((q) => Object.keys(open_feedbacks || {}).includes(q.key))
    .map((q) => [q.key, q.short ?? q.label]);
  const QuestionsKeyToLabel = Object.fromEntries(key_to_label_entries);

  const [randomIndices, setRandomIndices] = useState<
    Record<openFeedbackType, number>
  >(
    Object.fromEntries(
      entries.map(([key, val]) => [
        key,
        Math.floor(Math.random() * (val.length ?? 0)),
      ]),
    ) as Record<openFeedbackType, number>,
  );

  if (!open_feedbacks) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          backgroundColor: BACKGROUND,
        }}
      >
        <Text>
          Failed to Load Open Feedbacks. Please try again after reloading the
          app
        </Text>
      </View>
    );
  }

  const updateRandomIndexFor = (question: openFeedbackType) => {
    setRandomIndices({
      ...randomIndices,
      [question]: Math.floor(
        Math.random() * (open_feedbacks[question].length ?? 0),
      ),
    });
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      {entries.every(([_, arr]) => !arr || arr.length === 0) ? (
        <Text
          style={{
            borderColor: BORDER,
            backgroundColor: CARD,
            color: TEXT,
            textAlign: "center",
            paddingVertical: 16,
            paddingHorizontal: 32,
            margin: 20,
            borderWidth: 2,
            borderRadius: 16,
          }}
        >
          Sorry, no Open-Text Feedbacks Yet
        </Text>
      ) : (
        entries.map(([key, arr]) => (
          <View
            key={key}
            style={{
              paddingVertical: 16,
              margin: 20,
              borderColor: BORDER,
              borderWidth: 2,
              borderRadius: 16,
              backgroundColor: CARD,
              minWidth: "90%",
            }}
          >
            {/* Meta */}
            <View
              style={{
                position: "absolute",
                top: -16,
                paddingHorizontal: 8,
                gap: 8,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  backgroundColor: theme === "dark" ? CARD : BACKGROUND,
                  color: TEXT,
                  paddingHorizontal: 8,
                  borderColor: BORDER,
                  borderBottomWidth: 1,
                  borderRadius: 4,
                  textTransform: "capitalize",
                }}
              >
                {QuestionsKeyToLabel[key] ?? key}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: BACKGROUND,
                    borderRadius: "100%",
                    padding: 2,
                    display: arr.length ? "flex" : "none",
                  }}
                  onPress={() => updateRandomIndexFor(key)}
                >
                  <EvilIcons name="refresh" size={36} color={TEXT} />
                </TouchableOpacity>
                <Text
                  style={{
                    backgroundColor: BACKGROUND,
                    borderRadius: 18,
                    padding: 4,
                    display: arr.length ? "flex" : "none",
                    color: TEXT,
                  }}
                >
                  {arr.length}
                </Text>
              </View>
            </View>
            {!!arr.length && !!arr[randomIndices[key]] && (
              <Text
                style={{
                  position: "absolute",
                  bottom: -16,
                  right: 8,
                  backgroundColor: theme === "dark" ? CARD : BACKGROUND,
                  color: TEXT_SECONDARY,
                  borderRadius: 4,
                  textTransform: "capitalize",
                  display:
                    arr.length && arr[randomIndices[key]] ? "flex" : "none",
                }}
              >
                {arr[randomIndices[key]]?.submittedDate ?? key}
              </Text>
            )}

            <Text style={{ color: TEXT_SECONDARY, paddingHorizontal: 16 }}>
              {arr.length && arr[randomIndices[key]]
                ? `“${arr[randomIndices[key]].feedback}”`
                : "No Responses to this Question Yet"}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

export default OpenFeedbackTab;
