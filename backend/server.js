import express from "express";
import pool from "./db-config.js";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import feedbackRoutes from "./routes/feedback.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "./routes/verifyToken.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "localhost:8081",
    credentials: true,
  }),
);

app.use("/auth", authRoutes);
app.use("/feedback", feedbackRoutes, verifyToken);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/course", verifyToken, async (req, res) => {
  try {
    await pool.query(`SELECT * FROM course`, (err, result) => {
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

app.listen(PORT, () => console.log("listening to PORT " + PORT));
