import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { PendingFeedback } from "@/src/types/Feedback";
import { getPhaseColor, getPhaseDisplayName } from "@/src/util/general";
import { useRouter } from "expo-router";
import { JSX } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PendingCourseFeedbackCard = ({
  feedbackData,
  onPress,
}: {
  feedbackData: PendingFeedback;
  onPress: () => void;
}): JSX.Element => {
  const router = useRouter();
  const { NAVY, WHITE, CARD, TEXT, TEXT_SECONDARY, WARNING } = useColors();
  const { feedbackStore } = useStore();
  const { setCurrentFeedbackCourse } = feedbackStore;

  return (
    <TouchableOpacity
      key={feedbackData.id}
      style={[
        styles.pendingCourseFeedbackCard,
        {
          backgroundColor: CARD,
          borderLeftColor: NAVY,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <View style={styles.courseCodeRow}>
            <Text style={[styles.courseCode, { color: NAVY }]}>
              {feedbackData.courseCode}
            </Text>
            <Text style={[styles.courseName, { color: TEXT }]}>
              {feedbackData.courseName}
            </Text>
          </View>
          <View style={styles.courseMeta}>
            <Text style={[styles.sectionText, { color: TEXT_SECONDARY }]}>
              Section {feedbackData.section}
            </Text>
            <Text style={[styles.instructorText, { color: TEXT_SECONDARY }]}>
              • {feedbackData.instructor}
            </Text>
          </View>
        </View>
        <View style={styles.deadlineContainer}>
          <Text style={[styles.deadlineText, { color: WARNING }]}>
            Due: {feedbackData.deadline}
          </Text>
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
        style={[styles.feedbackButton, { backgroundColor: NAVY }]}
        onPress={() => {
          setCurrentFeedbackCourse(feedbackData);
          router.push("/feedback/Pending/FeedbackForm");
        }}
      >
        <Text style={[styles.feedbackButtonText, { color: WHITE }]}>
          Give Feedback
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pendingCourseFeedbackCard: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    gap:4
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
    marginRight: 8,
  },
  courseName: {
    fontSize: 16,
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
    fontWeight: "500",
  },
  instructorText: {
    fontSize: 14,
    marginLeft: 4,
  },
  deadlineContainer: {
    flex: 2,
    alignItems: "flex-end",
  },
  deadlineText: {
    fontSize: 12,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  feedbackButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default PendingCourseFeedbackCard;
