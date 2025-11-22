"use client";

import { Toast, ToastType } from "@/components/ui/toast";
import { createContext, useContext, useState, ReactNode } from "react";

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

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
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          padding: "24px",
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ marginBottom: "10px" }}>
            <Toast toast={t} onClose={() => removeToast(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
