import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tabs,
  Statistic,
  Select,
  DatePicker,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  MessageOutlined,
  StarOutlined,
  RiseOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import api from "../../api/client";
import "./Dashboard.css";
import {
  AnonymousFeedback,
  CourseStats,
  DashboardStats,
  StudentProfile,
} from "../../types/dashboardTypes";
import {
  courseColumns,
  feedbackColumns,
  studentColumns,
} from "../../config/DashboardConfig";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalFeedbacks: 0,
    avgRating: 0,
    completionRate: 0,
    activeUsers: 0,
  });
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [feedbacks, setFeedbacks] = useState<AnonymousFeedback[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [statsRes, coursesRes, studentsRes, feedbacksRes] =
        await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/courses/stats"),
          api.get("/dashboard/students"),
          api.get("/dashboard/feedbacks/anonymous"),
        ]);

      setStats(statsRes.data);
      setCourseStats(coursesRes.data);
      setStudents(studentsRes.data);
      setFeedbacks(feedbacksRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#3b82f6" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Feedbacks"
              value={stats.totalFeedbacks}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for different views */}
      <Tabs defaultActiveKey="courses" className="dashboard-tabs">
        <TabPane tab="Courses" key="courses" icon={<BookOutlined />}>
          <Card
            title="Course Statistics"
            extra={
              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={setSelectedDepartment}
                options={[
                  { value: "all", label: "All Departments" },
                  { value: "CS", label: "Computer Science" },
                  { value: "MATH", label: "Mathematics" },
                  { value: "PHY", label: "Physics" },
                ]}
              />
            }
          >
            <Table
              columns={courseColumns}
              dataSource={courseStats}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Students" key="students" icon={<UserOutlined />}>
          <Card title="Student Profiles">
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab="Anonymous Feedback"
          key="feedback"
          icon={<FileTextOutlined />}
        >
          <Card
            title="Recent Feedback"
            extra={
              <RangePicker
                onChange={(dates) => setDateRange(dates as [any, any])}
              />
            }
          >
            <Table
              columns={feedbackColumns}
              dataSource={feedbacks}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Analytics" key="analytics" icon={<RiseOutlined />}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Feedback Trends">
                <div
                  style={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p>Chart placeholder - Feedback trends over time</p>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Course Completion Rates">
                <div
                  style={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p>Chart placeholder - Top courses by completion</p>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Rating Distribution">
                <div
                  style={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p>Chart placeholder - Rating distribution</p>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;
