import { useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { setGlobalToast } from "../services/apiClient";

const ToastInitializer: React.FC = () => {
  const toast = useToast();

  useEffect(() => {
    // Initialize global toast for API client
    setGlobalToast(toast);
  }, [toast]);

  return null; // This component doesn't render anything
};

export default ToastInitializer;
