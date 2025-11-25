export interface Event {
  id: number;
  title: string;
  time: string;
  date: Date;
}

export type FeedbackPhase = "week1" | "week3" | "midterm" | "week12" | "finals";

export interface FeedbackData {
  rating: number;
  comments: string;
  improvements: string;
  wouldRecommend: boolean;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  deadline: string;
  feedbackPhase: FeedbackPhase;
}

export interface CompletedFeedback extends Course {
  submittedDate: string;
  feedbackData: FeedbackData;
}

export interface CompletedFeedbacks {
  [year: string]: {
    [semester: string]: CompletedFeedback[];
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
}

export const events: Event[] = [
  { id: 1, title: "Team Meeting", time: "10:00 AM", date: new Date() },
  { id: 2, title: "Lunch with John", time: "12:30 PM", date: new Date() },
  {
    id: 3,
    title: "Project Deadline",
    time: "All day",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
  },
];

export // Mock data - ONLY current semester courses that are open for feedback
const pendingFeedbackCourses: Course[] = [
  {
    id: "1",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    section: "A",
    instructor: "Dr. Smith",
    deadline: "2024-12-31",
    feedbackPhase: "finals",
  },
  {
    id: "2",
    courseCode: "MATH201",
    courseName: "Calculus II",
    section: "D",
    instructor: "Prof. Johnson",
    deadline: "2024-12-28",
    feedbackPhase: "finals",
  },
  {
    id: "3",
    courseCode: "ENG202",
    courseName: "Advanced Writing",
    section: "B",
    instructor: "Dr. Wilson",
    deadline: "2024-12-25",
    feedbackPhase: "week12",
  },
];

// Mock data - completed feedbacks organized by year and semester
export const completedFeedbacks: CompletedFeedbacks = {
  "2024": {
    Fall: [
      {
        id: "101",
        courseCode: "PHY150",
        courseName: "Physics Laboratory",
        section: "C",
        instructor: "Dr. Brown",
        submittedDate: "2024-11-15",
        deadline: "2024-11-15",
        feedbackPhase: "week3",
        feedbackData: {
          rating: 4,
          comments: "Great lab sessions with clear instructions.",
          improvements: "More time for experiments would be helpful.",
          wouldRecommend: true,
        },
      },
    ],
    Summer: [
      {
        id: "102",
        courseCode: "CHEM101",
        courseName: "General Chemistry",
        section: "A",
        instructor: "Prof. Davis",
        submittedDate: "2024-08-10",
        deadline: "2024-08-10",
        feedbackPhase: "midterm",
        feedbackData: {
          rating: 3,
          comments: "Challenging but informative course.",
          improvements: "Better lab equipment needed.",
          wouldRecommend: true,
        },
      },
    ],
    Spring: [
      {
        id: "103",
        courseCode: "BIO101",
        courseName: "Biology Fundamentals",
        section: "B",
        instructor: "Dr. Miller",
        submittedDate: "2024-04-20",
        deadline: "2024-04-20",
        feedbackPhase: "week1",
        feedbackData: {
          rating: 5,
          comments: "Excellent introductory course with clear explanations.",
          improvements: "More interactive activities would be beneficial.",
          wouldRecommend: true,
        },
      },
    ],
  },
  "2023": {
    Fall: [
      {
        id: "104",
        courseCode: "PSY101",
        courseName: "Introduction to Psychology",
        section: "D",
        instructor: "Dr. Taylor",
        submittedDate: "2023-12-05",
        deadline: "2023-12-05",
        feedbackPhase: "finals",
        feedbackData: {
          rating: 4,
          comments: "Fascinating subject matter with engaging lectures.",
          improvements: "Better organization of course materials.",
          wouldRecommend: true,
        },
      },
    ],
    Summer: [
      {
        id: "105",
        courseCode: "STAT200",
        courseName: "Statistics",
        section: "C",
        instructor: "Prof. Anderson",
        submittedDate: "2023-07-20",
        deadline: "2023-07-20",
        feedbackPhase: "midterm",
        feedbackData: {
          rating: 3,
          comments: "Challenging concepts but well explained.",
          improvements: "More practical examples needed.",
          wouldRecommend: false,
        },
      },
    ],
    Spring: [
      {
        id: "106",
        courseCode: "ART150",
        courseName: "Art Appreciation",
        section: "A",
        instructor: "Prof. Garcia",
        submittedDate: "2023-04-10",
        deadline: "2023-04-10",
        feedbackPhase: "week12",
        feedbackData: {
          rating: 5,
          comments: "Inspiring course that broadened my perspective.",
          improvements: "None, perfect as is.",
          wouldRecommend: true,
        },
      },
    ],
  },
};

// Mock user data
export const userData = {
  name: "John Doe",
  avatar: "👨‍🎓",
  role: "Student",
  degree: "BSCS",
  year: "Senior",
  feedbacksGiven: 24,
  feedbacksToFill: 3, // New field for pending feedbacks
  joinDate: "September 2022",
  email: "john.doe@university.edu",
  studentId: "STU-2022-001",
  currentSemester: "Fall 2024",
};

// Mock badges data
export const badges: Badge[] = [
  {
    id: "1",
    name: "Feedback Champion",
    description: "Submitted 20+ course feedbacks",
    icon: "🏆",
    color: "#FFD700",
    earned: true,
  },
  {
    id: "2",
    name: "Early Bird",
    description: "Always submits feedback before deadline",
    icon: "🐦",
    color: "#4CAF50",
    earned: true,
  },
  {
    id: "3",
    name: "Detail Oriented",
    description: "Provides comprehensive feedback",
    icon: "🔍",
    color: "#2196F3",
    earned: true,
  },
  {
    id: "4",
    name: "Community Helper",
    description: "Helped improve 10+ courses",
    icon: "🤝",
    color: "#9C27B0",
    earned: false,
  },
  {
    id: "5",
    name: "Quality Contributor",
    description: "Top 10% feedback quality",
    icon: "⭐",
    color: "#FF9800",
    earned: false,
  },
  {
    id: "6",
    name: "Consistent Learner",
    description: "Feedback every semester for 2 years",
    icon: "📚",
    color: "#795548",
    earned: false,
  },
];
