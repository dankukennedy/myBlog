import  Express  from "express";

import { createBlog, getBlogs, getUserBlogs, updateBlog, deleteBlog, getBlogById} from "../controllers/blogController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Express.Router();

router.post("/blogs", authMiddleware, createBlog);
router.get("/blogs", getBlogs);
router.get("/my-blogs", authMiddleware, getUserBlogs);
router.get("/blogs/:id", authMiddleware, getBlogById);
router.put("/blogs/:id", authMiddleware, updateBlog);
router.delete("/blogs/:id", authMiddleware, deleteBlog);

export default router;