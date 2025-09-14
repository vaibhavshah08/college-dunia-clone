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
  Pagination,
  Tooltip,
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
import { useToast } from "../../contexts/ToastContext";
import { useDebounce } from "../../hooks/useDebounce";
import collegesApi from "../../services/modules/colleges.api";
import loansApi from "../../services/modules/loans.api";
import documentsApi from "../../services/modules/documents.api";
import adminApi from "../../services/modules/admin.api";
import { College, Loan, Document, User, DocumentStatus } from "../../types/api";
import { downloadCsvTemplate, parseCsvFile } from "../../utils/excelUtils";
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
  const toast = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [collegesPage, setCollegesPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [documentsPage, setDocumentsPage] = useState(1);
  const [loansPage, setLoansPage] = useState(1);
  const [itemsPerPage] = useState(10);
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
  // Separate search states for each table
  const [collegeSearchQuery, setCollegeSearchQuery] = useState("");

  // Filter states for tables
  const [userFilters, setUserFilters] = useState({
    id: "",
    name: "",
    email: "",
    status: "",
  });
  const [loanFilters, setLoanFilters] = useState({
    id: "",
    userId: "",
    collegeId: "",
    status: "",
  });
  const [documentFilters, setDocumentFilters] = useState({
    id: "",
    userId: "",
    status: "",
  });

  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [collegeViewDialogOpen, setCollegeViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userViewDialogOpen, setUserViewDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [collegeDialogOpen, setCollegeDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    is_admin: false,
    is_active: true,
  });
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userDependencies, setUserDependencies] = useState<any>(null);
  const [deletionInProgress, setDeletionInProgress] = useState(false);

  // Debounced search queries for better UX
  const debouncedCollegeSearchQuery = useDebounce(collegeSearchQuery, 300);
  const debouncedUserFilters = useDebounce(userFilters, 300);
  const debouncedLoanFilters = useDebounce(loanFilters, 300);
  const debouncedDocumentFilters = useDebounce(documentFilters, 300);

  // Fetch data from APIs
  const { data: colleges = [], isLoading: collegesLoading } = useQuery({
    queryKey: ["colleges", "admin"],
    queryFn: () => collegesApi.getColleges({}),
    enabled: isAuthenticated,
  });

  const {
    data: loansData,
    isLoading: loansLoading,
    error: loansError,
  } = useQuery({
    queryKey: ["loans", "admin", debouncedLoanFilters],
    queryFn: () =>
      loansApi.getAllLoans(
        1,
        100,
        debouncedLoanFilters.status,
        debouncedLoanFilters.userId
      ),
    enabled: isAuthenticated,
    onError: (error) => {
      console.error("Loans fetch error:", error);
    },
  });

  const loans = loansData?.loans || [];

  const { data: documentsData, isLoading: documentsLoading } = useQuery({
    queryKey: ["documents", "admin", debouncedDocumentFilters],
    queryFn: () =>
      documentsApi.getAllDocuments(
        1,
        100,
        debouncedDocumentFilters.status,
        debouncedDocumentFilters.userId,
        ""
      ),
    enabled: isAuthenticated,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", "admin", debouncedUserFilters],
    queryFn: () => adminApi.getAllUsers(1, 100, ""),
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
  });

  // Update college mutation
  const updateCollegeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<College> }) =>
      collegesApi.updateCollege(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges", "admin"] });
      setCollegeDialogOpen(false);
      setEditingCollege(null);
    },
  });

  // Delete college mutation
  const deleteCollegeMutation = useMutation({
    mutationFn: collegesApi.deleteCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colleges", "admin"] });
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
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: documentsApi.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });
    },
  });

  // User mutations
  const createUserMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
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
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
      setUserDialogOpen(false);
      setEditingUser(null);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: ({
      id,
      mode,
    }: {
      id: string;
      mode: "USER_ONLY" | "WITH_DEPENDENCIES";
    }) => adminApi.deleteUser(id, mode),
    onSuccess: (data) => {
      if (!deletionInProgress) {
        setDeletionInProgress(true);

        // Invalidate specific queries to avoid over-invalidation
        queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
        queryClient.invalidateQueries({ queryKey: ["loans", "admin"] });
        queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });

        if (data.deletedCounts) {
          toast.success(
            `User deleted successfully. Removed ${data.deletedCounts.loans} loans and ${data.deletedCounts.documents} documents.`
          );
        } else {
          toast.success("User deleted successfully");
        }

        // Reset flag after a short delay
        setTimeout(() => setDeletionInProgress(false), 1000);
      }
    },
    onError: (error: any) => {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user");
      setDeletionInProgress(false);
    },
  });

  // Filter data based on debounced search query
  const filteredColleges = colleges.filter(
    (college) =>
      college.college_name
        .toLowerCase()
        .includes(debouncedCollegeSearchQuery.toLowerCase()) ||
      college.city
        .toLowerCase()
        .includes(debouncedCollegeSearchQuery.toLowerCase()) ||
      college.state
        .toLowerCase()
        .includes(debouncedCollegeSearchQuery.toLowerCase()) ||
      college.courses_offered.some((course) =>
        course.toLowerCase().includes(debouncedCollegeSearchQuery.toLowerCase())
      )
  );

  // Filter data based on filter states
  const filteredDocuments = documents.filter((document) => {
    const matchesId =
      !debouncedDocumentFilters.id ||
      document.document_id
        .toLowerCase()
        .includes(debouncedDocumentFilters.id.toLowerCase());
    const matchesUserId =
      !debouncedDocumentFilters.userId ||
      document.user_id
        .toLowerCase()
        .includes(debouncedDocumentFilters.userId.toLowerCase());
    const matchesStatus =
      !debouncedDocumentFilters.status ||
      document.status.toLowerCase() ===
        debouncedDocumentFilters.status.toLowerCase();

    return matchesId && matchesUserId && matchesStatus;
  });

  const filteredLoans = loans.filter((loan) => {
    const matchesId =
      !debouncedLoanFilters.id ||
      loan.loan_id
        .toLowerCase()
        .includes(debouncedLoanFilters.id.toLowerCase());
    const matchesUserId =
      !debouncedLoanFilters.userId ||
      loan.user_id
        .toLowerCase()
        .includes(debouncedLoanFilters.userId.toLowerCase());
    const matchesCollegeId =
      !debouncedLoanFilters.collegeId ||
      loan.college_id
        .toLowerCase()
        .includes(debouncedLoanFilters.collegeId.toLowerCase());
    const matchesStatus =
      !debouncedLoanFilters.status ||
      loan.status.toLowerCase() === debouncedLoanFilters.status.toLowerCase();

    return matchesId && matchesUserId && matchesCollegeId && matchesStatus;
  });

  const filteredUsers = users.filter((user) => {
    const matchesId =
      !debouncedUserFilters.id ||
      user.user_id
        .toLowerCase()
        .includes(debouncedUserFilters.id.toLowerCase());
    const matchesName =
      !debouncedUserFilters.name ||
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(debouncedUserFilters.name.toLowerCase());
    const matchesEmail =
      !debouncedUserFilters.email ||
      user.email
        .toLowerCase()
        .includes(debouncedUserFilters.email.toLowerCase());
    const matchesStatus =
      !debouncedUserFilters.status ||
      (debouncedUserFilters.status === "active" && user.is_active) ||
      (debouncedUserFilters.status === "inactive" && !user.is_active);

    return matchesId && matchesName && matchesEmail && matchesStatus;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setCollegeSearchQuery("");
    setUserFilters({ id: "", name: "", email: "", status: "" });
    setDocumentFilters({ id: "", userId: "", status: "" });
    setLoanFilters({ id: "", userId: "", collegeId: "", status: "" });
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
      toast.error("Failed to save college. Please try again.");
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

  const handleDeleteCollege = async (collegeId: string) => {
    try {
      // Check if there are any loans associated with this college
      const associatedLoans = await loansApi.getLoansByCollegeId(collegeId);

      if (associatedLoans.length > 0) {
        // Show detailed confirmation with loan IDs
        const loanIds = associatedLoans.map((loan) => loan.loan_id).join(", ");
        const confirmMessage = `Cannot delete this college. There are ${associatedLoans.length} loan(s) associated with it.\n\nAssociated Loan IDs: ${loanIds}\n\nPlease handle these loans first before deleting the college.`;

        alert(confirmMessage);
        return;
      }

      // If no loans are associated, proceed with normal confirmation
      if (window.confirm("Are you sure you want to delete this college?")) {
        deleteCollegeMutation.mutate(collegeId);
      }
    } catch (error) {
      console.error("Error checking for associated loans:", error);
      // If there's an error checking loans, proceed with normal confirmation
      if (window.confirm("Are you sure you want to delete this college?")) {
        deleteCollegeMutation.mutate(collegeId);
      }
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

    try {
      // Parse the uploaded file
      const data = await parseCsvFile(file);
      console.log("Parsed data:", data);

      if (!data || data.length === 0) {
        throw new Error("No data found in CSV file");
      }

      // Map CSV data to college schema
      const collegesData = data.map((row: any, index: number) => {
        // Validate required fields
        const requiredFields = [
          "College Name",
          "State",
          "City",
          "Pincode",
          "Fees (₹)",
          "Ranking",
          "Courses Offered",
          "Placement Ratio",
          "Year of Establish",
          "Affiliation",
          "Accreditation",
        ];
        const missingFields = requiredFields.filter(
          (field) => !row[field] || row[field] === ""
        );

        if (missingFields.length > 0) {
          throw new Error(
            `Row ${index + 2}: Missing required fields: ${missingFields.join(
              ", "
            )}`
          );
        }

        const collegeData = {
          college_name: row["College Name"],
          state: row["State"],
          city: row["City"],
          pincode: row["Pincode"] ? row["Pincode"].toString() : "",
          landmark: row["Landmark"] || "",
          fees: row["Fees (₹)"] || 0,
          ranking: row["Ranking"] || 0,
          courses_offered: row["Courses Offered"] || [],
          placement_ratio:
            row["Placement Ratio"] || row["Placement Ratio (%)"] || 0,
          year_of_establishment:
            row["Year of Establish"] || row["Year of Establishment"] || 0,
          affiliation: row["Affiliation"],
          accreditation: row["Accreditation"],
          is_partnered: row["Is Partnered"] || false,
          avg_package: row["Avg Package (₹)"] || 0,
          median_package: row["Median Package (₹)"] || 0,
          highest_package: row["Highest Package (₹)"] || 0,
          placement_rate: row["Placement Rate (%)"] || 0,
          top_recruiters: row["Top Recruiters"] || [],
        };

        console.log(`Mapped college data for row ${index + 2}:`, collegeData);
        return collegeData;
      });

      // Call API to save colleges
      const result = await collegesApi.bulkCreateColleges(collegesData);

      if (result?.data?.failed > 0) {
        toast.warning(
          `CSV file processed with some errors. ${result.data.successful} colleges created successfully, ${result.data.failed} failed.`
        );
        console.error("Failed colleges:", result.data.errors);
      } else {
        // CSV upload success handled by API client
      }

      // Refresh the colleges list
      queryClient.invalidateQueries(["colleges", "admin"]);
    } catch (error: any) {
      // Enhanced error handling for CSV upload
      if (error?.message === "Failed to parse CSV file") {
        toast.error(
          "Invalid CSV file format. Please use the provided template."
        );
      } else if (error?.message?.includes("Missing required fields")) {
        toast.error(error.message);
      } else if (error?.status === 413) {
        toast.error("File too large. Please upload a smaller file.");
      } else if (error?.status === 415) {
        toast.error("Unsupported file type. Please upload a CSV file (.csv).");
      } else if (error?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.code === "NETWORK_ERROR") {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        console.error("Upload error:", error);
        toast.error(
          `Failed to upload file: ${error?.message || "Unknown error"}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadCsvTemplate();
  };

  const handleDocumentView = (document: any) => {
    setSelectedDocument(document);
    setDocumentDialogOpen(true);
  };

  const handleCollegeView = (college: College) => {
    setSelectedCollege(college);
    setCollegeViewDialogOpen(true);
  };

  const handleUserView = (user: User) => {
    setSelectedUser(user);
    setUserViewDialogOpen(true);
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
      loansApi.updateLoanStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["loans", "admin"]);
      },
    }
  );

  const handleLoanAction = (loanId: string, action: "approve" | "reject") => {
    const status = action === "approve" ? "approved" : "rejected";
    updateLoanStatusMutation.mutate({ id: loanId, status });
  };

  const handleLoanView = (loan: Loan) => {
    setSelectedLoan(loan);
    setLoanDialogOpen(true);
  };

  // Refresh all data
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["colleges", "admin"] });
    queryClient.invalidateQueries({ queryKey: ["loans", "admin"] });
    queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });
    queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    // Data refresh success handled by API client
  };

  // Card click handlers to navigate to respective tabs
  const handleCardClick = (tabIndex: number) => {
    setTabValue(tabIndex);
  };

  // Pagination helper functions
  const getPaginatedData = (
    data: any[],
    page: number,
    itemsPerPage: number
  ) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: any[], itemsPerPage: number) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  // Pagination handlers
  const handleCollegesPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCollegesPage(value);
  };

  const handleUsersPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setUsersPage(value);
  };

  const handleDocumentsPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setDocumentsPage(value);
  };

  const handleLoansPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setLoansPage(value);
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
          toast.error("Password is required for new users.");
          setIsSubmitting(false);
          return;
        }
        createUserMutation.mutate(userForm);
      }
    } catch (error: any) {
      toast.error("Failed to save user. Please try again.");
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

  const handleDeleteUser = async (user: User) => {
    try {
      const dependencies = await adminApi.checkUserDependencies(user.user_id);
      setUserDependencies(dependencies);
      setUserToDelete(user);
      setDeleteUserDialogOpen(true);
    } catch (error) {
      console.error("Error checking user dependencies:", error);
      toast.error("Failed to check user dependencies");
    }
  };

  const handleConfirmDeleteUser = (mode: "USER_ONLY" | "WITH_DEPENDENCIES") => {
    if (userToDelete && !deletionInProgress) {
      setDeletionInProgress(true);
      deleteUserMutation.mutate({ id: userToDelete.user_id, mode });
      setDeleteUserDialogOpen(false);
      setUserToDelete(null);
      setUserDependencies(null);
    }
  };

  const handleOpenUserDialog = () => {
    setEditingUser(null);
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
        <Card
          sx={{
            height: "100%",
            cursor: "pointer",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
          onClick={() => handleCardClick(1)}
        >
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

        <Card
          sx={{
            height: "100%",
            cursor: "pointer",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
          onClick={() => handleCardClick(0)}
        >
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

        <Card
          sx={{
            height: "100%",
            cursor: "pointer",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
          onClick={() => handleCardClick(3)}
        >
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

        <Card
          sx={{
            height: "100%",
            cursor: "pointer",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
          onClick={() => handleCardClick(2)}
        >
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
                  {isSubmitting ? <CircularProgress size={20} /> : "Upload CSV"}
                  <input
                    type="file"
                    hidden
                    accept=".csv"
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
                value={collegeSearchQuery}
                onChange={(e) => setCollegeSearchQuery(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: "text.secondary" }}>
                      {collegesLoading ? <CircularProgress size={16} /> : "🔍"}
                    </Box>
                  ),
                }}
              />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
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
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : filteredColleges.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {collegeSearchQuery
                              ? `No colleges found matching "${collegeSearchQuery}"`
                              : "No colleges available"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getPaginatedData(
                        filteredColleges,
                        collegesPage,
                        itemsPerPage
                      ).map((college) => (
                        <TableRow key={college.college_id}>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.75rem",
                              }}
                            >
                              {college.college_id}
                            </Typography>
                          </TableCell>
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
                                .map((course: string, index: number) => (
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
                              color="info"
                              onClick={() => handleCollegeView(college)}
                            >
                              <Visibility />
                            </IconButton>
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
              {filteredColleges.length > itemsPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={getTotalPages(filteredColleges, itemsPerPage)}
                    page={collegesPage}
                    onChange={handleCollegesPageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
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

          {/* Filter Controls */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              label="User ID"
              variant="outlined"
              size="small"
              value={userFilters.id}
              onChange={(e) =>
                setUserFilters((prev) => ({ ...prev, id: e.target.value }))
              }
              sx={{ minWidth: 120 }}
            />
            <TextField
              label="Name"
              variant="outlined"
              size="small"
              value={userFilters.name}
              onChange={(e) =>
                setUserFilters((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              value={userFilters.email}
              onChange={(e) =>
                setUserFilters((prev) => ({ ...prev, email: e.target.value }))
              }
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={userFilters.status}
                label="Status"
                onChange={(e) =>
                  setUserFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
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
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No users found matching the current filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  getPaginatedData(filteredUsers, usersPage, itemsPerPage).map(
                    (user: User) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              fontSize: "0.75rem",
                            }}
                          >
                            {user.user_id}
                          </Typography>
                        </TableCell>
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
                            color="info"
                            onClick={() => handleUserView(user)}
                          >
                            <Visibility />
                          </IconButton>
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
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredUsers.length > itemsPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={getTotalPages(filteredUsers, itemsPerPage)}
                page={usersPage}
                onChange={handleUsersPageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
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

          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              label="Document ID"
              variant="outlined"
              size="small"
              value={documentFilters.id}
              onChange={(e) =>
                setDocumentFilters((prev) => ({ ...prev, id: e.target.value }))
              }
              sx={{ minWidth: 120 }}
            />
            <TextField
              label="User ID"
              variant="outlined"
              size="small"
              value={documentFilters.userId}
              onChange={(e) =>
                setDocumentFilters((prev) => ({
                  ...prev,
                  userId: e.target.value,
                }))
              }
              sx={{ minWidth: 120 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={documentFilters.status}
                label="Status"
                onChange={(e) =>
                  setDocumentFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
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
                  <TableCell>ID</TableCell>
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
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No documents found matching the current filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  getPaginatedData(
                    filteredDocuments,
                    documentsPage,
                    itemsPerPage
                  ).map((document: Document) => (
                    <TableRow key={document.document_id}>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                          }}
                        >
                          {document.document_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`User ID: ${document.user_id}`} arrow>
                          <span>
                            {document.user
                              ? `${document.user.first_name} ${document.user.last_name}`
                              : `User ${document.user_id}`}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {document.document_type || "General"}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
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
          {filteredDocuments.length > itemsPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={getTotalPages(filteredDocuments, itemsPerPage)}
                page={documentsPage}
                onChange={handleDocumentsPageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
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

          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              label="Loan ID"
              variant="outlined"
              size="small"
              value={loanFilters.id}
              onChange={(e) =>
                setLoanFilters((prev) => ({ ...prev, id: e.target.value }))
              }
              sx={{ minWidth: 120 }}
            />
            <TextField
              label="User ID"
              variant="outlined"
              size="small"
              value={loanFilters.userId}
              onChange={(e) =>
                setLoanFilters((prev) => ({ ...prev, userId: e.target.value }))
              }
              sx={{ minWidth: 120 }}
            />
            <TextField
              label="College ID"
              variant="outlined"
              size="small"
              value={loanFilters.collegeId}
              onChange={(e) =>
                setLoanFilters((prev) => ({
                  ...prev,
                  collegeId: e.target.value,
                }))
              }
              sx={{ minWidth: 120 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={loanFilters.status}
                label="Status"
                onChange={(e) =>
                  setLoanFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <MenuItem value="">All Loans</MenuItem>
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
                  <TableCell>ID</TableCell>
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
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No loans found matching the current filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  getPaginatedData(filteredLoans, loansPage, itemsPerPage).map(
                    (loan) => (
                      <TableRow key={loan.loan_id}>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              fontSize: "0.75rem",
                            }}
                          >
                            {loan.loan_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`User ID: ${loan.user_id}`} arrow>
                            <span>
                              {loan.user
                                ? `${loan.user.first_name} ${loan.user.last_name}`
                                : `User ${loan.user_id}`}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{loan.loan_type}</TableCell>
                        <TableCell>
                          ₹{loan.principal_amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={`College ID: ${loan.college_id}`}
                            arrow
                          >
                            <span>
                              {loan.college
                                ? loan.college.college_name
                                : `College ${loan.college_id}`}
                            </span>
                          </Tooltip>
                        </TableCell>
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
                            onClick={() => handleLoanView(loan)}
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
                    )
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredLoans.length > itemsPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={getTotalPages(filteredLoans, itemsPerPage)}
                page={loansPage}
                onChange={handleLoansPageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
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
                <Tooltip title={`User ID: ${selectedDocument.user_id}`} arrow>
                  <span>
                    {selectedDocument.user
                      ? `${selectedDocument.user.first_name} ${selectedDocument.user.last_name}`
                      : `User ${selectedDocument.user_id}`}
                  </span>
                </Tooltip>
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

      {/* College View Dialog */}
      <Dialog
        open={collegeViewDialogOpen}
        onClose={() => setCollegeViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>College Details</DialogTitle>
        <DialogContent>
          {selectedCollege && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedCollege.college_name}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    College ID
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                  >
                    {selectedCollege.college_id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedCollege.city}, {selectedCollege.state}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pincode
                  </Typography>
                  <Typography variant="body1">
                    {selectedCollege.pincode}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Landmark
                  </Typography>
                  <Typography variant="body1">
                    {selectedCollege.landmark || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fees
                  </Typography>
                  <Typography variant="body1">
                    ₹{selectedCollege.fees.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ranking
                  </Typography>
                  <Typography variant="body1">
                    #{selectedCollege.ranking}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Placement Ratio
                  </Typography>
                  <Typography variant="body1">
                    {selectedCollege.placement_ratio}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Year of Establishment
                  </Typography>
                  <Typography variant="body1">
                    {selectedCollege.year_of_establishment}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Affiliation
                  </Typography>
                  <Typography variant="body1">
                    {selectedCollege.affiliation}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Accreditation
                  </Typography>
                  <Typography variant="body1">
                    {selectedCollege.accreditation}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Partnered
                  </Typography>
                  <Typography variant="body1">
                    {selectedCollege.is_partnered ? "Yes" : "No"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedCollege.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Courses Offered
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedCollege.courses_offered?.map((course, index) => (
                    <Chip key={index} label={course} size="small" />
                  ))}
                </Box>
              </Box>

              {(selectedCollege.avg_package ||
                selectedCollege.median_package ||
                selectedCollege.highest_package) && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Package Details
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 2,
                    }}
                  >
                    {selectedCollege.avg_package && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Average Package
                        </Typography>
                        <Typography variant="body1">
                          ₹{selectedCollege.avg_package.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    {selectedCollege.median_package && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Median Package
                        </Typography>
                        <Typography variant="body1">
                          ₹{selectedCollege.median_package.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    {selectedCollege.highest_package && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Highest Package
                        </Typography>
                        <Typography variant="body1">
                          ₹{selectedCollege.highest_package.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {selectedCollege.top_recruiters &&
                selectedCollege.top_recruiters.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Top Recruiters
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selectedCollege.top_recruiters.map(
                        (recruiter, index) => (
                          <Chip
                            key={index}
                            label={recruiter}
                            size="small"
                            color="primary"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCollegeViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* User View Dialog */}
      <Dialog
        open={userViewDialogOpen}
        onClose={() => setUserViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedUser.first_name} {selectedUser.last_name}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                  >
                    {selectedUser.user_id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedUser.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.phone_number || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.is_admin ? "Admin" : "User"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">
                    {selectedUser.is_active ? "Active" : "Inactive"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserViewDialogOpen(false)}>Close</Button>
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
        onClose={() => setUserDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
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

      {/* Loan Details Dialog */}
      <Dialog
        open={loanDialogOpen}
        onClose={() => {
          setLoanDialogOpen(false);
          setSelectedLoan(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Loan Details</DialogTitle>
        <DialogContent>
          {selectedLoan && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Loan ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedLoan.loan_id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    User
                  </Typography>
                  <Typography variant="body1">
                    <Tooltip title={`User ID: ${selectedLoan.user_id}`} arrow>
                      <span>
                        {selectedLoan.user
                          ? `${selectedLoan.user.first_name} ${selectedLoan.user.last_name}`
                          : `User ${selectedLoan.user_id}`}
                      </span>
                    </Tooltip>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Loan Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedLoan.loan_type}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Principal Amount
                  </Typography>
                  <Typography variant="body1">
                    ₹{selectedLoan.principal_amount.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Interest Rate
                  </Typography>
                  <Typography variant="body1">
                    {selectedLoan.interest_rate}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Term (Months)
                  </Typography>
                  <Typography variant="body1">
                    {selectedLoan.term_months}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedLoan.status.replace("_", " ").toUpperCase()}
                    color={getStatusColor(selectedLoan.status) as any}
                    size="small"
                  />
                </Box>
                {selectedLoan.approved_by && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Approved By
                    </Typography>
                    <Typography variant="body1">
                      {selectedLoan.approved_by_user
                        ? `${selectedLoan.approved_by_user.first_name} ${selectedLoan.approved_by_user.last_name}`
                        : `User ${selectedLoan.approved_by}`}
                    </Typography>
                  </Box>
                )}
                {selectedLoan.rejected_by && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Rejected By
                    </Typography>
                    <Typography variant="body1">
                      {selectedLoan.rejected_by_user
                        ? `${selectedLoan.rejected_by_user.first_name} ${selectedLoan.rejected_by_user.last_name}`
                        : `User ${selectedLoan.rejected_by}`}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    College
                  </Typography>
                  <Typography variant="body1">
                    <Tooltip
                      title={`College ID: ${selectedLoan.college_id}`}
                      arrow
                    >
                      <span>
                        {selectedLoan.college
                          ? selectedLoan.college.college_name
                          : `College ${selectedLoan.college_id}`}
                      </span>
                    </Tooltip>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedLoan.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              {selectedLoan.description && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedLoan.description}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoanDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={deleteUserDialogOpen}
        onClose={() => setDeleteUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          {userToDelete && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete user{" "}
                <strong>
                  {userToDelete.first_name} {userToDelete.last_name}
                </strong>
                ?
              </Typography>

              {userDependencies && userDependencies.hasDependencies && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "grey.100",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.300",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    gutterBottom
                  >
                    ⚠️ This user has associated data:
                  </Typography>
                  <Typography variant="body2">
                    • {userDependencies.loans} loan(s)
                  </Typography>
                  <Typography variant="body2">
                    • {userDependencies.documents} document(s)
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontWeight: "bold" }}
                  >
                    Choose how to proceed:
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserDialogOpen(false)}>Cancel</Button>
          {userDependencies && userDependencies.hasDependencies ? (
            <>
              <Button
                onClick={() => handleConfirmDeleteUser("USER_ONLY")}
                color="warning"
                variant="outlined"
              >
                Delete User Only
              </Button>
              <Button
                onClick={() => handleConfirmDeleteUser("WITH_DEPENDENCIES")}
                color="error"
                variant="contained"
              >
                Delete User & All Data
              </Button>
            </>
          ) : (
            <Button
              onClick={() => handleConfirmDeleteUser("USER_ONLY")}
              color="error"
              variant="contained"
            >
              Delete User
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
