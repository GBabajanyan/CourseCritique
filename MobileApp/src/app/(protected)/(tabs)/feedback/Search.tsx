import CourseFeedbackCard from "@/src/components/CourseFeedbackCard/Completed/CourseFeedbackCard";
import LoadingScreen from "@/src/components/LoadingScreen/LoadingScreen";
import { Colors, departmentColors } from "@/src/constants/colors";
import { useStore } from "@/src/store/StoreProvider";
import { Course, FlashListItem } from "@/src/types/Course";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { observer } from "mobx-react";
import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { transformCoursesToFlashListConfig } from "@/src/util/course";
const { WHITE } = Colors;

const SearchFeedbacks = observer(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const { bottom } = useSafeAreaInsets();
  const { feedbackStore } = useStore();
  const {
    isLoading,
    allCourses,
    courseFeedbackInSearchModal,
    setCourseFeedbackInSearchModal,
    loadAllCourses,
    fetchCourseStats,
  } = feedbackStore;
  const bottomPadding = bottom + 20;
  const [isCourseDetailsModalOpen, setIsCourseDetailsModalOpen] =
    useState(false);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set(),
  );

  useFocusEffect(
    React.useCallback(() => {
      loadAllCourses();
    }, []),
  );

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return allCourses;

    return allCourses.filter(
      (course) =>
        course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.department?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allCourses, searchQuery]);

  const flashListData = useMemo(() => {
    const departmentsToExpand = !searchQuery
      ? expandedDepartments
      : new Set(Object.keys(departmentColors));
    return transformCoursesToFlashListConfig(
      filteredCourses,
      departmentsToExpand,
    );
  }, [filteredCourses, expandedDepartments, searchQuery]);

  const toggleDepartment = (department: string) => {
    setExpandedDepartments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(department)) {
        newSet.delete(department);
      } else {
        newSet.add(department);
      }
      return newSet;
    });
  };

  const handleCoursePress = async (course: Course) => {
    setCourseFeedbackInSearchModal(course);
    setIsCourseDetailsModalOpen(true);
    await fetchCourseStats(course.id);
  };

  const renderItem = useCallback(({ item }: { item: FlashListItem }) => {
    if (item.type === "header") {
      const { title, count, isCollapsed } = item;
      return (
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleDepartment(title)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionTitle}>
            <Ionicons
              name={!isCollapsed ? "caret-up-outline" : "caret-down-outline"}
              size={16}
              color="black"
            />
            <View
              style={[
                styles.phaseBadge,
                { backgroundColor: departmentColors[title] },
              ]}
            >
              <Text style={styles.phaseBadgeText}>{title}</Text>
            </View>
          </View>
          <Text style={styles.sectionCount}>{count} courses</Text>
        </TouchableOpacity>
      );
    }

    // Course item
    const { course } = item;
    return (
      <CourseFeedbackCard
        key={course.id}
        item={course}
        type="statsInfo"
        onToggle={() => handleCoursePress(course)}
        style={{ marginVertical: 4 }}
      />
    );
  }, []);

  const getItemType = useCallback((item: FlashListItem) => {
    return item.type;
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by course code, name, or instructor..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredCourses.length} courses found
      </Text>

      <FlashList
        data={flashListData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        getItemType={getItemType}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPadding },
        ]}
      />

      {flashListData.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>🎉</Text>
          <Text style={styles.emptyStateText}>No pending feedbacks!</Text>
          <Text style={styles.emptyStateSubtext}>
            All caught up with your course evaluations.
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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
    marginVertical: 8,
    marginBottom: 8,
  },
  //flashlist
  listContent: {
    rowGap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    flexDirection: "row",
    columnGap: 4,
    padding: 0,
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
  sectionCount: {
    fontSize: 12,
    color: "#666",
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

export default SearchFeedbacks;
