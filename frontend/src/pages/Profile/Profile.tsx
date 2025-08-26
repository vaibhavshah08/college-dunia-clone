import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import { Person } from "@mui/icons-material";

const Profile: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 2fr',
          },
          gap: 3,
        }}
      >
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}>
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              John Doe
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              john.doe@example.com
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1">John</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1">Doe</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">john.doe@example.com</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">+91 9876543210</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Profile;
