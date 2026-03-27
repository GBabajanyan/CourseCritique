import express from "express";
import pool from "../db-config.js";
import { verifyToken } from "./verifyToken.js";
const router = express.Router();

router.get("/pending", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
      f.id,
      c.course_code,
      c.course_name,
      c.section,
      c.instructor,
      f.deadline,
      f.feedback_phase
    FROM feedback f
    JOIN course c ON f.course_id = c.id
    WHERE f.user_id = $1
      AND f.status = 'pending'
    ORDER BY f.deadline ASC`,
      [req.user.userId],
    );
    res.send(result.rows);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});
export default router;
