import { Colors } from "@/src/constants/colors";
import { useStore } from "@/src/store/StoreProvider";
import { Course } from "@/src/types/Course";
import { getPhaseColor, getPhaseDisplayName } from "@/src/util/general";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
    <Pressable
      // style={styles.badgeItem}
      style={[styles.toDoCard, { shadowColor: NAVY }]}
      onPress={() => {
        setCurrentFeedbackCourse(item);
        router.push("/feedback/Pending/FeedbackForm");
      }}
    >
      {/* <View key={item.id} style={[styles.toDoCard, { shadowColor: NAVY }]}> */}
      <View style={styles.toDoDetails}>
        <Text style={styles.courseCode}>{item.courseCode}</Text>
        <Text style={styles.courseName}>{item.courseName}</Text>
        <Text style={styles.subText}>(Press to fill feedback)</Text>
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
      {/* <View style={styles.eventDetails}>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => {
            setCurrentFeedbackCourse(item);
            router.push("/feedback/Pending/FeedbackForm");
          }}
        >
          <Text style={styles.feedbackButtonText}>Give Feedback</Text>
        </TouchableOpacity>
      </View> */}
      {/* </View> */}
    </Pressable>
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
    color: "#333",
    fontWeight: "500",
  },
  courseName: {
    fontSize: 14,
    color: NAVY,
    fontWeight: "500",
  },
  subText: {
    fontSize: 10,
    color: "#ADAAA8",
    fontWeight: "500",
  },
  eventDetails: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
  },
  deadline: {
    fontSize: 12,
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
    fontSize: 8,
    fontWeight: "bold",
  },
  feedbackButton: {
    borderColor: NAVY,
    backgroundColor: WHITE,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
