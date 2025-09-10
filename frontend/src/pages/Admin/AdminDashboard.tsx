import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  People,
  School,
  AccountBalance,
  Description,
  Add,
  Upload,
  Edit,
  Delete,
  Download,
  Visibility,
  CheckCircle,
  Cancel,
  Person,
  Email,
  Phone,
  CalendarToday,
  AttachFile,
  Refresh,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import collegesApi from "../../services/modules/colleges.api";
import loansApi from "../../services/modules/loans.api";
import documentsApi from "../../services/modules/documents.api";
import adminApi from "../../services/modules/admin.api";
import { College, Loan, Document, User, DocumentStatus } from "../../types/api";
import { downloadExcelTemplate, parseExcelFile } from "../../utils/excelUtils";
import { getErrorMessage } from "../../utils/errorHandler";

// Get file URL for preview
const getFileUrl = (documentPath: string) => {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:7001";
  return `${API_BASE_URL}${documentPath}`;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [collegeForm, setCollegeForm] = useState({
    college_name: "",
    state: "",
    city: "",
    pincode: "",
    landmark: "",
    fees: "",
    ranking: "",
    courses_offered: "",
    placement_ratio: "",
    year_of_establishment: "",
    affiliation: "",
    accreditation: "",
    is_partnered: false,
    avg_package: "",
    median_package: "",
    highest_package: "",
    placement_rate: "",
    top_recruiters: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [collegeDialogOpen, setCollegeDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    is_admin: false,
    is_active: true,
  });
  const [documentStatusFilter, setDocumentStatusFilter] = useState<string>("");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Fetch data from APIs
  const { data: colleges = [], isLoading: collegesLoading } = useQuery({
    queryKey: ["colleges", "admin"],
    queryFn: () => collegesApi.getColleges({}),
    enabled: isAuthenticated,
  });

  const {
    data: loans = [],
    isLoading: loansLoading,
    error: loansError,
  } = useQuery({
    queryKey: ["loans", "admin"],
    queryFn: loansApi.getAllLoans,
    enabled: isAuthenticated,
    onError: (error) => {
      console.error("Loans fetch error:", error);
    },
  });

  const { data: documentsData, isLoading: documentsLoading } = useQuery({
    queryKey: ["documents", "admin", documentStatusFilter],
    queryFn: () => documentsApi.getAllDocuments(1, 100, documentStatusFilter),
    enabled: isAuthenticated,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", "admin", userSearchQuery],
    queryFn: () => adminApi.getAllUsers(1, 100, userSearchQuery),
    enabled: isAuthenticated,
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminApi.getDashboardStats,
    enabled: isAuthenticated,
  });

  const documents = documentsData?.documents || [];
  const users = usersData?.users || [];

  // Create college mutation
  const createCollegeMutation = useMutation({
    mutationFn: collegesApi.createCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges", "admin"] });
      setMessage({ type: "success", text: "College created successfully!" });
      setCollegeForm({
        college_name: "",
        state: "",
        city: "",
        pincode: "",
        landmark: "",
        fees: "",
        ranking: "",
        courses_offered: "",
        placement_ratio: "",
        year_of_establishment: "",
        affiliation: "",
        accreditation: "",
        is_partnered: false,
        avg_package: "",
        median_package: "",
        highest_package: "",
        placement_rate: "",
        top_recruiters: "",
      });
      setCollegeDialogOpen(false);
    },
    onError: (error: any) => {
      setMessage({
        type: "error",
        text: error?.message || "Failed to create college",
      });
    },
  });

  // Update college mutation
  const updateCollegeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<College> }) =>
      collegesApi.updateCollege(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges", "admin"] });
      setMessage({ type: "success", text: "College updated successfully!" });
      setCollegeDialogOpen(false);
      setEditingCollege(null);
    },
    onError: (error: any) => {
      setMessage({
        type: "error",
        text: error?.message || "Failed to update college",
      });
    },
  });

  // Delete college mutation
  const deleteCollegeMutation = useMutation({
    mutationFn: collegesApi.deleteCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges", "admin"] });
      setMessage({ type: "success", text: "College deleted successfully!" });
    },
    onError: (error: any) => {
      setMessage({
        type: "error",
        text: error?.message || "Failed to delete college",
      });
    },
  });

  // Document mutations
  const updateDocumentStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: string;
      rejectionReason?: string;
    }) => documentsApi.updateDocumentStatus(id, status, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });
      setMessage({
        type: "success",
        text: "Document status updated successfully!",
      });
    },
    onError: (error: any) => {
      setMessage({
        type: "error",
        text: error?.message || "Failed to update document status",
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: documentsApi.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });
      setMessage({ type: "success", text: "Document deleted successfully!" });
    },
    onError: (error: any) => {
      setMessage({
        type: "error",
        text: error?.message || "Failed to delete document",
      });
    },
  });

  // User mutations
  const createUserMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
      setMessage({ type: "success", text: "User created successfully!" });
      setUserDialogOpen(false);
      setUserForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        is_admin: false,
        is_active: true,
      });
    },
    onError: (error: any) => {
      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
      setMessage({ type: "success", text: "User updated successfully!" });
      setUserDialogOpen(false);
      setEditingUser(null);
    },
    onError: (error: any) => {
      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
      setMessage({ type: "success", text: "User deleted successfully!" });
    },
    onError: (error: any) => {
      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    },
  });

  // Filter data based on search query
  const filteredColleges = colleges.filter(
    (college) =>
      college.college_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.courses_offered.some((course) =>
        course.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const filteredDocuments = documents.filter((doc: Document) =>
    doc.document_path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLoans = loans.filter(
    (loan) =>
      loan.loan_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchQuery("");
  };

  const handleCollegeFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const target = e.target as { name: string; value: string };
    const { name, value } = target;
    setCollegeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const collegeData = {
        college_name: collegeForm.college_name,
        state: collegeForm.state,
        city: collegeForm.city,
        pincode: collegeForm.pincode,
        landmark: collegeForm.landmark,
        fees: Number(collegeForm.fees),
        ranking: Number(collegeForm.ranking),
        courses_offered: collegeForm.courses_offered
          .split(",")
          .map((c) => c.trim()),
        placement_ratio: Number(collegeForm.placement_ratio),
        year_of_establishment: Number(collegeForm.year_of_establishment),
        affiliation: collegeForm.affiliation,
        accreditation: collegeForm.accreditation,
        is_partnered: collegeForm.is_partnered,
        avg_package: collegeForm.avg_package
          ? Number(collegeForm.avg_package)
          : undefined,
        median_package: collegeForm.median_package
          ? Number(collegeForm.median_package)
          : undefined,
        highest_package: collegeForm.highest_package
          ? Number(collegeForm.highest_package)
          : undefined,
        placement_rate: collegeForm.placement_rate
          ? Number(collegeForm.placement_rate)
          : undefined,
        top_recruiters: collegeForm.top_recruiters
          .split(",")
          .map((r) => r.trim())
          .filter((r) => r.length > 0),
      };

      if (editingCollege) {
        updateCollegeMutation.mutate({
          id: editingCollege.college_id,
          data: collegeData,
        });
      } else {
        createCollegeMutation.mutate(collegeData);
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: "Failed to save college. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCollege = (college: College) => {
    setEditingCollege(college);
    setCollegeForm({
      college_name: college.college_name,
      state: college.state,
      city: college.city,
      pincode: college.pincode,
      landmark: college.landmark || "",
      fees: college.fees.toString(),
      ranking: college.ranking.toString(),
      courses_offered: college.courses_offered.join(", "),
      placement_ratio: college.placement_ratio.toString(),
      year_of_establishment: college.year_of_establishment.toString(),
      affiliation: college.affiliation,
      accreditation: college.accreditation,
      is_partnered: college.is_partnered || false,
      avg_package: college.avg_package?.toString() || "",
      median_package: college.median_package?.toString() || "",
      highest_package: college.highest_package?.toString() || "",
      placement_rate: college.placement_rate?.toString() || "",
      top_recruiters: college.top_recruiters?.join(", ") || "",
    });
    setCollegeDialogOpen(true);
  };

  const handleDeleteCollege = (collegeId: string) => {
    if (window.confirm("Are you sure you want to delete this college?")) {
      deleteCollegeMutation.mutate(collegeId);
    }
  };

  const handleOpenCollegeDialog = () => {
    setEditingCollege(null);
    setCollegeForm({
      college_name: "",
      state: "",
      city: "",
      pincode: "",
      landmark: "",
      fees: "",
      ranking: "",
      courses_offered: "",
      placement_ratio: "",
      year_of_establishment: "",
      affiliation: "",
      accreditation: "",
      is_partnered: false,
      avg_package: "",
      median_package: "",
      highest_package: "",
      placement_rate: "",
      top_recruiters: "",
    });
    setCollegeDialogOpen(true);
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Parse the uploaded file
      const data = await parseExcelFile(file);
      console.log("Parsed data:", data);

      // Simulate API call to save colleges
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage({
        type: "success",
        text: `Excel file uploaded successfully! ${data.length} colleges imported.`,
      });
    } catch (error: any) {
      // Enhanced error handling for Excel upload
      if (error?.message === "Failed to parse Excel file") {
        setMessage({
          type: "error",
          text: "Invalid Excel file format. Please use the provided template.",
        });
      } else if (error?.status === 413) {
        setMessage({
          type: "error",
          text: "File too large. Please upload a smaller file.",
        });
      } else if (error?.status === 415) {
        setMessage({
          type: "error",
          text: "Unsupported file type. Please upload an Excel file (.xlsx or .xls).",
        });
      } else if (error?.status === 500) {
        setMessage({
          type: "error",
          text: "Server error. Please try again later.",
        });
      } else if (error?.code === "NETWORK_ERROR") {
        setMessage({
          type: "error",
          text: "Network error. Please check your connection and try again.",
        });
      } else {
        setMessage({
          type: "error",
          text: "Failed to upload file. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
  };

  const handleDocumentView = (document: any) => {
    setSelectedDocument(document);
    setDocumentDialogOpen(true);
  };

  const handleDocumentAction = (
    documentId: string,
    action: "approve" | "reject",
    rejectionReason?: string
  ) => {
    updateDocumentStatusMutation.mutate({
      id: documentId,
      status: action === "approve" ? "approved" : "rejected",
      rejectionReason,
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocumentMutation.mutate(documentId);
    }
  };

  // Loan action mutations
  const updateLoanStatusMutation = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      loansApi.updateLoanStatus(id, { status: status as any }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["loans", "admin"]);
        setMessage({
          type: "success",
          text: "Loan status updated successfully!",
        });
      },
      onError: (error: any) => {
        setMessage({
          type: "error",
          text: getErrorMessage(error),
        });
      },
    }
  );

  const handleLoanAction = (loanId: string, action: "approve" | "reject") => {
    const status = action === "approve" ? "approved" : "rejected";
    updateLoanStatusMutation.mutate({ id: loanId, status });
  };

  // Refresh all data
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["colleges", "admin"] });
    queryClient.invalidateQueries({ queryKey: ["loans", "admin"] });
    queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });
    queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    setMessage({
      type: "success",
      text: "Data refreshed successfully!",
    });
  };

  // User management handlers
  const handleUserFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const target = e.target as { name: string; value: string | boolean };
    const { name, value } = target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (editingUser) {
        // For editing, only include password if it's provided
        const dataToUpdate = {
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          email: userForm.email,
          phone_number: userForm.phone_number,
          is_admin: userForm.is_admin,
          is_active: userForm.is_active,
          ...(userForm.password && { password: userForm.password }),
        };
        updateUserMutation.mutate({
          id: editingUser.user_id,
          data: dataToUpdate,
        });
      } else {
        // For new users, password is required
        if (!userForm.password) {
          setMessage({
            type: "error",
            text: "Password is required for new users.",
          });
          setIsSubmitting(false);
          return;
        }
        createUserMutation.mutate(userForm);
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: "Failed to save user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number || "",
      password: "", // Don't pre-fill password for editing
      is_admin: user.is_admin,
      is_active: user.is_active,
    });
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleOpenUserDialog = () => {
    setEditingUser(null);
    setMessage(null);
    setUserForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
      is_admin: false,
      is_active: true,
    });
    setUserDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Platform Stats
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          sx={{ minWidth: 120 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
          gap: 3,
          mb: 4,
        }}
      >
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <People sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  {dashboardStats?.totalUsers || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <School sx={{ fontSize: 40, color: "success.main", mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  {dashboardStats?.totalColleges || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Colleges
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <AccountBalance
                sx={{ fontSize: 40, color: "info.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  {dashboardStats?.pendingLoans || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Loans
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <Description
                sx={{ fontSize: 40, color: "warning.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  {dashboardStats?.totalDocuments || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Documents
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Admin Tabs */}
      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Colleges" />
          <Tab label="Users" />
          <Tab label="Documents" />
          <Tab label="Loans" />
        </Tabs>

        {/* Colleges Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Add colleges manually or upload via Excel sheet
            </Typography>
          </Box>

          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Manage Colleges
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add, edit, and manage college information
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCollegeDialog}
            >
              Add College
            </Button>
          </Box>

          {/* Excel Upload */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Colleges via Excel
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload an Excel file with college data. Download the template
                below.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  disabled={isSubmitting}
                  onClick={handleDownloadTemplate}
                >
                  Download Template
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<Upload />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Upload Excel"
                  )}
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                  />
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Colleges Table */}
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">Existing Colleges</Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {filteredColleges.length} of {colleges.length} colleges
                  </Typography>
                </Box>
              </Box>

              {/* Search Bar */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search colleges by name, location, or course type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: "text.secondary" }}>🔍</Box>
                  ),
                }}
              />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Courses</TableCell>
                      <TableCell>Fees</TableCell>
                      <TableCell>Ranking</TableCell>
                      <TableCell>Placement %</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {collegesLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : filteredColleges.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchQuery
                              ? `No colleges found matching "${searchQuery}"`
                              : "No colleges available"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredColleges.map((college) => (
                        <TableRow key={college.college_id}>
                          <TableCell>{college.college_name}</TableCell>
                          <TableCell>
                            {college.city}, {college.state}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {college.courses_offered
                                .slice(0, 2)
                                .map((course, index) => (
                                  <Chip
                                    key={index}
                                    label={course}
                                    size="small"
                                  />
                                ))}
                              {college.courses_offered.length > 2 && (
                                <Chip
                                  label={`+${
                                    college.courses_offered.length - 2
                                  }`}
                                  size="small"
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            ₹{college.fees.toLocaleString()}
                          </TableCell>
                          <TableCell>#{college.ranking}</TableCell>
                          <TableCell>{college.placement_ratio}%</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditCollege(college)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteCollege(college.college_id)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Manage Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add, edit, and manage user accounts
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                User Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage user accounts and permissions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenUserDialog}
            >
              Add User
            </Button>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name or email..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: "text.secondary" }}>🔍</Box>
              ),
            }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {userSearchQuery
                          ? `No users found matching "${userSearchQuery}"`
                          : "No users available"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: User) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_number || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_admin ? "Admin" : "User"}
                          color={user.is_admin ? "primary" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_active ? "Active" : "Inactive"}
                          color={user.is_active ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.user_id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Manage Documents
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and manage user uploaded documents
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search documents by user name or document type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: "text.secondary" }}>🔍</Box>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={documentStatusFilter}
                label="Status Filter"
                onChange={(e) => setDocumentStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Documents</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Document Type</TableCell>
                  <TableCell>File Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documentsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {searchQuery
                          ? `No documents found matching "${searchQuery}"`
                          : "No documents available"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((document: Document) => (
                    <TableRow key={document.document_id}>
                      <TableCell>
                        {document.user
                          ? `${document.user.first_name} ${document.user.last_name}`
                          : `User ${document.user_id}`}
                      </TableCell>
                      <TableCell>
                        {document.document_type || "General"}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AttachFile fontSize="small" />
                          {document.original_name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {(document.file_size / 1024 / 1024).toFixed(2)} MB
                      </TableCell>
                      <TableCell>
                        {new Date(document.uploaded_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            document.status.charAt(0).toUpperCase() +
                            document.status.slice(1)
                          }
                          color={getStatusColor(document.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDocumentView(document)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            documentsApi
                              .downloadDocument(document.document_id)
                              .then((blob) => {
                                const url = window.URL.createObjectURL(blob);
                                const a = window.document.createElement("a");
                                a.href = url;
                                a.download = document.original_name;
                                window.document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                window.document.body.removeChild(a);
                              })
                              .catch((error) => {
                                console.error("Download failed:", error);
                                // Fallback to direct URL
                                window.open(
                                  `/api/documents/${document.document_id}/download`,
                                  "_blank"
                                );
                              });
                          }}
                        >
                          <Download />
                        </IconButton>
                        {document.status === "pending" && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleDocumentAction(
                                  document.document_id,
                                  "approve"
                                )
                              }
                            >
                              <CheckCircle />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                const reason = prompt("Rejection reason:");
                                if (reason) {
                                  handleDocumentAction(
                                    document.document_id,
                                    "reject",
                                    reason
                                  );
                                }
                              }}
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        )}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteDocument(document.document_id)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Loans Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Manage Loan Applications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and manage education loan applications
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search loans by user name, loan type, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: "text.secondary" }}>🔍</Box>
              ),
            }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Loan Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>College</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loansLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {searchQuery
                          ? `No loans found matching "${searchQuery}"`
                          : "No loans available"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLoans.map((loan) => (
                    <TableRow key={loan.loan_id}>
                      <TableCell>User {loan.user_id}</TableCell>
                      <TableCell>{loan.loan_type}</TableCell>
                      <TableCell>
                        ₹{loan.principal_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>College {loan.college_id}</TableCell>
                      <TableCell>
                        {new Date(loan.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={loan.status.replace("_", " ").toUpperCase()}
                          color={getStatusColor(loan.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/loans/${loan.loan_id}`)}
                        >
                          <Visibility />
                        </IconButton>
                        {loan.status === "submitted" && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleLoanAction(loan.loan_id, "approve")
                              }
                            >
                              <CheckCircle />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleLoanAction(loan.loan_id, "reject")
                              }
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Document View Dialog */}
      <Dialog
        open={documentDialogOpen}
        onClose={() => setDocumentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Document Details</DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedDocument.name ||
                  selectedDocument.document_type ||
                  "Document"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Purpose:</strong> {selectedDocument.purpose}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Type:</strong>{" "}
                {selectedDocument.type?.replace("_", " ") ||
                  selectedDocument.document_type}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Uploaded by:</strong>{" "}
                {selectedDocument.user
                  ? `${selectedDocument.user.first_name} ${selectedDocument.user.last_name}`
                  : `User ${selectedDocument.user_id}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>File:</strong> {selectedDocument.original_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Size:</strong>{" "}
                {(selectedDocument.file_size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Uploaded:</strong>{" "}
                {new Date(selectedDocument.uploaded_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Status:</strong>{" "}
                {selectedDocument.status?.charAt(0).toUpperCase() +
                  selectedDocument.status?.slice(1)}
              </Typography>
              {selectedDocument.rejection_reason && (
                <Typography variant="body2" color="error" gutterBottom>
                  <strong>Rejection Reason:</strong>{" "}
                  {selectedDocument.rejection_reason}
                </Typography>
              )}
              {selectedDocument.reviewed_by && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Reviewed by:</strong> {selectedDocument.reviewed_by}
                </Typography>
              )}
              {selectedDocument.reviewed_at && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Reviewed on:</strong>{" "}
                  {new Date(selectedDocument.reviewed_at).toLocaleDateString()}
                </Typography>
              )}

              {/* Document Preview Section */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Document Preview
                </Typography>
                {selectedDocument.mime_type?.startsWith("image/") ? (
                  <Box>
                    <img
                      src={getFileUrl(selectedDocument.document_path)}
                      alt={selectedDocument.original_name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const nextElement = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "block";
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ display: "none" }}
                    >
                      Image preview not available
                    </Typography>
                  </Box>
                ) : selectedDocument.mime_type === "application/pdf" ? (
                  <Box>
                    <iframe
                      src={getFileUrl(selectedDocument.document_path)}
                      width="100%"
                      height="400px"
                      style={{ border: "none" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const nextElement = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "block";
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ display: "none" }}
                    >
                      PDF preview not available. Click download to view the
                      file.
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Preview not available for this file type
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Click download to view the file
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              if (selectedDocument) {
                // Use the documentsApi for proper authentication
                documentsApi
                  .downloadDocument(selectedDocument.document_id)
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = window.document.createElement("a");
                    a.href = url;
                    a.download = selectedDocument.original_name;
                    window.document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    window.document.body.removeChild(a);
                  })
                  .catch((error) => {
                    console.error("Download failed:", error);
                    // Fallback to direct URL
                    window.open(
                      `/api/documents/${selectedDocument.document_id}/download`,
                      "_blank"
                    );
                  });
              }
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* College Dialog */}
      <Dialog
        open={collegeDialogOpen}
        onClose={() => setCollegeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCollege ? "Edit College" : "Add New College"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddCollege} sx={{ mt: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                required
                fullWidth
                label="College Name"
                name="college_name"
                value={collegeForm.college_name}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
              />
              <TextField
                required
                fullWidth
                label="State"
                name="state"
                value={collegeForm.state}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
              />
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={collegeForm.city}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
              />
              <TextField
                required
                fullWidth
                label="Pincode"
                name="pincode"
                value={collegeForm.pincode}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
              />
              <TextField
                fullWidth
                label="Landmark"
                name="landmark"
                value={collegeForm.landmark}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
              />
              <TextField
                required
                fullWidth
                label="Fees (₹)"
                name="fees"
                type="number"
                value={collegeForm.fees}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
                placeholder="Enter college fees"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                fullWidth
                label="Ranking"
                name="ranking"
                type="number"
                value={collegeForm.ranking}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
                placeholder="Enter college ranking"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                fullWidth
                label="Courses Offered (comma-separated)"
                name="courses_offered"
                value={collegeForm.courses_offered}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
                placeholder="Engineering, Medical, Arts"
              />
              <TextField
                required
                fullWidth
                label="Placement Ratio (%)"
                name="placement_ratio"
                type="number"
                value={collegeForm.placement_ratio}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
                placeholder="Enter placement ratio"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                fullWidth
                label="Year of Establishment"
                name="year_of_establishment"
                type="number"
                value={collegeForm.year_of_establishment}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
                placeholder="Enter year of establishment"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                fullWidth
                label="Affiliation"
                name="affiliation"
                value={collegeForm.affiliation}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
              />
              <TextField
                required
                fullWidth
                label="Accreditation"
                name="accreditation"
                value={collegeForm.accreditation}
                onChange={handleCollegeFormChange}
                disabled={isSubmitting}
              />
            </Box>

            {/* Partnered College and Placement Details */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Partnership & Placement Details
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                  },
                  gap: 2,
                }}
              >
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="partnered-college-label">
                    Partnered College
                  </InputLabel>
                  <Select
                    labelId="partnered-college-label"
                    name="is_partnered"
                    value={collegeForm.is_partnered ? "true" : "false"}
                    label="Partnered College"
                    onChange={(e) => {
                      const value = e.target.value === "true";
                      setCollegeForm((prev) => ({
                        ...prev,
                        is_partnered: value,
                      }));
                    }}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Average Package (₹)"
                  name="avg_package"
                  type="number"
                  value={collegeForm.avg_package}
                  onChange={handleCollegeFormChange}
                  disabled={isSubmitting}
                />

                <TextField
                  fullWidth
                  label="Median Package (₹)"
                  name="median_package"
                  type="number"
                  value={collegeForm.median_package}
                  onChange={handleCollegeFormChange}
                  disabled={isSubmitting}
                />

                <TextField
                  fullWidth
                  label="Highest Package (₹)"
                  name="highest_package"
                  type="number"
                  value={collegeForm.highest_package}
                  onChange={handleCollegeFormChange}
                  disabled={isSubmitting}
                />

                <TextField
                  fullWidth
                  label="Placement Rate (%)"
                  name="placement_rate"
                  type="number"
                  value={collegeForm.placement_rate}
                  onChange={handleCollegeFormChange}
                  disabled={isSubmitting}
                />

                <TextField
                  fullWidth
                  label="Top Recruiters (comma-separated)"
                  name="top_recruiters"
                  value={collegeForm.top_recruiters}
                  onChange={handleCollegeFormChange}
                  disabled={isSubmitting}
                  placeholder="Google, Microsoft, Amazon"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCollegeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddCollege}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editingCollege ? (
              "Update College"
            ) : (
              "Add College"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Dialog */}
      <Dialog
        open={userDialogOpen}
        onClose={() => {
          setUserDialogOpen(false);
          setMessage(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}
          <Box component="form" onSubmit={handleAddUser} sx={{ mt: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                required
                fullWidth
                label="First Name"
                name="first_name"
                value={userForm.first_name}
                onChange={handleUserFormChange}
                disabled={isSubmitting}
              />
              <TextField
                required
                fullWidth
                label="Last Name"
                name="last_name"
                value={userForm.last_name}
                onChange={handleUserFormChange}
                disabled={isSubmitting}
              />
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                disabled={isSubmitting}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={userForm.phone_number}
                onChange={handleUserFormChange}
                disabled={isSubmitting}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                disabled={isSubmitting}
                required={!editingUser}
                helperText={
                  editingUser
                    ? "Leave blank to keep current password"
                    : "Password is required for new users"
                }
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="is_admin"
                  value={userForm.is_admin ? "true" : "false"}
                  label="Role"
                  onChange={(e) => {
                    const value = e.target.value === "true";
                    setUserForm((prev) => ({ ...prev, is_admin: value }));
                  }}
                  disabled={isSubmitting}
                >
                  <MenuItem value="false">User</MenuItem>
                  <MenuItem value="true">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="is_active"
                  value={userForm.is_active ? "true" : "false"}
                  label="Status"
                  onChange={(e) => {
                    const value = e.target.value === "true";
                    setUserForm((prev) => ({ ...prev, is_active: value }));
                  }}
                  disabled={isSubmitting}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editingUser ? (
              "Update User"
            ) : (
              "Add User"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
