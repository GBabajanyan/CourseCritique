import {
  ApartmentOutlined,
  BookOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RadarChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Collapse,
  CollapseProps,
  DatePicker,
  Divider,
  Form,
  Masonry,
  message,
  Modal,
  Select,
  Spin,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useParams } from "react-router-dom";
import client from "../../../api/client";
import FeedbackDistributionCard from "../../../components/FeedbackDistributionCard";
import { studentColumns } from "../../../config/CoursesConfig";
import { COLORS, GRAPH_COLORS } from "../../../constants/colors";
import { FEEDBACK_CONFIG } from "../../../constants/feedbackConfig";
import { Distribution } from "../../../types/charts";
import {
  Course,
  FeedbackPhase,
  sectionStatistic,
  StatTabData,
  Student,
  TextsTabData,
} from "../../../types/coursesTypes";
import {
  describeDistribution,
  describeVariance,
  getAverageAnswer,
} from "../../../util/util";
import "./CourseDetails.css";

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [feedbackCollapse, setFeedbackCollapse] = useState<
    CollapseProps["items"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const ccScore = course?.ratingStats?.overall?.score;

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    setLoading(true);

    try {
      const [courseRes, studentsRes] = await Promise.all([
        client.get(`dashboard/courses/${id}`),
        client.get(`/dashboard/courses/${id}/students`),
      ]);
      setCourse(courseRes.data);
      const courseData = courseRes.data;
      console.log(courseData);

      const collapseStatsConfig = FEEDBACK_CONFIG.map((section) => {
        const { key, title, questions } = section;
        const sectionInfo =
          courseData.ratingStats.sections[
            key as keyof typeof courseData.ratingStats.sections
          ];
        const { questions: questionData, ...sectionData } = sectionInfo;
        const questionsWithStats = questions
          .filter((q) => q.type !== "text" && !!sectionInfo.questions?.[q.key])
          .map((q) => {
            return {
              ...q,
              tabData: sectionInfo.questions[q.key],
            };
          });

        const tabsData = [
          {
            key,
            label: "Section Score",
            type: "section",
            tabData: { stats: sectionData },
          },
          ...questionsWithStats,
        ];

        return {
          key,
          label: title,
          children: renderSectionCollapseBody(tabsData),
        };
      });
      const openQuestionConfig = FEEDBACK_CONFIG.find((c) =>
        c.questions.some((q) =>
          Object.keys(courseData.open_feedbacks).includes(q.key),
        ),
      );
      const openQuestions = openQuestionConfig?.questions.filter(
        (q) => q.type === "text",
      );

      const openQuestionsTabs =
        openQuestions?.map((q) => ({
          ...q,
          tabData: { data: courseData.open_feedbacks[q.key] },
        })) ?? [];

      const collapseOpenFeedbackConfig = {
        key: "open",
        label: "Open Feedbacks",
        children: renderTextsCollapseBody(openQuestionsTabs),
        styles: { title: { color: COLORS.SAFFRON } },
      };

      setFeedbackCollapse([...collapseStatsConfig, collapseOpenFeedbackConfig]);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const renderSectionCollapseBody = (data: StatTabData[]) => {
    const tabconfig = data.map(({ key, label, short, tabData, type }) => {
      const TabPaneLabel = short ?? label;
      return {
        key,
        label: TabPaneLabel,
        children: renderStatSectionTab(label, tabData, type),
      };
    });
    return (
      <div className="feedback-section">
        <Tabs items={tabconfig} destroyOnHidden />
      </div>
    );
  };

  const renderTextsCollapseBody = (data: TextsTabData[]) => {
    const tabconfig = data.map(({ key, label, short, tabData }) => {
      const TabPaneLabel = short ?? label;
      return {
        key,
        label: TabPaneLabel,
        children: renderOpenFeedbackTab(label, key, tabData.data || []),
      };
    });
    return (
      <div className="feedback-section">
        <Tabs items={tabconfig} destroyOnHidden />
      </div>
    );
  };

  const renderOpenFeedbackTab = (
    label: string,
    key: string,
    data: string[],
  ) => {
    const alertsType = (() => {
      switch (key) {
        case "strengths":
          return "warning";
        case "improvements":
          return "success";
        default:
          return "info";
      }
    })();

    return (
      <div>
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{label}</h3>
        </span>
        <span>
          {data.length ? (
            <Masonry
              columns={4}
              gutter={8}
              styles={{
                root: {
                  maxHeight: "520px",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                },
                item: {
                  maxHeight: "300px",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                },
              }}
              items={data.map((d, i) => ({ key: i, data: d }))}
              itemRender={({ data, index }) => (
                <Alert title={data} type={alertsType} key={index} />
              )}
            />
          ) : (
            <span>...No feedbacks of this type yet</span>
          )}
        </span>
      </div>
    );
  };

  const renderStatSectionTab = (
    label: string,
    tabData: { stats: sectionStatistic; distribution?: Distribution },
    type: string,
  ) => {
    const { distribution = {}, stats } = tabData;
    const isSectionTab = type === "section";

    const cardStats = {
      distribution: distribution,
      mean: stats.mean,
      count: stats.count,
      variance: stats.variance,
    };

    const scaleLength = Object.keys(distribution).length;
    const colors =
      scaleLength === 5
        ? GRAPH_COLORS
        : scaleLength === 3
          ? [GRAPH_COLORS[1], GRAPH_COLORS[2], GRAPH_COLORS[3]]
          : [GRAPH_COLORS[0], GRAPH_COLORS[4]];

    return (
      <div>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            overflow: "overlay",
          }}
        >
          <h3>
            Score: {stats.CCScore.toFixed(2)} /10{" "}
            <Tooltip
              title={
                <Alert
                  showIcon
                  title={`Score is calculated considering BOTH Mean value and Number of
                  responses.\u200B It is NOT the same as Average value for the
                  question/section`}
                />
              }
              color="transparent"
              placement="top"
              style={{ width: "50vw", padding: 0 }}
              styles={{ container: { padding: 0, width: "40vw" } }}
              arrow={false}
            >
              <InfoCircleOutlined />
            </Tooltip>
          </h3>
          {!isSectionTab && <h3 style={{ color: COLORS.NAVY }}>Q: {label}</h3>}
        </span>
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          {!isSectionTab && (
            <FeedbackDistributionCard
              stats={cardStats}
              style={{ width: "50%" }}
            />
          )}
          <div
            style={{
              display: "flex",
              width: "45%",
              flexDirection: "column",
              alignItems: "space-evenly",
              fontSize: 16,
              gap: 8,
            }}
          >
            <span>
              <strong color={COLORS.NAVY}>Confidence:</strong> Based on{" "}
              {cardStats.count} responses
            </span>
            {!isSectionTab && (
              <span>
                <strong color={COLORS.NAVY}>Average Response</strong>{" "}
                {cardStats.mean.toFixed(2)} from {scaleLength}(
                <span style={{ color: colors[Math.floor(cardStats.mean)] }}>
                  {getAverageAnswer(cardStats.mean, scaleLength)}
                </span>
                )
              </span>
            )}
            {!isSectionTab && (
              <span>
                <strong color={COLORS.NAVY}>User agreement level:</strong>{" "}
                {describeVariance({
                  mean: stats.mean,
                  variance: stats.variance,
                  scaleLength,
                })}
                <Tooltip
                  title={
                    <>
                      User Agreement level is calculated based on how closely
                      the answers are distributed. Possible Values:
                      <br />
                      High Agreement
                      <br />
                      Mixed Opinions
                      <br />
                      Polarized
                    </>
                  }
                  placement="topLeft"
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            )}
            {!isSectionTab && (
              <span>
                <strong>Distribution:</strong>{" "}
                {describeDistribution(distribution)}
              </span>
            )}
          </div>
        </span>
      </div>
    );
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
        `/dashboard/courses/${id}/feedback-periods-create`,
        feedbackPhaseDetails,
      );

      const {
        message: resultmsg,
        feedback_completed,
        pending_feedbacks,
      } = response.data;
      message.success(resultmsg);
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              feedback_completed: feedback_completed,
              pending_feedbacks: pending_feedbacks,
            }
          : prev,
      );
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

  const styles: CollapseProps["styles"] = {
    header: {
      backgroundColor: "#003A5D",
      padding: "12px 16px",
      color: "#fff",
      fontWeight: "700",
    },
    title: {
      textTransform: "capitalize",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      paddingTop: 0,
    },
  };

  return loading ? (
    <div className="loading-spin">
      <Spin size="large" />
      Loading...
    </div>
  ) : (
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
              <div className="stat-value">
                <CountUp end={course?.credits || 0} duration={1} />
              </div>
            </div>
          </div>
          <div className="stat-item">
            <BookOutlined className="stat-icon" />
            <div>
              <div className="stat-label">Total Students</div>
              <div className="stat-value">
                <CountUp end={course?.total_students || 0} duration={1} />
              </div>
            </div>
          </div>
          <div className="stat-item">
            <RadarChartOutlined className="stat-icon" />
            <div>
              <div className="stat-label">CourseCritique Score</div>
              <div className="stat-value">
                {ccScore ? (
                  <CountUp
                    end={Number((ccScore * 100).toFixed(1))}
                    duration={1}
                  />
                ) : (
                  "N/A"
                )}
                {"/100"}
              </div>
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
        <div className="feedback-stat-container">
          <h1 className="course-title">Feedback Data</h1>
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
          {/* <SectionBarChart data={sectionChartData} /> */}
          {/* {feedbackCollapse?.length !== 0 && ( */}
          <Collapse
            items={feedbackCollapse}
            size="large"
            styles={styles}
            destroyOnHidden
          />
          {/* )} */}
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
            <Select
              placeholder="Select phase"
              options={[
                { value: "addDrop", label: "Add/drop period" },
                { value: "midterm", label: "Midterm" },
                { value: "finals", label: "Finals" },
              ]}
            />
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
