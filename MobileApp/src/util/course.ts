import { Course, FlashListItem } from "../types/Course";
import {
  CompletedFeedbackFromDB,
  CompletedFeedbackListConfigItem,
} from "../types/Feedback";
import { processToDate, semesterByMonthNumber } from "./general";

export const generateConfigArrayFromCompletedFeedbacks = (
  data: CompletedFeedbackFromDB[],
) => {
  const grouped = data.reduce((acc, compFeedObjRaw) => {
    const date = new Date(compFeedObjRaw.submittedDate);
    const year = date.getFullYear();
    const semester = semesterByMonthNumber(date.getMonth());

    if (!acc[year]) acc[year] = {};
    if (!acc[year][semester]) acc[year][semester] = [];

    const compFeedObj = {
      ...compFeedObjRaw,
      submittedDate: processToDate(compFeedObjRaw.submittedDate),
      feedbackData: {
        advice_future_gen: compFeedObjRaw.feedbackData?.advice_future_gen,
        strengths: compFeedObjRaw.feedbackData?.strengths,
        improvements: compFeedObjRaw.feedbackData?.improvements,
        take_another_course: compFeedObjRaw.feedbackData?.take_another_course,
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

export const isLowerLevel = (courseCode: string): boolean => {
  return /^[A-Z]+1\d{2}$/.test(courseCode); // e.g., CS101, MATH120, CHSS134
};

export const isUpperLevel = (courseCode: string): boolean => {
  return /^[A-Z]+[23]\d{2}$/.test(courseCode); // e.g., CS201, MATH310, CSE215
};
