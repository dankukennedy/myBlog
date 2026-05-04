import type { Response, NextFunction } from "express";
import prisma from "../config/db.js";
import type { AuthRequest } from "../middleware/auth.js";

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Invalid user ID" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, username: true, email: true, avatar: true, bio: true }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error:unknown) {
        res.status(500).json({ message: "Failed to fetch user profile" });
        next(error);
    }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Invalid user ID" });
        }

        const { username, avatar, bio } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { username, avatar, bio }
        });
         if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user: updatedUser });
    } catch (error:unknown) {
        res.status(500).json({ message: "Failed to update user profile" });
        next(error);
    }
};