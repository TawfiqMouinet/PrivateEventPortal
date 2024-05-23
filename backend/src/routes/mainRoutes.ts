import express from "express";
import { authRouter } from "./authRoutes";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadRoute";
import { docRouter } from "./docRoutes";

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

export default mainrouter;
