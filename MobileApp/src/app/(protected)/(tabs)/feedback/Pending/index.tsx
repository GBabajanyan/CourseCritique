import CourseDetailsModal from "@/src/components/CourseDetailsModal/CourseDetailsModal";
import { phaseColors, phaseNames } from "@/src/constants";
import { Colors } from "@/src/constants/colors";
import {
  currentSemester,
  currentYear,
  // CompletedFeedback,
  // completedFeedbacks,
  // Course,
  // FeedbackPhase,
  pendingFeedbackCourses,
} from "@/src/mock";
import { Course } from "@/src/types/Course";
import { FeedbackPhase } from "@/src/types/Feedback";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { JSX, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { NAVY, WHITE } = Colors;

const PendingFeedback: React.FC = () => {
  const router = useRouter();
  const [isCourseDetailsModalOpen, setIsCourseDetailsModalOpen] =
    useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = bottom + 20;

  const openCourseDetailsModal = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseDetailsModalOpen(true);
  };

  const closeCourseDetailsModal = () => {
    setIsCourseDetailsModalOpen(false);
    setSelectedCourse(null);
  };
  const getPhaseDisplayName = (phase: FeedbackPhase): string =>
    phaseNames[phase];

  const getPhaseColor = (phase: FeedbackPhase): string => {
    return phaseColors[phase];
  };

  const renderPendingCourseItem = (course: Course): JSX.Element => (
    <TouchableOpacity
      key={course.id}
      style={styles.pendingCourseItem}
      onPress={() => {
        openCourseDetailsModal(course);
      }}
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
        onPress={async () => {
          // router.push({
          //   pathname: "/feedback/Pending/FeedbackForm/[course]",
          //   params: {
          //     course,
          //   },
          // });
          const a = await axios.get("http://localhost:8000/course");
          console.log(a.data);
        }}
      >
        <Text style={styles.feedbackButtonText}>Give Feedback</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.tabContent,
        { paddingBottom: bottomPadding },
      ]}
    >
      <CourseDetailsModal
        visible={isCourseDetailsModalOpen}
        closeModal={closeCourseDetailsModal}
        courseDetails={selectedCourse}
      />
      <View>
        <Text style={styles.currentSemesterTitle}>
          {currentSemester} Semester {currentYear} - Open Feedbacks
        </Text>
        <Text style={styles.currentSemesterSubtitle}>
          {pendingFeedbackCourses.length} feedbacks to complete
        </Text>
      </View>

      <View style={styles.courseItemContainer}>
        {pendingFeedbackCourses.map(renderPendingCourseItem)}
      </View>

      {pendingFeedbackCourses.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>🎉</Text>
          <Text style={styles.emptyStateText}>No pending feedbacks!</Text>
          <Text style={styles.emptyStateSubtext}>
            All caught up with your course evaluations.
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
    paddingTop: 20,
    paddingHorizontal: 24,
    gap: 20,
  },
  courseItemContainer: {
    gap: 16,
  },
  //To complete Tab
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
  pendingCourseItem: {
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: NAVY,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  //pendingCourseItemBody
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
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  feedbackButton: {
    backgroundColor: NAVY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  feedbackButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
  //Completed Tab
  yearGroup: {
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
  feedbackMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  submittedDate: {
    fontSize: 12,
    color: "#666",
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

export default PendingFeedback;
