import Express from "express";
import { authMiddleware } from "../middleware/auth.js";
const router = Express.Router();
import { getProfile, updateProfile } from "../controllers/userController.js";

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;