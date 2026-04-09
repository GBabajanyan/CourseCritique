import { Colors } from "@/src/constants/colors";
import { useStore } from "@/src/store/StoreProvider";
import { Course } from "@/src/types/Course";
import { getPhaseColor, getPhaseDisplayName } from "@/src/util/general";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { SAFFRON, NAVY, WHITE } = Colors;

const ToDoItem = ({
  item,
  onPress = () => {},
}: {
  item: Course;
  onPress?: () => void;
}) => {
  const router = useRouter();
  const { feedbackStore } = useStore();
  const { setCurrentFeedbackCourse } = feedbackStore;

  return (
    // <Pressable style={styles.badgeItem} onPress={onPress}>
    <View key={item.id} style={styles.toDoCard}>
      <View style={styles.toDoDetails}>
        <Text style={styles.courseCode}>{item.courseCode}</Text>
        <Text style={styles.courseName}>{item.courseName}</Text>
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
        <Text style={styles.deadline}>Due: {item.deadline}</Text>
      </View>
      <View style={styles.eventDetails}>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => {
            setCurrentFeedbackCourse(item);
            router.push("/feedback/Pending/FeedbackForm");
          }}
        >
          <Text style={styles.feedbackButtonText}>Give Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </Pressable>
  );
};

const styles = StyleSheet.create({
  toDoCard: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    shadowColor: NAVY,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    gap: 12,
  },
  toDoDetails: {
    justifyContent: "center",
    width: "25%",
  },
  courseName: {
    fontSize: 14,
    color: "#003A5D",
    fontWeight: "500",
  },
  deadline: {
    fontSize: 14,
    color: "#ff6b35",
    fontWeight: "500",
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
  eventDetails: {
    flex: 1,
    justifyContent: "space-around",
    gap: 4,
  },
  courseCode: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  feedbackButton: {
    borderColor: NAVY,
    backgroundColor: WHITE,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    shadowColor: NAVY,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  feedbackButtonText: {
    color: NAVY,
    fontSize: 14,
    textAlign: "right",
    marginRight: 4,
    fontWeight: "600",
  },
});

export default ToDoItem;
