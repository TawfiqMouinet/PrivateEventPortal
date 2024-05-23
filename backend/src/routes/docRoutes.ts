import express, { Request, Response } from "express";
import {
  createDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/docController";
import { verifyToken, isUser } from "../controllers/authController";
import { isAdmin } from "../middleware/authorizationMiddleware";

export const docRouter = express.Router();

docRouter.post("/create", createDocument);
docRouter.get("/get", verifyToken, isUser, isAdmin, getDocuments);
docRouter.post("/delete", verifyToken, isUser, isAdmin, deleteDocument);
