import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

const GoogleSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processGoogleAuth = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          throw new Error("No authentication token received");
        }

        // Store the token and user data
        localStorage.setItem("token", token);

        // You might want to fetch user data here if not included in the token
        // For now, we'll redirect to the home page
        toast.success("Successfully signed in with Google!");

        // Redirect to home page
        navigate("/");
      } catch (error) {
        console.error("Google auth processing failed:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      } finally {
        setIsProcessing(false);
      }
    };

    processGoogleAuth();
  }, [searchParams, navigate, toast]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        {isProcessing ? (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Processing Google Authentication
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we complete your sign-in...
            </Typography>
          </>
        ) : (
          <Alert severity="success">
            <Typography variant="h6">Authentication Successful!</Typography>
            <Typography variant="body2">
              You will be redirected shortly.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default GoogleSuccess;
