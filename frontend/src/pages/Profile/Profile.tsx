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
import { useAuth } from "../../lib/hooks/useAuth";

const Profile: React.FC = () => {
  const { user } = useAuth();

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
              {user?.name?.charAt(0) || <Person sx={{ fontSize: 60 }} />}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {user?.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email || "user@example.com"}
            </Typography>
            {user?.is_admin && (
              <Typography 
                variant="body2" 
                sx={{ 
                  backgroundColor: "secondary.main",
                  color: "white",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  display: "inline-block",
                  mb: 2
                }}
              >
                Admin
              </Typography>
            )}
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
                  Full Name
                </Typography>
                <Typography variant="body1">{user?.name || "Not provided"}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user?.email || "Not provided"}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1">{user?.id || "Not available"}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">
                  {user?.is_admin ? "Administrator" : "Student"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Profile;
