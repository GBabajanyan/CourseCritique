import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/mobileApp/auth.js";
import feedbackRoutes from "./routes/mobileApp/feedback.js";
import coursesRoutes from "./routes/mobileApp/courses.js";
import courseRoutes from "./routes/dashboard/course.js";
import dashboardRoutes from "./routes/dashboard/dashboard.js";
import cookieParser from "cookie-parser";
import pool from "./db-config.js";
import verifyToken from "./routes/middleware/verifyToken.js";
import requireRole from "./routes/middleware/roleCheck.js";

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

const dashboardAccesRoles = ["admin", "instructor"];
const MobileAppAccessRoles = ["student"];

app.use(
  "/auth",
  authRoutes,
  requireRole([...MobileAppAccessRoles, ...dashboardAccesRoles]),
);
app.use(
  "/feedback",
  feedbackRoutes,
  verifyToken,
  requireRole(MobileAppAccessRoles),
);
app.use(
  "/courses",
  coursesRoutes,
  verifyToken,
  requireRole(MobileAppAccessRoles),
);

app.use("/dashboard", dashboardRoutes, requireRole(dashboardAccesRoles));
app.use("/dashboard/courses", courseRoutes, requireRole(dashboardAccesRoles));

app.get("/profile/me", verifyToken, async (req, res) => {
  try {
    const { rows: profileRows } = await pool.query(
      `SELECT * FROM profile_users WHERE "userId" = $1`,
      [req.userData.auth_id],
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
  res.json({ message: "CC" }).status(200);
});

app.listen(PORT, () => console.log("listening to PORT " + PORT));
