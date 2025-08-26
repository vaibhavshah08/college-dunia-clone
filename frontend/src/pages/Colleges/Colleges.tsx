import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Find Colleges
      </Typography>

      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(5, 1fr)',
              },
              gap: 3,
              alignItems: 'center',
            }}
          >
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
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select label="Location" defaultValue="">
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="mumbai">Mumbai</MenuItem>
                <MenuItem value="delhi">Delhi</MenuItem>
                <MenuItem value="bangalore">Bangalore</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Course Type</InputLabel>
              <Select label="Course Type" defaultValue="">
                <MenuItem value="">All Courses</MenuItem>
                <MenuItem value="engineering">Engineering</MenuItem>
                <MenuItem value="medical">Medical</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Fees Range</InputLabel>
              <Select label="Fees Range" defaultValue="">
                <MenuItem value="">All Ranges</MenuItem>
                <MenuItem value="0-50000">₹0 - ₹50,000</MenuItem>
                <MenuItem value="50000-100000">₹50,000 - ₹1,00,000</MenuItem>
                <MenuItem value="100000+">₹1,00,000+</MenuItem>
              </Select>
            </FormControl>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<FilterList />}
              sx={{ height: 56 }}
            >
              Apply Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* College List */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card 
            key={item}
            sx={{ 
              height: "100%", 
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Sample College {item}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Mumbai, Maharashtra
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                Ranking: #{item * 100}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Fees: ₹{item * 50000}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Colleges;
