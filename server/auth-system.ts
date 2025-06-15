// File structure:
// - src/
//   - index.ts
//   - config.ts
//   - db/
//     - schema.ts
//     - index.ts
//   - auth/
//     - controller.ts
//     - middleware.ts
//     - service.ts
//     - validation.ts
//   - types/
//     - index.ts

// src/config.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "auth_db",
  },
};

// src/types/index.ts
export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

// src/db/schema.ts
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

export const db = drizzle(pool);

// src/auth/validation.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// src/auth/service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { users, refreshTokens } from "../db/schema";
import { config } from "../config";
import { AuthResponse, TokenPayload } from "../types";

export class AuthService {
  async register(email: string, password: string): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id, email: users.email });

    // Generate tokens
    return this.generateTokens(user.id, user.email);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate tokens
    return this.generateTokens(user[0].id, user[0].email);
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    // Find refresh token
    const refreshTokenRecord = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token));

    if (refreshTokenRecord.length === 0) {
      throw new Error("Invalid refresh token");
    }

    // Check if token is expired
    if (new Date() > refreshTokenRecord[0].expiresAt) {
      // Delete expired token
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.id, refreshTokenRecord[0].id));
      throw new Error("Refresh token expired");
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, refreshTokenRecord[0].userId));

    if (user.length === 0) {
      throw new Error("User not found");
    }

    // Delete old refresh token (token rotation)
    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.id, refreshTokenRecord[0].id));

    // Generate new tokens
    return this.generateTokens(user[0].id, user[0].email);
  }

  async logout(token: string): Promise<void> {
    // Delete refresh token
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  }

  private async generateTokens(
    userId: string,
    email: string
  ): Promise<AuthResponse> {
    const tokenPayload: TokenPayload = { userId, email };

    // Generate access token
    const accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: config.accessTokenExpiry,
    });

    // Generate refresh token
    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Store refresh token
    await db.insert(refreshTokens).values({
      userId,
      token: refreshToken,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: { id: userId, email },
    };
  }
}

// src/auth/middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { TokenPayload } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// src/auth/controller.ts
import { Request, Response } from "express";
import { AuthService } from "./service";
import { registerSchema, loginSchema, refreshTokenSchema } from "./validation";
import { ZodError } from "zod";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = registerSchema.parse(req.body);
      const result = await authService.register(email, password);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await authService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);
      const result = await authService.refreshToken(refreshToken);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);
      await authService.logout(refreshToken);
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProtectedData(req: Request, res: Response) {
    return res.status(200).json({
      message: "Protected data",
      user: req.user,
    });
  }
}

// src/index.ts
import express from "express";
import cors from "cors";
import { config } from "./config";
import { AuthController } from "./auth/controller";
import { authenticate } from "./auth/middleware";

const app = express();
const authController = new AuthController();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.post("/api/auth/refresh-token", authController.refreshToken);
app.post("/api/auth/logout", authController.logout);

// Protected routes
app.get("/api/protected", authenticate, authController.getProtectedData);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// package.json
/*
{
  "name": "auth-system",
  "version": "1.0.0",
  "description": "JWT Authentication System with Refresh Tokens",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn src/index.ts",
    "db:migration": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "drizzle-orm": "^0.29.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "uuid": "^9.0.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.0",
    "@types/pg": "^8.10.9",
    "@types/uuid": "^9.0.7",
    "drizzle-kit": "^0.20.3",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.2"
  }
}
*/

// .env (example)
/*
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auth_db
*/

// drizzle.config.ts
/*
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
  },
});
*/
