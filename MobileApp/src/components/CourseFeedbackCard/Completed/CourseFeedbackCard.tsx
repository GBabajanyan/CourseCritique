import { phaseNames } from "@/src/constants";
import { departmentColors, phaseColors } from "@/src/constants/colors";
import { useColors } from "@/src/hooks/useColors";
import { CourseFeedbackCardType, FeedbackPhase } from "@/src/types/Feedback";
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
  const { NAVY, WHITE, CARD, TEXT, TEXT_SECONDARY, SUCCESS, SURFACE } =
    useColors();
  const isExpandable = isExpanded !== undefined;
  const isTypeCompleted = type === "completed";
  const renderRating = (rating: number): string => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getPhaseColor = (phase: FeedbackPhase): string => {
    return phaseColors[phase];
  };

  const getDepartmentColor = (department = "default"): string => {
    return departmentColors[department];
  };

  const getPhaseDisplayName = (phase: FeedbackPhase): string =>
    phaseNames[phase];

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
            // <Text style={[styles.expandIcon, { color: NAVY }]}>
            <Ionicons
              name={isExpanded ? "caret-up-outline" : "caret-down-outline"}
              size={24}
              color="black"
            />
            //</Text>
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && isTypeCompleted && (
        <View style={[styles.feedbackDetails, { backgroundColor: SURFACE }]}>
          <View style={styles.ratingContainer}>
            <Text style={[styles.detailLabel, { color: TEXT_SECONDARY }]}>
              Rating:
            </Text>
            <Text style={styles.ratingStars}>
              {renderRating(item.feedbackData?.avgRating)}
            </Text>
          </View>
          {item?.feedbackData?.comments && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: TEXT_SECONDARY }]}>
                Comments:
              </Text>
              <Text style={[styles.detailText, { color: TEXT_SECONDARY }]}>
                {item.feedbackData.comments}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: TEXT_SECONDARY }]}>
              Suggestions:
            </Text>
            <Text style={[styles.detailText, { color: TEXT_SECONDARY }]}>
              {item.feedbackData.improvements}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: TEXT_SECONDARY }]}>
              Would Recommend:
            </Text>
            <Text style={[styles.detailText, { color: TEXT_SECONDARY }]}>
              {item.feedbackData.wouldRecommend ? "Yes ✅" : "No ❌"}
            </Text>
          </View>
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
