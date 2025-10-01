import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Language,
  School,
  People,
  TrendingUp,
  Star,
  CalendarToday,
  Business,
  Engineering,
  Science,
  Handshake,
  Verified,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import collegesApi from "../../services/modules/colleges.api";
import coursesApi from "../../services/modules/courses.api";
import { College } from "../../types/api";
import SafeHtml from "../../components/SafeHtml/SafeHtml";
import { Course } from "../../services/modules/courses.api";

const CollegeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch college data from API
  const {
    data: collegeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["colleges", id],
    queryFn: () => collegesApi.getCollege(id!),
    enabled: !!id,
  });

  // Fetch linked courses if college has course IDs
  const { data: linkedCoursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", "by-ids", collegeData?.course_ids_json],
    queryFn: () =>
      coursesApi.getCoursesByIds(collegeData?.course_ids_json || []),
    enabled: !!collegeData?.course_ids_json?.length,
  });

  // Show loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show error state
  if (error || !collegeData) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load college details. Please try again.
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate("/colleges")}
          sx={{ mt: 2 }}
        >
          Back to Colleges
        </Button>
      </Container>
    );
  }

  const handleApplyNow = () => {
    // Navigate to loan application or college application form
    navigate("/loans");
  };

  const handleBackToList = () => {
    navigate("/colleges");
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button variant="outlined" onClick={handleBackToList} sx={{ mb: 2 }}>
          ← Back to Colleges
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
            {collegeData.college_name}
          </Typography>
          {collegeData.is_partnered && (
            <Chip
              icon={<Verified />}
              label="Verified Partner"
              color="success"
              variant="filled"
              sx={{
                fontSize: "0.875rem",
                height: "32px",
                fontWeight: 600,
                "& .MuiChip-icon": {
                  fontSize: "1rem",
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Chip
            icon={<Star />}
            label={`Ranking: #${collegeData.ranking}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<TrendingUp />}
            label={`${collegeData.placement_ratio}% Placement Rate`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<School />}
            label={collegeData.affiliation}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Main Content */}
        <Box>
          {/* About Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                About {collegeData.college_name}
              </Typography>
              <Typography variant="body1" paragraph>
                {collegeData.college_name} is a prestigious educational
                institution located in {collegeData.city}, {collegeData.state}.
                Established in {collegeData.year_of_establishment}, it has been
                providing quality education and has achieved a ranking of #
                {collegeData.ranking}. The college is affiliated with{" "}
                {collegeData.affiliation} and accredited by{" "}
                {collegeData.accreditation}.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Typography variant="body2" color="text.secondary">
                  <CalendarToday
                    sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                  />
                  Established: {collegeData.year_of_establishment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Business
                    sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                  />
                  Affiliation: {collegeData.affiliation}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Courses Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Linked Courses
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {collegeData.course_ids_json &&
                collegeData.course_ids_json.length > 0 ? (
                  <Chip
                    label={`${collegeData.course_ids_json.length} courses linked`}
                    variant="outlined"
                    color="primary"
                  />
                ) : (
                  <Chip
                    label="No courses linked"
                    variant="outlined"
                    color="default"
                  />
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Linked Courses Section */}
          {linkedCoursesData && linkedCoursesData.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Detailed Course Information
                </Typography>
                {coursesLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {linkedCoursesData?.map((course) => (
                      <Box
                        key={course.id}
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          backgroundColor: "background.paper",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {course.name}
                          </Typography>
                          <Chip
                            label={`${course.duration_years} years`}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        {course.stream && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Stream: {course.stream}
                          </Typography>
                        )}
                        {course.description && (
                          <SafeHtml
                            html={course.description}
                            variant="body2"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional Info Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Additional Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pincode
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {collegeData.pincode}
                  </Typography>
                </Box>
                {collegeData.landmark && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Landmark
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {collegeData.landmark}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Accreditation
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {collegeData.accreditation}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box>
          {/* Quick Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Quick Info
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${collegeData.city}, ${collegeData.state}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <School color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`Ranking: #${collegeData.ranking}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Affiliation: ${collegeData.affiliation}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Established: ${collegeData.year_of_establishment}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Key Statistics
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Annual Fees
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    ₹{collegeData.fees.toLocaleString()}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Placement Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {collegeData.placement_ratio}%
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ranking
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    #{collegeData.ranking}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Linked Courses
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {collegeData.course_ids_json
                      ? collegeData.course_ids_json.length
                      : 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Apply Button */}
          <Card>
            <CardContent>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleApplyNow}
                sx={{ py: 1.5 }}
              >
                Apply Now
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center" }}
              >
                Get education loan assistance
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default CollegeDetail;
