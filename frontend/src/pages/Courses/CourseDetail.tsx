import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  School,
  AccessTime,
  ArrowBack,
  Description,
} from "@mui/icons-material";
import { useQuery } from "react-query";
import coursesApi, { Course } from "../../services/modules/courses.api";
import SafeHtml from "../../components/SafeHtml/SafeHtml";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch course data
  const {
    data: courseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesApi.getCourse(id!),
    enabled: !!id,
  });

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading course details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    console.error("Course detail error:", error);
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        >
          <Typography variant="subtitle1" gutterBottom>
            Failed to load course details
          </Typography>
          <Typography variant="body2">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </Typography>
        </Alert>
        <Button
          variant="outlined"
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!courseData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Course not found. The requested course may have been removed or you
          may not have permission to view it.
        </Alert>
        <Button
          variant="outlined"
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const course = courseData;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        variant="outlined"
        onClick={handleBack}
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Card>
        <CardContent>
          {/* Course Name */}
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
            {course?.name || "Course Name Not Available"}
          </Typography>

          {/* Stream Name */}
          {course?.stream && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Stream Name
              </Typography>
              <Chip
                label={course.stream}
                color="primary"
                variant="outlined"
                sx={{ fontSize: "1rem", padding: "8px 16px" }}
              />
            </Box>
          )}

          {/* Duration */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Duration
            </Typography>
            <Chip
              icon={<AccessTime />}
              label={`${course?.duration_years || 0} Year${
                (course?.duration_years || 0) > 1 ? "s" : ""
              }`}
              color="secondary"
              variant="outlined"
              sx={{ fontSize: "1rem", padding: "8px 16px" }}
            />
          </Box>

          {/* Course Details */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Course Details
            </Typography>
            {course?.description ? (
              <SafeHtml html={course.description} variant="body1" />
            ) : (
              <Typography variant="body1" color="text.secondary">
                No course details available.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CourseDetail;
