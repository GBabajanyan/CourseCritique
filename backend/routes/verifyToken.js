import jwt from "jsonwebtoken";
import pool from "../db-config.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided. Please login first.",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid token format. Use Bearer <token>",
    });
  }
  const token = authHeader.substring(7);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = {
    userId: decoded.userId,
    // Add any other fields from token if needed
  };
  next();
};
