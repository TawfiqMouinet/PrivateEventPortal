import { NextFunction, Request, Response } from "express";

export const validateSchema = (schema: Zod.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const isValid = schema.parseAsync(req.body);
      if (!isValid) {
        res.status(400).json({ message: "Invalid request body" });
      } else {
        next();
      }
    } catch (error: any) {
      console.log("Not Validated");
      res.status(406).json({ error });
    }
  };
};
