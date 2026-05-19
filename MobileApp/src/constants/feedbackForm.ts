import { form_config_step } from "../types/Feedback";

export const FORM_CONFIG: form_config_step[] = [
  {
    key: "course_design",
    title: "Course Design",
    questions: [
      { key: "course_pace", label: "Course pace", type: "3", required: true },
      { key: "course_load", label: "Course load", type: "3", required: true },
      {
        key: "class_organization",
        label: "Classes were structured & well-organized",
        type: "3",
        required: true,
      },
    ],
  },
  {
    key: "materials",
    title: "Materials & Assignments",
    questions: [
      {
        key: "course_materials",
        label: "Materials were relevant to course objectives",
        type: "3",
        required: true,
      },
      {
        key: "assignment_instructions",
        label: "Assignment instructions were clearly explained",
        type: "5",
        required: true,
      },
      {
        key: "grading_rubrics",
        label: "Grading assignments was fair",
        type: "3",
        required: true,
      },
    ],
  },
  {
    key: "engagement",
    title: "Instructor Engagement",
    questions: [
      {
        key: "class_management",
        label: "Manages class effectively",
        type: "5",
        required: true,
      },
      {
        key: "student_participation",
        label: "Encourages student participation",
        type: "3",
        required: true,
      },
      {
        key: "in_class_queries",
        label: "Responds to in-class queries adequately",
        type: "5",
        required: true,
      },
      {
        key: "concern_learning",
        label: "Demonstrates concern about student learning",
        type: "5",
        required: true,
      },
    ],
  },
  {
    key: "support",
    title: "Instructor Support",
    questions: [
      {
        key: "availability",
        label: "Available outside class",
        type: "3",
        required: true,
      },
      {
        key: "feedback_on_assignments",
        label: "Provides feedback on assignments",
        type: "5",
        required: true,
      },
      {
        key: "inspires_motivation",
        label: "Inspires student interest",
        type: "5",
        required: true,
      },
    ],
  },
  {
    key: "outcomes",
    title: "Learning Outcomes",
    questions: [
      {
        key: "substantial_learning",
        label: "Course resulted in substantial learning",
        short: "New Knowledge",
        type: "thumb",
        required: true,
      },
      {
        key: "take_another_course",
        label: "Would take another course with this instructor",
        short: "Take More",
        type: "thumb",
        required: true,
      },
      {
        key: "advice_future_gen",
        label:
          "Please share any advice for Future Generations of Students who will take this course ",
        short: "Advice for Future Generations",
        type: "text",
      },
      {
        key: "strengths",
        label: "Mention Strong sides of the course You managed to experience",
        short: "Strengths",
        type: "text",
      },
      {
        key: "improvements",
        label: "Any Improvements you would like to see about this course",
        short: "Improvements",
        type: "text",
      },
    ],
  },
];

export const FEEDBACK_VALUES_BY_TYPE = {
  "5": {
    1: "Strongly Disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree",
  },
  "3": { 1: "Needs Improvement", 2: "Satisfactory", 3: "Excellent" },
  thumb: { 0: "Disagree", 1: "Agree" },
};
