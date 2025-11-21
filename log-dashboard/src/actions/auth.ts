import { AuthFormState, LoginFormSchema } from "@/lib/definitions";
import { setSession } from "@/lib/session";
import { redirect } from "next/navigation";

const API_URL = "http://localhost:8080/api/v1";

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
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        errors: {
          _form: [data.error || "Invalid credentials"],
        },
      };
    }

    await setSession(data.token);
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
