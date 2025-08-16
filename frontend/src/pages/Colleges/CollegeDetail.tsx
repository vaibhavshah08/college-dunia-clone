import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import { LocationOn, Phone, Email, Language } from "@mui/icons-material";

const CollegeDetail: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Sample College Details
      </Typography>

      <Grid container spacing={3}>
        <Grid>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                About the College
              </Typography>
              <Typography variant="body1" paragraph>
                This is a sample college description. It provides comprehensive
                education in various fields including engineering, medical, and
                arts.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Courses Offered
              </Typography>
              <Grid container spacing={1}>
                {[
                  "Computer Science",
                  "Mechanical Engineering",
                  "Electrical Engineering",
                ].map((course) => (
                  <Grid key={course}>
                    <Chip label={course} variant="outlined" />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Info
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <LocationOn
                    sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                  />
                  Mumbai, Maharashtra
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <Phone
                    sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                  />
                  +91 1234567890
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <Email
                    sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                  />
                  info@samplecollege.edu
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <Language
                    sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                  />
                  www.samplecollege.edu
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Typography variant="body2" gutterBottom>
                Ranking: #150
              </Typography>
              <Typography variant="body2" gutterBottom>
                Average Fees: ₹75,000
              </Typography>
              <Typography variant="body2" gutterBottom>
                Placement Rate: 85%
              </Typography>
              <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CollegeDetail;
