import express from "express";
import pool from "../../db-config.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.course_code as "courseCode",
        c.course_name as "courseName",
        c.instructor,
        c.department,
        c.section,
        c.credits,
        NULL as stats
      FROM course c
      LEFT JOIN enrollment e ON c.id = e.course_id
      LEFT JOIN feedback f ON c.id = f.course_id
      GROUP BY department,course_code, instructor,c.id
      ORDER BY course_code ASC,instructor ASC
      `);

    res.json(result.rows);
  } catch (error) {
    console.error("GET /courses error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

export default router;
