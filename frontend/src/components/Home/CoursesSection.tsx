import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowForward, AccessTime } from "@mui/icons-material";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import coursesApi from "../../services/modules/courses.api";
import { getErrorMessage } from "../../utils/errorHandler";

const CoursesSection: React.FC = () => {
  const navigate = useNavigate();

  // Fetch 4 random courses
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery(
    ["courses", "random"],
    () => coursesApi.getCourses({ limit: 4 }),
    {
      refetchOnWindowFocus: false,
      staleTime: 0, // Always fetch fresh data
    }
  );

  const courses = coursesData?.courses || [];

  const handleViewDetails = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const handleSeeMore = () => {
    navigate("/courses");
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {getErrorMessage(error)}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          component="h2"
          variant="h3"
          color="text.primary"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Popular Courses
        </Typography>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
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
                      "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    zIndex: 1,
                  }}
                />

                <CardContent
                  sx={{
                    flexGrow: 1,
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "120px",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      lineHeight: 1.3,
                      mb: 1,
                      textAlign: "center",
                      fontSize: "1rem",
                    }}
                  >
                    {course.stream || "General"}
                  </Typography>

                  <Chip
                    icon={<AccessTime />}
                    label={`${course.duration_years} years`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: "0.7rem",
                      borderColor: "primary.main",
                      color: "primary.main",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "white",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </motion.div>

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="outlined"
          size="large"
          endIcon={<ArrowForward />}
          onClick={handleSeeMore}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white",
              borderColor: "primary.main",
            },
          }}
        >
          See More Courses
        </Button>
      </Box>
    </Container>
  );
};

export default CoursesSection;
