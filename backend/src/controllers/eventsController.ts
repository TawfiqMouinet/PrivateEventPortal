import { Request, Response } from "express";
import type { User } from "@prisma/client";
import { prisma } from "../utils/db";

interface AuthRequest extends Request {
  user?: User;
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      organizerId,
      title,
      description,
      location,
      date,
      maxAttendees,
      minAge,
    } = req.body;
    const newEvent = await prisma.event.create({
      data: {
        organizerId: organizerId,
        title: title,
        description: description,
        location: location,
        date: date,
        maxAttendees: maxAttendees,
        minAge: minAge,
      },
    });
    console.log("Event created successfully!");
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        registrations: {
          include: {
            user: true,
          },
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOrganizerEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        organizerId: req.user?.id,
      },
      include: {
        registrations: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id, title, description, location, date, maxAttendees, minAge } =
      req.body;
    const updatedEvent = await prisma.event.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        location: location,
        date: date,
        maxAttendees: maxAttendees,
        minAge: minAge,
      },
    });
    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await prisma.event.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
