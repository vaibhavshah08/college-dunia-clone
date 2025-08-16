import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
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

      <Grid container spacing={3}>
        <Grid>
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
        </Grid>

        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid>
                  <Typography variant="body2" color="text.secondary">
                    First Name
                  </Typography>
                  <Typography variant="body1">John</Typography>
                </Grid>
                <Grid>
                  <Typography variant="body2" color="text.secondary">
                    Last Name
                  </Typography>
                  <Typography variant="body1">Doe</Typography>
                </Grid>
                <Grid>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">john.doe@example.com</Typography>
                </Grid>
                <Grid>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">+91 9876543210</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
