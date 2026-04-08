import { localeDateOptions } from "../constants";
import { Course, FlashListItem } from "../types/Course";
import {
  CompletedFeedbackFromDB,
  CompletedFeedbackListConfigItem,
} from "../types/Feedback";

const configureSemesterByMonthNumber = (n: number) => {
  if (n <= 5) return "Spring";
  if (n <= 9) return "Summer";
  return "Fall";
};

export const processToDate = (fullDate: any) =>
  new Date(fullDate).toLocaleDateString("en-CA", localeDateOptions);

export const generateConfigArrayFromCompletedFeedbacks = (
  data: CompletedFeedbackFromDB[],
) => {
  const grouped = data.reduce((acc, compFeedObjRaw) => {
    const date = new Date(compFeedObjRaw.submittedDate);
    const year = date.getFullYear();
    const semester = configureSemesterByMonthNumber(date.getMonth());

    if (!acc[year]) acc[year] = {};
    if (!acc[year][semester]) acc[year][semester] = [];

    const compFeedObj = {
      ...compFeedObjRaw,
      submittedDate: processToDate(compFeedObjRaw.submittedDate),
      feedbackData: {
        avgRating: 4,
        comments: compFeedObjRaw.feedbackData?.open_feedback,
        improvements: "asdfd",
        wouldRecommend: compFeedObjRaw.feedbackData?.take_another_course,
      },
    };
    acc[year][semester].push(compFeedObj);
    return acc;
  }, {} as CompletedFeedbackListConfigItem);

  return Object.entries(grouped)
    .reverse()
    .map(([year, semesters]) => ({
      title: year,
      data: Object.entries(semesters).map(([semester, items]) => ({
        semester,
        feedbacks: items,
      })),
    }));
};

export const transformCoursesToFlashListConfig = (
  courses: Course[],
  expandedDepartments: Set<string>,
): FlashListItem[] => {
  const groupedByDepartment = courses.reduce(
    (acc, course) => {
      const dept = course.department;
      if (dept === undefined) return acc;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(course);
      return acc;
    },
    {} as Record<string, Course[]>,
  );

  const result: FlashListItem[] = [];

  Object.entries(groupedByDepartment).forEach(
    ([department, departmentCourses]) => {
      result.push({
        type: "header",
        title: department,
        count: departmentCourses.length,
        isCollapsed: expandedDepartments.has(department),
      });
      if (expandedDepartments.has(department)) {
        departmentCourses.forEach((course) => {
          result.push({
            type: "item",
            course: course,
          });
        });
      }
    },
  );

  return result;
};
