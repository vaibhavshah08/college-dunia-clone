import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Pagination,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Button,
} from "@mui/material";
import { Search, School, Visibility } from "@mui/icons-material";
import { useQuery } from "react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import coursesApi from "../../services/modules/courses.api";
import { getErrorMessage } from "../../utils/errorHandler";

const Courses: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // State
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState<number | "">("");
  const navigate = useNavigate();

  const handleViewDetails = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Queries
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery(
    ["courses", page, limit, debouncedSearchTerm, streamFilter, durationFilter],
    () =>
      coursesApi.getCourses({
        page,
        limit,
        q: debouncedSearchTerm || undefined,
        stream: streamFilter || undefined,
        durationYears: durationFilter || undefined,
      }),
    {
      keepPreviousData: true,
    }
  );

  const courses = Array.isArray(coursesData?.courses)
    ? coursesData.courses
    : [];
  const pagination = coursesData?.pagination || null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
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
            mb: 2,
          }}
        >
          Browse Courses
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
        >
          Discover a wide range of courses offered by colleges. Find the perfect
          program for your career goals.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 3,
          }}
        >
          <Chip
            label="🎓 100+ Courses"
            color="primary"
            variant="outlined"
            sx={{ fontSize: "0.9rem", fontWeight: 600 }}
          />
          <Chip
            label="🏆 Top Universities"
            color="secondary"
            variant="outlined"
            sx={{ fontSize: "0.9rem", fontWeight: 600 }}
          />
          <Chip
            label="💼 Career Ready"
            color="success"
            variant="outlined"
            sx={{ fontSize: "0.9rem", fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Filters */}
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
            🔍 Find Your Perfect Course
          </Typography>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={3}
            alignItems="center"
          >
            <TextField
              label="Search courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="medium"
              placeholder="Search courses (e.g., B.Tech, MBA, Engineering)..."
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
              <InputLabel>Stream</InputLabel>
              <Select
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value)}
                label="Stream"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <MenuItem value="">All Streams</MenuItem>
                <MenuItem value="CSE">CSE</MenuItem>
                <MenuItem value="ECE">ECE</MenuItem>
                <MenuItem value="ME">ME</MenuItem>
                <MenuItem value="CE">CE</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="medium" sx={{ minWidth: 180 }}>
              <InputLabel>Duration</InputLabel>
              <Select
                value={durationFilter}
                onChange={(e) =>
                  setDurationFilter(e.target.value as number | "")
                }
                label="Duration"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <MenuItem value="">All Durations</MenuItem>
                <MenuItem value={2}>2 Years</MenuItem>
                <MenuItem value={3}>3 Years</MenuItem>
                <MenuItem value={4}>4 Years</MenuItem>
                <MenuItem value={5}>5 Years</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {coursesLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 6,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            borderRadius: 3,
            mb: 4,
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: "#1976D2",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            🔍 Finding the best courses for you...
          </Typography>
        </Box>
      ) : coursesError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(coursesError)}
        </Alert>
      ) : courses.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            p: 8,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            borderRadius: 3,
            mb: 4,
          }}
        >
          <School
            sx={{
              fontSize: 100,
              color: "#1976D2",
              mb: 3,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h4"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2 }}
          >
            🎓 No courses found
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || streamFilter || durationFilter
              ? "Try adjusting your search criteria or filters."
              : "No courses are available at the moment."}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setSearchTerm("");
              setStreamFilter("");
              setDurationFilter("");
            }}
            sx={{
              background: "linear-gradient(45deg, #1976D2, #42A5F5)",
              fontWeight: 600,
              px: 4,
              py: 1.5,
            }}
          >
            Clear Filters
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {courses.map((course, index) => (
              <Card
                key={course.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: 3,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    borderColor: "#1976D2",
                    "& .course-card-overlay": {
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
                    background: "linear-gradient(90deg, #1976D2, #42A5F5)",
                    transform: "scaleX(0)",
                    transition: "transform 0.3s ease",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                  },
                }}
                onClick={() => handleViewDetails(course.id)}
              >
                <Box
                  className="course-card-overlay"
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
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    zIndex: 2,
                    p: 3,
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      fontWeight="bold"
                      sx={{
                        background: "linear-gradient(45deg, #1976D2, #42A5F5)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 2,
                      }}
                    >
                      {course.name}
                    </Typography>
                    {course.stream && (
                      <Chip
                        label={course.stream}
                        color="primary"
                        variant="filled"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          background:
                            "linear-gradient(45deg, #1976D2, #42A5F5)",
                          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mt: "auto", pt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleViewDetails(course.id);
                      }}
                      startIcon={<Visibility />}
                      sx={{
                        background: "linear-gradient(45deg, #1976D2, #42A5F5)",
                        boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        py: 1.5,
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1565C0, #1976D2)",
                          boxShadow: "0 6px 20px rgba(25, 118, 210, 0.6)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Courses;
