import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { login, isLoggingIn, isAuthenticated, user, isLoadingUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already admin
  useEffect(() => {
    if (!isLoadingUser && isAuthenticated && user?.role === "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, user, isLoadingUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login({ email: formData.email, password: formData.password });
      // The useEffect will handle the redirect if user is admin
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  // Show loading while checking authentication status
  if (isLoadingUser) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <AdminPanelSettings sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography component="h1" variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Admin Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access the admin dashboard
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Admin Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
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
            disabled={isLoggingIn}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoggingIn}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              mb: 2,
            }}
          >
            {isLoggingIn ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login as Admin"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
