import React from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../../lib/hooks/useAuth";
import Unauthorized from "../../pages/Error/Unauthorized";

interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
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
    return <Navigate to="/login" replace />;
  }

  // If user is admin, show unauthorized page
  if (user?.is_admin) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

export default UserRoute;
