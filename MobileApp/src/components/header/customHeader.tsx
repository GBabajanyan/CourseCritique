import {
  currentSemester,
  currentYear,
} from "@/src/mock";
import { useStore } from "@/src/store/StoreProvider";
import { Course } from "@/src/types/Course";
import { usePathname, useRouter, useSegments } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getHeaderParams = (pathname: string, selectedCourse?: Course) => {
  switch (pathname) {
    case "/":
      return { title: "Course Critique", subtitle: "" };
    case "/profile":
      return { title: "Profile", subtitle: "" };
    case "/feedback/Pending":
      return {
        title: "Give Feedback",
        subtitle: `${currentSemester} Semester ${currentYear}`,
      };
    case "/feedback/Completed":
      return {
        title: "Completed Feedbacks",
        subtitle: `${currentSemester} Semester ${currentYear}`,
      };
    case "/feedback/Search":
      return {
        title: "Search Feedback",
        subtitle: `${currentSemester} Semester ${currentYear}`,
      };
    case "/feedback/Pending/FeedbackForm":
      if (!selectedCourse)
        return {
          title: "Give Feedback",
        };

      const { courseName, courseCode } = selectedCourse;
      return {
        title: "Give Feedback",
        subtitle: `${courseCode} | ${courseName}`,
      };
    case "/profile/allBadges":
      return {
        title: "All Badges",
        backButton: true,
      };
    case "/profile/settings":
      return {
        title: "Settings",
        backButton: true,
      };
    case "/profile/settings/Edit":
      return {
        title: "Edit Profile",
        backButton: true,
      };
    case "/profile/settings/About":
      return {
        title: "About",
        backButton: true,
      };
    case "/profile/settings/Help":
      return {
        title: "Help Center",
        backButton: true,
      };
    default:
      return { title: "Course Critique", subtitle: "" };
  }
};
const CustomHeader = () => {
  const router = useRouter();
  const activeTab = usePathname();
  const segments = useSegments();
  const parentRouteName = segments[segments.length - 2];

  const { feedbackStore } = useStore();
  const { selectedCourse } = feedbackStore;

  const { title, subtitle, backButton } = getHeaderParams(
    activeTab,
    selectedCourse,
  );

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <SafeAreaView style={styles.header} edges={["top"]}>
      {backButton && (
        <Pressable style={styles.goBackButton} onPress={goBack}>
          <Text
            style={styles.goBackText}
          >{`< ${parentRouteName || "Back"}`}</Text>
        </Pressable>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    justifyContent: "center",
  },
  goBackButton: {
    flex: 0,
    position: "absolute",
    left: 10,
    bottom: "50%",
  },
  goBackText: {
    fontSize: 18,
    color: "#007AFF",
    textTransform: "capitalize",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    position: "relative",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
});

export default CustomHeader;
