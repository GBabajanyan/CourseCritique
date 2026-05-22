import express from "express";
import pool from "../../db-config.js";
import verifyToken from "../middleware/verifyToken.js";
import { getFeedbackStats } from "../../util/feedbackStats.js";
const router = express.Router();

/**
 * @openapi
 * /feedback/pending:
 *   get:
 *     summary: Get pending feedbacks
 *     description: Returns list of feedbacks awaiting submission for the authenticated user
 *     tags:
 *       - Mobile - Feedback
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending feedbacks within their active window (startDate ≤ now < deadline)
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
 *                     description: Feedback record UUID — pass this as feedbackId when submitting
 *                   courseCode:
 *                     type: string
 *                   courseName:
 *                     type: string
 *                   section:
 *                     type: string
 *                   instructor:
 *                     type: string
 *                   department:
 *                     type: string
 *                   deadline:
 *                     type: string
 *                     format: date
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   feedbackPhase:
 *                     type: string
 *                     enum: [addDrop, midterm, finals]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — student role required
 */
router.get("/pending", async (req, res) => {
  try {
    const { profile_id } = req.userData;
    const result = await pool.query(
      `SELECT
      f.id,
      c.course_code as "courseCode",
      c.course_name as "courseName",
      c.instructor,
      c.department,
      c.section,
      f.deadline,
      f.start_date as "startDate",
      f.feedback_phase as "feedbackPhase"
    FROM feedback f
    JOIN course c ON f.course_id = c.id
    WHERE  f.status = 'pending'  
    AND NOW() < f.deadline 
    AND NOW() > f.start_date
    AND f.profile_id = $1
    ORDER BY f.deadline ASC`,
      [profile_id],
    );

    res.send(result.rows);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

/**
 * @openapi
 * /feedback/completed:
 *   get:
 *     summary: Get completed feedbacks
 *     description: Returns all feedbacks that the authenticated student has already submitted, ordered by submission date (newest first). Course details fall back to a snapshot if the course record was since modified. Requires student role.
 *     tags:
 *       - Mobile - Feedback
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Completed feedback history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       courseCode:
 *                         type: string
 *                       courseName:
 *                         type: string
 *                       instructor:
 *                         type: string
 *                       section:
 *                         type: string
 *                       department:
 *                         type: string
 *                       feedbackPhase:
 *                         type: string
 *                         enum: [addDrop, midterm, finals]
 *                       submittedDate:
 *                         type: string
 *                         format: date-time
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       deadline:
 *                         type: string
 *                         format: date
 *                       feedbackData:
 *                         $ref: '#/components/schemas/FeedbackRatings'
 *                 rowCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — student role required
 *       500:
 *         description: Server error
 */
router.get("/completed", async (req, res) => {
  try {
    const { profile_id } = req.userData;

    const result = await pool.query(
      `SELECT
      f.id,
      COALESCE(f.course_snapshot->>'course_code', c.course_code) as "courseCode",
      COALESCE(f.course_snapshot->>'course_name', c.course_name) as "courseName",
      COALESCE(f.course_snapshot->>'instructor', c.instructor) as instructor,
      COALESCE(f.course_snapshot->>'section', c.section) as section,
      f.deadline,
      c.department,
      f.feedback_phase as "feedbackPhase",
	    f.submitted_at as "submittedDate",
      f.start_date as "startDate",
      f.deadline,
	    f.response as "feedbackData"
    FROM feedback f
    LEFT JOIN course c ON f.course_id = c.id
    WHERE  f.status = 'completed'
    AND f.profile_id = $1
    ORDER BY f.submitted_at DESC`,
      [profile_id],
    );

    const { rows, rowCount } = result;
    res.send({ rows, rowCount });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

/**
 * @openapi
 * /feedback/{courseId}/stats:
 *   get:
 *     summary: Get aggregated feedback stats for a course
 *     description: Returns averaged numeric ratings and collected open-ended responses for all completed feedbacks of a course. Used by the mobile app to display course insights. Requires student role.
 *     tags:
 *       - Mobile - Feedback
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [20, 50, 100]
 *         description: Cap the number of feedback records used in the aggregation (omit for all)
 *     responses:
 *       200:
 *         description: Aggregated feedback statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedbacks_completed:
 *                   type: integer
 *                   description: Total number of completed feedbacks for this course
 *                 ratingStats:
 *                   type: object
 *                   description: Averaged numeric ratings per question
 *                   additionalProperties:
 *                     type: number
 *                 open_feedbacks:
 *                   type: object
 *                   properties:
 *                     advice_future_gen:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           feedback:
 *                             type: string
 *                           submittedDate:
 *                             type: string
 *                     strengths:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           feedback:
 *                             type: string
 *                           submittedDate:
 *                             type: string
 *                     improvements:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           feedback:
 *                             type: string
 *                           submittedDate:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — student role required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get("/:id/stats", async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query; // Get limit from query params

    const feedback_count = await pool.query(
      ` SELECT 
       COUNT(DISTINCT CASE WHEN status = 'completed' THEN id END) as feedbacks_completed
      FROM feedback 
      WHERE course_id = $1
      `,
      [id],
    );

    if (feedback_count.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Build query with optional limit
    let feedbackQuery = `
      SELECT response, submitted_at FROM feedback 
      WHERE course_id = $1 AND status = 'completed' 
      ORDER BY submitted_at DESC
    `;

    const queryParams = [id];

    // Add LIMIT if provided and valid
    if (limit && [20, 50, 100].includes(Number(limit))) {
      feedbackQuery += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(limit);
    }

    const feedbackResult = await pool.query(feedbackQuery, queryParams);

    const feedbacks = feedbackResult.rows.reduce(
      (acc, f) => {
        const { response, submitted_at } = f;
        const { advice_future_gen, improvements, strengths, ...numeric } =
          response;
        const submittedDate = new Date(submitted_at).toLocaleDateString(
          "en-CA",
          { year: "numeric", month: "short", day: "numeric" },
        );
        acc.stats.push(numeric);

        if (advice_future_gen)
          acc.open_feedbacks.advice_future_gen.push({
            feedback: advice_future_gen,
            submittedDate,
          });
        if (strengths)
          acc.open_feedbacks.strengths.push({
            feedback: strengths,
            submittedDate,
          });
        if (improvements)
          acc.open_feedbacks.improvements.push({
            feedback: improvements,
            submittedDate,
          });
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
    const feedbackStats = getFeedbackStats(stats, false);

    res.json({
      feedbacks_completed: feedback_count.rows[0].feedbacks_completed,
      ratingStats: feedbackStats,
      open_feedbacks,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

/**
 * @openapi
 * /feedback/submit:
 *   post:
 *     summary: Submit course feedback
 *     description: Submits completed feedback for a course
 *     tags:
 *       - Mobile - Feedback
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feedbackId
 *               - ratings
 *             properties:
 *               feedbackId:
 *                 type: string
 *                 format: uuid
 *                 description: The `id` of the pending feedback record obtained from GET /feedback/pending
 *               ratings:
 *                 $ref: '#/components/schemas/FeedbackRatings'
 *     responses:
 *       200:
 *         description: Feedback submitted successfully. If this is the first submission for this course/phase/deadline, the student's pioneer badge is also set.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — student role required
 *       500:
 *         description: Server error
 */
router.post("/submit", async (req, res) => {
  const { ratings, feedbackId } = req.body;
  try {
    const userId = req.userData.id;
    // Get feedback details
    const feedback = await pool.query(
      `
    SELECT course_id, feedback_phase, deadline 
    FROM feedback 
    WHERE id = $1 
  `,
      [feedbackId],
    );

    // Check if this is the first feedback for this course+phase+deadline
    const existingCount = await pool.query(
      `
    SELECT COUNT(*) FROM feedback 
    WHERE course_id = $1 
      AND feedback_phase = $2 
      AND deadline = $3
      AND status = 'completed'
  `,
      [
        feedback.rows[0].course_id,
        feedback.rows[0].feedback_phase,
        feedback.rows[0].deadline,
      ],
    );

    // If this is the first one, grant pioneer badge
    if (parseInt(existingCount.rows[0].count) === 0) {
      await pool.query(
        `
      UPDATE profile_users 
      SET is_pioneer = true 
      WHERE "userId" = $1
    `,
        [userId],
      );
    }

    const resl = await pool.query(
      `UPDATE feedback
       SET response = $1, status = 'completed', submitted_at = NOW()
       WHERE id = $2`,
      [ratings, feedbackId],
    );

    if (!resl.rowCount) res.sendStatus(500);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
    console.log("Feedback submit Error: ", err);
  }
});

export default router;
