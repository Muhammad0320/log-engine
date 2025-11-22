"use client";

import { useActionState } from "react";
import styled from "styled-components";
import { loginAction } from "@/actions/auth";
import { AuthFormState } from "@/lib/definitions";
import { FieldError, GlobalError } from "@/components/ui/formErrors";
import { BorderBeamButton } from "@/components/ui/borderBeamButton";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  color: #8b949e;
  margin-bottom: 6px;
`;

const Input = styled.input<{ hasError?: boolean }>`
  background: #0d1117;
  border: 1px solid
    ${(props) => (props.hasError ? "#ff6b6b" : "var(--border-color)")};
  color: #fff;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${(props) => (props.hasError ? "#ff6b6b" : "#58a6ff")};
  }
`;

const initialState: AuthFormState = { errors: {} };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(loginAction, initialState);

  return (
    <Form action={formAction}>
      <GlobalError errors={state.errors._form} />

      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          hasError={!!state.errors.email}
        />
        <FieldError errors={state.errors.email} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          hasError={!!state.errors.password}
        />
        <FieldError errors={state.errors.password} />
      </FormGroup>

      <div style={{ marginTop: "10px" }}>
        <BorderBeamButton type="submit" isLoading={isPending}>
          Sign In
        </BorderBeamButton>
      </div>
    </Form>
  );
}
