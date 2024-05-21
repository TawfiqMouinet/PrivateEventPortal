import { title } from "process";
import { z } from "zod";

export const eventSchema: Zod.Schema = z.object({
  organizerId: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  date: z.date(),
});
