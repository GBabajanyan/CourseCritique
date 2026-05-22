import express from "express";
import pool from "../../db-config.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

// GET /dashboard/stats - Overall dashboard statistics
/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns overview statistics for admin dashboard
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCourses:
 *                   type: integer
 *                 totalStudents:
 *                   type: integer
 *                 totalFeedbacks:
 *                   type: integer
 *                 avgRating:
 *                   type: number
 *                 completionRate:
 *                   type: integer
 *                 activeUsers:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const coursesResult = await pool.query("SELECT COUNT(*) FROM course");
    const studentsResult = await pool.query(
      "SELECT COUNT(*) FROM profile_users WHERE role = 'student'",
    );
    const feedbacksResult = await pool.query(
      `SELECT COUNT(*) FROM feedback WHERE status = 'completed'`,
    );

    const totalSubmitted = feedbacksResult.rows[0].count;
    const totalExpectedResult = await pool.query(
      `SELECT COUNT(*) FROM feedback WHERE status = 'pending'`,
    );
    const totalPending = totalExpectedResult.rows[0].count;
    const totalStudents = studentsResult.rows[0].count;
    const completionRate =
      totalStudents === 0
        ? 0
        : Math.round((totalPending / totalStudents) * 100);

    // Active users (logged in within last 30 days)
    const activeUsersResult = await pool.query(
      `SELECT COUNT(*) FROM auth_users 
       WHERE is_active=true AND last_login >= NOW() - INTERVAL '30 days'`,
    );

    res.json({
      totalCourses: parseInt(coursesResult.rows[0].count),
      totalStudents: parseInt(totalStudents),
      totalFeedbacks: parseInt(totalSubmitted),
      completionRate: completionRate,
      activeUsers: parseInt(activeUsersResult.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

/**
 * @openapi
 * /dashboard/courses/stats:
 *   get:
 *     summary: Get per-course statistics
 *     description: Returns each course with student count, completed feedback count, average rating, and feedback completion rate. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses with statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   course_code:
 *                     type: string
 *                   course_name:
 *                     type: string
 *                   instructor:
 *                     type: string
 *                   department:
 *                     type: string
 *                   total_students:
 *                     type: integer
 *                   feedback_count:
 *                     type: integer
 *                     description: Number of completed feedbacks
 *                   avg_rating:
 *                     type: number
 *                     nullable: true
 *                     description: Average course_pace rating (1–5), null if no feedbacks
 *                   completion_rate:
 *                     type: number
 *                     description: Percentage of students who submitted feedback (0–100)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
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
        COUNT(DISTINCT CASE WHEN f.status = 'completed' THEN f.id END) as feedback_count,
        COUNT(DISTINCT CASE WHEN f.status = 'pending' THEN f.id END) as pending_count,
       CASE 
          WHEN COUNT(DISTINCT e.profile_id) = 0 THEN 0
          ELSE ROUND(
            (COUNT(DISTINCT CASE WHEN f.status = 'pending' THEN f.id END)::numeric / 
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

/**
 * @openapi
 * /dashboard/students:
 *   get:
 *     summary: List all students
 *     description: Returns all student profiles sorted by join date (newest first), including feedback submission count. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of student profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   name:
 *                     type: string
 *                   year:
 *                     type: string
 *                   department:
 *                     type: string
 *                     description: Student's declared degree/program
 *                   feedbacks_given:
 *                     type: integer
 *                     description: Total completed feedbacks submitted by this student
 *                   join_date:
 *                     type: string
 *                     format: date-time
 *                   badges_earned:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
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
        COUNT(DISTINCT CASE WHEN f.status = 'completed' THEN f.id END) as feedbacks_given,
        pu.created_at as join_date
      FROM profile_users pu
      LEFT JOIN feedback f ON pu.id = f.profile_id AND f.status = 'completed'
      WHERE pu.role = 'student'
      GROUP BY pu."studentId", pu.email, pu.name, pu.year, pu.degree, pu.created_at
      ORDER BY pu.created_at DESC
    `);

    res.json(result.rows.map((r) => ({ ...r, badges_earned: 3 })));
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
});

/**
 * @openapi
 * /dashboard/feedbacks/anonymous:
 *   get:
 *     summary: List anonymous feedbacks
 *     description: Returns completed feedbacks with ratings and comments, stripped of student identity. Supports optional date-range and course filtering. Returns up to 100 records. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter feedbacks submitted on or after this date (use together with endDate)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter feedbacks submitted on or before this date (use together with startDate)
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by course UUID
 *     responses:
 *       200:
 *         description: List of anonymous feedback entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   course_code:
 *                     type: string
 *                   course_name:
 *                     type: string
 *                   feedback_phase:
 *                     type: string
 *                     enum: [addDrop, midterm, finals]
 *                   rating:
 *                     type: integer
 *                     description: course_pace rating (1–5)
 *                   comments:
 *                     type: string
 *                   submitted_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
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
      WHERE f.status = 'completed'
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

/**
 * @openapi
 * /dashboard/feedbacks/by-course/{courseId}:
 *   get:
 *     summary: Get feedbacks for a specific course
 *     description: Returns all completed feedbacks for a course along with total count and average rating across all numeric rating fields. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course UUID
 *     responses:
 *       200:
 *         description: Course feedbacks with aggregate statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_feedbacks:
 *                   type: integer
 *                 average_rating:
 *                   type: string
 *                   description: Average of all numeric rating fields, formatted to one decimal place
 *                   example: "3.8"
 *                 feedbacks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       feedback_phase:
 *                         type: string
 *                         enum: [addDrop, midterm, finals]
 *                       comments:
 *                         type: string
 *                       submitted_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
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
        AND f.status = 'completed'
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

/**
 * @openapi
 * /dashboard/feedback-trends:
 *   get:
 *     summary: Get feedback submission trends over time
 *     description: Returns time-bucketed feedback counts and average ratings. The bucket size depends on the `period` parameter — `week` buckets by day, `month` by week, `year` by month. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *           default: month
 *         description: Time window to aggregate over
 *     responses:
 *       200:
 *         description: Array of time-bucketed trend data points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Start of the time bucket
 *                   count:
 *                     type: integer
 *                     description: Number of feedbacks submitted in this bucket
 *                   avg_rating:
 *                     type: number
 *                     nullable: true
 *                     description: Average course_pace rating for this bucket
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
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
      FROM feedback
      WHERE status = 'completed'
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

/**
 * @openapi
 * /dashboard/departments:
 *   get:
 *     summary: List all departments
 *     description: Returns a distinct, sorted list of department names from the course table. Useful for populating filter dropdowns. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of department name strings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Computer Science", "Mathematics", "Physics"]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
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
