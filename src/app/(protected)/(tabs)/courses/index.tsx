import { phaseColors, phaseNames } from "@/src/constants";
import {
  CompletedFeedback,
  completedFeedbacks,
  Course,
  FeedbackPhase,
  pendingFeedbackCourses,
} from "@/src/mock";
import { useRouter } from "expo-router";
import React, { JSX, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CoursesScreen: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  // Current semester info
  const currentYear: string = "2024";
  const currentSemester: string = "Fall";

  const toggleFeedback = (id: string): void => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  const getPhaseDisplayName = (phase: FeedbackPhase): string =>
    phaseNames[phase];

  const getPhaseColor = (phase: FeedbackPhase): string => {
    return phaseColors[phase];
  };

  const renderRating = (rating: number): string => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const renderPendingCourseItem = (course: Course): JSX.Element => (
    <TouchableOpacity
      key={course.id}
      style={styles.courseItem}
      onPress={() =>
        console.log("Navigate to feedback form for:", course.courseCode)
      }
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <View style={styles.courseCodeRow}>
            <Text style={styles.courseCode}>{course.courseCode}</Text>
            <Text style={styles.courseName}>{course.courseName}</Text>
          </View>
          <View style={styles.courseMeta}>
            <Text style={styles.sectionText}>Section {course.section}</Text>
            <Text style={styles.instructorText}>• {course.instructor}</Text>
          </View>
        </View>
        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineText}>Due: {course.deadline}</Text>
          <View
            style={[
              styles.phaseBadge,
              { backgroundColor: getPhaseColor(course.feedbackPhase) },
            ]}
          >
            <Text style={styles.phaseBadgeText}>
              {getPhaseDisplayName(course.feedbackPhase)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.feedbackButton}
        // onPress={()=>{}}
        onPress={() => router.push({ pathname: "/courses/FeedbackForm/[course]", params: course })}
      >
        <Text style={styles.feedbackButtonText}>Give Feedback</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCompletedFeedbackItem = (
    feedback: CompletedFeedback
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
      <View key={year} style={styles.yearGroup}>
        <Text style={styles.yearHeader}>{year}</Text>
        {Object.entries(semesters).map(([semester, courses]) => (
          <View key={semester} style={styles.semesterGroup}>
            <Text style={styles.semesterHeader}>{semester} Semester</Text>
            {courses.map(renderCompletedFeedbackItem)}
          </View>
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Course Feedback</Text>
        <Text style={styles.subtitle}>
          {currentSemester} Semester {currentYear}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            To Complete
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.scrollView}>
        {activeTab === "pending" ? (
          <View style={styles.tabContent}>
            <View style={styles.currentSemesterHeader}>
              <Text style={styles.currentSemesterTitle}>
                {currentSemester} Semester {currentYear} - Open Feedbacks
              </Text>
              <Text style={styles.currentSemesterSubtitle}>
                {pendingFeedbackCourses.length} feedbacks to complete
              </Text>
            </View>

            {pendingFeedbackCourses.map(renderPendingCourseItem)}

            {pendingFeedbackCourses.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>🎉</Text>
                <Text style={styles.emptyStateText}>No pending feedbacks!</Text>
                <Text style={styles.emptyStateSubtext}>
                  All caught up with your course evaluations.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.tabContent}>
            {renderGroupedCompletedFeedbacks()}

            {Object.keys(completedFeedbacks).length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>📝</Text>
                <Text style={styles.emptyStateText}>
                  No feedbacks submitted yet
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Your completed feedbacks will appear here.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    paddingVertical: 20,
  },
  currentSemesterHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    marginBottom: 10,
  },
  currentSemesterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  currentSemesterSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  yearGroup: {
    marginBottom: 25,
  },
  yearHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  semesterGroup: {
    marginBottom: 20,
  },
  semesterHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  courseItem: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedFeedbackItem: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 8,
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
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
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
    color: "#007AFF",
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
  deadlineContainer: {
    alignItems: "flex-end",
  },
  deadlineText: {
    fontSize: 12,
    color: "#ff6b35",
    fontWeight: "500",
    marginBottom: 6,
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  phaseBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  completedBadge: {
    backgroundColor: "#28a745",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  completedBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  feedbackMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
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
  submittedDate: {
    fontSize: 12,
    color: "#666",
  },
  expandIcon: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
  },
  feedbackButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  feedbackButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  feedbackDetails: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
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
    borderColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  viewFormButtonText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#fff",
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

export default CoursesScreen;
