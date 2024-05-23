import { Request, Response } from "express";
import type { User } from "@prisma/client";
import { prisma } from "../utils/db";

interface AuthRequest extends Request {
  user?: User;
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const [
      organizerId,
      title,
      description,
      location,
      date,
      maxAttendees,
      minAge,
    ] = req.body;
    const newEvent = await prisma.event.create({
      data: {
        organizerId: organizerId,
        title: title,
        description: description,
        location: location,
        date: date,
        minAge: minAge,
        maxAttendees: maxAttendees,
      },
    });
  } catch (error) {}
};
