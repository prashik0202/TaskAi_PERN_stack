import { Router } from "express";
import { ProjectController } from "../controller/project/project.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

const projectController = new ProjectController();

router.post("/:userId", authMiddleware, projectController.createProject);
router.get("/:id", authMiddleware, projectController.getProjectById);
router.get(
  "/user/:userId",
  authMiddleware,
  projectController.getProjectsByUserId
);
router.put("/:id", authMiddleware, projectController.updateProject);
router.delete("/:id", authMiddleware, projectController.deleteProject);
router.patch("/:id/archive", authMiddleware, projectController.archiveProject);

export default router;
