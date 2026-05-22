import express from "express";

import pool from "../../db-config.js";

const router = express.Router();

/**
 * @openapi
 * /profile/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the full profile of the authenticated student. Requires student role.
 *     tags:
 *       - Mobile - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — student role required
 *       500:
 *         description: Server error
 */
router.get("/me", async (req, res) => {
  try {
    const { rows: profileRows } = await pool.query(
      `SELECT * FROM profile_users WHERE id = $1`,
      [req.userData.profile_id],
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

    res.json({ user: userProfile });
  } catch (error) {
    console.log(error?.message);

    res.status(500).send("Server Error: Fetch Profile");
  }
});

/**
 * @openapi
 * /profile/badges:
 *   get:
 *     summary: Get all badges
 *     description: Returns all available badges ordered by section (milestones → quality → diversity → bonus). Requires student role.
 *     tags:
 *       - Mobile - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Badge'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — student role required
 *       500:
 *         description: Server error
 */
router.get("/badges", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM public.badge
ORDER BY 
  CASE section
    WHEN 'milestones' THEN 1
    WHEN 'quality' THEN 2
    WHEN 'diversity' THEN 3
    WHEN 'bonus' THEN 4
  END;
  `);

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error: Fetch Badges");
  }
});

export default router;
