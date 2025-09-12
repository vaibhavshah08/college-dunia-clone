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
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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
            <ErrorIcon
              sx={{
                fontSize: 120,
                color: theme.palette.error.main,
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
              404
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
              Page Not Found
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
              Sorry, the page you are looking for doesn't exist or has been
              moved. Please check the URL or navigate back to our homepage.
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
            If you believe this is an error, please contact our support team or
            try refreshing the page.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
