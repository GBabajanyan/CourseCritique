import {
  BookOutlined,
  FileTextOutlined,
  MessageOutlined,
  RiseOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../api/client";
import AddStudentModal from "../../components/AddStudentModal";
import {
  courseColumns,
  feedbackColumns,
  studentColumns,
} from "../../config/DashboardConfig";
import { COLORS } from "../../constants/colors";
import {
  AnonymousFeedback,
  CourseStats,
  DashboardStats,
  StudentProfile,
} from "../../types/dashboardTypes";
import "./Dashboard.css";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Mock data for Feedback Trends
const trendData = [
  { month: "Sep", feedbacks: 12, avgRating: 4.2 },
  { month: "Oct", feedbacks: 18, avgRating: 4.4 },
  { month: "Nov", feedbacks: 25, avgRating: 4.5 },
  { month: "Dec", feedbacks: 22, avgRating: 4.3 },
  { month: "Jan", feedbacks: 30, avgRating: 4.6 },
  { month: "Feb", feedbacks: 28, avgRating: 4.4 },
  { month: "Mar", feedbacks: 35, avgRating: 4.7 },
];

// Mock data for Course Completion Rates
const completionData = [
  { name: "CS101", completion: 92 },
  { name: "CS201", completion: 78 },
  { name: "MATH201", completion: 85 },
  { name: "PHY150", completion: 68 },
  { name: "ENG101", completion: 88 },
  { name: "HIST202", completion: 72 },
];

// Mock data for Rating Distribution
const ratingData = [
  { rating: "1 star", count: 8, color: "#ef4444" },
  { rating: "2 stars", count: 12, color: "#f97316" },
  { rating: "3 stars", count: 25, color: "#eab308" },
  { rating: "4 stars", count: 45, color: "#22c55e" },
  { rating: "5 stars", count: 62, color: "#10b981" },
];

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
  // const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);

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

  const reloadStudents = async () => {
    setLoading(true);

    try {
      const studentsRes = await api.get("/dashboard/students");
      setStudents(studentsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredCourses = courseStats.filter((course) => {
    const matchesDepartment =
      selectedDepartment === "all" || course.department === selectedDepartment;
    return matchesDepartment;
  });
  const departments = Array.from(new Set(courseStats.map((c) => c.department)));
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
                  ...departments.map((dept) => ({ key: dept, label: dept })),
                ]}
              />
            }
          >
            <Table
              columns={courseColumns}
              dataSource={filteredCourses}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Students" key="students" icon={<UserOutlined />}>
          <AddStudentModal
            open={addStudentModalOpen}
            closeModal={() => setAddStudentModalOpen(false)}
            postSubmission={reloadStudents}
          />
          <Card
            title="Student Profiles"
            extra={
              <Space>
                <Button
                  onClick={() => setAddStudentModalOpen(true)}
                  type="primary"
                  style={{ backgroundColor: COLORS.NAVY }}
                >
                  Add Student
                </Button>
                <Button type="primary" style={{ backgroundColor: COLORS.NAVY }}>
                  Bulk Add Students
                </Button>
              </Space>
            }
          >
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
            {/* Feedback Trends - Line Chart */}
            <Col span={24}>
              <Card
                title="Feedback Trends (Last 7 Months)"
                extra={
                  <Select
                  defaultActiveFirstOption
                    options={courseStats.map((c) => ({
                      label: c.course_name,
                      value: c.course_code,
                    }))}
                  />
                }
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 5]}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="feedbacks"
                      stroke="#003A5D"
                      name="Feedbacks Submitted"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgRating"
                      stroke="#EEBC03"
                      name="Average Rating"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Course Completion Rates - Bar Chart */}
            <Col span={12}>
              <Card title="Top Courses by Completion Rate">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={completionData}
                    layout="vertical"
                    margin={{ left: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} unit="%" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar
                      dataKey="completion"
                      fill="#003A5D"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Rating Distribution - Pie Chart */}
            <Col span={12}>
              <Card title="Overall Rating Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ratingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                    >
                      {ratingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    {/* <Legend /> */}
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;
