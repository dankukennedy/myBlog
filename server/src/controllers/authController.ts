import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import   prisma  from "../config/db.js";
import type { LoginInput, RegisterInput } from "../types/index.js";

export const register = async (req: Request<{},{}, RegisterInput>, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio } });
    } catch (error:unknown) {
        res.status(500).json({ message: "Registration failed" });
        next(error);
    }
};

export const login = async (req: Request<{},{}, LoginInput>, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio } });
    } catch (error:unknown) {
        res.status(500).json({ message: "Login failed" });
        next(error);
    }
};