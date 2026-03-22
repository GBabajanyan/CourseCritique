import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  deadline: string;
  feedbackPhase: string;
}

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

class FeedbackStore {
  pendingCourses: Course[] = [];
  completedFeedbacks: Feedback[] = [];
  isLoading: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
  }

  // Load pending courses (feedbacks to fill)
  loadPendingCourses = async (): Promise<void> => {
    this.isLoading = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - in real app, this would come from API
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
      this.pendingCourses = this.pendingCourses.filter(
        (c) => c.id !== course.id,
      );

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
