import express from "express";
import pool from "../../db-config.js";

const router = express.Router();

/**
 * @openapi
 * /dashboard/students/create:
 *   post:
 *     summary: Create a student profile
 *     description: Adds a new student profile (without creating an auth account). Useful for pre-populating students before they self-register. Fails if the studentId already exists. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Students
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - studentid
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [student, instructor, admin]
 *                 default: student
 *               degree:
 *                 type: string
 *                 example: Computer Science
 *               year:
 *                 type: string
 *                 example: "1"
 *               studentid:
 *                 type: string
 *                 example: S99999
 *     responses:
 *       201:
 *         description: Student profile created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: A student with that studentId already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /dashboard/students/{studentId}:
 *   get:
 *     summary: Get student details
 *     description: Returns profile information and total completed feedback count for a single student, looked up by university student ID. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: University-assigned student ID (e.g. S12345)
 *     responses:
 *       200:
 *         description: Student profile with feedback count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Internal profile UUID
 *                 studentId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 year:
 *                   type: string
 *                 degree:
 *                   type: string
 *                 join_date:
 *                   type: string
 *                   format: date-time
 *                 total_feedbacks:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /dashboard/students/{studentId}/courses:
 *   get:
 *     summary: Get courses enrolled by a student
 *     description: Returns the list of courses a student is enrolled in, ordered by most recent semester first. Requires admin or instructor role.
 *     tags:
 *       - Dashboard - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: University-assigned student ID (e.g. S12345)
 *     responses:
 *       200:
 *         description: List of enrolled courses
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
 *                   section:
 *                     type: string
 *                   instructor:
 *                     type: string
 *                   department:
 *                     type: string
 *                   semester:
 *                     type: string
 *                     enum: [Fall, Spring, Summer]
 *                   year:
 *                     type: integer
 *                     example: 2025
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin or instructor role required
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
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
