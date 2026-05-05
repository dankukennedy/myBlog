import type { Request, Response, NextFunction } from "express";
import prisma from "../config/db.js";
import type { AuthRequest } from "../middleware/auth.js";

export const createBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Invalid user ID" });
        }

        const { title, content,image,published } = req.body;

        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                image,
                published,
                authorId: req.userId
            }
        });
          if(!blog) {
            return res.status(400).json({ message: "Failed to create blog post" });
        }
        res.status(201).json({ blog });
    } catch (error:unknown) {
        res.status(500).json({ message: "Failed to create blog post" });
        next(error);
    }
}

export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await prisma.blog.findMany({
            where: { published: true },
            include: { author: { select: { username: true } } }
        });
          if(!blogs || blogs.length === 0) {
            return res.status(404).json({ message: "No blog posts found" });
        }
        res.json({ blogs });
    } catch (error:unknown) {
        res.status(500).json({ message: "Failed to fetch blog posts" });
        next(error);
    }
}

export const getUserBlogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Invalid user ID" });
        }

        const blogs = await prisma.blog.findMany({
            where: { authorId: req.userId },
            include: { author: { select: { username: true , avatar:true} } },
                orderBy: { createdAt: "desc" }
        });
        if (!blogs) {
            return res.status(404).json({ message: "No blog posts found for this user" });
        }

        res.json({ blogs });
    } catch (error:unknown) {
        res.status(500).json({ message: "Failed to fetch user's blog posts" });
        next(error);
    }
}

export const getBlogById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const blogId = id as string;

        if(!blogId){
            return res.status(400).json({ message: "Blog ID is required" });
        }

        const blog = await prisma.blog.findUnique({
            where: { id: blogId },
            include: { author: { select: { username: true, avatar: true } } }
        });

        if (!blog || !blog.published) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        res.json({ blog });
    } catch (error:unknown) {
        res.status(500).json({ message: "Failed to fetch blog post" });
        next(error);
    }
}

export const updateBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const blogId = id as string;

        if (!req.userId) {
            return res.status(401).json({ message: "Invalid user ID" });
        }

        const { title, content, image, published } = req.body;

        const blog = await prisma.blog.update({
            where: { id: blogId },
            data: {
                title,
                content,
                image,
                published
            }
        });

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        res.json({ blog });
    } catch (error:unknown) {
        res.status(500).json({ message: "Failed to update blog post" });
        next(error);
    }
}

export const deleteBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const blogId = id as string;

        if (!req.userId) {
            return res.status(401).json({ message: "Invalid user ID" });
        }

        const blog = await prisma.blog.delete({
            where: { id: blogId }
        });
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        res.json({ message: "Blog post deleted successfully" });
    } catch (error:unknown) {
        res.status(500).json({ message: "Failed to delete blog post" });
        next(error);
    }
}
