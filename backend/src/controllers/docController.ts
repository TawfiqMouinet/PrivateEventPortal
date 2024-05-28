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
    const documents = await prisma.document.findMany();
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  if (req.body.docURL) {
    try {
      prisma.document.delete({
        where: {
          url: req.body.docURL,
        },
      });
      console.log("Document deleted successfully");
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};
