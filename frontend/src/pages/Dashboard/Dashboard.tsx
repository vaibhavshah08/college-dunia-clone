import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import {
  School,
  AccountBalance,
  Description,
  TrendingUp,
} from "@mui/icons-material";

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <School sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Colleges Applied
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <AccountBalance
                sx={{ fontSize: 40, color: "secondary.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Loan Applications
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <Description
                sx={{ fontSize: 40, color: "success.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  8
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Documents Uploaded
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <TrendingUp
                sx={{ fontSize: 40, color: "warning.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  85%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Success Rate
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;
