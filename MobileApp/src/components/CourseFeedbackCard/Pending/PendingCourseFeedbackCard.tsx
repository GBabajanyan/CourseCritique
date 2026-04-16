import { Colors } from "@/src/constants/colors";
import { useStore } from "@/src/store/StoreProvider";
import { PendingFeedback } from "@/src/types/Feedback";
import { getPhaseColor, getPhaseDisplayName } from "@/src/util/general";
import { useRouter } from "expo-router";
import { JSX } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { NAVY, WHITE } = Colors;

const PendingCourseFeedbackCard = ({
  feedbackData,
  onPress,
}: {
  feedbackData: PendingFeedback;
  onPress: () => void;
}): JSX.Element => {
  const router = useRouter();
  const { feedbackStore } = useStore();
  const { setCurrentFeedbackCourse } = feedbackStore;

  return (
    <TouchableOpacity
      key={feedbackData.id}
      style={styles.pendingCourseFeedbackCard}
      onPress={onPress}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <View style={styles.courseCodeRow}>
            <Text style={styles.courseCode}>{feedbackData.courseCode}</Text>
            <Text style={styles.courseName}>{feedbackData.courseName}</Text>
          </View>
          <View style={styles.courseMeta}>
            <Text style={styles.sectionText}>
              Section {feedbackData.section}
            </Text>
            <Text style={styles.instructorText}>
              • {feedbackData.instructor}
            </Text>
          </View>
        </View>
        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineText}>Due: {feedbackData.deadline}</Text>
          <View
            style={[
              styles.phaseBadge,
              { backgroundColor: getPhaseColor(feedbackData.feedbackPhase) },
            ]}
          >
            <Text style={styles.phaseBadgeText}>
              {getPhaseDisplayName(feedbackData.feedbackPhase)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => {
          setCurrentFeedbackCourse(feedbackData);
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
    gap: 4,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  courseInfo: {
    flex: 3,
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
    flex: 2,
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
    textAlign: "right",
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
