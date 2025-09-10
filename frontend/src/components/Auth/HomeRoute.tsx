import React from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../../lib/hooks/useAuth";

interface HomeRouteProps {
  children: React.ReactNode;
}

const HomeRoute: React.FC<HomeRouteProps> = ({ children }) => {
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

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // If user is authenticated and is admin, redirect to admin dashboard
  if (user?.is_admin) {
    return <Navigate to="/admin" replace />;
  }

  // If user is authenticated but not admin, show home page
  return <>{children}</>;
};

export default HomeRoute;
