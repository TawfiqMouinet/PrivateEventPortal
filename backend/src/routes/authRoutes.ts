import express, { Request, Response } from "express";
import {
  register,
  login,
  createSession,
  logout,
  updateProfile,
  verifyToken,
  isUser,
  verifyUser,
} from "../controllers/authController";
import { User } from "@prisma/client";
import { isAdmin } from "../middleware/authorizationMiddleware";

interface AuthRequest extends Request {
  user?: User;
}

export const authRouter = express.Router();

authRouter.post("/register", register);
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
authRouter.put("/update", verifyToken, isUser, updateProfile);
authRouter.put("/verify", verifyToken, isUser, isAdmin, verifyUser);
