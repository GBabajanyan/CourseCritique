import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import { AxiosInstance } from "axios";
import { Course } from "../types/Course";
import { Rating3, Rating5, Thumb } from "../types/Feedback";
import { completedFeedbacks } from "../mock";

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

export type FeedbackRatings = {
  course_pace: Rating5;
  course_load: Rating5;
  class_organization: Rating5;

  course_materials: Rating5;
  assignment_instructions: Rating5;
  grading_rubrics: Rating5;

  class_management: Rating5;
  student_participation: Rating5;
  in_class_queries: Rating5;
  concern_learning: Rating5;

  availability: Rating3;
  feedback_on_assignments: Rating3;
  inspires_motivation: Rating3;

  substantial_learning: Thumb;
  take_another_course: Thumb;

  open_feedback: string | undefined;
};

class FeedbackStore {
  rootStore: RootStore;
  api: AxiosInstance;

  pendingCourses: Course[] = [];
  selectedCourse: Course | null = null;
  currentFeedBack: Feedback | null;
  ratings: FeedbackRatings | null = null;
  completedFeedbacks: (typeof completedFeedbacks)[] = [];
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
        course_pace: undefined,
        course_load: undefined,
        class_organization: undefined,
        course_materials: undefined,
        assignment_instructions: undefined,
        grading_rubrics: undefined,
        class_management: undefined,
        student_participation: undefined,
        in_class_queries: undefined,
        concern_learning: undefined,
        availability: undefined,
        feedback_on_assignments: undefined,
        inspires_motivation: undefined,
        substantial_learning: undefined,
        take_another_course: undefined,
        open_feedback: undefined,
      };
    });
  };

  loadPendingCourses = async (): Promise<void> => {
    this.isLoading = true;

    try {
      const { data } = await this.rootStore.apiClient.instance.get(
        `http://localhost:8000/feedback/pending`,
      );
      console.log(data);

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
      const { data } = await this.rootStore.apiClient.instance.get(
        `http://localhost:8000/feedback/pending`,
      );
      console.log(data);

      // Mock data
      this.completedFeedbacks = [...completedFeedbacks];
    } catch (error) {
      console.error("Load completed feedbacks error:", error);
    } finally {
      this.isLoading = false;
    }
  };

  // Submit new feedback
  submitFeedback = async (feedbackData: FeedbackRatings): Promise<boolean> => {
    this.isLoading = true;

    try {
      const feedbackJson = JSON.stringify(feedbackData);
      await this.rootStore.apiClient.instance.post(`http://localhost:8000/feedback/submit`, {
        ratings: feedbackJson,
        courseId: this.selectedCourse?.id,
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
