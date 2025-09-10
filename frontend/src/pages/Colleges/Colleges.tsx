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
  Badge,
  Pagination,
} from "@mui/material";
import {
  Search,
  School,
  Compare,
  Add,
  Remove,
  Business,
  Star,
  Verified,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import { useQuery, useQueryClient } from "react-query";
import { useComparison } from "../../contexts/ComparisonContext";
import collegesApi from "../../services/modules/colleges.api";
import ImagePlaceholder from "../../components/ImagePlaceholder/ImagePlaceholder";
import { College } from "../../types/api";

const Colleges: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
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
    coursesOffered: [] as string[],
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Refresh function
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["colleges"] });
    queryClient.invalidateQueries({ queryKey: ["colleges", "filters"] });
  };

  // Pagination helper functions
  const getPaginatedData = (
    data: College[],
    page: number,
    itemsPerPage: number
  ) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: College[], itemsPerPage: number) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Convert frontend filters to API format
  const getApiFilters = () => {
    return {
      q: filters.q || undefined,
      state: filters.state || undefined,
      city: filters.city || undefined,
      minFees: filters.minFees || undefined,
      maxFees: filters.maxFees || undefined,
      ranking: filters.ranking || undefined,
      coursesOffered:
        filters.coursesOffered.length > 0
          ? filters.coursesOffered.join(",")
          : undefined,
    };
  };

  // Fetch colleges from API with reactive filtering
  const {
    data: colleges = [],
    isLoading,
    error,
  } = useQuery<College[], Error>({
    queryKey: ["colleges", filters],
    queryFn: () => collegesApi.getColleges(getApiFilters()),
    enabled: isAuthenticated,
  });

  // Type assertion to fix TypeScript issue
  const isLoadingTyped = isLoading as boolean;

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/colleges/${collegeId}`);
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]:
          field === "minFees" || field === "maxFees" || field === "ranking"
            ? value
              ? Number(value)
              : undefined
            : field === "coursesOffered"
            ? Array.isArray(value)
              ? value
              : []
            : value,
      };

      // Validate that minFees is not greater than maxFees
      if (field === "minFees" && newFilters.minFees && newFilters.maxFees) {
        if (newFilters.minFees > newFilters.maxFees) {
          newFilters.maxFees = newFilters.minFees;
        }
      }
      if (field === "maxFees" && newFilters.minFees && newFilters.maxFees) {
        if (newFilters.maxFees < newFilters.minFees) {
          newFilters.minFees = newFilters.maxFees;
        }
      }

      return newFilters;
    });
  };

  const handleCompareColleges = () => {
    navigate("/colleges/compare");
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.q !== "" ||
      filters.state !== "" ||
      filters.city !== "" ||
      filters.minFees !== undefined ||
      filters.maxFees !== undefined ||
      filters.ranking !== undefined ||
      filters.coursesOffered.length > 0
    );
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      state: "",
      city: "",
      minFees: undefined,
      maxFees: undefined,
      ranking: undefined,
      coursesOffered: [],
    });
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
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            size="small"
          >
            Refresh
          </Button>
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
        <CardContent sx={{ p: 2 }}>
          {/* First Row: Search and Location Filters */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "2fr 1fr 1fr",
                md: "2fr 1fr 1fr",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              label="Search colleges..."
              variant="outlined"
              value={filters.q}
              onChange={(e) => handleFilterChange("q", e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <FormControl fullWidth size="small">
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
            <FormControl fullWidth size="small">
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
          </Box>

          {/* Second Row: Fees Range, Courses, and Actions */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr 1fr auto",
                md: "1fr 1fr 1fr auto",
              },
              gap: 2,
              alignItems: "end",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr auto 1fr",
                },
                gap: 1,
                alignItems: "end",
              }}
            >
              <TextField
                fullWidth
                label="Min Fees (₹)"
                type="number"
                value={filters.minFees || ""}
                onChange={(e) => handleFilterChange("minFees", e.target.value)}
                placeholder="0"
                inputProps={{ min: 0, step: 1000 }}
                size="small"
              />
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  px: 1,
                  alignSelf: "center",
                  display: { xs: "none", sm: "block" },
                }}
              >
                to
              </Typography>
              <TextField
                fullWidth
                label="Max Fees (₹)"
                type="number"
                value={filters.maxFees || ""}
                onChange={(e) => handleFilterChange("maxFees", e.target.value)}
                placeholder="No limit"
                inputProps={{ min: 0, step: 1000 }}
                size="small"
              />
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>Courses</InputLabel>
              <Select
                label="Courses"
                value={filters.coursesOffered}
                onChange={(e) =>
                  handleFilterChange("coursesOffered", e.target.value)
                }
                multiple
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="Computer Science Engineering">
                  Computer Science Engineering
                </MenuItem>
                <MenuItem value="Mechanical Engineering">
                  Mechanical Engineering
                </MenuItem>
                <MenuItem value="Electrical Engineering">
                  Electrical Engineering
                </MenuItem>
                <MenuItem value="Electronics & Communication">
                  Electronics & Communication
                </MenuItem>
                <MenuItem value="Civil Engineering">Civil Engineering</MenuItem>
                <MenuItem value="Chemical Engineering">
                  Chemical Engineering
                </MenuItem>
                <MenuItem value="Aerospace Engineering">
                  Aerospace Engineering
                </MenuItem>
                <MenuItem value="Biotechnology">Biotechnology</MenuItem>
                <MenuItem value="Information Technology">
                  Information Technology
                </MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
                <MenuItem value="Artificial Intelligence">
                  Artificial Intelligence
                </MenuItem>
                <MenuItem value="Business Administration">
                  Business Administration
                </MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={clearFilters}
              startIcon={<Remove />}
              size="small"
              disabled={!hasActiveFilters()}
              sx={{
                height: "40px",
                opacity: hasActiveFilters() ? 1 : 0.5,
                color: hasActiveFilters() ? "primary.main" : "text.disabled",
                borderColor: hasActiveFilters()
                  ? "primary.main"
                  : "text.disabled",
              }}
            >
              Clear
            </Button>
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
        <Box>
          {/* Filter Summary */}
          {hasActiveFilters() && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: "primary.50",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
                <strong>Active Filters:</strong>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {filters.q && (
                  <Chip
                    label={`Search: "${filters.q}"`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.state && (
                  <Chip
                    label={`State: ${filters.state}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.city && (
                  <Chip
                    label={`City: ${filters.city}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {(filters.minFees || filters.maxFees) && (
                  <Chip
                    label={`Fees: ₹${
                      filters.minFees?.toLocaleString() || "0"
                    } - ₹${filters.maxFees?.toLocaleString() || "∞"}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.coursesOffered.length > 0 && (
                  <Chip
                    label={`Courses: ${filters.coursesOffered.length} selected`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}

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
              getPaginatedData(colleges, page, itemsPerPage).map(
                (college: College) => (
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {college.college_name}
                        </Typography>
                        {college.is_partnered && (
                          <Chip
                            icon={<Verified />}
                            label="Partner"
                            size="small"
                            color="success"
                            variant="filled"
                            sx={{
                              fontSize: "0.75rem",
                              height: "24px",
                              fontWeight: 600,
                              "& .MuiChip-icon": {
                                fontSize: "0.875rem",
                              },
                            }}
                          />
                        )}
                      </Box>
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
                )
              )
            )}
          </Box>

          {/* Pagination */}
          {colleges.length > itemsPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={getTotalPages(colleges, itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Colleges;
