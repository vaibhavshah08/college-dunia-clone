import React from "react";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import {
  School,
  AccountBalance,
  Description,
  TrendingUp,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import {
  AnimatedPage,
  AnimatedList,
  AnimatedCard,
} from "../../components/Motion";

const Dashboard: React.FC = () => {
  const stats = [
    {
      icon: <School sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />,
      value: "5",
      label: "Colleges Applied",
    },
    {
      icon: (
        <AccountBalance sx={{ fontSize: 40, color: "secondary.main", mr: 2 }} />
      ),
      value: "2",
      label: "Loan Applications",
    },
    {
      icon: <Description sx={{ fontSize: 40, color: "success.main", mr: 2 }} />,
      value: "8",
      label: "Documents Uploaded",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: "warning.main", mr: 2 }} />,
      value: "85%",
      label: "Success Rate",
    },
  ];

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <DashboardIcon sx={{ fontSize: 48, color: "#1976D2" }} />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                background: "linear-gradient(45deg, #1976D2, #42A5F5)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0,
              }}
            >
              Dashboard
            </Typography>
          </Box>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
          >
            Welcome to your personal dashboard. Track your applications,
            documents, and progress.
          </Typography>
        </Box>

        <AnimatedList
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            alignItems: "stretch",
          }}
          staggerDelay={0.1}
        >
          {stats.map((stat, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center">
                    {stat.icon}
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </AnimatedList>
      </Container>
    </AnimatedPage>
  );
};

export default Dashboard;
