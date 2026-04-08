import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../../db-config.js";

dotenv.config();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("No token provided. Please login first.");
      return res.status(401).json({
        message: "No token provided. Please login first.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("invalid token format. Use Bearer <token>");
      return res.status(401).json({
        message: "Invalid token format. Use Bearer <token>",
      });
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const result = await pool.query(
      `
      SELECT 
        u.id as auth_id,
        p.id as profile_id,
        u.username,
        p."studentId",
        p.name,
        p.role
      FROM auth_users u
      JOIN profile_users p ON u.id = p."userId"
      WHERE u.id = $1
    `,
      [decoded.id],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userData = result.rows[0];
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.error("verifyToken error:", error.response?.data);
      return res.status(401).json({
        message: "Invalid token. Please login again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      console.error("verifyToken error:", error);
      return res.status(401).json({
        message: "Token expired. Please refresh your token.",
      });
    }

    console.error("verifyToken error:", error.response?.data || error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyToken;
