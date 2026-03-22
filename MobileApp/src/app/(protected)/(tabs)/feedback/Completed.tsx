import { phaseColors, phaseNames } from "@/src/constants";
import { Colors } from "@/src/constants/colors";
import { CompletedFeedback, completedFeedbacks } from "@/src/mock";
import { FeedbackPhase } from "@/src/types/Feedback";
import React, { JSX, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { NAVY, WHITE, SAFFRON } = Colors;

const Completed = () => {
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = bottom + 20;

  const toggleFeedback = (id: string): void => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };
  const renderRating = (rating: number): string => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getPhaseColor = (phase: FeedbackPhase): string => {
    return phaseColors[phase];
  };

  const getPhaseDisplayName = (phase: FeedbackPhase): string =>
    phaseNames[phase];

  const renderCompletedFeedbackItem = (
    feedback: CompletedFeedback,
  ): JSX.Element => (
    <View key={feedback.id} style={styles.completedFeedbackItem}>
      <TouchableOpacity
        style={styles.feedbackHeader}
        onPress={() => toggleFeedback(feedback.id)}
      >
        <View style={styles.courseInfo}>
          <View style={styles.courseCodeRow}>
            <Text style={styles.courseCode}>{feedback.courseCode}</Text>
            <Text style={styles.courseName}>{feedback.courseName}</Text>
          </View>
          <View style={styles.courseMeta}>
            <Text style={styles.sectionText}>Section {feedback.section}</Text>
            <Text style={styles.instructorText}>• {feedback.instructor}</Text>
          </View>
          <View style={styles.feedbackMetaRow}>
            <View
              style={[
                styles.phaseBadge,
                { backgroundColor: getPhaseColor(feedback.feedbackPhase) },
              ]}
            >
              <Text style={styles.phaseBadgeText}>
                {getPhaseDisplayName(feedback.feedbackPhase)}
              </Text>
            </View>
            <Text style={styles.submittedDate}>
              Submitted: {feedback.submittedDate}
            </Text>
          </View>
        </View>
        <View style={styles.feedbackMeta}>
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>Completed</Text>
          </View>
          <Text style={styles.expandIcon}>
            {expandedFeedback === feedback.id ? "▲" : "▼"}
          </Text>
        </View>
      </TouchableOpacity>

      {expandedFeedback === feedback.id && (
        <View style={styles.feedbackDetails}>
          <View style={styles.ratingContainer}>
            <Text style={styles.detailLabel}>Rating:</Text>
            <Text style={styles.ratingStars}>
              {renderRating(feedback.feedbackData.rating)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Comments:</Text>
            <Text style={styles.detailText}>
              {feedback.feedbackData.comments}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Suggestions:</Text>
            <Text style={styles.detailText}>
              {feedback.feedbackData.improvements}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Would Recommend:</Text>
            <Text style={styles.detailText}>
              {feedback.feedbackData.wouldRecommend ? "Yes ✅" : "No ❌"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewFormButton}
            onPress={() =>
              console.log("View full form for:", feedback.courseCode)
            }
          >
            <Text style={styles.viewFormButtonText}>View Full Form</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderGroupedCompletedFeedbacks = (): JSX.Element[] => {
    return Object.entries(completedFeedbacks).map(([year, semesters]) => (
      <View key={year} style={styles.courseItemContainer}>
        <Text style={styles.yearHeader}>{year}</Text>
        {Object.entries(semesters).map(([semester, courses]) => (
          <View key={semester} style={styles.semesterGroup}>
            <Text style={styles.semesterHeader}>{semester} Semester</Text>
            <View style={styles.courseItemContainer}>
              {courses.map(renderCompletedFeedbackItem)}
            </View>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.tabContent,
        {
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {!!Object.keys(completedFeedbacks).length ? (
        <View style={styles.courseItemContainer}>
          {renderGroupedCompletedFeedbacks()}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>📝</Text>
          <Text style={styles.emptyStateText}>No feedbacks submitted yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Your completed feedbacks will appear here.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  tabContent: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 20,
  },
  courseItemContainer: {
    gap: 16,
  },
  yearHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
  },
  semesterGroup: {
    gap: 8,
  },
  semesterHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  completedFeedbackItem: {
    backgroundColor: WHITE,
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
    flex: 1,
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
    color: NAVY,
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
  completedBadge: {
    backgroundColor: "#28a745",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  completedBadgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: "bold",
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
  },
  feedbackMeta: {
    alignItems: "flex-end",
  },
  expandIcon: {
    fontSize: 12,
    color: NAVY,
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
  viewFormButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: NAVY,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  viewFormButtonText: {
    color: NAVY,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default Completed;
