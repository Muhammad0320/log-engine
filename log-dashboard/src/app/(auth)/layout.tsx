import {
  AuthCard,
  AuthContainer,
  AuthTitle,
} from "@/components/features/auth/AuthCompoents";
import { ReactNode } from "react";
// We'll reuse the styled components, but refactored slightly

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthContainer>
      <AuthCard>
        <AuthTitle>LogEngine</AuthTitle>
        {children}
      </AuthCard>
    </AuthContainer>
  );
}
