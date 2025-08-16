import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from "@mui/material";
import {
  School,
  Search,
  Compare,
  AccountBalance,
  Description,
  TrendingUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: "Find Your Perfect College",
      description:
        "Search through thousands of colleges with advanced filters and detailed information.",
    },
    {
      icon: <Compare sx={{ fontSize: 40 }} />,
      title: "Compare Colleges",
      description:
        "Side-by-side comparison of colleges based on fees, ranking, and facilities.",
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      title: "Easy Loan Applications",
      description:
        "Apply for educational loans with a simple and streamlined process.",
    },
    {
      icon: <Description sx={{ fontSize: 40 }} />,
      title: "Document Management",
      description: "Upload and manage all your important documents securely.",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: "Track Your Progress",
      description:
        "Monitor your applications and stay updated with real-time status.",
    },
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: "Expert Guidance",
      description:
        "Get expert advice and guidance for your educational journey.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "grey.800",
          color: "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `url(https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`,
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
            backgroundColor: "rgba(0,0,0,.3)",
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
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ color: "white", borderColor: "white", mb: 2 }}
            >
              Get Started
            </Button>
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
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={3}>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                1000+
              </Typography>
              <Typography variant="h6">Colleges</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                50K+
              </Typography>
              <Typography variant="h6">Students</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                95%
              </Typography>
              <Typography variant="h6">Success Rate</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography
                variant="h3"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                24/7
              </Typography>
              <Typography variant="h6">Support</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
