import * as z from "zod";
export const signinSchema = z.object({
  identifier: z.email().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "password required" }),
});
