import express from "express";
import { authRouter } from "./authRoutes";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadRoute";
import { docRouter } from "./docRoutes";
import { eventsRouter } from "./eventRoutes";
import { regRouter } from "./regRoutes";

const mainrouter = express.Router();

mainrouter.use("/auth", authRouter);
mainrouter.use("/docs", docRouter);
mainrouter.use(
  "/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      isDev: true,
    },
  })
);
mainrouter.use("/events", eventsRouter);
mainrouter.use("/registrations", regRouter);

export default mainrouter;
