"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/actions/auth";
import { AuthFormState } from "@/lib/definitions";
import { FieldError, GlobalError } from "@/components/ui/formErrors";
import { BorderBeamButton } from "@/components/ui/borderBeamButton";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormGroup,
  Input,
  InputWrapper,
  Label,
  TogglePasswordBtn,
} from "./AuthStyles";

const initialState: AuthFormState = { errors: {} };

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(registerAction, initialState);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form action={formAction}>
      <GlobalError errors={state.errors._form} />

      <FormGroup>
        <Label htmlFor="name">Full Name</Label>
        <Input
          name="name"
          type="text"
          placeholder="Han Solo"
          $hasError={!!state.errors.name}
        />
        <FieldError errors={state.errors.name} />
      </FormGroup>

      <FormGroup>
        <label
          style={{ fontSize: "13px", color: "#8b949e", marginBottom: "6px" }}
        >
          Email
        </label>
        <Input
          name="email"
          type="email"
          placeholder="pilot@falcon.com"
          $hasError={!!state.errors.email}
        />
        <FieldError errors={state.errors.email} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <InputWrapper>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            $hasError={!!state.errors.password}
          />
          <TogglePasswordBtn
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1} // Skip tab focus
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </TogglePasswordBtn>
        </InputWrapper>
        <FieldError errors={state.errors.password} />
      </FormGroup>

      <div style={{ marginTop: "16px" }}>
        <BorderBeamButton type="submit" isLoading={isPending}>
          Create Account
        </BorderBeamButton>
      </div>
    </Form>
  );
}
