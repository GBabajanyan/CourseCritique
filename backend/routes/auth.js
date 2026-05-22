import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db-config.js";
import { generateAuthToken, generateRefreshToken } from "../util/util.js";

const router = express.Router();

/**
 * @openapi
 * /auth/user_reg:
 *   post:
 *     summary: Register a new user
 *     description: Creates an auth account and a student profile in a single transaction. The username is derived from the email prefix (e.g. `john.smith@uni.edu` → `john.smith`).
 *     tags:
 *       - Authentication
 *     security: []
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
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.smith@university.edu
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword123
 *               role:
 *                 type: string
 *                 enum: [student, instructor, admin]
 *                 example: student
 *               degree:
 *                 type: string
 *                 example: Computer Science
 *               year:
 *                 type: string
 *                 example: "2"
 *               studentid:
 *                 type: string
 *                 example: S12345
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: A user with that email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 */
router.post("/user_reg", async (req, res) => {
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
      "Select username FROM auth_users WHERE email = $1",
      [email],
    );

    if (userCheck.rows.length) {
      return res
        .status(400)
        .json({ message: "User with specified email already exists" });
    }

    const username = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth_user = await pool.query(
      "INSERT INTO auth_users (username, email, password_hash, is_active) VALUES ($1, $2, $3, true) RETURNING *",
      [username, email, hashedPassword],
    );
    const registered_user = auth_user.rows[0].id;

    await pool.query(
      `INSERT INTO profile_users ("userId","firstName","lastName", email, degree, year, "studentId", role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        registered_user,
        firstName,
        lastName,
        email,
        degree,
        year,
        studentid,
        role,
      ],
    );
    await pool.query("COMMIT");

    res.status(201).json({ error: "Student not found" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error.message);
    res.status(500).send("Server Error: Register");
  }
});

/**
 * @openapi
 * /auth/user_login:
 *   post:
 *     summary: Authenticate user
 *     description: Accepts a username or email plus password. Returns a short-lived `authToken` (JWT) and a 30-day `refreshToken` together with the full user profile.
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: User's email or username
 *                 example: john.smith
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/AuthTokens'
 *                 - type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid username/email or incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 */
router.post("/user_login", async (req, res) => {
  try {
    const { login, password } = req.body;

    const checkUserQuery =
      "SELECT * FROM auth_users WHERE username = $1 OR email = $1";
    const { rows } = await pool.query(checkUserQuery, [login]);
    const user = rows[0];

    if (!user)
      return res.status(400).json({ message: "Invalid Username/Email" });

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch)
      return res.status(400).json({ message: "Incorrect Password" });

    const { rows: profileRows } = await pool.query(
      `SELECT * FROM profile_users WHERE "userId" = $1`,
      [user.id],
    );

    if (!profileRows.length) throw new Error("User profile not found");

    const profile = profileRows[0];
    const userProfile = {
      ...profile,
      created_at: undefined,
      join_date: profile.created_at,
    };

    const refreshToken = generateRefreshToken(user.id);
    await pool.query(
      `UPDATE auth_users 
     SET refresh_token = $1, 
         refresh_token_expires = NOW() + INTERVAL '30 days',
         last_login = NOW()
     WHERE id = $2`,
      [refreshToken, user.id],
    );

    res.json({
      user: userProfile,
      authToken: generateAuthToken(user.id),
      refreshToken,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error.message, error);
    res.status(500).send("Server Error: Login");
  }
});

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Exchanges a valid refresh token for a new auth token and a rotated refresh token. The old refresh token is invalidated on success.
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token received at login
 *     responses:
 *       200:
 *         description: New token pair issued
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/AuthTokens'
 *                 - type: object
 *                   properties:
 *                     userProfile:
 *                       $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Refresh token missing, invalid, or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 */
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
    );

    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const { userId } = decoded;

    const userQuery = await pool.query(
      "SELECT * FROM auth_users WHERE id = $1 AND refresh_token = $2",
      [userId, refreshToken],
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: "Refresh token not valid" });
    }

    const newAuthToken = generateAuthToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    await pool.query("UPDATE auth_users SET refresh_token = $1 WHERE id = $2", [
      newRefreshToken,
      userId,
    ]);

    const { rows: profileRows } = await pool.query(
      `SELECT * FROM profile_users WHERE "userId" = $1`,
      [userId],
    );

    let userProfile;
    if (profileRows.length) {
      const profile = profileRows[0];
      userProfile = {
        ...profile,
        created_at: undefined,
        join_date: profile.created_at,
      };
    }

    res.json({
      authToken: newAuthToken,
      refreshToken: newRefreshToken,
      userProfile,
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @openapi
 * /auth/user_logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidates the provided refresh token by removing it from the database, effectively ending the session.
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to invalidate
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       400:
 *         description: Refresh token missing or not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 */
router.post("/user_logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
    );

    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const { userId } = decoded;

    const removeTokens = await pool.query(
      `UPDATE auth_users 
       SET refresh_token = NULL,
           refresh_token_expires = NULL
       WHERE id = $1 AND refresh_token = $2
       RETURNING id`,
      [userId, refreshToken],
    );

    if (!removeTokens.rowCount) {
      return res.status(400).json({ message: "Refresh token not deleted" });
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
});

export default router;
