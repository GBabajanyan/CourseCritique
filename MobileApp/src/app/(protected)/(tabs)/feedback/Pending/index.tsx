import CourseStatsModal from "@/src/components/CourseDetailsModal/CourseStatsModal";
import PendingCourseFeedbackCard from "@/src/components/CourseFeedbackCard/Pending/PendingCourseFeedbackCard";
import LoadingScreen from "@/src/components/LoadingScreen/LoadingScreen";
import { Colors } from "@/src/constants/colors";
import { currentSemester, currentYear } from "@/src/mock";
import { useStore } from "@/src/store/StoreProvider";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { WHITE } = Colors;

const PendingFeedbacks: React.FC = observer(() => {
  const [isCourseStatsModalOpen, setIsCourseStatsModalOpen] = useState(false);
  // const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { bottom } = useSafeAreaInsets();
  const { feedbackStore } = useStore();
  const {
    isPageLoading,
    courseFeedbackInSearchModal,
    pendingFeedbacks,
    // loadPendingCourses,
    setCourseFeedbackInSearchModal,
    fetchCourseStats,
  } = feedbackStore;

  const bottomPadding = bottom + 20;

  const openCourseStatsModal = async (courseCode: string) => {
    const res = await fetchCourseStats(courseCode);
    if (!res) {
      return Alert.alert("Something went wrong. Please come back later");
    }
    setCourseFeedbackInSearchModal(res);
    setIsCourseStatsModalOpen(true);
  };

  const closeCourseDetailsModal = () => {
    setIsCourseStatsModalOpen(false);
    setCourseFeedbackInSearchModal(null);
  };
  if (isPageLoading) return <LoadingScreen />;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.tabContent,
        { paddingBottom: bottomPadding },
      ]}
    >
      <CourseStatsModal
        visible={isCourseStatsModalOpen}
        closeModal={closeCourseDetailsModal}
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
        {pendingFeedbacks.map((feedback) => (
          <PendingCourseFeedbackCard
            key={feedback.id}
            feedbackData={feedback}
            onPress={() => {
              openCourseStatsModal(feedback.courseCode);
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

export default PendingFeedbacks;
