"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
    id: string;
    title?: string;
    description?: string;
    variant?: "default" | "success" | "error" | "warning";
    duration?: number;
}

interface ToastContextType {
    toasts: ToastProps[];
    addToast: (toast: Omit<ToastProps, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
    undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastProps[]>([]);

    const addToast = React.useCallback(
        (toast: Omit<ToastProps, "id">) => {
            const id = Math.random().toString(36).substring(7);
            const newToast = { ...toast, id };
            setToasts((prev) => [...prev, newToast]);

            // Auto remove after duration
            const duration = toast.duration || 5000;
            setTimeout(() => {
                removeToast(id);
            }, duration);
        },
        []
    );

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

function ToastContainer({
    toasts,
    removeToast,
}: {
    toasts: ToastProps[];
    removeToast: (id: string) => void;
}) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function Toast({
    title,
    description,
    variant = "default",
    onClose,
}: ToastProps & { onClose: () => void }) {
    const variantStyles = {
        default: "bg-card border-border",
        success: "bg-green-500/10 border-green-500/50 text-green-500",
        error: "bg-red-500/10 border-red-500/50 text-red-500",
        warning: "bg-yellow-500/10 border-yellow-500/50 text-yellow-500",
    };

    return (
        <div
            className={cn(
                "pointer-events-auto w-full rounded-xl border-2 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-right-full",
                variantStyles[variant]
            )}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                    {title && (
                        <p className="text-sm font-semibold leading-none">{title}</p>
                    )}
                    {description && (
                        <p className="text-sm opacity-90 leading-relaxed">{description}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="rounded-lg p-1 hover:bg-background/50 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
