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

  const fullName = user ? `${user.first_name} ${user.last_name}` : "User";
  const firstName = user?.first_name || "U";

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 2fr",
          },
          gap: 3,
        }}
      >
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}>
              {firstName.charAt(0) || <Person sx={{ fontSize: 60 }} />}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {fullName}
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
                  mb: 2,
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
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1">
                  {user?.first_name || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1">
                  {user?.last_name || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user?.email || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {user?.phone_number || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1">
                  {user?.user_id || "Not available"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">
                  {user?.is_admin ? "Administrator" : "Student"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1">
                  {user?.is_active ? "Active" : "Inactive"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Not available"}
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
