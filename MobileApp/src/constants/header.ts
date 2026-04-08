import { currentSemester, currentYear } from "../mock";

export  const headerParams={
    "/": { title: "Course Critique", subtitle: "" },
        "/profile": { title: "Profile", subtitle: "" },
        "/feedback/Pending": {
            title: "Give Feedback",
            subtitle: `${currentSemester} Semester ${currentYear}`,
          },
        "/feedback/Completed": {
            title: "Completed Feedbacks",
            subtitle: `${currentSemester} Semester ${currentYear}`,
          },
        "/feedback/Search": {
            title: "Search Feedback",
            subtitle: `${currentSemester} Semester ${currentYear}`,
          },
        "/feedback/Pending/FeedbackForm": 
          const { courseName, courseCode } = selectedCourse,
          return {
            title: "Give Feedback",
            subtitle: `${courseCode} | ${courseName}`,
          },
          "/feedback/Pending/FeedbackForm/noCourse":{
              title: "Give Feedback",
            },
        "/profile/allBadges": {
            title: "All Badges",
            backButton: true,
          },
        "/profile/settings": {
            title: "Settings",
            backButton: true,
          },
        "/profile/settings/Edit": {
            title: "Edit Profile",
            backButton: true,
          },
        "/profile/settings/About": {
            title: "About",
            backButton: true,
          },
        "/profile/settings/Help": {
            title: "Help Center",
            backButton: true,
          },
        "default":
           { title: "Course Critique", subtitle: "" },
      }
}