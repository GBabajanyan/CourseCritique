import express from "express";
import pool from "../db-config.js";

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

export default router;
