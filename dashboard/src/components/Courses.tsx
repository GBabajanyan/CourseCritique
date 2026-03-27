import React, { useEffect, useState } from "react";
import "./Courses.css";
import api from "../api/client";

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  instructor: string;
  credits: number;
  department: string;
  total_students?: number;
  feedback_completed?: number;
  avg_rating?: number;
  pending_feedbacks?: number;
}

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
      const { data } = await api.get("http://localhost:8000/course/all");
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

  const departmentNames = Array.from(new Set(courses.map((c) => c.department)));
  const departments = ["all", ...departmentNames];
  
  if (loading) {
    return (
      <div className="courses-loading">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Header */}
      <div className="courses-header">
        <div>
          <h1 className="courses-title">Courses</h1>
          <p className="courses-subtitle">
            Manage and view all course evaluations
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by code, name, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="department-filter">
          <label>Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="department-select"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-badge">
          <span className="stat-badge-value">{courses.length}</span>
          <span className="stat-badge-label">Total Courses</span>
        </div>
        <div className="stat-badge">
          <span className="stat-badge-value">
            {courses.filter((c) => (c.feedback_completed || 0) > 0).length}
          </span>
          <span className="stat-badge-label">With Feedbacks</span>
        </div>
        <div className="stat-badge">
          <span className="stat-badge-value">
            {Math.round(
              courses.reduce((acc, c) => acc + (c.avg_rating || 0), 0) /
                courses.length || 0,
            )}
          </span>
          <span className="stat-badge-label">Avg Rating</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Instructor</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Students</th>
              <th>Feedbacks</th>
              <th>Avg Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td className="course-code-cell">{course.course_code}</td>
                <td className="course-name-cell">{course.course_name}</td>
                <td>{course.instructor}</td>
                <td>{course.department}</td>
                <td className="text-center">{course.credits}</td>
                <td className="text-center">{course.total_students || 0}</td>
                <td className="text-center">
                  <span className="feedback-count">
                    {course.feedback_completed || 0}
                  </span>
                  <span className="pending-count">
                    ({course.pending_feedbacks || 0} pending)
                  </span>
                </td>
                <td className="text-center">
                  <span className="rating">{course.avg_rating || "—"}</span>
                  {course.avg_rating && <span className="star">⭐</span>}
                </td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => console.log("View course:", course.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCourses.length === 0 && (
        <div className="no-results">
          <p>No courses found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
