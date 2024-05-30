import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface DecodedJwtPayload extends JwtPayload {
  id: string;
}

interface AuthRequest extends Request {
  user?: DecodedJwtPayload;
  token?: string;
}

type Cookies = {
  [key: string]: string;
};

const SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, dob, role, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        hashedPassword: hashedPassword,
        name: name,
        role: role,
        dob: dob,
      },
    });
    console.log("User created successfully!");
    if (newUser.role === "ORGANIZER") {
      await prisma.organizer.create({
        data: {
          id: newUser.id,
        },
      });
      console.log("Organizer created successfully!");
    }
    res
      .status(201)
      .json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error in signup: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    console.log("Checking if user exists");
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Checking if password is correct");
    const isPasswordCorrect = bcrypt.compareSync(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      console.log("Password is incorrect");
      return res.status(402).json({ message: "Invalid credentials" });
    }

    console.log("Checking if user is verified");
    if (!user.verified) {
      console.log("User is not verified");
      return res.status(403).json({ message: "User is not verified" });
    }

    console.log("Generating JWT");
    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: "1d",
    });
    console.log("JWT generated successfully");
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in login: ", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createSession = async (req: AuthRequest, res: Response) => {
  if (req.user && req.token) {
    try {
      console.log("Creating session");
      const user = req.user;
      const decodedToken = jwt.verify(req.token, SECRET) as DecodedJwtPayload;
      console.log("Checking if token contains a userId claim");
      if (decodedToken && decodedToken.userId) {
        const { userId } = decodedToken;
        const session = await prisma.session.create({
          data: {
            jwt: req.token,
            userId: userId,
          },
        });
        const sessionId = session.id;
        res.cookie("sessionId", sessionId, { httpOnly: true });
        res.cookie("jwt", req.token, { httpOnly: true });
        res.status(200).json({
          message: "Login Successful!",
          user,
          cookie: { jwt: req.token },
          sessionId,
        });
      } else {
        res
          .status(400)
          .json({ message: "JWT does not contain a userId claim" });
      }
    } catch (error) {
      console.error("Session Creation Error: ", error);
      res.status(500).json({ message: "Server Error", error });
    }
  } else {
    res.status(500).json({ message: "No request token error" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  const cookieHeader = req.headers.cookie as string;
  if (!cookieHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const cookies: Cookies = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    cookies[key] = value;
  });
  const sessionId = cookies.sessionId;
  if (!sessionId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const deleted = await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });
    res.clearCookie("sessionId");
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    return res.status(405).json({ message: "Invalid Token", error });
  }
};

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const cookieHeader = req.headers.cookie as string;
  if (!cookieHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Initialize an empty object for cookies
  const cookies: Cookies = {};

  // Parse the cookies from the "cookie" header
  cookieHeader.split(";").forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    cookies[key] = value;
  });

  const token = cookies.jwt; // Get the JWT token from the cookies
  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET) as DecodedJwtPayload;
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(405).json({ message: "Invalid Token", error: error });
  }
};

export const isUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.userId) {
      const user = await prisma.user.findFirst({
        where: {
          id: req.user.userId,
        },
      });
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid user ID" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user) {
      const { name, email, dob } = req.body;
      const updatedUser = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          name: name,
          email: email,
          dob: dob,
        },
      });
      res.status(200).json({ message: "Profile updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: { error } });
  }
};

export const verifyUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.body.userId) {
      const user = await prisma.user.update({
        where: {
          id: req.body.userId,
        },
        data: {
          verified: true,
        },
      });
      res.status(200).json({ message: "User verified successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: { error } });
  }
};
