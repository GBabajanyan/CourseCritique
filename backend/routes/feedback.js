import express from "express";
import { verifyToken } from "./verifyToken";
const router = express.Router();

router.get("/feedback", verifyToken, async (req, res) => {
  try {
    await pool.query(`SELECT * FROM feedback`, (err, result) => {
      if (err) {
        res.send({ err });
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
