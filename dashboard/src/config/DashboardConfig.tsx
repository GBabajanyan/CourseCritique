import { Button, Progress, Tag } from "antd";
import {
  AnonymousFeedback,
  CourseStats,
  StudentProfile,
} from "../types/dashboardTypes";
// Course table columns
export const courseColumns = [
  {
    title: "Course Code",
    dataIndex: "course_code",
    key: "course_code",
    render: (text: string) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: "Course Name",
    dataIndex: "course_name",
    key: "course_name",
    render: (text: string, record: CourseStats) => (
      <Button
        type="link"
        style={{ color: "#000" }}
        onClick={() => (window.location.href = `/courses/${record.id}`)}
      >
        {text}
      </Button>
    ),
  },
  {
    title: "Instructor",
    dataIndex: "instructor",
    key: "instructor",
  },
  {
    title: "Department",
    dataIndex: "department",
    key: "department",
    // filters: [...new Set(courseStats.map(c => c.department))].map(d => ({ text: d, value: d })),
    onFilter: (value: any, record: CourseStats) => record.department === value,
  },
  {
    title: "Students",
    dataIndex: "total_students",
    key: "total_students",
    sorter: (a: CourseStats, b: CourseStats) =>
      a.total_students - b.total_students,
  },
  {
    title: "Feedbacks",
    dataIndex: "feedback_count",
    key: "feedback_count",
    sorter: (a: CourseStats, b: CourseStats) =>
      a.feedback_count - b.feedback_count,
  },
  {
    title: "Completion",
    dataIndex: "completion_rate",
    key: "completion_rate",
    render: (rate: number) => (
      <Progress percent={rate} size="small" strokeColor="#3b82f6" />
    ),
  },
];

// Student table columns
export const studentColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: StudentProfile, args: any) => (
      <Button
        type="link"
        style={{ color: "#000" }}
        onClick={() => {(window.location.href = `/students/${record.studentId}`)}}
      >
        {text || record.username}
      </Button>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
    filters: [
      { text: "Freshman", value: "Freshman" },
      { text: "Sophomore", value: "Sophomore" },
      { text: "Junior", value: "Junior" },
      { text: "Senior", value: "Senior" },
    ],
    onFilter: (value: any, record: StudentProfile) => record.year === value,
  },
  {
    title: "Department",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "Feedbacks",
    dataIndex: "feedbacks_given",
    key: "feedbacks_given",
    sorter: (a: StudentProfile, b: StudentProfile) =>
      a.feedbacks_given - b.feedbacks_given,
  },
  {
    title: "Joined",
    dataIndex: "join_date",
    key: "join_date",
    render: (date: number) => (
      <span>{new Date(date).toLocaleDateString()}</span>
    ),
  },
];

// Anonymous Feedback columns
export const feedbackColumns = [
  {
    title: "Course",
    dataIndex: "course_code",
    key: "course_code",
    render: (code: string, record: AnonymousFeedback) => (
      <div>
        <Tag color="blue">{code}</Tag>
        <div style={{ fontSize: 12, color: "#666" }}>{record.course_name}</div>
      </div>
    ),
  },
  {
    title: "Phase",
    dataIndex: "feedback_phase",
    key: "feedback_phase",
    render: (phase: string) => {
      const colors: Record<string, string> = {
        week1: "orange",
        week3: "gold",
        midterm: "blue",
        week12: "green",
        finals: "red",
      };
      return <Tag color={colors[phase] || "default"}>{phase}</Tag>;
    },
  },
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    render: (rating: number) => <span>{rating}/5 ⭐</span>,
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
    ellipsis: true,
    render: (text: string) => text || "—",
  },
  {
    title: "Submitted",
    dataIndex: "submitted_at",
    key: "submitted_at",
    sorter: (a: AnonymousFeedback, b: AnonymousFeedback) =>
      new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime(),
  },
];
