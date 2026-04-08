import express from "express";
import pool from "../../db-config.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    await pool.query(`SELECT * FROM course`, (err, result) => {
      if (err) {
        res.status(400).send({ err });
      } else {
        res.send(result.rows);
      }
    });
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        c.id,
        c.course_code,
        c.course_name,
        c.instructor,
        c.department,
        c.credits,
        c.description,
        COUNT(DISTINCT e.profile_id) as total_students,
        COUNT(DISTINCT CASE WHEN f.status = 'submitted' THEN f.id END) as feedback_completed,
        COUNT(DISTINCT CASE WHEN f.status = 'pending' THEN f.id END) as pending_feedbacks
      FROM course c
      LEFT JOIN enrollment e ON c.id = e.course_id
      LEFT JOIN feedback f ON c.id = f.course_id
      WHERE c.id = $1
      GROUP BY c.id, c.course_code, c.course_name, c.instructor, c.department, c.credits, c.description
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

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

router.post("/:id/feedback-periods-create", verifyToken, async (req, res) => {
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
    SELECT unnest($1::varchar[]), $2, 'pending', $3, $4, $5, NOW()`,
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
