import { usePathname, useSegments } from "expo-router";
import { useStore } from "../store/StoreProvider";

export const useActiveTabParams = () => {
  const activeTab = usePathname();
  const segments = useSegments();
  const { feedbackStore, settingsStore } = useStore();

  const { currentFeedbackCourse: selectedCourse } = feedbackStore;
  const { currentSemester, currentYear } = settingsStore;

  let title, subtitle, backButton;

  switch (activeTab) {
    case "/":
      title = "Course Critique";
      subtitle = "";
      break;
    case "/profile":
      title = "Profile";
      subtitle = "";
      break;
    case "/feedback/Pending":
      title = "Give Feedback";
      subtitle = `${currentSemester} Semester ${currentYear}`;
      break;
    case "/feedback/Completed":
      title = "Completed Feedbacks";
      subtitle = `${currentSemester} Semester ${currentYear}`;
      break;
    case "/feedback/Search":
      title = "Search Feedback";
      subtitle = `${currentSemester} Semester ${currentYear}`;
      break;
    case "/feedback/Pending/FeedbackForm":
      if (selectedCourse === null) {
        title = "Give Feedback";
        break;
      }
      const { courseName, courseCode } = selectedCourse;
      title = "Give Feedback";
      subtitle = `${courseCode} | ${courseName}`;
      break;
    case "/profile/allBadges":
      title = "All Badges";
      backButton = true;
      break;
    case "/profile/settings":
      title = "Settings";
      backButton = true;
      break;
    case "/profile/settings/Edit":
      title = "Edit Profile";
      backButton = true;
      break;
    case "/profile/settings/About":
      title = "About";
      backButton = true;
      break;
    case "/profile/settings/Help":
      title = "Help Center";
      backButton = true;
    default:
      title = "Course Critique";
      subtitle = "";
      break;
  }

  const parentRouteName = backButton
    ? segments[segments.length - 2]
    : undefined;

  return { title, subtitle, parentRouteName };
};
