import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";

const Colleges: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Find Colleges
      </Typography>

      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <TextField
                fullWidth
                label="Search colleges..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select label="Location" defaultValue="">
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="mumbai">Mumbai</MenuItem>
                  <MenuItem value="delhi">Delhi</MenuItem>
                  <MenuItem value="bangalore">Bangalore</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl fullWidth>
                <InputLabel>Course Type</InputLabel>
                <Select label="Course Type" defaultValue="">
                  <MenuItem value="">All Courses</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="medical">Medical</MenuItem>
                  <MenuItem value="arts">Arts</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl fullWidth>
                <InputLabel>Fees Range</InputLabel>
                <Select label="Fees Range" defaultValue="">
                  <MenuItem value="">All Ranges</MenuItem>
                  <MenuItem value="0-50000">₹0 - ₹50,000</MenuItem>
                  <MenuItem value="50000-100000">₹50,000 - ₹1,00,000</MenuItem>
                  <MenuItem value="100000+">₹1,00,000+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <Button fullWidth variant="contained" startIcon={<FilterList />}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* College List */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid key={item}>
            <Card sx={{ height: "100%", cursor: "pointer" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sample College {item}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mumbai, Maharashtra
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Ranking: #{item * 100}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Fees: ₹{item * 50000}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Colleges;
