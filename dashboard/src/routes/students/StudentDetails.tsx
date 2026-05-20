import {
  ArrowLeftOutlined,
  CalendarOutlined,
  IdcardOutlined,
  MailOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Descriptions, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";
import { EnrolledCourse, Student } from "../../types/studentPageTypes";
import "./studentDetails.css";

const StudentDetails: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const [studentRes, coursesRes] = await Promise.all([
        api.get(`/dashboard/students/${studentId}`),
        api.get(`/dashboard/students/${studentId}/courses`),
      ]);

    console.log(coursesRes.data);
    
      setStudent(studentRes.data);
      setEnrolledCourses(coursesRes.data);
    } catch (error) {
      console.error("fetchStudentData error:", error);
      message.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const courseColumns = [
    {
      title: "Course Code",
      dataIndex: "course_code",
      key: "course_code",
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
      render: (text: string, record: EnrolledCourse) => (
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
      title: "Section",
      dataIndex: "section",
      key: "section",
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
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      render: (semester: string) => {
        const colors: Record<string, string> = {
          Spring: "green",
          Summer: "gold",
          Fall: "orange",
        };
        return <Tag color={colors[semester] || "default"}>{semester}</Tag>;
      },
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 80,
    },
  ];

  if (loading) return <div className="loading">Loading...</div>;
  if (!student) return <div className="error">Student not found</div>;

  return (
    <div className="student-details">
      {/* Header with back button */}
      <div className="details-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/students")}
          className="back-btn"
        >
          Back to Students
        </Button>
      </div>

      {/* Student Profile Card */}
      <Card className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <UserOutlined style={{ fontSize: 40, color: "#fff" }} />
          </div>
          <div className="profile-info">
            <h1 className="student-name">{student.name}</h1>
            <div className="student-badges">
              <Tag color="blue">{student.year}</Tag>
              <Tag color="purple">{student.degree}</Tag>
            </div>
          </div>
        </div>

        <Descriptions column={2}>
          <Descriptions.Item
            label={
              <span className="descriptions-label">
                <IdcardOutlined /> Student ID
              </span>
            }
          >
            {student.studentId}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span className="descriptions-label">
                <MailOutlined /> Email
              </span>
            }
          >
            {student.email}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span className="descriptions-label">
                <CalendarOutlined /> Joined
              </span>
            }
          >
            {student.join_date}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span className="descriptions-label">
                <StarOutlined /> Year
              </span>
            }
          >
            {student.year}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Enrolled Courses Table */}
      <Card
        title={`Enrolled Courses (${enrolledCourses.length})`}
        className="content-card"
      >
        <Table
          columns={courseColumns}
          dataSource={enrolledCourses}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default StudentDetails;
