import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import ApiClient from "../api/client";
import { AxiosInstance } from "axios";
import { Course } from "../types/Course";

export interface Feedback {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  submittedDate: string;
  feedbackPhase: string;
  rating: number;
  understanding: number;
  engagement: number;
  organization: number;
  comments: string;
  strengths: string;
  improvements: string;
  wouldRecommend: boolean;
}

interface FeedbackRatings {
  course_pace: number;
  course_load: number;
  course_materials: number;
  assignment_instructions: number;
  grading_rubrics: number;
  substantial_learning: number;
  class_management: number;
  student_participation: number;
  in_class_queries: number;
  concern_learning: number;
  availability: number;
  feedback_on_assignments: number;
  class_organization: number;
  inspires_motivation: number;
  take_another_course: number;
  open_feedback: string;
}

class FeedbackStore {
  rootStore: RootStore;
  api: AxiosInstance;

  pendingCourses: Course[] = [];
  selectedCourse: Course | null = null;
  currentFeedBack: Feedback | null;
  ratings: FeedbackRatings | null = null;
  completedFeedbacks: Feedback[] = [];
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.api = rootStore.apiClient.instance;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setSelectedCourse = (course: Course | null) => {
    runInAction(() => {
      this.selectedCourse = course;
      this.ratings = {
        course_pace: 0,
        course_load: 0,
        course_materials: 0,
        assignment_instructions: 0,
        grading_rubrics: 0,
        substantial_learning: 0,
        class_management: 0,
        student_participation: 0,
        in_class_queries: 0,
        concern_learning: 0,
        availability: 0,
        feedback_on_assignments: 0,
        class_organization: 0,
        inspires_motivation: 0,
        take_another_course: 0,
        open_feedback: "",
      };
    });
  };

  loadPendingCourses = async (): Promise<void> => {
    this.isLoading = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const a = await this.rootStore.apiClient.instance.get(
        `http://localhost:8000/feedback/pending`,
      );

      console.log("TODO: BIND DB DATA WITH FRONT");

      runInAction(() => {
        this.pendingCourses = [
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
        ];
      });
    } catch (error) {
      console.error("Load pending courses error:", error);
    } finally {
      this.isLoading = false;
    }
  };

  // Load completed feedbacks
  loadCompletedFeedbacks = async (): Promise<void> => {
    this.isLoading = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      this.completedFeedbacks = [
        {
          id: "101",
          courseId: "1",
          courseCode: "ENG101",
          courseName: "English Composition",
          section: "B",
          instructor: "Prof. Davis",
          submittedDate: "2024-11-15",
          feedbackPhase: "week3",
          rating: 4,
          understanding: 4,
          engagement: 3,
          organization: 5,
          comments: "Great course with engaging content.",
          strengths: "Knowledgeable instructor",
          improvements: "More practical examples",
          wouldRecommend: true,
        },
      ];
    } catch (error) {
      console.error("Load completed feedbacks error:", error);
    } finally {
      this.isLoading = false;
    }
  };

  // Submit new feedback
  submitFeedback = async (
    course: Course,
    feedbackData: Omit<
      Feedback,
      | "id"
      | "courseId"
      | "courseCode"
      | "courseName"
      | "section"
      | "instructor"
      | "submittedDate"
    >,
  ): Promise<boolean> => {
    this.isLoading = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create new feedback
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        courseId: course.id,
        courseCode: course.courseCode,
        courseName: course.courseName,
        section: course.section,
        instructor: course.instructor,
        submittedDate: new Date().toISOString().split("T")[0],
        ...feedbackData,
      };

      // Add to completed feedbacks
      this.completedFeedbacks.unshift(newFeedback);

      // Remove from pending courses
      runInAction(() => {
        this.pendingCourses = this.pendingCourses.filter(
          (c) => c.id !== course.id,
        );
      });

      return true;
    } catch (error) {
      console.error("Submit feedback error:", error);
      return false;
    } finally {
      this.isLoading = false;
    }
  };

  // Get pending courses count
  get pendingCount(): number {
    return this.pendingCourses.length;
  }

  // Get completed feedbacks count
  get completedCount(): number {
    return this.completedFeedbacks.length;
  }
}

export default FeedbackStore;
