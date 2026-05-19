import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RadarChart } from "react-native-gifted-charts";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import OpenFeedbackTab from "./OpenFeedbackTab/OpenFeedbackTab";
import { FORM_CONFIG } from "@/src/constants/feedbackForm";
import { observer } from "mobx-react";

type Props = {
  visible: boolean;
  closeModal: () => void;
};

const CourseStatsModal = observer(({ visible, closeModal }: Props) => {
  const { feedbackStore } = useStore();
  const { CARD, SURFACE, TEXT, TEXT_SECONDARY, BORDER, NAVY, WHITE } =
    useColors();
  const { isModalLoading, courseFeedbackInSearchModal: selectedCourse } =
    feedbackStore;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "stats", title: "Stats" },
    { key: "open", title: "Open" },
  ]);
  const [selectedLimit, setSelectedLimit] = useState<number | "All">("All");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  if (!visible || selectedCourse === null) return undefined;
  const { ratingStats, feedbacks_completed } = selectedCourse;
  const radar_labels = Object.entries(ratingStats.sections).map(
    ([key, val]) => {
      const label = (
        FORM_CONFIG.find((c) => c.key === key)?.title ?? key
      ).replace(" ", "\n");
      const score = val.CCScore.toFixed(1);
      return `${label}\n(${score})`;
    },
  );

  // Fetch course stats with limit
  const refreshStats = async (limit: number | "All") => {
    if (limit === selectedLimit) return;
    setSelectedLimit(limit);
    const res = await feedbackStore.fetchCourseStats(
      selectedCourse.courseCode,
      limit,
    );
    feedbackStore.setCourseFeedbackInSearchModal(res);
  };

  const renderScene = SceneMap({
    stats: () => (
      <View style={{ flex: 1 }}>
        {/* Dropdown in Stats tab */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              { borderColor: BORDER, backgroundColor: SURFACE },
            ]}
            onPress={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            <Text style={{ color: TEXT }}>
              Show: {selectedLimit === "All" ? "All" : `Last ${selectedLimit}`}
            </Text>
            <Ionicons name="chevron-down" size={18} color={TEXT} />
          </TouchableOpacity>

          {isDropdownVisible && (
            <View
              style={[
                styles.dropdownList,
                { backgroundColor: SURFACE, borderColor: BORDER },
              ]}
            >
              {[20, 50, 100, "All"].map((value) => (
                <TouchableOpacity
                  key={value.toString()}
                  style={styles.dropdownItem}
                  onPress={() => refreshStats(value as number | "All")}
                >
                  <Text style={{ color: TEXT }}>
                    {value === "All" ? value : `Last ${value}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* RadarChart uses updated stats */}
        <RadarChart
          data={Object.values(ratingStats.sections).map((v) =>
            Number(v.CCScore.toFixed(1)),
          )}
          labels={radar_labels}
          labelConfig={{
            stroke: NAVY,
            fontWeight: "bold",
            fontSize: 16,
            alignmentBaseline: "text-after-edge",
          }}
          polygonConfig={{
            isAnimated: true,
            fill: NAVY,
          }}
          maxValue={10}
          startAngle={90}
          chartSize={420}
        />
      </View>
    ),
    open: () => (
      <OpenFeedbackTab
        open_feedbacks={selectedCourse?.open_feedbacks ?? undefined}
      />
    ),
  });

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
            ratingStats && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flex: 1 }}
              >
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
                      {feedbacks_completed || 0}
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
                      {(ratingStats.overall?.score || 37).toFixed(2) * 100}/100
                    </Text>
                    <Text
                      style={[styles.summaryLabel, { color: TEXT_SECONDARY }]}
                    >
                      Rating
                    </Text>
                  </View>
                </View>
                <TabView
                  navigationState={{ index, routes }}
                  renderScene={renderScene}
                  style={{
                    flex: 1,
                    borderTopColor: BORDER,
                    backgroundColor: SURFACE,
                    borderTopWidth: 1,
                    paddingTop: 12,
                  }}
                  renderTabBar={(props: any) => {
                    return (
                      <TabBar
                        {...props}
                        style={[
                          styles.tabBar,
                          { borderColor: WHITE, backgroundColor: SURFACE },
                        ]}
                        indicatorStyle={[
                          styles.indicator,
                          { backgroundColor: NAVY },
                        ]}
                        contentContainerStyle={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        activeColor={WHITE}
                        inactiveColor={NAVY}
                        pressOpacity={0.9}
                      />
                    );
                  }}
                  onIndexChange={setIndex}
                  swipeEnabled={true}
                  animationEnabled={true}
                />
              </ScrollView>
            )
          )}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  dropdownContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    position: "relative",
    zIndex: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 110,
  },
  dropdownList: {
    position: "absolute",
    top: 48,
    right: 16,
    width: 120,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 20,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "85%",
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
    transform: "translateY(50%)",
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
  tabBar: {
    borderRadius: 40,
    // transform: [{ scaleX: 0.8 }],
    width: "80%",
    height: "10%",
    alignSelf: "center",
    zIndex: 1,
    elevation: 1,
    borderWidth: 2,
  },
  indicator: {
    position: "absolute",
    height: "100%",
    borderRadius: 40,
    opacity: 0.9,
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
