import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useAuth } from "../../lib/hooks/useAuth";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToAdmin = () => {
    navigate("/admin", { replace: true });
  };

  const isAdmin = user?.is_admin;

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box mb={4}>
            <SecurityIcon
              sx={{
                fontSize: 120,
                color: theme.palette.warning.main,
                mb: 2,
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: "4rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              403
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: theme.palette.text.primary,
                mb: 2,
                fontWeight: 600,
              }}
            >
              Access Denied
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              {isAdmin
                ? "You don't have permission to access this page. This area is restricted to regular users only."
                : "You don't have permission to access this page. This area is restricted to administrators only."}
            </Typography>
          </Box>

          <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Go to Homepage
            </Button>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AdminIcon />}
                onClick={handleGoToAdmin}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Go to Admin Panel
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>

        <Box mt={4}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            If you believe you should have access to this page, please contact
            your administrator or try logging in with a different account.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized;
