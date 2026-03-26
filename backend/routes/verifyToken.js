import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = async (req, res, next) => {
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

    req.user = {
      userId: decoded.id,
    };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.log("invalid token");
      return res.status(401).json({
        message: "Invalid token. Please login again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      console.log("expired token");
      return res.status(401).json({
        message: "Token expired. Please refresh your token.",
      });
    }

    console.error("Auth error:", error);
    return res.status(500).json({
      message: "Authentication failed.",
    });
  }
};
