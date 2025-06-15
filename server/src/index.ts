import { Express, Request, Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UserRoutes from "./routes/user.routes";
import ProjectRoutes from "./routes/project.routes";
import TaskRoutes from "./routes/tasks.routes";
dotenv.config();

const PORT = process.env.PORT || 8000;

// creating express app
const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json

// api health status
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "all OK!",
  });
});
app.use("/api/user", UserRoutes);
app.use("/api/project", ProjectRoutes);
app.use("/api/tasks", TaskRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
