import { fetchClient } from "@/lib/client";
import {
  AuthFormState,
  LoginFormSchema,
  RegisterFormSchema,
} from "@/lib/definitions";
import { setSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = "http://localhost:8080/api/v1";

interface LoginResponse {
  token: string;
}

export async function loginAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedSchema = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedSchema.success) {
    return {
      errors: validatedSchema.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedSchema.data;

  try {
    const data = await fetchClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    await setSession(data.token);
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message || "Invalid credentials"],
        },
      };
    }
    return {
      errors: { _form: ["Failed to connect to the server. Please try again!"] },
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function registerAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedRegisterSchema = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedRegisterSchema.success) {
    return {
      errors: validatedRegisterSchema.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedRegisterSchema.data;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        errors: { _form: [data.error || "Registration failed"] },
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    }
    return {
      errors: { _form: ["Failed to connect to the server. Please try again!"] },
    };
  }

  redirect("/");
}
