import express from "express";
import { authRouter } from "./authRoutes";

const mainrouter = express.Router();

mainrouter.use("/auth", authRouter);

export default mainrouter;
