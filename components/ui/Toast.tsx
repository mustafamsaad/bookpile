"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  toast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)] backdrop-blur-sm animate-in slide-in-from-right",
        toast.type === "success"
          ? "border-ok/25 bg-ok/10 text-foreground"
          : "border-accent/30 bg-accent/10 text-foreground"
      )}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-ok" strokeWidth={1.75} />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
      )}
      <span className="font-medium">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 shrink-0 opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
