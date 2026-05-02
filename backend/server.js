import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/mobileApp/auth.js";
import profileRoutes from "./routes/mobileApp/profile.js";
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

app.use("/auth", authRoutes);
app.use(
  "/profile",
  verifyToken,
  requireRole(MobileAppAccessRoles),
  profileRoutes,
);
app.use(
  "/feedback",
  verifyToken,
  requireRole(MobileAppAccessRoles),
  feedbackRoutes,
);
app.use(
  "/courses",
  verifyToken,
  requireRole(MobileAppAccessRoles),
  coursesRoutes,
);

app.use("/dashboard", requireRole(dashboardAccesRoles), dashboardRoutes);
app.use("/dashboard/courses", requireRole(dashboardAccesRoles), courseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CC" }).status(200);
});

app.listen(PORT, () => console.log("listening to PORT " + PORT));
