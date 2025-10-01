import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Pagination,
  Alert,
  CircularProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Upload,
  Download,
  Search,
  Refresh,
  School,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useToast } from "../../contexts/ToastContext";
import { useDebounce } from "../../hooks/useDebounce";
import coursesApi, {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
} from "../../services/modules/courses.api";
import { getErrorMessage } from "../../utils/errorHandler";
import RichTextEditor from "../RichTextEditor/RichTextEditor";

interface CoursesManagementProps {
  onClose?: () => void;
}

const CoursesManagement: React.FC<CoursesManagementProps> = ({ onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { success, error: showError, info } = useToast();
  const queryClient = useQueryClient();

  // State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState<number | "">("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Form state
  const [formData, setFormData] = useState<CreateCourseDto>({
    name: "",
    stream: "",
    durationYears: 4,
    description: "",
  });

  // Queries
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
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
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // Mutations
  const createCourseMutation = useMutation(coursesApi.createCourse, {
    onSuccess: () => {
      success("Course created successfully");
      queryClient.invalidateQueries(["courses"]);
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });

  const updateCourseMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateCourseDto }) =>
      coursesApi.updateCourse(id, data),
    {
      onSuccess: () => {
        success("Course updated successfully");
        queryClient.invalidateQueries(["courses"]);
        setIsEditDialogOpen(false);
        resetForm();
      },
      onError: (error) => {
        showError(getErrorMessage(error));
      },
    }
  );

  const deleteCourseMutation = useMutation(coursesApi.deleteCourse, {
    onSuccess: () => {
      success("Course deleted successfully");
      queryClient.invalidateQueries(["courses"]);
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });

  const importCoursesMutation = useMutation(coursesApi.importCourses, {
    onSuccess: (data) => {
      info(
        `Import completed: ${data.data.successful} successful, ${data.data.failed_count} failed`
      );
      queryClient.invalidateQueries(["courses"]);
      setIsImportDialogOpen(false);
      setImportFile(null);
    },
    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });

  // Handlers
  const handleCreateCourse = () => {
    createCourseMutation.mutate(formData);
  };

  const handleUpdateCourse = () => {
    if (selectedCourse) {
      updateCourseMutation.mutate({
        id: selectedCourse.id,
        data: formData,
      });
    }
  };

  const handleDeleteCourse = () => {
    if (selectedCourse) {
      deleteCourseMutation.mutate(selectedCourse.id);
    }
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      stream: course.stream || "",
      durationYears: course.duration_years,
      description: course.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImportCourses = () => {
    if (importFile) {
      importCoursesMutation.mutate(importFile);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await coursesApi.exportCoursesCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "courses.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      success("Courses exported to CSV successfully");
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await coursesApi.exportCoursesExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "courses.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      success("Courses exported to Excel successfully");
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      stream: "",
      durationYears: 4,
      description: "",
    });
    setSelectedCourse(null);
  };

  const handleCreateDialogOpen = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  // Safely extract data with fallbacks
  const courses = Array.isArray(coursesData?.courses)
    ? coursesData.courses
    : [];
  const pagination = coursesData?.pagination || null;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Courses Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage course information, import/export data, and link courses to
            colleges.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateDialogOpen}
            size={isMobile ? "small" : "medium"}
          >
            Add Course
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => setIsImportDialogOpen(true)}
            size={isMobile ? "small" : "medium"}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            size={isMobile ? "small" : "medium"}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportExcel}
            size={isMobile ? "small" : "medium"}
          >
            Export Excel
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
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
              sx={{ minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
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
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetchCourses()}
              size="small"
            >
              Refresh
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardContent>
          {coursesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : coursesError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading courses: {getErrorMessage(coursesError)}
            </Alert>
          ) : !coursesData ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No data available
              </Typography>
            </Box>
          ) : courses.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <School sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No courses found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {searchTerm || streamFilter || durationFilter
                  ? "Try adjusting your filters or search terms."
                  : "Get started by creating your first course."}
              </Typography>
              <Button variant="contained" onClick={handleCreateDialogOpen}>
                Add Course
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Stream</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Updated</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {course.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {course.stream ? (
                            <Chip
                              label={course.stream}
                              size="small"
                              color="primary"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {course.duration_years} years
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(course.updated_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Tooltip title="Edit Course">
                              <IconButton
                                size="small"
                                onClick={() => handleEditCourse(course)}
                                color="primary"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Course">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(course)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
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
        </CardContent>
      </Card>

      {/* Create Course Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Course Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
              placeholder="e.g., B.Tech, B.Pharma, MBA, M.Tech, BBA, BCA"
              required
            />
            <TextField
              fullWidth
              label="Stream (Optional)"
              value={formData.stream}
              onChange={(e) =>
                setFormData({ ...formData, stream: e.target.value })
              }
              margin="normal"
              placeholder="e.g., CSE, ECE, ME, CE, IT, Finance, Marketing, HR"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Duration (Years)</InputLabel>
              <Select
                value={formData.durationYears}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationYears: e.target.value as number,
                  })
                }
                label="Duration (Years)"
              >
                <MenuItem value={2}>2 Years</MenuItem>
                <MenuItem value={3}>3 Years</MenuItem>
                <MenuItem value={4}>4 Years</MenuItem>
                <MenuItem value={5}>5 Years</MenuItem>
                <MenuItem value={6}>6 Years</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Description (Optional)
              </Typography>
              <RichTextEditor
                value={formData.description || ""}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Enter detailed course description with formatting..."
                minHeight={150}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateCourse}
            variant="contained"
            disabled={!formData.name || createCourseMutation.isLoading}
          >
            {createCourseMutation.isLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Create Course"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Course Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
              placeholder="e.g., B.Tech, B.Pharma, MBA, M.Tech, BBA, BCA"
              required
            />
            <TextField
              fullWidth
              label="Stream (Optional)"
              value={formData.stream}
              onChange={(e) =>
                setFormData({ ...formData, stream: e.target.value })
              }
              margin="normal"
              placeholder="e.g., CSE, ECE, ME, CE, IT, Finance, Marketing, HR"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Duration (Years)</InputLabel>
              <Select
                value={formData.durationYears}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationYears: e.target.value as number,
                  })
                }
                label="Duration (Years)"
              >
                <MenuItem value={2}>2 Years</MenuItem>
                <MenuItem value={3}>3 Years</MenuItem>
                <MenuItem value={4}>4 Years</MenuItem>
                <MenuItem value={5}>5 Years</MenuItem>
                <MenuItem value={6}>6 Years</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Description (Optional)
              </Typography>
              <RichTextEditor
                value={formData.description || ""}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Enter detailed course description with formatting..."
                minHeight={150}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateCourse}
            variant="contained"
            disabled={!formData.name || updateCourseMutation.isLoading}
          >
            {updateCourseMutation.isLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Update Course"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCourse?.name}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteCourse}
            color="error"
            variant="contained"
            disabled={deleteCourseMutation.isLoading}
          >
            {deleteCourseMutation.isLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Courses</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload an Excel (.xlsx) or CSV file with course data. The file
              should contain columns: name, stream (optional), durationYears,
              description (optional).
            </Typography>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportFile}
              style={{ width: "100%" }}
            />
            {importFile && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Selected file: {importFile.name}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsImportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleImportCourses}
            variant="contained"
            disabled={!importFile || importCoursesMutation.isLoading}
          >
            {importCoursesMutation.isLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Import"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoursesManagement;
