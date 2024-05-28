import express, { Request, Response } from "express";
import {
  createEvent,
  getEvents,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventsController";
import { verifyToken, isUser } from "../controllers/authController";
import { isOrganizer } from "../middleware/authorizationMiddleware";

export const eventsRouter = express.Router();

eventsRouter.post("/create", verifyToken, isUser, isOrganizer, createEvent);
eventsRouter.get("/get", verifyToken, isUser, getEvents);
eventsRouter.get(
  "/getByOrganizer",
  verifyToken,
  isUser,
  isOrganizer,
  getOrganizerEvents
);
eventsRouter.put("/update", verifyToken, isUser, isOrganizer, updateEvent);
eventsRouter.delete("/delete", verifyToken, isUser, isOrganizer, deleteEvent);
