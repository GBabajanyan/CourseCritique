import express from "express";
import pool from "../../db-config.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/pending", verifyToken, async (req, res) => {
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

router.get("/completed", verifyToken, async (req, res) => {
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
      f.feedback_phase as "feedbackPhase",
	    f.submitted_at as "submittedDate",
	    f.response as "feedbackData"
    FROM feedback f
    LEFT JOIN course c ON f.course_id = c.id
    WHERE  f.status = 'completed'
    AND f.profile_id = $1
    ORDER BY f.submitted_at DESC`,
      [profile_id],
    );
    /*
    SELECT COUNT(*) FROM feedback WHERE profile_id = 'f140d3ee-e9b2-4bb8-8ab7-c3e42e5135c4' AND status = 'completed';
    */
    const { rows, rowCount } = result;
    res.send({ rows, rowCount });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

// GET /api/courses/:id/stats
router.get("/:id/stats", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        COUNT(*) as total_feedbacks,
        
        -- 5-scale ratings (1-5)
        ROUND(AVG((response->'ratings'->>'course_pace')::numeric), 1) as avg_course_pace,
        ROUND(AVG((response->'ratings'->>'course_load')::numeric), 1) as avg_course_load,
        ROUND(AVG((response->'ratings'->>'class_organization')::numeric), 1) as avg_class_organization,
        
        ROUND(AVG((response->'ratings'->>'course_materials')::numeric), 1) as avg_course_materials,
        ROUND(AVG((response->'ratings'->>'assignment_instructions')::numeric), 1) as avg_assignment_instructions,
        ROUND(AVG((response->'ratings'->>'grading_rubrics')::numeric), 1) as avg_grading_rubrics,
        
        ROUND(AVG((response->'ratings'->>'class_management')::numeric), 1) as avg_class_management,
        ROUND(AVG((response->'ratings'->>'student_participation')::numeric), 1) as avg_student_participation,
        ROUND(AVG((response->'ratings'->>'in_class_queries')::numeric), 1) as avg_in_class_queries,
        ROUND(AVG((response->'ratings'->>'concern_learning')::numeric), 1) as avg_concern_learning,
        
        -- 3-scale ratings (1-3)
        ROUND(AVG((response->'ratings'->>'availability')::numeric), 1) as avg_availability,
        ROUND(AVG((response->'ratings'->>'feedback_on_assignments')::numeric), 1) as avg_feedback_on_assignments,
        ROUND(AVG((response->'ratings'->>'inspires_motivation')::numeric), 1) as avg_inspires_motivation,
        
        -- Thumb ratings (yes/no)
        COUNT(CASE WHEN (response->'ratings'->>'substantial_learning') = 'yes' THEN 1 END) as substantial_learning_yes,
        COUNT(CASE WHEN (response->'ratings'->>'substantial_learning') = 'no' THEN 1 END) as substantial_learning_no,
        COUNT(CASE WHEN (response->'ratings'->>'take_another_course') = 'yes' THEN 1 END) as take_another_course_yes,
        COUNT(CASE WHEN (response->'ratings'->>'take_another_course') = 'no' THEN 1 END) as take_another_course_no,
        
        -- Recent comments (subquery instead of FILTER with ORDER)
        (
          SELECT json_agg(comments)
          FROM (
            SELECT response->>'open_feedback' as comments
            FROM feedback f2
            WHERE f2.course_id = $1 
              AND f2.status = 'completed'
              AND response->>'open_feedback' IS NOT NULL
              AND response->>'open_feedback' != ''
            ORDER BY f2.submitted_at DESC
            LIMIT 5
          ) sub
        ) as recent_comments
      FROM feedback
      WHERE course_id = $1 AND status = 'completed'
    `,
      [id],
    );

    const row = result.rows[0];

    res.json({
      total_feedbacks: parseInt(row.total_feedbacks) || 0,
      avg_rating:
        ((parseFloat(row.avg_course_pace) || 0) +
          (parseFloat(row.avg_course_load) || 0) +
          (parseFloat(row.avg_class_organization) || 0) +
          (parseFloat(row.avg_course_materials) || 0) +
          (parseFloat(row.avg_assignment_instructions) || 0) +
          (parseFloat(row.avg_grading_rubrics) || 0) +
          (parseFloat(row.avg_class_management) || 0) +
          (parseFloat(row.avg_student_participation) || 0) +
          (parseFloat(row.avg_in_class_queries) || 0) +
          (parseFloat(row.avg_concern_learning) || 0)) /
        10,
      ratings_breakdown: {
        course_pace: parseFloat(row.avg_course_pace) || 0,
        course_load: parseFloat(row.avg_course_load) || 0,
        class_organization: parseFloat(row.avg_class_organization) || 0,
        course_materials: parseFloat(row.avg_course_materials) || 0,
        assignment_instructions:
          parseFloat(row.avg_assignment_instructions) || 0,
        grading_rubrics: parseFloat(row.avg_grading_rubrics) || 0,
        class_management: parseFloat(row.avg_class_management) || 0,
        student_participation: parseFloat(row.avg_student_participation) || 0,
        in_class_queries: parseFloat(row.avg_in_class_queries) || 0,
        concern_learning: parseFloat(row.avg_concern_learning) || 0,
        availability: parseFloat(row.avg_availability) || 0,
        feedback_on_assignments:
          parseFloat(row.avg_feedback_on_assignments) || 0,
        inspires_motivation: parseFloat(row.avg_inspires_motivation) || 0,
        substantial_learning: {
          yes: parseInt(row.substantial_learning_yes) || 0,
          no: parseInt(row.substantial_learning_no) || 0,
        },
        take_another_course: {
          yes: parseInt(row.take_another_course_yes) || 0,
          no: parseInt(row.take_another_course_no) || 0,
        },
      },
      recent_comments: row.recent_comments || [],
    });
  } catch (error) {
    console.error(
      "GET /courses/:id/stats error:",
      error.response?.data || error,
    );
    res.status(500).json({ error: "Failed to fetch course statistics" });
  }
});

router.post("/submit", verifyToken, async (req, res) => {
  const { ratings, feedbackId } = req.body;

  try {
    // Update feedback with ratings and mark as completed
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
