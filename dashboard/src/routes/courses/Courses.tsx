import { SearchOutlined } from "@ant-design/icons";
import { Card, Col, Input, Row, Select, Space, Statistic, Table } from "antd";
import React, { useEffect, useState } from "react";
import client from "../../api/client";
import { coursesColumns } from "../../config/CoursesConfig";
import { Course } from "../../types/coursesTypes";
import "./Courses.css";

const { Search } = Input;
const { Option } = Select;

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await client.get(
        "/dashboard/courses/all",
      );

      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" || course.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [
    "all",
    ...Array.from(new Set(courses.map((c) => c.department))),
  ];

  return (
    <div className="courses-container">
      {/* Header */}
      <div className="courses-header">
        <h1 className="courses-title">Courses</h1>
        <p className="courses-subtitle">
          Manage and view all course evaluations
        </p>
      </div>

      {/* Stats Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Courses" value={courses.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="With Feedbacks"
              value={
                courses.filter((c) => (c.feedback_completed || 0) > 0).length
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Feedbacks"
              value={courses.reduce(
                (acc, c) => acc + (Number(c.feedback_completed) || 0),
                0,
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="middle" wrap>
          <Search
            placeholder="Search by code, name, or instructor..."
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            onChange={setSelectedDepartment}
          >
            {departments.map((dept) => (
              <Option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={coursesColumns}
          dataSource={filteredCourses}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10, // Items per page
            showSizeChanger: true, // Allow user to change page size
            pageSizeOptions: ["10", "20", "50", "100"], // Options for page size
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default Courses;
