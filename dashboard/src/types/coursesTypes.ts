import { Distribution } from "./charts";

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  instructor: string;
  credits: number;
  department: string;
  total_students: number;
  feedback_completed: number;
  pending_feedbacks?: number;
  description?: string;
  ratingStats: {
    sections: {
      course_design: sectionStatistic & {
        questions: Record<string, sectionStatistic>;
      };
      materials: sectionStatistic & {
        questions: Record<string, sectionStatistic>;
      };
      engagement: sectionStatistic & {
        questions: Record<string, sectionStatistic>;
      };
      support: sectionStatistic & {
        questions: Record<string, sectionStatistic>;
      };
      outcomes: sectionStatistic & {
        questions: Record<string, sectionStatistic>;
      };
    };
    overall: { count: number; score: number };
  };
  open_feedbacks: {
    advice_future_gen: string[];
    strengths: string[];
    improvements: string[];
  };
}

export interface sectionStatistic {
  count: number;
  CCScore: number;
  mean: number;
  variance: number;
}

interface TabsData {
  key: string;
  label: string;
  short?: string;
  tabData: any;
}
export interface StatTabData extends TabsData {
  type: string;
  tabData: {
    stats: sectionStatistic;
    distribution?: Distribution;
  };
}
export interface TextsTabData extends TabsData {
  type: string;
  tabData: {
    data: string[];
  };
}
export interface CollapseRenderData {
  type: string;
  key: string;
  label: string;
  short?: string;
  tabData: {
    stats: sectionStatistic;
    data: string[];
  };
}

export interface ColumnConfig {
  key: string;
  title: string;
  className?: string;
  render: (
    value: any,
    record?: Course,
    onView?: (id: string) => void,
  ) => React.ReactNode;
}

export interface Student {
  studentId: string;
  name: string;
  email: string;
  year: string;
  enrolled_at: string;
}

export interface FeedbackPhase {
  phase: string;
  deadline: any;
  startDate: any;
}
