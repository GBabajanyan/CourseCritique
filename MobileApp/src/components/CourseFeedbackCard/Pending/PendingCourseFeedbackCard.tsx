import { phaseNames } from "@/src/constants";
import { Colors, phaseColors } from "@/src/constants/colors";
import { useStore } from "@/src/store/StoreProvider";
import { Course } from "@/src/types/Course";
import { FeedbackPhase } from "@/src/types/Feedback";
import { useRouter } from "expo-router";
import { JSX } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { NAVY, WHITE } = Colors;

const PendingCourseFeedbackCard = ({
  course,
  onPress,
}: {
  course: Course;
  onPress: () => void;
}): JSX.Element => {
  const router = useRouter();
  const { feedbackStore } = useStore();
  const { setCurrentFeedbackCourse } = feedbackStore;

  const getPhaseDisplayName = (phase: FeedbackPhase): string =>
    phaseNames[phase];

  const getPhaseColor = (phase: FeedbackPhase): string => {
    return phaseColors[phase];
  };

  return (
    <TouchableOpacity
      key={course.id}
      style={styles.pendingCourseFeedbackCard}
      onPress={onPress}
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
        onPress={() => {
          setCurrentFeedbackCourse(course);
          router.push("/feedback/Pending/FeedbackForm");
        }}
      >
        <Text style={styles.feedbackButtonText}>Give Feedback</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pendingCourseFeedbackCard: {
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
});

export default PendingCourseFeedbackCard;
