export const FEEDBACK_CONFIG = [
  {
    key: "course_design",
    title: "Course Design",
    questions: [
      { key: "course_pace", label: "Course pace", type: "3" },
      { key: "course_load", label: "Course load", type: "3" },
      {
        key: "class_organization",
        label: "Classes were structured & well-organized",
        short: "Organization",
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
        short: "Relevance",
        type: "3",
      },
      {
        key: "assignment_instructions",
        label: "Assignment instructions were clearly explained",
        short: "Assignment Clarity",
        type: "5",
      },
      {
        key: "grading_rubrics",
        label: "Grading assignments was fair",
        short: "Grading Rubrics",
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
        short: "Class Management",
        type: "5",
      },
      {
        key: "student_participation",
        label: "Encourages student participation",
        short: "Interaction",
        type: "3",
      },
      {
        key: "in_class_queries",
        label: "Responds to in-class queries adequately",
        short: "Responses",
        type: "5",
      },
      {
        key: "concern_learning",
        label: "Demonstrates concern about student learning",
        short: "Concern",
        type: "5",
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
        short: "Availability",
        type: "3",
      },
      {
        key: "feedback_on_assignments",
        label: "Provides feedback on assignments",
        short: "Feedbacks",
        type: "5",
      },
      {
        key: "inspires_motivation",
        label: "Inspires student interest",
        short: "Inspiration",
        type: "5",
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
      },
      {
        key: "take_another_course",
        label: "Would take another course with this instructor",
        short: "Take More",
        type: "thumb",
      },
      {
        key: "advice_future_gen",
        label:
          "Please share any advice for Future Generations of Students who will take this course ",
        short: "Future Generations",
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

export const FEEDBACK_VALUES_BY_TYPE: Record<number, any> = {
  "5": {
    1: "Strongly\nDisagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly Agree",
  },
  "3": { 1: "Needs Improvement", 2: "Satisfactory", 3: "Excellent" },
  "2": { 0: "Disagree", 1: "Agree" },
};
