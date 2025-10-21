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
  Stack,
  Pagination,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useQuery } from "react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import coursesApi from "../../services/modules/courses.api";
import { AnimatedPage } from "../../components/Motion";
import GroupedCoursesDisplay from "../../components/Courses/GroupedCoursesDisplay";

const Courses: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  // Extract unique filter options from courses data
  const uniqueStreams = Array.from(
    new Set(courses.map((course) => course.stream).filter(Boolean))
  ).sort();

  const uniqueDurations = Array.from(
    new Set(courses.map((course) => course.duration_years).filter(Boolean))
  ).sort((a, b) => a - b);

  return (
    <AnimatedPage>
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
            Discover a wide range of courses offered by colleges. Find the
            perfect program for your career goals.
          </Typography>
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
                  {uniqueStreams.map((stream) => (
                    <MenuItem key={stream} value={stream}>
                      {stream}
                    </MenuItem>
                  ))}
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
                  {uniqueDurations.map((duration) => (
                    <MenuItem key={duration} value={duration}>
                      {duration} Years
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Grouped Courses Display */}
        <GroupedCoursesDisplay
          courses={courses}
          isLoading={coursesLoading}
          error={coursesError}
          onViewDetails={handleViewDetails}
        />

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
      </Container>
    </AnimatedPage>
  );
};

export default Courses;
