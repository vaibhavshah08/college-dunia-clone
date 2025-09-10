import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import {
  Search,
  Compare,
  AccountBalance,
  Description,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: "Find Your Perfect College",
      description:
        "Search through thousands of colleges with advanced filters and detailed information.",
      path: "/colleges",
    },
    {
      icon: <Compare sx={{ fontSize: 40 }} />,
      title: "Compare Colleges",
      description:
        "Side-by-side comparison of colleges based on fees, ranking, and facilities.",
      path: "/colleges/compare",
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      title: "Easy Loan Applications",
      description:
        "Apply for educational loans with a simple and streamlined process.",
      path: "/loans",
    },
    {
      icon: <Description sx={{ fontSize: 40 }} />,
      title: "Document Management",
      description: "Upload and manage all your important documents securely.",
      path: "/documents",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "primary.main",
          color: "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.9), rgba(25, 118, 210, 0.9)), url(https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`,
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Find Your Dream College
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Discover thousands of colleges, compare them side by side, and make
            informed decisions about your education. Apply for loans and manage
            your documents all in one place.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/colleges")}
              sx={{ mr: 2, mb: 2 }}
            >
              Explore Colleges
            </Button>
            {!isAuthenticated && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/register")}
                sx={{ color: "white", borderColor: "white", mb: 2 }}
              >
                Get Started
              </Button>
            )}
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose College Dunia?
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 4,
            alignItems: "stretch",
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              onClick={() => {
                navigate(feature.path);
                window.scrollTo(0, 0);
              }}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2 }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
