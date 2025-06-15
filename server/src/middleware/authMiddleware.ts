import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthService } from "../service/auth/auth.service";

interface DecodedToken extends JwtPayload {
  userId: string;
}

declare global {
  /* eslint-disable @typescript-eslint/no-namespace  */
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}

export default async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = request.cookies.token;

    if (!token) {
      response.status(401).json({
        error: "Unauthorized - No token provided!",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded) {
      response.status(401).json({
        error: "Unauthorized - Invalid token",
      });
      return;
    }

    const authService = new AuthService();
    const user = await authService.getUserById(decoded.userId);

    if (!user) {
      response.status(404).json({
        error: "User not found",
      });
      return;
    }

    request.user = user;

    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      response.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}
