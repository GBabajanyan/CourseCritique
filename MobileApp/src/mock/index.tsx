import { Course } from "../types/Course";
import { SemesterType } from "../types/User";
export interface EventType {
  id: number;
  title: string;
  time: string;
  date?: Date;
}

type userDataType = {
  name: string;
  avatar: string;
  role: string;
  degree: string;
  year: "Senior" | "Junior" | "Somphomore" | "Freshman";
  feedbacksGiven: number;
  feedbacksToFill: number;
  email: string;
  studentId: string;
  currentSemester: `${SemesterType} ${string}`;
};

export const events: EventType[] = [
  { id: 1, title: "Team Meeting", time: "10:00 AM", date: new Date() },
  { id: 2, title: "Lunch with John", time: "12:30 PM", date: new Date() },
  {
    id: 3,
    title: "Project Deadline",
    time: "All day",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
  },
];

export const pendingFeedbackCourses: Course[] = [
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
  {
    id: "4",
    courseCode: "ENG202",
    courseName: "Advanced Writing",
    section: "B",
    instructor: "Dr. Wilson",
    deadline: "2024-12-25",
    feedbackPhase: "week12",
  },
];

// Mock data - completed feedbacks organized by year and semester
export const completedFeedbacks = {
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
        feedbackPhase: "addDrop",
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
        feedbackPhase: "finals",
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
export const userData: userDataType = {
  name: "John Doe",
  avatar:
    "https://static.vecteezy.com/system/resources/thumbnails/038/252/103/small/ai-generated-asian-male-student-smiling-happily-on-transparent-background-study-success-concept-png.png",
  role: "Student",
  degree: "BSCS",
  year: "Senior",
  feedbacksGiven: 24,
  feedbacksToFill: 3, // New field for pending feedbacks
  email: "john.doe@university.edu",
  studentId: "STU-2022-001",
  currentSemester: "Fall 2024",
};

// Current semester info
export const currentYear: string = "2026";
export const currentSemester: string = "Fall";
