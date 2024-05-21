import { date, z } from "zod";

export const registrationSchema: Zod.Schema = z.object({
  eventId: z.string(),
  userId: z.string(),
  status: z.enum(["PENDING", "ATTENDED", "CANCELLED"]),
  date: z.date(),
});
