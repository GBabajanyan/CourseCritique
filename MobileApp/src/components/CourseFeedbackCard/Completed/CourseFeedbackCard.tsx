import { FORM_CONFIG } from "@/src/constants/feedbackForm";
import { useColors } from "@/src/hooks/useColors";
import { CourseFeedbackCardType } from "@/src/types/Feedback";
import {
  getDepartmentColor,
  getPhaseColor,
  getPhaseDisplayName,
} from "@/src/util/general";
import { Ionicons } from "@expo/vector-icons";
import React, { JSX } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CourseFeedbackCard = ({
  item,
  type,
  isExpanded,
  style = {},
  onToggle,
}: CourseFeedbackCardType): JSX.Element => {
  const { NAVY, CARD, TEXT, TEXT_SECONDARY, SUCCESS, SURFACE } = useColors();
  const isExpandable = isExpanded !== undefined;
  const isTypeCompleted = type === "completed";
  const key_to_label_entries = FORM_CONFIG[
    FORM_CONFIG.length - 1
  ].questions.map((q) => [q.key, q.short ?? q.label]);
  const QuestionsKeyToLabel = Object.fromEntries(key_to_label_entries);
  const feedbackEntries = Object.entries(
    isTypeCompleted ? item.feedbackData : {},
  );
  return (
    <View
      key={item.id}
      style={[styles.completedFeedbackItem, style, { backgroundColor: CARD }]}
    >
      <TouchableOpacity style={styles.feedbackHeader} onPress={onToggle}>
        <View style={styles.courseInfo}>
          <View style={styles.courseCodeRow}>
            <Text style={[styles.courseCode, { color: NAVY }]}>
              {item.courseCode}
            </Text>
            <Text style={[styles.courseName, { color: TEXT }]}>
              {item.courseName}
            </Text>
          </View>
          <View style={styles.courseMeta}>
            <Text style={[styles.sectionText, { color: TEXT_SECONDARY }]}>
              Section {item.section}
            </Text>
            <Text style={[styles.instructorText, { color: TEXT_SECONDARY }]}>
              • {item.instructor}
            </Text>
          </View>
          {isTypeCompleted && (
            <View style={styles.feedbackMetaRow}>
              <Text style={[styles.submittedDate, { color: SUCCESS }]}>
                Submitted: {item.submittedDate}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.feedbackMeta}>
          {isTypeCompleted ? (
            <View
              style={[
                styles.phaseBadge,
                { backgroundColor: getPhaseColor(item.feedbackPhase) },
              ]}
            >
              <Text style={styles.phaseBadgeText}>
                {getPhaseDisplayName(item.feedbackPhase)}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.phaseBadge,
                { backgroundColor: getDepartmentColor(item.department) },
              ]}
            >
              <Text style={styles.phaseBadgeText}>{item.department}</Text>
            </View>
          )}
          {isExpandable && (
            <Ionicons
              name={isExpanded ? "caret-up-outline" : "caret-down-outline"}
              size={24}
              color="black"
            />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={[styles.feedbackDetails, { backgroundColor: SURFACE }]}>
          {feedbackEntries.map(([name, answer]) => {
            if (answer === undefined) return;
            const displayResponse =
              typeof answer === "string" ? answer : answer ? "Yes ✅" : "No ❌";
            return (
              <View style={styles.detailRow} key={name}>
                <Text style={[styles.detailLabel, { color: TEXT_SECONDARY }]}>
                  {QuestionsKeyToLabel[name]}
                </Text>
                <Text style={[styles.detailText, { color: TEXT_SECONDARY }]} numberOfLines={3} ellipsizeMode="tail">
                  {displayResponse}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  completedFeedbackItem: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseInfo: {
    flex: 2,
  },
  courseCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  courseCode: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  courseName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  sectionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  instructorText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  feedbackMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  phaseBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  submittedDate: {
    fontSize: 12,
    color: "#666",
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
  },
  feedbackMeta: {
    alignItems: "flex-end",
    flex: 1,
  },
  expandIcon: {
    fontSize: 12,
    fontWeight: "bold",
  },
  feedbackDetails: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: 120,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 18,
  },
  ratingStars: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CourseFeedbackCard;
