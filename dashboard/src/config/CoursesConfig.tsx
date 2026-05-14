import React from "react";
import { Space, Tag, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { ColumnType } from "antd/es/table";
import { Course, Student } from "../types/coursesTypes";

export const coursesColumns: ColumnType<Course>[] = [
  {
    title: "Course Code",
    dataIndex: "course_code",
    key: "course_code",
    render: (text: string, record: Course) => (
      <Button
        type="link"
        onClick={() => (window.location.href = `/courses/${record.id}`)}
      >
        {text}
      </Button>
    ),
  },
  {
    title: "Course Name",
    dataIndex: "course_name",
    key: "course_name",
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
    render: (text: string) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: "Credits",
    dataIndex: "credits",
    key: "credits",
    align: "center",
  },
  {
    title: "Students",
    dataIndex: "total_students",
    key: "total_students",
    align: "center",
    render: (val: number) => val || 0,
  },
  {
    title: "Feedbacks",
    key: "feedbacks",
    align: "center",
    render: (_: any, record: Course) => (
      <Space>
        <span className="feedback-count">{record.feedback_completed || 0}</span>
        {/* <span className="pending-count">
          ({record.pending_feedbacks || 0} pending)
        </span> */}
      </Space>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    render: (_: any, record: Course) => (
      <Button
        type="link"
        icon={<EyeOutlined />}
        onClick={() => (window.location.href = `/courses/${record.id}`)}
      >
        View
      </Button>
    ),
  },
];

export const studentColumns: ColumnType<Student>[] = [
  {
    title: "Student ID",
    dataIndex: "studentId",
    key: "studentId",
    render: (text: string, record: Student) => (
      <Button
        type="link"
        onClick={() => (window.location.href = `/students/${record.studentId}`)}
      >
        {text}
      </Button>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: Student) => (
      <Button
        type="link"
        style={{ color: "#000" }}
        onClick={() => (window.location.href = `/students/${record.studentId}`)}
      >
        {text}
      </Button>
    ),
  },
  { title: "Email", dataIndex: "email", key: "email" },
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
    render: (year: string) => <Tag color="blue">{year}</Tag>,
  },
  { title: "Enrolled Date", dataIndex: "enrolled_at", key: "enrolled_at" },
];
