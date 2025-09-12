import React, { useState } from "react";
import { Button, Box, CircularProgress, Alert } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import {
  googleAuthService,
  GoogleAuthResponse,
} from "../services/googleAuthService";
import { useToast } from "../contexts/ToastContext";

interface GoogleAuthButtonProps {
  onSuccess: (response: GoogleAuthResponse) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  text?: string;
  sx?: any;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  fullWidth = true,
  variant = "outlined",
  size = "large",
  text = "Continue with Google",
  sx,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This will redirect to the backend OAuth endpoint
      await googleAuthService.signInWithGoogle();
      // The page will redirect, so this won't execute
    } catch (err: any) {
      const errorMessage = err.message || "Google sign-in failed";
      setError(errorMessage);
      onError?.(err);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Box sx={sx}>
      <Button
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        onClick={handleGoogleSignIn}
        startIcon={isLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
        sx={{
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 500,
          textTransform: "none",
          borderColor: "#dadce0",
          color: "#3c4043",
          "&:hover": {
            backgroundColor: "#f8f9fa",
            borderColor: "#dadce0",
          },
          "&:disabled": {
            backgroundColor: "#f8f9fa",
            color: "#5f6368",
            borderColor: "#dadce0",
          },
        }}
      >
        {isLoading ? "Redirecting..." : text}
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default GoogleAuthButton;
