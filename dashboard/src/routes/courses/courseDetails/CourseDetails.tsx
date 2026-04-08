import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Tag,
  message,
  Modal,
  Form,
  Select,
  DatePicker,
  Divider,
  Flex,
} from "antd";
import {
  ApartmentOutlined,
  BookOutlined,
  CreditCardOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./CourseDetails.css";
import client from "../../../api/client";
import { Course, FeedbackPhase, Student } from "../../../types/coursesTypes";

const { Option } = Select;

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, studentsRes] = await Promise.all([
        client.get(`/courses/${id}`),
        client.get(`/courses/${id}/students`),
      ]);

      setCourse(courseRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      message.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeedbackPeriod = async ({
    phase,
    deadline,
    startDate,
  }: FeedbackPhase) => {
    try {
      const feedbackPhaseDetails = {
        phase: phase,
        deadline: deadline.format("YYYY-MM-DD"),
        startDate: startDate.format("YYYY-MM-DD"),
      };

      const response = await client.post(
        `/courses/${id}/feedback-periods-create`,
        feedbackPhaseDetails,
      );
      const {
        message: resultmsg,
        feedback_completed,
        pending_feedbacks,
      } = response.data;
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              feedback_completed: feedback_completed,
              pending_feedbacks: pending_feedbacks,
            }
          : prev,
      );
      message.success(resultmsg);
      setModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      console.error(
        "handleAddFeedbackPeriod error:",
        error.response?.data || error,
      );
      message.error(
        "Failed to add feedback period. Try again later or contact Support",
      );
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const studentColumns = [
    { title: "Student ID", dataIndex: "studentId", key: "studentId" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      render: (year: string) => <Tag color="blue">{year}</Tag>,
    },
    { title: "Enrolled Date", dataIndex: "enrolled_at", key: "enrolled_at" },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="course-details">
      {/* Course Info Card */}
      <Card title="Course Information" style={{ marginBottom: 24 }}>
        <div className="course-header">
          <div className="course-code-badge">{course?.course_code}</div>
          <h1 className="course-title">{course?.course_name}</h1>
        </div>

        <div className="course-stats-row">
          <div className="stat-item">
            <UserOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Instructor</div>
              <div className="stat-value">{course?.instructor}</div>
            </div>
          </div>
          <div className="stat-item">
            <ApartmentOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Department</div>
              <div className="stat-value">{course?.department}</div>
            </div>
          </div>
          <div className="stat-item">
            <CreditCardOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Credits</div>
              <div className="stat-value">{course?.credits}</div>
            </div>
          </div>
          <div className="stat-item">
            <BookOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Total Students</div>
              <div className="stat-value">{course?.total_students || 0}</div>
            </div>
          </div>
        </div>
        <Divider />
        {course?.description && (
          <div className="course-description">
            <h3>Description</h3>
            <p>{course?.description}</p>
            <Divider />
          </div>
        )}

        <div className="feedback-stats">
          <div className="feedback-stat completed">
            <span className="stat-number">
              {course?.feedback_completed || 0}
            </span>
            <span className="stat-text">Feedbacks Completed</span>
          </div>
          <div className="feedback-stat pending">
            <span className="stat-number">
              {course?.pending_feedbacks || 0}
            </span>
            <span className="stat-text">Pending Feedbacks</span>
          </div>
        </div>
      </Card>

      {/* Add Feedback Period Button */}
      <div style={{ marginBottom: 24, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Feedback Period
        </Button>
      </div>

      {/* Enrolled Students Table */}
      <Card title={`Enrolled Students (${students.length})`}>
        <Table
          columns={studentColumns}
          dataSource={students}
          rowKey="studentId"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal for adding feedback period */}
      <Modal
        title="Add Feedback Period"
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddFeedbackPeriod}>
          <Form.Item
            name="phase"
            label="Feedback Phase"
            rules={[
              { required: true, message: "Please select a feedback phase" },
            ]}
          >
            <Select placeholder="Select phase">
              <Option value="addDrop">Add/drop period</Option>
              <Option value="midterm">Midterm</Option>
              <Option value="finals">Finals</Option>
            </Select>
          </Form.Item>
          <div className="FeedbackPhaseDates">
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[
                { required: true, message: "Please select a start date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[
                { required: true, message: "Please select a deadline" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return !value || getFieldValue("startDate") <= value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Deadline cannot be before the start date"),
                        );
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>
            Create Feedback Period
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseDetails;
