import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, response: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "15d",
  });

  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production",
    sameSite: "none",
    maxAge: 15 * 60 * 60 * 1000,
  });

  return token;
};
