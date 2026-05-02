import express from "express";

import pool from "../../db-config.js";

const router = express.Router();

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
