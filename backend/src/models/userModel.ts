import { z } from "zod";

export const userSchema: Zod.Schema = z.object({
  name: z.string(),
  email: z.string().email(),
  hashedPassword: z.string(),
  role: z.enum(["ATTENDEE", "ORGANIZER", "ADMIN", "SUPPORT", "SUPERADMIN"]),
  verified: z.boolean(),
});
