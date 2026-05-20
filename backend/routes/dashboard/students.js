import express from "express";
import pool from "../../db-config.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    await pool.query("BEGIN");

    const {
      firstName,
      lastName,
      role,
      email,
      password,
      degree,
      year,
      studentid,
    } = req.body;

    const userCheck = await pool.query(
      `Select * FROM profile_users WHERE "studentId" = $1`,
      [studentid],
    );

    if (userCheck.rows.length) {
      return res
        .status(400)
        .json({ message: "Student with specified Student ID already exists" });
    }

    await pool.query(
      `INSERT INTO profile_users ("firstName","lastName", email, degree, year, "studentId", role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [firstName, lastName, email, degree, year, studentid, role],
    );

    await pool.query("COMMIT");

    res.status(201).send({ success: true });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error.message);
    res.status(500).send("Server Error: Add Student");
  }
});

// GET /dashboard/students/:studentId - Get student details
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query(
      `
      SELECT 
      pu.id,
        pu."studentId",
        pu.name,
        pu.email,
        pu.year,
        pu.degree,
        pu.created_at as join_date,
        COUNT(DISTINCT CASE WHEN f.status = 'completed' THEN f.id END) as total_feedbacks
      FROM profile_users pu
      LEFT JOIN feedback f ON pu.id = f.profile_id AND f.status = 'completed'
      WHERE pu."studentId" = $1
      GROUP BY pu.id, pu."studentId", pu.name, pu.email, pu.year, pu.degree, pu.created_at
    `,
      [studentId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(
      "GET /dashboard/students/:studentId error:",
      error.response?.data || error,
    );
    res.status(500).json({ error: "Failed to fetch student data" });
  }
});

// GET /dashboard/students/:studentId/courses - Get student's enrolled courses
router.get("/:studentId/courses", async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentResult = await pool.query(
      `SELECT id FROM profile_users WHERE "studentId" = $1`,
      [studentId],
    );
    if (studentResult.rows.length === 0)
      return res.status(404).json({ error: "Student not found" });

    const profileId = studentResult.rows[0].id;
    const result = await pool.query(
      `
      SELECT 
        c.id,
        c.course_code,
        c.course_name,
        c.section,
        c.instructor,
        c.department,
        e.semester,
        e.year
      FROM enrollment e
      JOIN course c ON e.course_id = c.id
      WHERE e.profile_id = $1
      GROUP BY c.id, c.course_code, c.course_name, c.section, e.semester, e.year
      ORDER BY e.year DESC, 
        CASE e.semester
          WHEN 'Fall' THEN 3
          WHEN 'Summer' THEN 2
          WHEN 'Spring' THEN 1
        END DESC
    `,
      [profileId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(
      "GET /dashboard/students/:studentId/courses error:",
      error.response?.data || error,
    );
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
});

export default router;
