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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Remove,
  ArrowBack,
  Handshake,
  Verified,
  Download,
  Star,
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
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);

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
    setFilteredColleges(allColleges);
  }, [allColleges]);

  // Check if selected colleges have common courses
  const hasCommonCourses = React.useMemo(() => {
    if (selectedColleges.length <= 1) return true; // Single college or no colleges

    // Find common courses across all selected colleges
    const commonCourses = selectedColleges.reduce((common, college, index) => {
      if (index === 0) return college.courses_offered;
      return common.filter((course) =>
        college.courses_offered.includes(course)
      );
    }, selectedColleges[0]?.courses_offered || []);

    return commonCourses.length > 0;
  }, [selectedColleges]);

  // Filter colleges based on common courses
  useEffect(() => {
    let filtered = allColleges;

    // Filter by common courses with selected colleges
    if (selectedColleges.length > 0) {
      filtered = filtered.filter((college) => {
        // If this college is already selected, include it
        if (isInComparison(college.college_id)) {
          return true;
        }

        // Check if this college has any common courses with selected colleges
        return selectedColleges.some((selectedCollege) =>
          selectedCollege.courses_offered.some((course) =>
            college.courses_offered.includes(course)
          )
        );
      });
    }

    setFilteredColleges(filtered);
  }, [allColleges, selectedColleges, isInComparison]);

  const handleAddCollege = (college: College) => {
    if (canAddMore) {
      // Check if the college has any common courses with already selected colleges
      if (selectedColleges.length > 0) {
        const hasCommonCourse = selectedColleges.some((selectedCollege) =>
          selectedCollege.courses_offered.some((course) =>
            college.courses_offered.includes(course)
          )
        );

        if (!hasCommonCourse) {
          // Show error message or prevent addition
          alert(
            `Cannot add ${college.college_name}. No common courses found with selected colleges.`
          );
          return;
        }
      }

      addToComparison(college);
    }
  };

  const handleRemoveCollege = (collegeId: string) => {
    removeFromComparison(collegeId);
  };

  // Function to find the best value for comparison
  const getBestValue = (key: string, colleges: College[]) => {
    if (colleges.length <= 1) return null;

    // Don't highlight financial fields and YOE as "best"
    const excludedFields = ["fees", "year_of_establishment"];
    if (excludedFields.includes(key)) return null;

    const values = colleges
      .map((college) => {
        const value = college[key as keyof College];
        if (typeof value === "number") return value;
        return null;
      })
      .filter((v) => v !== null) as number[];

    if (values.length === 0) return null;

    // Check if all values are the same - don't highlight if they are
    const uniqueValues = new Set(values);
    if (uniqueValues.size === 1) return null;

    // For ranking, lower is better; for others, higher is better
    const isLowerBetter = ["ranking"].includes(key);
    const bestValue = isLowerBetter ? Math.min(...values) : Math.max(...values);

    return bestValue;
  };

  // Function to check if a value is the best
  const isBestValue = (key: string, value: any, colleges: College[]) => {
    const bestValue = getBestValue(key, colleges);
    if (bestValue === null) return false;

    if (typeof value === "number") {
      const isLowerBetter = ["ranking"].includes(key);
      return isLowerBetter ? value === bestValue : value === bestValue;
    }
    return false;
  };

  // Function to export comparison as CSV
  const exportToCSV = () => {
    const headers = [
      "Criteria",
      ...selectedColleges.map((c) => c.college_name),
    ];
    const rows = comparisonRows.map((row) => {
      const values = selectedColleges.map((college) => {
        let value = "";
        switch (row.key) {
          case "ranking":
            value = `#${college.ranking}`;
            break;
          case "year_of_establishment":
            value = college.year_of_establishment
              ? college.year_of_establishment.toString()
              : "-";
            break;
          case "fees":
            value = `₹${college.fees.toLocaleString()}`;
            break;
          case "placement_ratio":
            value = `${college.placement_ratio}%`;
            break;
          case "placement_rate":
            value = college.placement_rate ? `${college.placement_rate}%` : "-";
            break;
          case "avg_package":
            value = college.avg_package
              ? `₹${college.avg_package.toLocaleString()}`
              : "-";
            break;
          case "median_package":
            value = college.median_package
              ? `₹${college.median_package.toLocaleString()}`
              : "-";
            break;
          case "highest_package":
            value = college.highest_package
              ? `₹${college.highest_package.toLocaleString()}`
              : "-";
            break;
          case "courses_offered":
            value = college.courses_offered.join(", ");
            break;
          case "top_recruiters":
            value = college.top_recruiters
              ? college.top_recruiters.join(", ")
              : "-";
            break;
          case "is_partnered":
            value = college.is_partnered ? "Yes" : "No";
            break;
          case "placement_last_updated":
            value = college.placement_last_updated
              ? new Date(college.placement_last_updated).toLocaleDateString()
              : "-";
            break;
          case "created_at":
            value = new Date(college.created_at).toLocaleDateString();
            break;
          case "landmark":
            value = college.landmark || "-";
            break;
          default:
            value = String(college[row.key as keyof College] || "-");
        }
        return value;
      });
      return [row.label, ...values];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "college-comparison.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const comparisonRows = [
    // Basic Information
    { label: "College Name", key: "college_name", category: "Basic Info" },
    { label: "State", key: "state", category: "Basic Info" },
    { label: "City", key: "city", category: "Basic Info" },
    { label: "Pincode", key: "pincode", category: "Basic Info" },
    { label: "Landmark", key: "landmark", category: "Basic Info" },

    // Academic Information
    { label: "Ranking", key: "ranking", category: "Academic" },
    {
      label: "Year Established",
      key: "year_of_establishment",
      category: "Academic",
    },
    { label: "Affiliation", key: "affiliation", category: "Academic" },
    { label: "Accreditation", key: "accreditation", category: "Academic" },
    { label: "Courses Offered", key: "courses_offered", category: "Academic" },

    // Financial Information
    { label: "Annual Fees", key: "fees", category: "Financial" },

    // Placement Information
    {
      label: "Placement Ratio",
      key: "placement_ratio",
      category: "Placements",
    },
    { label: "Placement Rate", key: "placement_rate", category: "Placements" },
    { label: "Average Package", key: "avg_package", category: "Placements" },
    { label: "Median Package", key: "median_package", category: "Placements" },
    {
      label: "Highest Package",
      key: "highest_package",
      category: "Placements",
    },
    { label: "Top Recruiters", key: "top_recruiters", category: "Placements" },
    {
      label: "Placement Last Updated",
      key: "placement_last_updated",
      category: "Placements",
    },

    // Partnership Status
    { label: "Partner College", key: "is_partnered", category: "Status" },
    { label: "Created Date", key: "created_at", category: "Status" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Back to Colleges">
              <IconButton onClick={() => navigate("/colleges")}>
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Typography variant="h4" component="h1">
              Compare Colleges
            </Typography>
          </Box>
          {selectedColleges.length > 0 && hasCommonCourses && (
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportToCSV}
              sx={{ ml: 2 }}
            >
              Export CSV
            </Button>
          )}
        </Box>

        {/* Selected Colleges */}
        {selectedColleges.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Selected Colleges ({selectedColleges.length})
              {selectedColleges.length > 1 && !hasCommonCourses && (
                <Chip
                  label="No Common Courses"
                  color="warning"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
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

            {/* Common Courses */}
            {selectedColleges.length > 1 && hasCommonCourses && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Common Courses:
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {(() => {
                    const commonCourses = selectedColleges.reduce(
                      (common, college, index) => {
                        if (index === 0) return college.courses_offered;
                        return common.filter((course) =>
                          college.courses_offered.includes(course)
                        );
                      },
                      selectedColleges[0]?.courses_offered || []
                    );

                    return commonCourses.length > 0 ? (
                      commonCourses.map((course) => (
                        <Chip
                          key={course}
                          label={course}
                          size="small"
                          color="secondary"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No common courses found
                      </Typography>
                    );
                  })()}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Add More Colleges */}
        {canAddMore && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add More Colleges
            </Typography>
            {selectedColleges.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Only colleges with common courses can be compared
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {filteredColleges
                .filter((college) => !isInComparison(college.college_id))
                .slice(0, 10)
                .map((college) => {
                  // Check if this college has common courses with selected colleges
                  const hasCommonCourse =
                    selectedColleges.length === 0 ||
                    selectedColleges.some((selectedCollege) =>
                      selectedCollege.courses_offered.some((course) =>
                        college.courses_offered.includes(course)
                      )
                    );

                  return (
                    <Chip
                      key={college.college_id}
                      label={college.college_name}
                      onClick={() => handleAddCollege(college)}
                      icon={<Add />}
                      variant="outlined"
                      color={hasCommonCourse ? "primary" : "default"}
                      disabled={!hasCommonCourse}
                      title={
                        hasCommonCourse
                          ? "Click to add to comparison"
                          : "No common courses with selected colleges"
                      }
                    />
                  );
                })}
            </Box>
            {filteredColleges.filter(
              (college) => !isInComparison(college.college_id)
            ).length === 0 && (
              <Typography variant="body2" color="text.secondary">
                {selectedColleges.length > 0
                  ? "No colleges found with common courses to add"
                  : "No colleges available to add"}
              </Typography>
            )}
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

        {/* Summary Cards */}
        {!isLoading && !error && selectedColleges.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Quick Summary
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(auto-fit, minmax(200px, 1fr))",
                },
                gap: 2,
                mb: 3,
              }}
            >
              {selectedColleges.map((college) => (
                <Paper
                  key={college.college_id}
                  sx={{ p: 2, textAlign: "center" }}
                >
                  <Typography variant="h6" gutterBottom>
                    {college.college_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {college.city}, {college.state}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Ranking:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      #{college.ranking}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Fees:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{college.fees.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Placement:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {college.placement_ratio}%
                    </Typography>
                  </Box>
                  {college.avg_package && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Avg Package:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{college.avg_package.toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Legend */}
        {!isLoading && !error && selectedColleges.length > 1 && (
          <Box
            sx={{ mb: 2, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              <Star
                sx={{
                  color: "success.main",
                  fontSize: "1rem",
                  mr: 0.5,
                  verticalAlign: "middle",
                }}
              />
              Best value in each category is highlighted with a star and green
              background (excluding financial fields like fees)
            </Typography>
          </Box>
        )}

        {/* No Common Courses Message */}
        {!isLoading &&
          !error &&
          selectedColleges.length > 1 &&
          !hasCommonCourses && (
            <Box
              sx={{
                mb: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 6,
                px: 0,
              }}
            >
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  maxWidth: "700px",
                  width: "100%",
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    alignItems: "flex-start",
                    mt: 0.5,
                  },
                  "& .MuiAlert-message": {
                    pt: 0.5,
                  },
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Cannot Compare These Colleges
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                  The selected colleges don't offer any common courses, making a
                  meaningful comparison impossible.
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                  Please select colleges that offer similar academic programs
                  for a proper comparison.
                </Typography>
              </Alert>
              <Button
                variant="outlined"
                onClick={() => {
                  // Clear all selected colleges
                  selectedColleges.forEach((college) =>
                    removeFromComparison(college.college_id)
                  );
                }}
                sx={{
                  mt: 1,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Clear Selection
              </Button>
            </Box>
          )}

        {/* Comparison Table */}
        {!isLoading &&
          !error &&
          selectedColleges.length > 0 &&
          hasCommonCourses && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "200px" }}>
                      Criteria
                    </TableCell>
                    {selectedColleges.map((college, index) => (
                      <TableCell
                        key={index}
                        sx={{ fontWeight: "bold", minWidth: "250px" }}
                      >
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
                  {comparisonRows.map((row, rowIndex) => {
                    const isNewCategory =
                      rowIndex === 0 ||
                      comparisonRows[rowIndex - 1].category !== row.category;

                    return (
                      <React.Fragment key={row.key}>
                        {isNewCategory && (
                          <TableRow>
                            <TableCell
                              colSpan={selectedColleges.length + 1}
                              sx={{
                                fontWeight: "bold",
                                backgroundColor: "primary.main",
                                color: "white",
                                fontSize: "1.1rem",
                                py: 2,
                              }}
                            >
                              {row.category}
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", pl: 3 }}>
                            {row.label}
                          </TableCell>
                          {selectedColleges.map((college, index) => {
                            let value = "";
                            let displayValue = null;

                            switch (row.key) {
                              case "ranking":
                                value = `#${college.ranking}`;
                                break;
                              case "year_of_establishment":
                                value = college.year_of_establishment
                                  ? college.year_of_establishment.toString()
                                  : "-";
                                break;
                              case "fees":
                                value = `₹${college.fees.toLocaleString()}`;
                                break;
                              case "placement_ratio":
                                value = `${college.placement_ratio}%`;
                                break;
                              case "placement_rate":
                                value = college.placement_rate
                                  ? `${college.placement_rate}%`
                                  : "-";
                                break;
                              case "avg_package":
                                value = college.avg_package
                                  ? `₹${college.avg_package.toLocaleString()}`
                                  : "-";
                                break;
                              case "median_package":
                                value = college.median_package
                                  ? `₹${college.median_package.toLocaleString()}`
                                  : "-";
                                break;
                              case "highest_package":
                                value = college.highest_package
                                  ? `₹${college.highest_package.toLocaleString()}`
                                  : "-";
                                break;
                              case "courses_offered":
                                displayValue = (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {college.courses_offered.map(
                                      (course, i) => (
                                        <Chip
                                          key={i}
                                          label={course}
                                          size="small"
                                        />
                                      )
                                    )}
                                  </Box>
                                );
                                break;
                              case "top_recruiters":
                                displayValue =
                                  college.top_recruiters &&
                                  college.top_recruiters.length > 0 ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {college.top_recruiters.map(
                                        (recruiter, i) => (
                                          <Chip
                                            key={i}
                                            label={recruiter}
                                            size="small"
                                            color="secondary"
                                          />
                                        )
                                      )}
                                    </Box>
                                  ) : (
                                    "-"
                                  );
                                break;
                              case "is_partnered":
                                displayValue = (
                                  <Chip
                                    label={college.is_partnered ? "Yes" : "No"}
                                    color={
                                      college.is_partnered
                                        ? "success"
                                        : "default"
                                    }
                                    size="small"
                                  />
                                );
                                break;
                              case "placement_last_updated":
                                value = college.placement_last_updated
                                  ? new Date(
                                      college.placement_last_updated
                                    ).toLocaleDateString()
                                  : "-";
                                break;
                              case "created_at":
                                value = new Date(
                                  college.created_at
                                ).toLocaleDateString();
                                break;
                              case "landmark":
                                value = college.landmark || "-";
                                break;
                              default:
                                value = String(
                                  college[row.key as keyof College] || "-"
                                );
                            }

                            const isBest = isBestValue(
                              row.key,
                              college[row.key as keyof College],
                              selectedColleges
                            );

                            return (
                              <TableCell
                                key={index}
                                sx={{
                                  backgroundColor: isBest
                                    ? "rgba(76, 175, 80, 0.1)"
                                    : "transparent",
                                  position: "relative",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  {displayValue || value}
                                  {isBest && (
                                    <Star
                                      sx={{
                                        color: "success.main",
                                        fontSize: "1rem",
                                        ml: 0.5,
                                      }}
                                    />
                                  )}
                                </Box>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
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
