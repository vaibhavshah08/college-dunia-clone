import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import { GoogleAuthResponse } from "../../services/googleAuthService";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");

  const { login, isLoggingIn } = useAuth();

  const handleGoogleSuccess = async (response: GoogleAuthResponse) => {
    try {
      // Use the existing login flow but with Google response
      // The response already contains the token and user data
      // We need to simulate the login success
      console.log("Google auth successful:", response);

      // Store the token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect based on user type
      if (response.user.is_admin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Google auth success handling failed:", error);
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleGoogleError = (error: Error) => {
    console.error("Google auth error:", error);
    setError(`Google sign-in failed: ${error.message}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await login({ email: formData.email, password: formData.password });
      // Navigation is handled by the useAuth hook
    } catch (err: any) {
      // Set local error state for UI feedback
      if (err?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err?.status === 422) {
        setError("Please check your input and try again.");
      } else if (err?.status === 429) {
        setError(
          "Too many login attempts. Please wait a moment and try again."
        );
      } else if (err?.code === "NETWORK_ERROR") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Sign in to your account to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Google OAuth Button */}
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          disabled={isLoggingIn}
          sx={{ mb: 3 }}
        />

        {/* Divider */}
        <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            or
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoggingIn}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isLoggingIn}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              mb: 3,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
