import React, { useState, useEffect } from "react";
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
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search, School, Compare, Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import { useQuery } from "react-query";
import { useComparison } from "../../contexts/ComparisonContext";
import collegesApi from "../../services/modules/colleges.api";
import ImagePlaceholder from "../../components/ImagePlaceholder/ImagePlaceholder";
import { College } from "../../types/api";

const Colleges: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    selectedColleges,
    addToComparison,
    removeFromComparison,
    isInComparison,
    canAddMore,
  } = useComparison();

  // State for filters
  const [filters, setFilters] = useState({
    q: "",
    state: "",
    city: "",
    minFees: undefined as number | undefined,
    maxFees: undefined as number | undefined,
    ranking: undefined as number | undefined,
    coursesOffered: undefined as string[] | undefined,
  });

  // Fetch colleges from API with reactive filtering
  const {
    data: colleges = [],
    isLoading,
    error,
  } = useQuery<College[], Error>({
    queryKey: ["colleges", filters],
    queryFn: () => collegesApi.getColleges(filters),
    enabled: isAuthenticated,
  });

  // Type assertion to fix TypeScript issue
  const isLoadingTyped = isLoading as boolean;

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/colleges/${collegeId}`);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]:
        field === "minFees" || field === "maxFees" || field === "ranking"
          ? value
            ? Number(value)
            : undefined
          : field === "coursesOffered"
          ? value
            ? value.split(",")
            : undefined
          : value,
    }));
  };

  const handleCompareColleges = () => {
    navigate("/colleges/compare");
  };

  const handleToggleComparison = (
    college: College,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (isInComparison(college.college_id)) {
      removeFromComparison(college.college_id);
    } else if (canAddMore) {
      addToComparison(college);
    }
  };

  // Show login message if user is not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <School sx={{ fontSize: 80, color: "primary.main", mb: 3 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Access Colleges
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Please login to view and explore colleges
          </Typography>
          <Alert severity="info" sx={{ mb: 3, maxWidth: 500 }}>
            You need to be logged in to access the colleges section. This helps
            us provide you with personalized recommendations and better service.
          </Alert>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ px: 4, py: 1.5 }}
          >
            Login to Continue
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" component="h1">
          Find Colleges
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {selectedColleges.length > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                {selectedColleges.length} selected
              </Typography>
              <Box display="flex" gap={0.5}>
                {selectedColleges.map((college) => (
                  <Chip
                    key={college.college_id}
                    label={college.college_name}
                    size="small"
                    onDelete={() => removeFromComparison(college.college_id)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
          <Button
            variant="contained"
            startIcon={<Compare />}
            onClick={handleCompareColleges}
            disabled={selectedColleges.length < 2}
          >
            Compare ({selectedColleges.length})
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              label="Search colleges..."
              variant="outlined"
              value={filters.q}
              onChange={(e) => handleFilterChange("q", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={filters.state}
                onChange={(e) => handleFilterChange("state", e.target.value)}
              >
                <MenuItem value="">All States</MenuItem>
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Karnataka">Karnataka</MenuItem>
                <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                label="City"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <MenuItem value="">All Cities</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Bangalore">Bangalore</MenuItem>
                <MenuItem value="Pilani">Pilani</MenuItem>
                <MenuItem value="Chennai">Chennai</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Min Fees</InputLabel>
              <Select
                label="Min Fees"
                value={filters.minFees?.toString() || ""}
                onChange={(e) => handleFilterChange("minFees", e.target.value)}
              >
                <MenuItem value="">No Minimum</MenuItem>
                <MenuItem value="0">₹0</MenuItem>
                <MenuItem value="50000">₹50,000</MenuItem>
                <MenuItem value="100000">₹1,00,000</MenuItem>
                <MenuItem value="200000">₹2,00,000</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {isLoadingTyped && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load colleges. Please try again.
        </Alert>
      )}

      {/* College List */}
      {!isLoadingTyped && !error && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          {colleges.length === 0 ? (
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Alert severity="info">
                No colleges found matching your criteria. Try adjusting your
                filters.
              </Alert>
            </Box>
          ) : (
            colleges.map((college: College) => (
              <Card
                key={college.college_id}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <ImagePlaceholder
                    width="100%"
                    height={180}
                    variant="college"
                    text={college.college_name}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "50%",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Tooltip
                      title={
                        isInComparison(college.college_id)
                          ? "Remove from comparison"
                          : canAddMore
                          ? "Add to comparison"
                          : "Maximum colleges selected"
                      }
                    >
                      <IconButton
                        onClick={(e) => handleToggleComparison(college, e)}
                        disabled={
                          !isInComparison(college.college_id) && !canAddMore
                        }
                        color={
                          isInComparison(college.college_id)
                            ? "primary"
                            : "default"
                        }
                        size="small"
                      >
                        {isInComparison(college.college_id) ? (
                          <Remove />
                        ) : (
                          <Add />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <CardContent
                  sx={{ p: 3 }}
                  onClick={() => handleCollegeClick(college.college_id)}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {college.college_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {college.city}, {college.state}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Ranking: #{college.ranking}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Annual Fees: ₹{college.fees.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Placement Ratio: {college.placement_ratio}%
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Courses: {college.courses_offered.join(", ")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Established: {college.year_of_establishment}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
    </Container>
  );
};

export default Colleges;
