import express from "express";
import pool from "../../db-config.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

// GET /dashboard/stats - Overall dashboard statistics
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const coursesResult = await pool.query("SELECT COUNT(*) FROM course");
    const studentsResult = await pool.query(
      "SELECT COUNT(*) FROM profile_users WHERE role = 'student'",
    );
    const feedbacksResult = await pool.query(
      `SELECT COUNT(*) FROM feedback WHERE status = 'submitted'`,
    );
    const avgRatingResult = await pool.query(
      `SELECT AVG((response->'ratings'->>'course_pace')::float) as avg_rating 
       FROM feedback 
       WHERE status = 'submitted' AND response->'ratings'->>'course_pace' IS NOT NULL`,
    );

    const totalSubmitted = feedbacksResult.rows[0].count;
    const totalExpectedResult = await pool.query(
      `SELECT COUNT(*) FROM feedback WHERE status = 'pending'`,
    );
    const totalPending = totalExpectedResult.rows[0].count;
    const completionRate =
      totalSubmitted + totalPending > 0
        ? Math.round((totalSubmitted / (totalSubmitted + totalPending)) * 100)
        : 0;

    // Active users (logged in within last 30 days)
    const activeUsersResult = await pool.query(
      `SELECT COUNT(*) FROM auth_users 
       WHERE is_active=true AND last_login >= NOW() - INTERVAL '30 days'`,
    );

    res.json({
      totalCourses: parseInt(coursesResult.rows[0].count),
      totalStudents: parseInt(studentsResult.rows[0].count),
      totalFeedbacks: parseInt(totalSubmitted),
      avgRating: parseFloat(avgRatingResult.rows[0].avg_rating) || 0,
      completionRate: completionRate,
      activeUsers: parseInt(activeUsersResult.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// GET /dashboard/courses/stats
router.get("/courses/stats", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.course_code,
        c.course_name,
        c.instructor,
        c.department,
        COUNT(DISTINCT e.profile_id) as total_students,
        COUNT(DISTINCT CASE WHEN f.status = 'submitted' THEN f.id END) as feedback_count,
        CASE 
          WHEN AVG(CASE 
            WHEN f.status = 'submitted' THEN (f.response->'ratings'->>'course_pace')::numeric
            ELSE NULL 
          END) IS NULL THEN NULL
          ELSE ROUND(
            AVG(CASE 
              WHEN f.status = 'submitted' THEN (f.response->'ratings'->>'course_pace')::numeric
              ELSE NULL 
            END)::numeric, 
            1
          )
        END as avg_rating,
        CASE 
          WHEN COUNT(DISTINCT e.profile_id) = 0 THEN 0
          ELSE ROUND(
            (COUNT(DISTINCT CASE WHEN f.status = 'submitted' THEN f.id END)::numeric / 
            COUNT(DISTINCT e.profile_id)::numeric) * 100, 
            1
          )
        END as completion_rate
      FROM course c
      LEFT JOIN enrollment e ON c.id = e.course_id
      LEFT JOIN feedback f ON c.id = f.course_id AND e.profile_id = f.profile_id
      GROUP BY c.id, c.course_code, c.course_name, c.instructor, c.department
      ORDER BY c.course_code ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching course stats:", error);
    res.status(500).json({ error: "Failed to fetch course statistics" });
  }
});

// GET /dashboard/students
router.get("/students", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pu."studentId",
        pu.email,
        pu.name,
        pu.year,
        pu."studentId" as studentId,
        pu.degree as department,
        COUNT(DISTINCT CASE WHEN f.status = 'submitted' THEN f.id END) as feedbacks_given,
        COUNT(DISTINCT ub.badge_id) as badges_earned,
        pu.created_at as join_date
      FROM profile_users pu
      LEFT JOIN feedback f ON pu.id = f.profile_id AND f.status = 'submitted'
      LEFT JOIN user_badge ub ON pu.id = ub.profile_id AND ub.is_completed = true
      WHERE pu.role = 'student'
      GROUP BY pu."studentId", pu.email, pu.name, pu.year, pu.degree, pu.created_at
      ORDER BY pu.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
});

// GET /dashboard/feedbacks/anonymous
router.get("/feedbacks/anonymous", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, courseId } = req.query;

    let query = `
      SELECT 
        f.id,
        c.course_code,
        c.course_name,
        f.feedback_phase,
        (f.response->'ratings'->>'course_pace')::int as rating,
        f.response->>'comments' as comments,
        f.submitted_at
      FROM feedback f
      JOIN course c ON f.course_id = c.id
      WHERE f.status = 'submitted'
        AND f.response->'ratings'->>'course_pace' IS NOT NULL
    `;

    const params = [];
    let paramIndex = 1;

    if (startDate && endDate) {
      query += ` AND f.submitted_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(startDate, endDate);
      paramIndex += 2;
    }

    if (courseId) {
      query += ` AND f.course_id = $${paramIndex}`;
      params.push(courseId);
      paramIndex++;
    }

    query += ` ORDER BY f.submitted_at DESC LIMIT 100`;

    const result = await pool.query(query, params);

    const feedbacks = result.rows.map((f) => ({
      ...f,
      rating: f.rating || 0,
      comments: f.comments || "",
    }));

    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching anonymous feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch feedback data" });
  }
});

// GET /dashboard/feedbacks/by-course/:courseId
router.get("/feedbacks/by-course/:courseId", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        f.id,
        f.feedback_phase,
        f.response->'ratings' as ratings,
        f.response->>'comments' as comments,
        f.submitted_at
      FROM feedback f
      WHERE f.course_id = $1 
        AND f.status = 'submitted'
      ORDER BY f.submitted_at DESC
    `,
      [courseId],
    );

    const feedbacks = result.rows;
    const ratings = feedbacks.flatMap((f) => {
      const r = f.ratings;
      return r ? Object.values(r).map((v) => parseInt(v)) : [];
    });

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    res.json({
      total_feedbacks: feedbacks.length,
      average_rating: avgRating.toFixed(1),
      feedbacks: feedbacks.map((f) => ({
        ...f,
        ratings: undefined,
        comments: f.comments,
      })),
    });
  } catch (error) {
    console.error("Error fetching course feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch course feedbacks" });
  }
});

// GET /dashboard/feedback-trends
router.get("/feedback-trends", verifyToken, async (req, res) => {
  try {
    const { period = "month" } = req.query;

    let interval;
    switch (period) {
      case "week":
        interval = "day";
        break;
      case "month":
        interval = "week";
        break;
      case "year":
        interval = "month";
        break;
      default:
        interval = "week";
    }

    const result = await pool.query(
      `
      SELECT 
        DATE_TRUNC($1, submitted_at) as date,
        COUNT(*) as count,
        ROUND(AVG((response->'ratings'->>'course_pace')::numeric), 1) as avg_rating
      FROM feedback
      WHERE status = 'submitted'
      GROUP BY DATE_TRUNC($1, submitted_at)
      ORDER BY date ASC
    `,
      [interval],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching feedback trends:", error);
    res.status(500).json({ error: "Failed to fetch feedback trends" });
  }
});

// GET /dashboard/departments
router.get("/departments", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT department 
      FROM course 
      WHERE department IS NOT NULL 
      ORDER BY department
    `);

    res.json(result.rows.map((r) => r.department));
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

export default router;
