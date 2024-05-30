import { Request, Response } from "express";
import type { User } from "@prisma/client";
import { prisma } from "../utils/db";
import { Registration } from "@prisma/client";
import {
  couldStartTrivia,
  decodedTextSpanIntersectsWith,
  isQuestionDotToken,
} from "typescript";
import { deepStrictEqual } from "assert";
import { getFips } from "crypto";
import { setDefaultAutoSelectFamily } from "net";

interface AuthRequest extends Request {
  user?: User;
}

export const createRegistration = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.id) {
      const event = req.body.event;
      const existingRegistration = await prisma.registration.findFirst({
        where: {
          userId: req.user.id,
          eventId: event.id,
        },
      });
      if (existingRegistration) {
        res.status(400).json({ message: "Registration already exists" });
        return;
      }
      if (event.maxAttendees - event.registrations.length <= 0) {
        res.status(400).json({ message: "Event seats are full" });
        return;
      }
      const newRegistration = await prisma.registration.create({
        data: {
          userId: req.user?.id!,
          eventId: event.id,
        },
      });
      res.status(201).json({ message: "Registration created successfully" });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.id) {
      const registrations = await prisma.registration.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          event: true,
        },
      });
      res.status(200).json(registrations);
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteRegistration = async (req: AuthRequest, res: Response) => {
  try {
    if (req.body.eventId && req.user?.id) {
      await prisma.registration.delete({
        where: {
          eventId_userId: {
            eventId: req.body.eventId,
            userId: req.user.id,
          },
        },
      });
      res.status(200).json({ message: "Registration deleted successfully" });
    } else if (req.user?.id) {
      const regId = req.body.regId;
      await prisma.registration.delete({
        where: {
          id: regId,
        },
      });
      res.status(200).json({ message: "Registration deleted successfully" });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEventRegistrations = async (req: Request, res: Response) => {
  try {
    const eventId = req.body.eventId;
    const registrations = await prisma.registration.findMany({
      where: {
        eventId: eventId,
      },
    });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
