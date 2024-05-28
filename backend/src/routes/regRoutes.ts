import express, { Request, Response } from "express";
import {
  createRegistration,
  getRegistrations,
  getEventRegistrations,
  deleteRegistration,
} from "../controllers/regController";
import { verifyToken, isUser } from "../controllers/authController";
import { isOrganizer } from "../middleware/authorizationMiddleware";

export const regRouter = express.Router();

regRouter.post("/create", verifyToken, isUser, createRegistration);
regRouter.get("/get", verifyToken, isUser, getRegistrations);
regRouter.get(
  "/getByEvent",
  verifyToken,
  isUser,
  isOrganizer,
  getEventRegistrations
);
regRouter.post("/delete", verifyToken, isUser, deleteRegistration);
