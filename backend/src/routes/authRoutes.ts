import express, { Request, Response } from "express";
import {
  register,
  login,
  createSession,
  logout,
  verifyToken,
  isUser,
} from "../controllers/authController";
import { User } from "@prisma/client";
import { validateSchema } from "../models/validateSchema";
import { userSchema } from "../models/userModel";

interface AuthRequest extends Request {
  user?: User;
}

export const authRouter = express.Router();

authRouter.post("/register", validateSchema(userSchema), register);
authRouter.post("/login", login, createSession);
authRouter.get("/logout", logout);
authRouter.get(
  "/getuser",
  verifyToken,
  isUser,
  (req: AuthRequest, res: Response) => {
    const user = req.user;
    res.status(202).json({ user });
  }
);
