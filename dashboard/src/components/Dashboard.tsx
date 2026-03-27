import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Tag, Progress, Tabs, Statistic, Select, DatePicker } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  MessageOutlined,
  StarOutlined,
  TrophyOutlined,
  RiseOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import api from '../api/client';
import './Dashboard.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalFeedbacks: number;
  avgRating: number;
  completionRate: number;
  activeUsers: number;
}

interface CourseStats {
  id: string;
  course_code: string;
  course_name: string;
  instructor: string;
  department: string;
  total_students: number;
  feedback_count: number;
  avg_rating: number;
  completion_rate: number;
}

interface StudentProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  year: string;
  department: string;
  feedbacks_given: number;
  badges_earned: number;
  join_date: string;
}

interface AnonymousFeedback {
  id: string;
  course_code: string;
  course_name: string;
  feedback_phase: string;
  rating: number;
  comments: string;
  submitted_at: string;
}

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
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [statsRes, coursesRes, studentsRes, feedbacksRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/courses/stats'),
        api.get('/dashboard/students'),
        api.get('/dashboard/feedbacks/anonymous')
      ]);

      setStats(statsRes.data);
      setCourseStats(coursesRes.data);
      setStudents(studentsRes.data);
      setFeedbacks(feedbacksRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Course table columns
  const courseColumns = [
    {
      title: 'Course Code',
      dataIndex: 'course_code',
      key: 'course_code',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      // filters: [...new Set(courseStats.map(c => c.department))].map(d => ({ text: d, value: d })),
      onFilter: (value: any, record: CourseStats) => record.department === value,
    },
    {
      title: 'Students',
      dataIndex: 'total_students',
      key: 'total_students',
      sorter: (a: CourseStats, b: CourseStats) => a.total_students - b.total_students,
    },
    {
      title: 'Feedbacks',
      dataIndex: 'feedback_count',
      key: 'feedback_count',
      sorter: (a: CourseStats, b: CourseStats) => a.feedback_count - b.feedback_count,
    },
    {
      title: 'Avg Rating',
      dataIndex: 'avg_rating',
      key: 'avg_rating',
      render: (rating: number) => (
        <span>
          {rating ? `${rating.toFixed(1)}` : '—'} 
          {rating && <StarOutlined style={{ color: '#fbbf24', marginLeft: 4 }} />}
        </span>
      ),
      sorter: (a: CourseStats, b: CourseStats) => (a.avg_rating || 0) - (b.avg_rating || 0),
    },
    {
      title: 'Completion',
      dataIndex: 'completion_rate',
      key: 'completion_rate',
      render: (rate: number) => (
        <Progress percent={rate} size="small" strokeColor="#3b82f6" />
      ),
    },
  ];

  // Student table columns
  const studentColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: StudentProfile) => (
        <span>
          {text || record.username}
        </span>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      filters: [
        { text: 'Freshman', value: 'Freshman' },
        { text: 'Sophomore', value: 'Sophomore' },
        { text: 'Junior', value: 'Junior' },
        { text: 'Senior', value: 'Senior' },
      ],
      onFilter: (value: any, record: StudentProfile) => record.year === value,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Feedbacks',
      dataIndex: 'feedbacks_given',
      key: 'feedbacks_given',
      sorter: (a: StudentProfile, b: StudentProfile) => a.feedbacks_given - b.feedbacks_given,
    },
    {
      title: 'Badges',
      dataIndex: 'badges_earned',
      key: 'badges_earned',
      render: (count: number) => (
        <span>
          <TrophyOutlined style={{ color: '#fbbf24', marginRight: 4 }} />
          {count}
        </span>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'join_date',
      key: 'join_date',
    },
  ];

  // Anonymous Feedback columns
  const feedbackColumns = [
    {
      title: 'Course',
      dataIndex: 'course_code',
      key: 'course_code',
      render: (code: string, record: AnonymousFeedback) => (
        <div>
          <Tag color="blue">{code}</Tag>
          <div style={{ fontSize: 12, color: '#666' }}>{record.course_name}</div>
        </div>
      ),
    },
    {
      title: 'Phase',
      dataIndex: 'feedback_phase',
      key: 'feedback_phase',
      render: (phase: string) => {
        const colors: Record<string, string> = {
          week1: 'orange',
          week3: 'gold',
          midterm: 'blue',
          week12: 'green',
          finals: 'red',
        };
        return <Tag color={colors[phase] || 'default'}>{phase}</Tag>;
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <span>
          {rating}/5 ⭐
        </span>
      ),
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
      ellipsis: true,
      render: (text: string) => text || '—',
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      sorter: (a: AnonymousFeedback, b: AnonymousFeedback) => 
        new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime(),
    },
  ];

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
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Feedbacks"
              value={stats.totalFeedbacks}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={stats.avgRating}
              precision={1}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for different views */}
      <Tabs defaultActiveKey="courses" className="dashboard-tabs">
        <TabPane tab="Courses" key="courses" icon={<BookOutlined />}>
          <Card title="Course Statistics" extra={
            <Select 
              defaultValue="all" 
              style={{ width: 150 }}
              onChange={setSelectedDepartment}
            >
              <Option value="all">All Departments</Option>
              <Option value="CS">Computer Science</Option>
              <Option value="MATH">Mathematics</Option>
              <Option value="PHY">Physics</Option>
            </Select>
          }>
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

        <TabPane tab="Anonymous Feedback" key="feedback" icon={<FileTextOutlined />}>
          <Card title="Recent Feedback" extra={
            <RangePicker onChange={(dates) => setDateRange(dates as [any, any])} />
          }>
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
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p>Chart placeholder - Feedback trends over time</p>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Course Completion Rates">
                <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p>Chart placeholder - Top courses by completion</p>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Rating Distribution">
                <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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