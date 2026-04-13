import React, { useState } from "react";
import CourseDetailsModal from "@/src/components/CourseDetailsModal/CourseDetailsModal";
import { Colors } from "@/src/constants/colors";
import { currentSemester, currentYear } from "@/src/mock";
import { useStore } from "@/src/store/StoreProvider";
import { Course } from "@/src/types/Course";
import { observer } from "mobx-react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import PendingCourseFeedbackCard from "@/src/components/CourseFeedbackCard/Pending/PendingCourseFeedbackCard";
import LoadingScreen from "@/src/components/LoadingScreen/LoadingScreen";

const { NAVY, WHITE } = Colors;

const PendingFeedback: React.FC = observer(() => {
  const [isCourseDetailsModalOpen, setIsCourseDetailsModalOpen] =
    useState(false);
  // const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { bottom } = useSafeAreaInsets();
  const { feedbackStore } = useStore();
  const { isLoading, pendingFeedbacks, loadPendingCourses } = feedbackStore;

  const bottomPadding = bottom + 20;

  useFocusEffect(
    React.useCallback(() => {
      loadPendingCourses();
    }, []),
  );

  const openCourseDetailsModal = (course: Course) => {
    // setSelectedCourse(course);
    setIsCourseDetailsModalOpen(true);
  };

  const closeCourseDetailsModal = () => {
    setIsCourseDetailsModalOpen(false);
    // setSelectedCourse(null);
  };
  if (isLoading) return <LoadingScreen />;

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
        courseDetails={null}
      />
      <View>
        <Text style={styles.currentSemesterTitle}>
          {currentSemester} Semester {currentYear} - Open Feedbacks
        </Text>
        {pendingFeedbacks.length === 0 && (
          <Text style={styles.currentSemesterSubtitle}>
            {pendingFeedbacks.length} feedbacks to complete
          </Text>
        )}
      </View>

      <View style={styles.courseItemContainer}>
        {pendingFeedbacks.map((course) => (
          <PendingCourseFeedbackCard
            key={course.id}
            course={course}
            onPress={() => {
              openCourseDetailsModal(course);
            }}
          />
        ))}
      </View>

      {pendingFeedbacks.length === 0 && (
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
});

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
