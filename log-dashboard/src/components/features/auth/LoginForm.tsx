"use client";

import { useActionState, useState } from "react";
import styled from "styled-components";
import { loginAction } from "@/actions/auth";
import { AuthFormState } from "@/lib/definitions";
import { FieldError, GlobalError } from "@/components/ui/formErrors";
import { BorderBeamButton } from "@/components/ui/borderBeamButton";
import { Eye, EyeOff } from "lucide-react";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative; // For positioning the eye icon
`;

const Label = styled.label`
  font-size: 13px;
  color: #8b949e;
  margin-bottom: 6px;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  background: #0d1117;
  border: 1px solid ${(props) => (props.$hasError ? "#ff6b6b" : "#30363d")};
  color: #fff;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${(props) => (props.$hasError ? "#ff6b6b" : "#58a6ff")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError ? "rgba(255,107,107,0.1)" : "rgba(88,166,255,0.1)"};
  }
`;

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #8b949e;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    color: #c9d1d9;
  }
`;

const initialState: AuthFormState = { errors: {} };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(loginAction, initialState);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form action={formAction}>
      <GlobalError errors={state.errors._form} />

      <FormGroup>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@logengine.com"
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
          Initialize Session
        </BorderBeamButton>
      </div>
    </Form>
  );
}
