import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Remove,
  ArrowBack,
  Handshake,
  Verified,
} from "@mui/icons-material";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useComparison } from "../../contexts/ComparisonContext";
import collegesApi from "../../services/modules/colleges.api";
import { College } from "../../types/api";

const CollegeComparison: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedColleges,
    addToComparison,
    removeFromComparison,
    isInComparison,
    canAddMore,
  } = useComparison();
  const [availableColleges, setAvailableColleges] = useState<College[]>([]);

  // Fetch all colleges for selection
  const { data: allColleges = [] } = useQuery({
    queryKey: ["colleges", "all"],
    queryFn: () => collegesApi.getColleges({}),
  });

  // Fetch comparison data
  const {
    data: comparisonData,
    isLoading,
    error,
  } = useQuery<any, Error>({
    queryKey: [
      "colleges",
      "compare",
      selectedColleges.map((c) => c.college_id),
    ],
    queryFn: () =>
      collegesApi.compareColleges({
        ids: selectedColleges.map((c) => c.college_id),
      }),
    enabled: selectedColleges.length > 0,
  });

  useEffect(() => {
    setAvailableColleges(allColleges);
  }, [allColleges]);

  const handleAddCollege = (college: College) => {
    if (canAddMore) {
      addToComparison(college);
    }
  };

  const handleRemoveCollege = (collegeId: string) => {
    removeFromComparison(collegeId);
  };

  const comparisonRows = [
    { label: "College Name", key: "college_name" },
    { label: "Location", key: "location" },
    { label: "Ranking", key: "ranking" },
    { label: "Annual Fees", key: "fees" },
    { label: "Placement Ratio", key: "placement_ratio" },
    { label: "Year Established", key: "year_of_establishment" },
    { label: "Affiliation", key: "affiliation" },
    { label: "Accreditation", key: "accreditation" },
    { label: "Courses Offered", key: "courses_offered" },
  ];

  return (
    <Container maxWidth="lg">
      <>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <IconButton onClick={() => navigate("/colleges")}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Compare Colleges
          </Typography>
        </Box>

        {/* Selected Colleges */}
        {selectedColleges.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Selected Colleges ({selectedColleges.length})
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {selectedColleges.map((college) => (
                <Chip
                  key={college.college_id}
                  label={college.college_name}
                  onDelete={() => handleRemoveCollege(college.college_id)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Add More Colleges */}
        {canAddMore && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add More Colleges
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {availableColleges
                .filter((college) => !isInComparison(college.college_id))
                .slice(0, 10)
                .map((college) => (
                  <Chip
                    key={college.college_id}
                    label={college.college_name}
                    onClick={() => handleAddCollege(college)}
                    icon={<Add />}
                    variant="outlined"
                  />
                ))}
            </Box>
          </Box>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load comparison data. Please try again.
          </Alert>
        )}

        {/* Comparison Table */}
        {!isLoading && !error && selectedColleges.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Criteria</TableCell>
                  {selectedColleges.map((college, index) => (
                    <TableCell key={index} sx={{ fontWeight: "bold" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>{college.college_name}</span>
                        {college.is_partnered && (
                          <Chip
                            icon={<Verified />}
                            label="Partner"
                            size="small"
                            color="success"
                            variant="filled"
                            sx={{
                              fontSize: "0.75rem",
                              height: "20px",
                              fontWeight: 600,
                              "& .MuiChip-icon": {
                                fontSize: "0.75rem",
                              },
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonRows.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.label}
                    </TableCell>
                    {selectedColleges.map((college, index) => {
                      let value = "";
                      switch (row.key) {
                        case "location":
                          value = `${college.city}, ${college.state}`;
                          break;
                        case "ranking":
                          value = `#${college.ranking}`;
                          break;
                        case "fees":
                          value = `₹${college.fees.toLocaleString()}`;
                          break;
                        case "placement_ratio":
                          value = `${college.placement_ratio}%`;
                          break;
                        case "courses_offered":
                          value = college.courses_offered.join(", ");
                          break;
                        default:
                          value = String(
                            college[row.key as keyof College] || "-"
                          );
                      }

                      return (
                        <TableCell key={index}>
                          {row.key === "courses_offered" ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {college.courses_offered.map((course, i) => (
                                <Chip key={i} label={course} size="small" />
                              ))}
                            </Box>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* No Selection State */}
        {selectedColleges.length === 0 && (
          <Alert severity="info">
            Please select at least one college to compare. Go back to the
            colleges page to add colleges to your comparison.
          </Alert>
        )}
      </>
    </Container>
  );
};

export default CollegeComparison;
