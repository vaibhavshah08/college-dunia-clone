import React from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../../lib/hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoadingUser, user } = useAuth();

  if (isLoadingUser) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is authenticated, redirect them away from login/register pages
  if (isAuthenticated) {
    // If user is admin, redirect to admin dashboard
    if (user?.is_admin) {
      return <Navigate to="/admin" replace />;
    }
    // If user is regular user, redirect to home page
    return <Navigate to="/" replace />;
  }

  // If not authenticated, show the login/register page
  return <>{children}</>;
};

export default PublicRoute;
