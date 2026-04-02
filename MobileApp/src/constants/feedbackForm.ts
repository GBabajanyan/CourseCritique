export const FORM_CONFIG = [
  {
    key: "course_structure",
    title: "Course Structure",
    questions: [
      { key: "course_pace", label: "Course pace was appropriate", type: "3" },
      { key: "course_load", label: "Course load was adequate", type: "5" },
      {
        key: "class_organization",
        label: "Classes were structured & well-organized",
        type: "3",
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
      },
      {
        key: "assignment_instructions",
        label: "Assignment instructions were clearly explained",
        type: "5",
      },
      {
        key: "grading_rubrics",
        label: "Grading rubrics were comprehensive",
        type: "3",
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
      },
      {
        key: "student_participation",
        label: "Encourages student participation",
        type: "3",
      },
      {
        key: "in_class_queries",
        label: "Responds to in-class queries adequately",
        type: "5",
      },
      {
        key: "concern_learning",
        label: "Demonstrates concern about student learning",
        type: "5",
      },
    ],
  },
  {
    key: "support",
    title: "Instructor Support",
    questions: [
      { key: "availability", label: "Available outside class", type: "3" },
      {
        key: "feedback_on_assignments",
        label: "Provides feedback on assignments",
        type: "5",
      },
      {
        key: "inspires_motivation",
        label: "Inspires student interest",
        type: "5",
      },
    ],
  },
  {
    key: "overall",
    title: "Overall Satisfaction",
    questions: [
      {
        key: "substantial_learning",
        label: "Course resulted in substantial learning",
        type: "thumb",
      },
      {
        key: "take_another_course",
        label: "Would take another course with this instructor",
        type: "thumb",
      },  {
        key: "open_feedback",
        label: "Please share any additional feedback or suggestions for improvement.",
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
