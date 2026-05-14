export const ratingMaxValues = {
  course_pace: 3,
  course_load: 3,
  class_organization: 3,

  course_materials: 3,
  assignment_instructions: 5,
  grading_rubrics: 3,

  class_management: 5,
  student_participation: 3,
  in_class_queries: 5,
  concern_learning: 5,

  availability: 3,
  feedback_on_assignments: 5,
  inspires_motivation: 5,

  substantial_learning: 1,
  take_another_course: 1,
};

export const FORM_CONFIG = {
  course_design: ["course_pace", "course_load", "class_organization"],
  materials: ["course_materials", "assignment_instructions", "grading_rubrics"],
  engagement: [
    "class_management",
    "student_participation",
    "in_class_queries",
    "concern_learning",
  ],
  support: ["availability", "feedback_on_assignments", "inspires_motivation"],
  outcomes: ["substantial_learning", "take_another_course"],
};
