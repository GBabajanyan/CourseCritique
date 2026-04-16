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
  const { isModalLoading, courseFeedbackInSearchModal: selectedCourse } =
    feedbackStore;

  if (!visible || selectedCourse === null) return undefined;

  const renderRatingBar = (label: string, rating: number) => (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingBarContainer}>
        <View
          style={[styles.ratingBarFill, { width: `${(rating / 5) * 100}%` }]}
        />
      </View>
      <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
    </View>
  );

  const renderThumbStat = (label: string, yes: number, no: number) => {
    const total = yes + no;
    const yesPercent = total > 0 ? (yes / total) * 100 : 0;
    return (
      <View style={styles.thumbRow}>
        <Text style={styles.thumbLabel}>{label}</Text>
        <View style={styles.thumbBarContainer}>
          <View style={[styles.thumbBarYes, { width: `${yesPercent}%` }]} />
          <View
            style={[styles.thumbBarNo, { width: `${100 - yesPercent}%` }]}
          />
        </View>
        <View style={styles.thumbIcons}>
          <Text style={styles.thumbText}>👍 {yes}</Text>
          <Text style={styles.thumbText}>👎 {no}</Text>
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
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Course Statistics</Text>
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
                <View style={styles.modalCourseInfo}>
                  <Text style={styles.modalCourseCode}>
                    {selectedCourse?.courseCode}
                  </Text>
                  <Text style={styles.modalCourseName}>
                    {selectedCourse?.courseName}
                  </Text>
                  <Text style={styles.modalInstructor}>
                    {selectedCourse?.instructor}
                  </Text>
                </View>

                {/* Summary Stats */}
                <View style={styles.summaryStats}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                      {stats.total_feedbacks}
                    </Text>
                    <Text style={styles.summaryLabel}>Feedbacks</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                      {stats.avg_rating.toFixed(1)}
                    </Text>
                    <Text style={styles.summaryLabel}>Avg Rating</Text>
                  </View>
                </View>

                {/* Ratings Section */}
                <Text style={styles.sectionTitle}>Course Ratings</Text>
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

                <Text style={styles.sectionTitle}>Instructor Ratings</Text>
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

                <Text style={styles.sectionTitle}>Overall</Text>
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
                    <Text style={styles.sectionTitle}>Recent Comments</Text>
                    {stats.recent_comments.map((comment, index) => (
                      <View key={index} style={styles.commentCard}>
                        <Text style={styles.commentText}>
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
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  resultsCount: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  ratingBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingBadgeText: {
    fontSize: 12,
    color: "#d97706",
  },
  courseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  courseDept: {
    fontSize: 12,
    color: "#999",
  },
  feedbackCount: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
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
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalLoading: {
    marginTop: 40,
  },
  modalCourseInfo: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
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
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  modalInstructor: {
    fontSize: 14,
    color: "#666",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#f8f9fa",
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
    color: "#666",
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
    backgroundColor: "#e5e7eb",
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
    color: "#333",
  },
  thumbRow: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  thumbLabel: {
    fontSize: 14,
    color: "#666",
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
    color: "#666",
  },
  commentCard: {
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});

export default CourseStatsModal;
