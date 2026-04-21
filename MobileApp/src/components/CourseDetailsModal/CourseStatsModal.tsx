import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  closeModal: () => void;
};

const CourseStatsModal = ({ visible, closeModal }: Props) => {
  const { feedbackStore } = useStore();
  const { CARD, BACKGROUND, SURFACE, TEXT, TEXT_SECONDARY, BORDER } =
    useColors();
  const { isModalLoading, courseFeedbackInSearchModal: selectedCourse } =
    feedbackStore;

  if (!visible || selectedCourse === null) return undefined;

  const renderRatingBar = (label: string, rating: number) => (
    <View style={styles.ratingRow}>
      <Text style={[styles.ratingLabel, { color: TEXT_SECONDARY }]}>
        {label}
      </Text>
      <View
        style={[styles.ratingBarContainer, { backgroundColor: BACKGROUND }]}
      >
        <View
          style={[styles.ratingBarFill, { width: `${(rating / 5) * 100}%` }]}
        />
      </View>
      <Text style={[styles.ratingValue, { color: TEXT_SECONDARY }]}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );

  const renderThumbStat = (label: string, yes: number, no: number) => {
    const total = yes + no;
    const yesPercent = total > 0 ? (yes / total) * 100 : 0;
    return (
      <View style={styles.thumbRow}>
        <Text style={[styles.thumbLabel, { color: TEXT_SECONDARY }]}>
          {label}
        </Text>
        <View style={styles.thumbBarContainer}>
          <View style={[styles.thumbBarYes, { width: `${yesPercent}%` }]} />
          <View
            style={[styles.thumbBarNo, { width: `${100 - yesPercent}%` }]}
          />
        </View>
        <View style={styles.thumbIcons}>
          <Text style={[styles.thumbText, { color: TEXT_SECONDARY }]}>
            👍 {yes}
          </Text>
          <Text style={[styles.thumbText, { color: TEXT_SECONDARY }]}>
            👎 {no}
          </Text>
        </View>
      </View>
    );
  };

  const { stats } = selectedCourse;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: SURFACE }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: BORDER }]}>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="arrow-back" size={24} color={TEXT_SECONDARY} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: TEXT }]}>
              Course Statistics
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {isModalLoading ? (
            <ActivityIndicator
              size="large"
              color="#007AFF"
              style={styles.modalLoading}
            />
          ) : (
            stats && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Course Info */}
                <View
                  style={[
                    styles.modalCourseInfo,
                    { borderBottomColor: BORDER },
                  ]}
                >
                  <Text style={styles.modalCourseCode}>
                    {selectedCourse?.courseCode}
                  </Text>
                  <Text style={[styles.modalCourseName, { color: TEXT }]}>
                    {selectedCourse?.courseName}
                  </Text>
                  <Text
                    style={[styles.modalInstructor, { color: TEXT_SECONDARY }]}
                  >
                    {selectedCourse?.instructor}
                  </Text>
                </View>

                {/* Summary Stats */}
                <View style={[styles.summaryStats, { backgroundColor: CARD }]}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                      {stats.total_feedbacks}
                    </Text>
                    <Text
                      style={[styles.summaryLabel, { color: TEXT_SECONDARY }]}
                    >
                      Feedbacks
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                      {stats.avg_rating.toFixed(1)}
                    </Text>
                    <Text
                      style={[styles.summaryLabel, { color: TEXT_SECONDARY }]}
                    >
                      Avg Rating
                    </Text>
                  </View>
                </View>

                {/* Ratings Section */}
                <Text style={[styles.sectionTitle, { color: TEXT }]}>
                  Course Ratings
                </Text>
                {renderRatingBar(
                  "Course Pace",
                  stats.ratings_breakdown.course_pace,
                )}
                {renderRatingBar(
                  "Course Load",
                  stats.ratings_breakdown.course_load,
                )}
                {renderRatingBar(
                  "Organization",
                  stats.ratings_breakdown.class_organization,
                )}
                {renderRatingBar(
                  "Materials",
                  stats.ratings_breakdown.course_materials,
                )}
                {renderRatingBar(
                  "Assignments",
                  stats.ratings_breakdown.assignment_instructions,
                )}
                {renderRatingBar(
                  "Grading",
                  stats.ratings_breakdown.grading_rubrics,
                )}

                <Text style={[styles.sectionTitle, { color: TEXT }]}>
                  Instructor Ratings
                </Text>
                {renderRatingBar(
                  "Class Management",
                  stats.ratings_breakdown.class_management,
                )}
                {renderRatingBar(
                  "Student Participation",
                  stats.ratings_breakdown.student_participation,
                )}
                {renderRatingBar(
                  "Responsiveness",
                  stats.ratings_breakdown.in_class_queries,
                )}
                {renderRatingBar(
                  "Concern for Learning",
                  stats.ratings_breakdown.concern_learning,
                )}
                {renderRatingBar(
                  "Availability",
                  stats.ratings_breakdown.availability,
                )}
                {renderRatingBar(
                  "Feedback Quality",
                  stats.ratings_breakdown.feedback_on_assignments,
                )}
                {renderRatingBar(
                  "Inspires Motivation",
                  stats.ratings_breakdown.inspires_motivation,
                )}

                <Text style={[styles.sectionTitle, { color: TEXT }]}>
                  Overall
                </Text>
                {renderThumbStat(
                  "Substantial Learning",
                  stats.ratings_breakdown.substantial_learning.yes,
                  stats.ratings_breakdown.substantial_learning.no,
                )}
                {renderThumbStat(
                  "Would Take Again",
                  stats.ratings_breakdown.take_another_course.yes,
                  stats.ratings_breakdown.take_another_course.no,
                )}

                {/* Recent Comments */}
                {stats.recent_comments.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: TEXT }]}>
                      Recent Comments
                    </Text>
                    {stats.recent_comments.map((comment, index) => (
                      <View
                        key={index}
                        style={[styles.commentCard, { backgroundColor: CARD }]}
                      >
                        <Text
                          style={[
                            styles.commentText,
                            { color: TEXT_SECONDARY },
                          ]}
                        >
                          &quot;{comment}&quot;
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </ScrollView>
            )
          )}
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalLoading: {
    marginTop: 40,
  },
  modalCourseInfo: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalCourseCode: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 4,
  },
  modalCourseName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  modalInstructor: {
    fontSize: 14,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  ratingLabel: {
    width: 100,
    fontSize: 14,
    color: "#666",
  },
  ratingBarContainer: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    backgroundColor: "#f59e0b",
    borderRadius: 3,
  },
  ratingValue: {
    width: 35,
    fontSize: 14,
    fontWeight: "500",
  },
  thumbRow: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  thumbLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  thumbBarContainer: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  thumbBarYes: {
    backgroundColor: "#10b981",
  },
  thumbBarNo: {
    backgroundColor: "#ef4444",
  },
  thumbIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  thumbText: {
    fontSize: 12,
  },
  commentCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  commentText: {
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default CourseStatsModal;
