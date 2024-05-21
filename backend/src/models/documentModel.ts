import { z } from "zod";

export const documentSchema: Zod.Schema = z.object({
  userId: z.string(),
  url: z.string().url(),
});
