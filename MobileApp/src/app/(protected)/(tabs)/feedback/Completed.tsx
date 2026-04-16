import CourseFeedbackCard from "@/src/components/CourseFeedbackCard/Completed/CourseFeedbackCard";
import LoadingScreen from "@/src/components/LoadingScreen/LoadingScreen";
import { Colors } from "@/src/constants/colors";
import { useStore } from "@/src/store/StoreProvider";
import { CompletedFeedback } from "@/src/types/Feedback";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { ScrollView, SectionList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { NAVY, WHITE } = Colors;

const CompletedFeedbacks = observer(() => {
  const { feedbackStore } = useStore();
  const { isPageLoading, completedFeedbacks, loadCompletedFeedbacks } =
    feedbackStore;
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(
    null,
  );

  const { bottom } = useSafeAreaInsets();
  const bottomPadding = bottom;

  // useFocusEffect(
  //   React.useCallback(() => {
  //     loadCompletedFeedbacks();
  //   }, []),
  // );

  const toggleFeedback = (id: string): void => {
    setExpandedFeedbackId(expandedFeedbackId === id ? null : id);
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; data: any[] };
  }) => <Text style={styles.yearHeader}>{section.title}</Text>;

  const renderItem = ({
    item,
  }: {
    item: { semester: string; feedbacks: CompletedFeedback[] };
  }) => (
    <View style={styles.semesterGroup}>
      <Text style={styles.semesterHeader}>{item.semester}</Text>
      {item.feedbacks.map((feedback) => (
        <CourseFeedbackCard
          key={feedback.id}
          item={feedback}
          type="completed"
          isExpanded={expandedFeedbackId === feedback.id}
          onToggle={() => toggleFeedback(feedback.id)}
        />
      ))}
    </View>
  );
  if (isPageLoading) return <LoadingScreen />;

  return !!Object.keys(completedFeedbacks).length ? (
    <SectionList
      contentContainerStyle={[
        styles.tabContent,
        { paddingBottom: bottomPadding },
      ]}
      sections={completedFeedbacks}
      keyExtractor={(item, index) => `${item.semester}-${index}`}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  ) : (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.tabContent,
        { paddingBottom: bottomPadding },
      ]}
    >
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateEmoji}>📝</Text>
        <Text style={styles.emptyStateText}>No feedbacks submitted yet</Text>
        <Text style={styles.emptyStateSubtext}>
          Your completed feedbacks will appear here.
        </Text>
      </View>
    </ScrollView>
  );
});

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  tabContent: {
    paddingVertical: 12, //12 cuz paddingTop of the section headers are already 8
    paddingHorizontal: 24,
    gap: 20,
  },
  yearHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
    backgroundColor: "#F2F2F2",
  },
  semesterGroup: {
    gap: 8,
  },
  semesterHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 0,
    marginLeft: 12,
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

export default CompletedFeedbacks;
