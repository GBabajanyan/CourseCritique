import Expo from "expo-server-sdk";
import jwt from "jsonwebtoken";
const expo = new Expo();

export const generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "15h" });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_EXPIRES_IN || "30d",
    },
  );
};


