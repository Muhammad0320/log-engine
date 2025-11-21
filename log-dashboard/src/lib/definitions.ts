import { z } from "zod";

export interface AuthFormState {
  errors: {
    email?: string[];
    password?: string[];
    name?: string[];
    _form?: string[];
  };

  message?: string[];
}

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { error: "password field must be at least 8 characters long" }),
});
