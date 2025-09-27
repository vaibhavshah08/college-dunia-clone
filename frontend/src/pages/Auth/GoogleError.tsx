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
  const [errorType, setErrorType] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorType(error);
      if (error === "user_not_found") {
        setErrorMessage("Account not found. Please register first.");
        toast.error("Account not found. Please register first.");
      } else if (error === "user_inactive") {
        setErrorMessage("Your account is inactive. Please contact support.");
        toast.error("Your account is inactive. Please contact support.");
      } else {
        setErrorMessage(`Google authentication failed: ${error}`);
        toast.error("Google sign-in failed. Please try again.");
      }
    } else {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [searchParams, toast]);

  const handleRetry = () => {
    if (errorType === "user_not_found") {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            "& .MuiAlert-icon": {
              alignSelf: "flex-start",
              mt: 0.5,
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mt: 0 }}
            >
              Authentication Failed
            </Typography>
            <Typography variant="body2">{errorMessage}</Typography>
          </Box>
        </Alert>

        {errorType === "user_not_found" ? (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We couldn't find an account associated with your Google account.
            Please register first to create a new account.
          </Typography>
        ) : errorType === "user_inactive" ? (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your account is currently inactive. Please contact our support team
            to reactivate your account.
          </Typography>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              There was a problem signing you in with Google. This could be due
              to:
            </Typography>

            <Box sx={{ textAlign: "left", mb: 3 }}>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>You cancelled the sign-in process</li>
                <li>Network connectivity issues</li>
                <li>Google authentication service temporarily unavailable</li>
                <li>Invalid or expired authentication request</li>
              </Typography>
            </Box>
          </>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleRetry}
          sx={{ minWidth: 200 }}
        >
          {errorType === "user_not_found" ? "Register Now" : "Try Again"}
        </Button>
      </Paper>
    </Container>
  );
};

export default GoogleError;
