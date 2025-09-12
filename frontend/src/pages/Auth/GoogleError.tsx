import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

const GoogleError: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [errorMessage, setErrorMessage] = useState(
    "Google authentication failed"
  );

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(`Google authentication failed: ${error}`);
    }
    toast.error("Google sign-in failed. Please try again.");
  }, [searchParams, toast]);

  const handleRetry = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Authentication Failed
          </Typography>
          <Typography variant="body2">{errorMessage}</Typography>
        </Alert>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          There was a problem signing you in with Google. This could be due to:
        </Typography>

        <Box sx={{ textAlign: "left", mb: 3 }}>
          <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
            <li>You cancelled the sign-in process</li>
            <li>Network connectivity issues</li>
            <li>Google authentication service temporarily unavailable</li>
            <li>Invalid or expired authentication request</li>
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleRetry}
          sx={{ minWidth: 200 }}
        >
          Try Again
        </Button>
      </Paper>
    </Container>
  );
};

export default GoogleError;
