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
  Grid,
  Chip,
  Stack,
  Pagination,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Search,
  School,
  ExpandMore,
  ExpandLess,
  AccessTime,
} from "@mui/icons-material";
import { useQuery } from "react-query";
import { useDebounce } from "../../hooks/useDebounce";
import coursesApi, { Course } from "../../services/modules/courses.api";
import { getErrorMessage } from "../../utils/errorHandler";
import SafeHtml from "../../components/SafeHtml/SafeHtml";

const Courses: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState<number | "">("");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

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

  const handleCourseExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const courses = Array.isArray(coursesData?.courses)
    ? coursesData.courses
    : [];
  const pagination = coursesData?.pagination || null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Browse Courses
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Discover a wide range of courses offered by colleges. Find the perfect
          program for your career goals.
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            alignItems="center"
          >
            <TextField
              label="Search courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              placeholder="Search courses (e.g., B.Tech, MBA, Engineering)..."
              sx={{ minWidth: 200, flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Stream</InputLabel>
              <Select
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value)}
                label="Stream"
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
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Duration</InputLabel>
              <Select
                value={durationFilter}
                onChange={(e) =>
                  setDurationFilter(e.target.value as number | "")
                }
                label="Duration"
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
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : coursesError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(coursesError)}
        </Alert>
      ) : courses.length === 0 ? (
        <Box sx={{ textAlign: "center", p: 6 }}>
          <School sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No courses found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {searchTerm || streamFilter || durationFilter
              ? "Try adjusting your search criteria or filters."
              : "No courses are available at the moment."}
          </Typography>
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
            {courses.map((course) => (
              <Card
                key={course.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      fontWeight="bold"
                    >
                      {course.name}
                    </Typography>
                    {course.stream && (
                      <Chip
                        label={course.stream}
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    )}
                  </Box>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {course.duration_years} years
                    </Typography>
                  </Stack>

                  {course.description && (
                    <Box sx={{ mt: "auto" }}>
                      <SafeHtml
                        html={course.description}
                        variant="body2"
                        color="text.secondary"
                        maxLength={100}
                        showExpandButton={true}
                        onExpand={() => handleCourseExpand(course.id)}
                        isExpanded={expandedCourse === course.id}
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp:
                            expandedCourse === course.id ? "none" : 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      />
                    </Box>
                  )}

                  <Box
                    sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Updated:{" "}
                      {new Date(course.updated_at).toLocaleDateString()}
                    </Typography>
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
