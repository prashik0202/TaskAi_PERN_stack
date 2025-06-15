import express from "express";
import { UserController } from "../controller/user/user.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();
const userController = new UserController();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.put("/update/:userId", authMiddleware, userController.updateUser);
router.get("/me", authMiddleware, userController.getUser);
router.post("/logout", authMiddleware, userController.logout);

export default router;
