"use client";

import { Toast, ToastType } from "@/components/ui/toast";
import { createContext, useContext, useState, ReactNode } from "react";
import styled from "styled-components";

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const ToastViewport = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 24px;
  z-index: 50; /* Matches our Modal backdrop, effectively "top layer" */
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none; /* Let clicks pass through empty areas */
`;

// Wrap the Toast item so IT captures pointer events, but the container doesn't block buttons underneath
const ToastWrapper = styled.div`
  pointer-events: auto;
`;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        success: (msg) => addToast(msg, "success"),
        error: (msg) => addToast(msg, "error"),
      }}
    >
      {children}
      <ToastViewport>
        {toasts.map((t) => (
          <ToastWrapper key={t.id}>
            <Toast toast={t} onClose={() => removeToast(t.id)} />
          </ToastWrapper>
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
