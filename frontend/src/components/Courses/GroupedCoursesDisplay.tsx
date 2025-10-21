import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ExpandMore,
  School,
  Visibility,
  AccessTime,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Course } from "../../services/modules/courses.api";

interface GroupedCoursesDisplayProps {
  courses: Course[];
  isLoading: boolean;
  error: any;
  onViewDetails: (courseId: string) => void;
}

const GroupedCoursesDisplay: React.FC<GroupedCoursesDisplayProps> = ({
  courses,
  isLoading,
  error,
  onViewDetails,
}) => {
  // Group courses by name
  const groupedCourses = courses.reduce((acc, course) => {
    const courseName = course.name;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const courseNames = Object.keys(groupedCourses).sort();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const handleToggle = (courseName: string) => {
    setExpandedCourse(expandedCourse === courseName ? null : courseName);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error.message || "Failed to load courses"}
      </Alert>
    );
  }

  if (courses.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          p: 8,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
        }}
      >
        <School sx={{ fontSize: 100, color: "#1976D2", mb: 3, opacity: 0.7 }} />
        <Typography
          variant="h4"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 600, mb: 2 }}
        >
          🎓 No courses found
        </Typography>
        <Typography variant="h6" color="text.secondary">
          No courses are available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <AnimatePresence>
        {courseNames.map((courseName, index) => (
          <motion.div
            key={courseName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Accordion
              expanded={expandedCourse === courseName}
              onChange={() => handleToggle(courseName)}
              sx={{
                mb: 2,
                // borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: "0 0 16px 0",
                },
                "& .MuiAccordionSummary-root": {
                  // borderRadius: 2,
                },
                "&.Mui-expanded .MuiAccordionSummary-root": {
                  // borderRadius: "8px 8px 0 0",
                },
                "& .MuiAccordionDetails-root": {
                  // borderRadius: "0 0 8px 8px",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  background:
                    "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)",
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <School sx={{ color: "primary.main", mr: 2, fontSize: 28 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 0.5,
                      }}
                    >
                      {courseName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {groupedCourses[courseName].length} stream
                      {groupedCourses[courseName].length !== 1 ? "s" : ""}{" "}
                      available
                    </Typography>
                  </Box>
                  <Chip
                    label={`${groupedCourses[courseName].length} streams`}
                    size="small"
                    sx={{
                      backgroundColor: "primary.light",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: { duration: 0.3 },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                        },
                        gap: 2,
                      }}
                    >
                      {groupedCourses[courseName].map((course, streamIndex) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: streamIndex * 0.1,
                          }}
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
                              borderRadius: 2,
                              position: "relative",
                              overflow: "hidden",
                              "&:hover": {
                                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
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
                                height: 3,
                                background:
                                  "linear-gradient(90deg, #1976D2, #42A5F5)",
                                transform: "scaleX(0)",
                                transition: "transform 0.3s ease",
                              },
                              "&:hover::before": {
                                transform: "scaleX(1)",
                              },
                            }}
                            onClick={() => onViewDetails(course.id)}
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
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                minHeight: "140px",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="h6"
                                  component="h4"
                                  sx={{
                                    fontWeight: 600,
                                    color: "text.primary",
                                    lineHeight: 1.3,
                                    mb: 2,
                                    textAlign: "center",
                                  }}
                                >
                                  {course.stream || "General"}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mb: 2,
                                  }}
                                >
                                  <Chip
                                    icon={<AccessTime />}
                                    label={`${course.duration_years} years`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      fontSize: "0.75rem",
                                      borderColor: "primary.main",
                                      color: "primary.main",
                                      backgroundColor: "transparent",
                                      "&:hover": {
                                        backgroundColor: "primary.light",
                                        color: "white",
                                      },
                                    }}
                                  />
                                </Box>
                              </Box>

                              <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  onViewDetails(course.id);
                                }}
                                sx={{
                                  background:
                                    "linear-gradient(45deg, #1976D2, #42A5F5)",
                                  boxShadow:
                                    "0 4px 15px rgba(25, 118, 210, 0.4)",
                                  fontWeight: 600,
                                  textTransform: "none",
                                  borderRadius: 2,
                                  py: 1,
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #1565C0, #1976D2)",
                                    boxShadow:
                                      "0 6px 20px rgba(25, 118, 210, 0.6)",
                                  },
                                }}
                              >
                                View Details
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  </motion.div>
                </Box>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default GroupedCoursesDisplay;
