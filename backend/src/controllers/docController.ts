import { Request, Response } from "express";
import type { User } from "@prisma/client";
import { prisma } from "../utils/db";

export const createDocument = async (req: Request, res: Response) => {
  if (req.body.docURL && req.body.user) {
    try {
      const newDoc = await prisma.document.create({
        data: {
          userId: req.body.user.id,
          url: req.body.docURL,
        },
      });
      res.status(201).json({ message: "Document created successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).json({
      message: "Bad request",
    });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      include: { user: true },
    });
    if (documents.length === 0) {
      return res.status(405).json({ message: "No documents found" });
    }
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  if (req.body.docId) {
    try {
      await prisma.document.delete({
        where: {
          id: req.body.docId,
        },
      });
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};
