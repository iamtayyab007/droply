import * as z from "zod";
export const signupSchema = z
  .object({
    email: z.email({ message: "please enter a valid email address" }),
    password: z
      .string()
      .min(5, { message: "password should be min 5 characters" }),
    confirmPassword: z
      .string()
      .min(5, { message: "password should be min 5 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password do not match",
    path: ["confirmPassword"],
  });
