import React, { createContext, useContext, ReactNode } from "react";
import { toast, ToastOptions } from "react-toastify";

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast deduplication
const shownToasts = new Set<string>();
const TOAST_TIMEOUT = 5000; // 5 seconds

function showUniqueToast(
  message: string,
  type: "success" | "error" | "info" | "warning",
  options?: ToastOptions
) {
  const key = `${type}-${message}`;
  if (!shownToasts.has(key)) {
    shownToasts.add(key);
    toast[type](message, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });

    // Remove from set after timeout to allow showing again if needed
    setTimeout(() => {
      shownToasts.delete(key);
    }, TOAST_TIMEOUT);
  }
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toastContext: ToastContextType = {
    success: (message: string, options?: ToastOptions) => {
      showUniqueToast(message, "success", options);
    },
    error: (message: string, options?: ToastOptions) => {
      showUniqueToast(message, "error", options);
    },
    info: (message: string, options?: ToastOptions) => {
      showUniqueToast(message, "info", options);
    },
    warning: (message: string, options?: ToastOptions) => {
      showUniqueToast(message, "warning", options);
    },
  };

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
    </ToastContext.Provider>
  );
};
