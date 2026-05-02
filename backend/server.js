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

const allowedOrigins = [
  "http://localhost:3000", // Web dev
  "http://localhost:8081", // Expo web
  "exp://localhost:8081", // Expo dev
  "https://yourdomain.com", // Production web
  "exp://exp.host/@yourusername/your-app", // Expo production
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600, 
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

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
