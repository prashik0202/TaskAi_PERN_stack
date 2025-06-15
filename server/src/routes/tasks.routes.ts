import { Router } from "express";
import { TaskController } from "../controller/tasks/tasks.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();
const taskController = new TaskController();

router.post("/:projectId", authMiddleware, taskController.createTask);
router.get("/:projectId", authMiddleware, taskController.getTasksByProjectId);
router.get("/:taskId/task", authMiddleware, taskController.getTask);
router.put("/:taskId/update", authMiddleware, taskController.updateTaskById);
router.patch("/:taskId", authMiddleware, taskController.updateTaskStatus);
router.delete("/:taskId", authMiddleware, taskController.deleteTask);

export default router;
