import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { PendingFeedback } from "@/src/types/Feedback";
import { getPhaseColor, getPhaseDisplayName } from "@/src/util/general";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ToDoItem = ({ item }: { item: PendingFeedback }) => {
  const router = useRouter();
  const { TEXT, TEXT_SECONDARY, NAVY, WARNING, CARD } = useColors();
  const { feedbackStore } = useStore();
  const { setCurrentFeedbackCourse } = feedbackStore;

  const onItemPress = () => {
    if (new Date(item.deadline) < new Date()) return;
    setCurrentFeedbackCourse(item);
    router.push("/feedback/Pending/FeedbackForm");
  };
  
  return (
    <Pressable
      key={item.id}
      style={[styles.toDoCard, { shadowColor: NAVY, backgroundColor: CARD }]}
      onPress={onItemPress}
    >
      <View style={styles.toDoDetails}>
        <Text style={[styles.courseCode, { color: NAVY }]}>
          {item.courseCode}
        </Text>
        <Text style={[styles.courseName, { color: TEXT }]}>
          {item.courseName}
        </Text>
        <Text style={[styles.subText, { color: TEXT_SECONDARY }]}>
          (Press to fill feedback)
        </Text>
      </View>
      <View style={styles.eventDetails}>
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
        <Text style={[styles.deadline, { color: WARNING }]}>
          Due: {item.deadline}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toDoCard: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    justifyContent: "space-between",
    shadowOpacity: 0.5,
    shadowRadius: 3,
    gap: 12,
  },
  toDoDetails: {
    justifyContent: "center",
  },
  courseCode: {
    fontSize: 16,
    fontWeight: "500",
  },
  courseName: {
    fontSize: 14,
    fontWeight: "500",
  },
  subText: {
    fontSize: 10,
    fontWeight: "500",
  },
  eventDetails: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
  },
  deadline: {
    fontSize: 12,
    fontWeight: "500",
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  phaseBadgeText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
  },
});

export default ToDoItem;
