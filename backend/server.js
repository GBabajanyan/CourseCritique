import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import feedbackRoutes from "./routes/feedback.js";
import course from "./routes/course.js";
import dashboard from "./routes/dashboard.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "./routes/verifyToken.js";
import pool from "./db-config.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(
//   cors({
//     origin:
//       process.env.MOBILE_URL || "localhost:8081" || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

app.use("/auth", authRoutes);
app.use("/feedback", feedbackRoutes, verifyToken);
app.use("/course", course);
app.use("/dashboard", dashboard);

app.get("/profile/me", verifyToken, async (req, res) => {
  try {

    const { rows: profileRows } = await pool.query(
      `SELECT * FROM profile_users WHERE "userId" = $1`,
      [req.user.userId],
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
    res.status(500).send("Server Error: Fetch Profile");
  }
});

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => console.log("listening to PORT " + PORT));
