import React, { useState, useMemo } from "react";
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
  Stack,
  InputAdornment,
  useMediaQuery,
  useTheme,
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
  AccountBalance,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import { useQuery, useQueryClient } from "react-query";
import { useComparison } from "../../contexts/ComparisonContext";
import collegesApi from "../../services/modules/colleges.api";
import coursesApi from "../../services/modules/courses.api";
import ImagePlaceholder from "../../components/ImagePlaceholder/ImagePlaceholder";
import { College } from "../../types/api";
import {
  AnimatedPage,
  AnimatedList,
  AnimatedCard,
  AnimatedButton,
} from "../../components/Motion";

const Colleges: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["colleges"] });
      await queryClient.invalidateQueries({
        queryKey: ["colleges", "filters"],
      });
    } finally {
      setIsRefreshing(false);
    }
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
    // Only send backend-supported filters (coursesOffered filtering will be done on frontend)
    return {
      q: filters.q || undefined,
      state: filters.state || undefined,
      city: filters.city || undefined,
      minFees: filters.minFees || undefined,
      maxFees: filters.maxFees || undefined,
      ranking: filters.ranking || undefined,
    };
  };

  // First, fetch ALL colleges without any filters to get all course IDs and filter options
  const { data: allColleges = [] } = useQuery<College[], Error>({
    queryKey: ["colleges", "all"],
    queryFn: () => collegesApi.getColleges({}),
    enabled: isAuthenticated,
  });

  // Get all unique course IDs from all colleges
  const allCourseIds = Array.from(
    new Set(
      allColleges
        .flatMap((college) => college.course_ids_json || [])
        .filter(Boolean)
    )
  );

  // Fetch course details to get stream names
  const { data: coursesData = [], error: coursesError } = useQuery(
    ["courses", "byIds", allCourseIds],
    () => coursesApi.getCoursesByIds(allCourseIds),
    {
      enabled: isAuthenticated && allCourseIds.length > 0,
      retry: false,
      onError: (error) => {
        console.error("Error fetching courses by IDs:", error);
      },
    }
  );

  // Fetch colleges with backend-supported filters
  const {
    data: backendFilteredColleges = [],
    isLoading,
    error,
  } = useQuery<College[], Error>({
    queryKey: [
      "colleges",
      "filtered",
      filters.q,
      filters.state,
      filters.city,
      filters.minFees,
      filters.maxFees,
      filters.ranking,
    ],
    queryFn: () => collegesApi.getColleges(getApiFilters()),
    enabled: isAuthenticated,
  });

  // Apply frontend course filtering
  const colleges = useMemo(() => {
    try {
      if (filters.coursesOffered.length === 0) {
        return backendFilteredColleges;
      }

      // Skip course filtering if there's an error with courses data
      if (coursesError || !Array.isArray(coursesData)) {
        console.warn("Skipping course filtering due to courses data error");
        return backendFilteredColleges;
      }

      // Get course IDs for selected streams
      const selectedCourseIds = coursesData
        .filter(
          (course: any) =>
            course?.stream && filters.coursesOffered.includes(course.stream)
        )
        .map((course: any) => course?.id)
        .filter(Boolean);

      if (selectedCourseIds.length === 0) {
        return backendFilteredColleges;
      }

      // Filter colleges that have any of the selected courses
      return backendFilteredColleges.filter((college) =>
        college.course_ids_json?.some((courseId) =>
          selectedCourseIds.includes(courseId)
        )
      );
    } catch (error) {
      console.error("Error in course filtering:", error);
      return backendFilteredColleges;
    }
  }, [
    backendFilteredColleges,
    filters.coursesOffered,
    coursesData,
    coursesError,
  ]);

  // Type assertion to fix TypeScript issue
  const isLoadingTyped = isLoading as boolean;

  // Extract unique filter options from all colleges data
  const uniqueStates = Array.from(
    new Set(allColleges.map((college) => college.state).filter(Boolean))
  ).sort();

  const uniqueCities = Array.from(
    new Set(allColleges.map((college) => college.city).filter(Boolean))
  ).sort();

  // Extract unique stream names from courses data
  const uniqueStreams = useMemo(() => {
    try {
      if (coursesError || !Array.isArray(coursesData)) {
        return [];
      }
      return Array.from(
        new Set(coursesData.map((course) => course?.stream).filter(Boolean))
      ).sort();
    } catch (error) {
      console.error("Error extracting unique streams:", error);
      return [];
    }
  }, [coursesData, coursesError]);

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
          <AnimatedButton
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              px: 4,
              py: 1.5,
              background: "linear-gradient(45deg, #1976D2, #42A5F5)",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                background: "linear-gradient(45deg, #1565C0, #1976D2)",
              },
            }}
          >
            Login to Continue
          </AnimatedButton>
        </Box>
      </Container>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <AccountBalance sx={{ fontSize: 48, color: "#1976D2" }} />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                background: "linear-gradient(45deg, #1976D2, #42A5F5)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0,
              }}
            >
              Find Colleges
            </Typography>
          </Box>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
          >
            Discover and compare colleges. Find the perfect institution for your
            educational journey.
          </Typography>
        </Box>

        {/* Action Section */}
        <Card
          sx={{
            mb: 4,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 0 },
                mb: { xs: selectedColleges.length > 0 ? 2 : 0, sm: 0 },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#2c3e50" }}
              >
                🏫 College Discovery
              </Typography>
              <Box display="flex" alignItems="center" gap={2} flexWrap="nowrap">
                <Button
                  variant="outlined"
                  startIcon={
                    isRefreshing ? <CircularProgress size={16} /> : <Refresh />
                  }
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  size="small"
                  sx={{
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
                <IconButton
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  size="large"
                  sx={{
                    display: { xs: "flex", sm: "none" },
                  }}
                  aria-label="Refresh"
                >
                  {isRefreshing ? <CircularProgress size={20} /> : <Refresh />}
                </IconButton>
                <AnimatedButton
                  variant="contained"
                  startIcon={<Compare />}
                  onClick={handleCompareColleges}
                  disabled={selectedColleges.length < 2}
                  sx={{
                    minWidth: { xs: "auto", sm: "auto" },
                    px: { xs: 2, sm: 3 },
                    background: "linear-gradient(45deg, #1976D2, #42A5F5)",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565C0, #1976D2)",
                    },
                  }}
                >
                  <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                    Compare ({selectedColleges.length})
                  </Box>
                  <Box sx={{ display: { xs: "inline", sm: "none" } }}>
                    Compare
                  </Box>
                </AnimatedButton>
              </Box>
            </Box>

            {/* Selected Colleges List - Below the controls on mobile */}
            {selectedColleges.length > 0 && (
              <Box
                sx={{
                  mt: { xs: 1.5, sm: 0 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {selectedColleges.length} selected
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    flexWrap: "wrap",
                    maxWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  {selectedColleges.map((college) => (
                    <Chip
                      key={college.college_id}
                      label={college.college_name}
                      size="small"
                      onDelete={() => removeFromComparison(college.college_id)}
                      color="primary"
                      variant="outlined"
                      sx={{
                        maxWidth: "100%",
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card
          sx={{
            mb: 4,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3, color: "#2c3e50" }}
            >
              🔍 Find Your Perfect College
            </Typography>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              alignItems="center"
            >
              <TextField
                label="Search colleges..."
                value={filters.q}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                size="medium"
                placeholder="Search colleges (e.g., IIT, NIT, University)..."
                sx={{
                  minWidth: 250,
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#1976D2" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="medium" sx={{ minWidth: 180 }}>
                <InputLabel>State</InputLabel>
                <Select
                  label="State"
                  value={filters.state}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <MenuItem value="">All States</MenuItem>
                  {uniqueStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="medium" sx={{ minWidth: 180 }}>
                <InputLabel>City</InputLabel>
                <Select
                  label="City"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {uniqueCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Second Row: Fees Range, Courses, and Actions */}
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Min Fees (₹)"
                  type="number"
                  value={filters.minFees || ""}
                  onChange={(e) =>
                    handleFilterChange("minFees", e.target.value)
                  }
                  placeholder="0"
                  inputProps={{ min: 0, step: 1000 }}
                  size="medium"
                  sx={{
                    minWidth: 120,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: 2,
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    px: 1,
                    alignSelf: "center",
                  }}
                >
                  to
                </Typography>
                <TextField
                  label="Max Fees (₹)"
                  type="number"
                  value={filters.maxFees || ""}
                  onChange={(e) =>
                    handleFilterChange("maxFees", e.target.value)
                  }
                  placeholder="No limit"
                  inputProps={{ min: 0, step: 1000 }}
                  size="medium"
                  sx={{
                    minWidth: 120,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: 2,
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    },
                  }}
                />
              </Box>
              <FormControl size="medium" sx={{ minWidth: 200 }}>
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
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {uniqueStreams.map((stream) => (
                    <MenuItem key={stream} value={stream}>
                      {stream}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <AnimatedButton
                variant="outlined"
                onClick={clearFilters}
                startIcon={<Remove />}
                size="medium"
                disabled={!hasActiveFilters()}
                sx={{
                  opacity: hasActiveFilters() ? 1 : 0.5,
                  color: hasActiveFilters() ? "primary.main" : "text.disabled",
                  borderColor: hasActiveFilters()
                    ? "primary.main"
                    : "text.disabled",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": {
                    background: hasActiveFilters()
                      ? "linear-gradient(45deg, #1976D2, #42A5F5)"
                      : "transparent",
                    color: hasActiveFilters() ? "white" : "text.disabled",
                    borderColor: hasActiveFilters()
                      ? "transparent"
                      : "text.disabled",
                  },
                }}
              >
                Clear
              </AnimatedButton>
            </Stack>
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

            <AnimatedList
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
              staggerDelay={0.08}
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
                  (college: College, index: number) => (
                    <AnimatedCard key={college.college_id} delay={index * 0.08}>
                      <Card
                        onClick={() => handleCollegeClick(college.college_id)}
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          position: "relative",
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                          border: "1px solid rgba(0,0,0,0.05)",
                          borderRadius: 3,
                          overflow: "hidden",
                          "&:hover": {
                            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                            borderColor: "#1976D2",
                            "& .college-card-overlay": {
                              opacity: 1,
                            },
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background:
                              "linear-gradient(90deg, #1976D2, #42A5F5)",
                            transform: "scaleX(0)",
                            transition: "transform 0.3s ease",
                          },
                          "&:hover::before": {
                            transform: "scaleX(1)",
                          },
                        }}
                      >
                        <Box
                          className="college-card-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            zIndex: 1,
                          }}
                        />
                        <Box sx={{ position: "relative", zIndex: 2 }}>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleComparison(college, e);
                                }}
                                disabled={
                                  !isInComparison(college.college_id) &&
                                  !canAddMore
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
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                lineHeight: 1.3,
                              }}
                            >
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
                            Courses offered:{" "}
                            {college.course_ids_json
                              ? college.course_ids_json.length
                              : 0}{" "}
                            courses
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Established: {college.year_of_establishment}
                          </Typography>
                        </CardContent>
                      </Card>
                    </AnimatedCard>
                  )
                )
              )}
            </AnimatedList>

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
    </AnimatedPage>
  );
};

export default Colleges;
