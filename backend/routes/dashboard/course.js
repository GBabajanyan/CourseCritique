import express from "express";
import pool from "../../db-config.js";
import { getFeedbackStats } from "../../util/feedbackStats.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
/**
 * @openapi
 * /dashboard/courses/all:
 *   get:
 *     summary: Get all courses
 *     description: Returns every course with enrollment and feedback counters. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Courses
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
 *                 allOf:
 *                   - $ref: '#/components/schemas/Course'
 *                   - type: object
 *                     properties:
 *                       total_students:
 *                         type: integer
 *                         description: Number of enrolled students
 *                       feedback_completed:
 *                         type: integer
 *                         description: Number of submitted feedbacks
 *                       pending_feedbacks:
 *                         type: integer
 *                         description: Number of pending (unsubmitted) feedbacks
 *       401:
 *         description: Unauthorized — valid token required
 *       403:
 *         description: Forbidden — admin or instructor role required
 */
router.get("/all", async (req, res) => {
  try {
    await pool.query(
      `SELECT 
  c.id,
  c.course_code,
  c.course_name,
  c.instructor,
  c.credits,
  c.department,
  c.description,
  COUNT(DISTINCT e.profile_id) AS total_students,
  COUNT(DISTINCT CASE WHEN f.status = 'completed' THEN f.id END) AS feedback_completed,
  COUNT(DISTINCT CASE WHEN f.status = 'pending' THEN f.id END) AS pending_feedbacks
FROM course c
LEFT JOIN enrollment e ON c.id = e.course_id
LEFT JOIN feedback f ON c.id = f.course_id
GROUP BY c.id, c.course_code, c.course_name, c.instructor, c.credits, c.department, c.description
ORDER BY c.course_code ASC;`,
      (err, result) => {
        if (err) {
          res.status(400).send({ err });
        } else {
          res.send(result.rows);
        }
      },
    );
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

/**
 * @openapi
 * /dashboard/courses/{id}:
 *   get:
 *     summary: Get course details
 *     description: Returns full course data including enrollment counts, aggregated rating statistics, and open-ended feedback responses. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course UUID
 *     responses:
 *       200:
 *         description: Course details with aggregated feedback statistics
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/CourseWithStats'
 *                 - type: object
 *                   properties:
 *                     ratingStats:
 *                       type: object
 *                       description: Averaged numeric ratings across all completed feedbacks
 *                       additionalProperties:
 *                         type: number
 *                     open_feedbacks:
 *                       type: object
 *                       properties:
 *                         advice_future_gen:
 *                           type: array
 *                           items: { type: string }
 *                         improvements:
 *                           type: array
 *                           items: { type: string }
 *                         strengths:
 *                           type: array
 *                           items: { type: string }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        c.id,
        c.course_code,
        c.course_name,
        c.instructor,
        c.department,
        c.credits,
        c.description,
        COUNT(DISTINCT e.profile_id) as total_students,
        COUNT(DISTINCT CASE WHEN f.status = 'completed' THEN f.id END) as feedback_completed,
        COUNT(DISTINCT CASE WHEN f.status = 'pending' THEN f.id END) as pending_feedbacks
      FROM course c
      LEFT JOIN enrollment e ON c.id = e.course_id
      LEFT JOIN feedback f ON c.id = f.course_id
      WHERE c.id = $1
      GROUP BY c.id, c.course_code, c.course_name, c.instructor, c.department, c.credits, c.description`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const feedbackResult = await pool.query(
      `SELECT response from feedback where course_id = $1 and status = 'completed'`,
      [id],
    );

    const feedbacks = feedbackResult.rows.reduce(
      (acc, f) => {
        const { advice_future_gen, improvements, strengths, ...numeric } =
          f.response;
        acc.stats.push(numeric);
        if (advice_future_gen)
          acc.open_feedbacks.advice_future_gen.push(advice_future_gen);
        if (strengths) acc.open_feedbacks.advice_future_gen.push(strengths);
        if (improvements) acc.open_feedbacks.improvements.push(improvements);
        return acc;
      },
      {
        stats: [],
        open_feedbacks: {
          advice_future_gen: [],
          improvements: [],
          strengths: [],
        },
      },
    );
    const { stats, open_feedbacks } = feedbacks;
    const feedbackStats = getFeedbackStats(stats);

    res.json({ ...result.rows[0], ratingStats: feedbackStats, open_feedbacks });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

/**
 * @openapi
 * /dashboard/courses/{id}/students:
 *   get:
 *     summary: Get enrolled students for a course
 *     description: Returns the list of students enrolled in the specified course. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course UUID
 *     responses:
 *       200:
 *         description: List of enrolled students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                     type: string
 *                     description: University-assigned student ID
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   year:
 *                     type: string
 *                   enrolled_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
router.get("/:id/students", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        pu."studentId",
        pu.name,
        pu.email,
        pu.year,
        e.enrolled_at
      FROM enrollment e
      JOIN profile_users pu ON e.profile_id = pu.id
      WHERE e.course_id = $1
      ORDER BY pu.name ASC
    `,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({ error: "Failed to fetch enrolled students" });
  }
});

/**
 * @openapi
 * /dashboard/courses/{id}/feedback-periods-create:
 *   post:
 *     summary: Create a feedback period for a course
 *     description: Opens a new feedback period for all enrolled students. Creates one `pending` feedback record per enrolled student. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phase
 *               - startDate
 *               - deadline
 *             properties:
 *               phase:
 *                 type: string
 *                 enum: [addDrop, midterm, finals]
 *                 description: Feedback phase within the academic term
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-15"
 *                 description: Must be after startDate
 *     responses:
 *       200:
 *         description: Feedback period created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Feedback period "midterm" created for 30 students'
 *                 feedback_completed:
 *                   type: integer
 *                 pending_feedbacks:
 *                   type: integer
 *       400:
 *         description: startDate must be before deadline
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
router.post("/:id/feedback-periods-create", async (req, res) => {
  const { id } = req.params;
  const { phase, deadline, startDate } = req.body;

  try {
    if (startDate >= deadline) {
      return res
        .status(400)
        .json({ error: "Start date must be before deadline" });
    }

    const students = await pool.query(
      `SELECT profile_id FROM enrollment WHERE course_id = $1`,
      [id],
    );
    const profileIds = students.rows.map((s) => s.profile_id);

    await pool.query(
      `INSERT INTO feedback (profile_id, course_id, status, feedback_phase,start_date, deadline, created_at)
    SELECT unnest($1::uuid[]), $2, 'pending', $3, $4, $5, NOW()`,
      [profileIds, id, phase, startDate, deadline],
    );

    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT CASE WHEN status = 'submitted' THEN id END) as feedback_completed,
        COUNT(DISTINCT CASE WHEN status = 'pending' THEN id END) as pending_feedbacks
      FROM feedback
      WHERE course_id = $1`,
      [id],
    );

    res.json({
      message: `Feedback period "${phase}" created for ${students.rows.length} students`,
      feedback_completed: result.rows[0].feedback_completed || 0,
      pending_feedbacks: result.rows[0].pending_feedbacks || 0,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error creating feedback period:", error);
    res
      .status(500)
      .json({ error: "Failed to create feedback period:" + error.message });
  }
});

export default router;
