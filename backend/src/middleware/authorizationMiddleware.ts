import { NextFunction, Request, Response } from "express";
import type { User } from "@prisma/client";

interface AuthRequest extends Request {
  user?: User;
}

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};

export const isOrganizer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "ORGANIZER") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};
