import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import {
  Add,
  Visibility,
  Refresh,
  Edit,
  MonetizationOn,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import loansApi from "../../services/modules/loans.api";
import collegesApi from "../../services/modules/colleges.api";
import { Loan, LoanCreate } from "../../types/api";
import { useToast } from "../../contexts/ToastContext";
import {
  AnimatedPage,
  AnimatedList,
  AnimatedCard,
  AnimatedButton,
} from "../../components/Motion";

const Loans: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState<LoanCreate>({
    loan_type: "Education Loan",
    principal_amount: undefined as any,
    interest_rate: 8.5,
    term_months: undefined as any,
    college_id: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    gender: "",
    whatsapp_number: "",
    description: "",
  });

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      setFormData({
        loan_type: "Education Loan",
        principal_amount: undefined as any,
        interest_rate: 8.5,
        term_months: undefined as any,
        college_id: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        gender: "",
        whatsapp_number: "",
        description: "",
      });
    };
  }, []);

  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Fetch user's loans
  const {
    data: loans = [],
    isLoading,
    error,
  } = useQuery<Loan[], Error>({
    queryKey: ["loans", "me"],
    queryFn: loansApi.getMyLoans,
    enabled: isAuthenticated,
  });

  // Fetch colleges for loan form
  const { data: colleges = [] } = useQuery({
    queryKey: ["colleges"],
    queryFn: () => collegesApi.getColleges({}),
    enabled: isAuthenticated,
  });

  // Create loan mutation
  const createLoanMutation = useMutation({
    mutationFn: loansApi.createLoan,
    onSuccess: () => {
      if (!mutationInProgress) {
        setMutationInProgress(true);
        queryClient.invalidateQueries({ queryKey: ["loans", "me"] });
        setOpenDialog(false);
        setFormData({
          loan_type: "Education Loan",
          principal_amount: undefined as any,
          interest_rate: 8.5,
          term_months: undefined as any,
          college_id: "",
          phone_number: "",
          first_name: "",
          last_name: "",
          gender: "",
          whatsapp_number: "",
          description: "",
        });
        setTimeout(() => setMutationInProgress(false), 1000);
      }
    },
    onError: (error: any) => {
      console.error("Create loan error:", error);
      toast.error("Failed to submit loan application");
      setMutationInProgress(false);
    },
  });

  // Update loan mutation
  const updateLoanMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LoanCreate }) =>
      loansApi.updateLoan(id, data),
    onSuccess: () => {
      if (!mutationInProgress) {
        setMutationInProgress(true);
        queryClient.invalidateQueries({ queryKey: ["loans", "me"] });
        setOpenDialog(false);
        setEditingLoan(null);
        setFormData({
          loan_type: "Education Loan",
          principal_amount: undefined as any,
          interest_rate: 8.5,
          term_months: undefined as any,
          college_id: "",
          phone_number: "",
          first_name: "",
          last_name: "",
          gender: "",
          whatsapp_number: "",
          description: "",
        });
        toast.success("Loan updated successfully");
        setTimeout(() => setMutationInProgress(false), 1000);
      }
    },
    onError: (error: any) => {
      console.error("Update loan error:", error);
      toast.error("Failed to update loan. Only pending loans can be edited.");
      setMutationInProgress(false);
    },
  });

  const handleSubmit = () => {
    if (mutationInProgress) {
      return; // Prevent multiple submissions
    }

    // Validation
    if (!formData.principal_amount || formData.principal_amount <= 0) {
      toast.error("Please enter a valid principal amount");
      return;
    }
    if (!formData.term_months || formData.term_months <= 0) {
      toast.error("Please select a valid tenure");
      return;
    }
    if (!formData.college_id) {
      toast.error("Please select a college");
      return;
    }

    if (editingLoan) {
      updateLoanMutation.mutate({ id: editingLoan.loan_id, data: formData });
    } else {
      createLoanMutation.mutate(formData);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["loans", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["colleges"] });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditLoan = (loan: Loan) => {
    if (loan.status !== "submitted") {
      toast.error("Only pending loans can be edited");
      return;
    }

    setEditingLoan(loan);
    setFormData({
      loan_type: loan.loan_type,
      principal_amount: loan.principal_amount,
      interest_rate: loan.interest_rate,
      term_months: loan.term_months,
      college_id: loan.college_id,
      phone_number: loan.phone_number || "",
      first_name: loan.first_name || "",
      last_name: loan.last_name || "",
      gender: loan.gender || "",
      whatsapp_number: loan.whatsapp_number || "",
      description: loan.description || "",
    });
    setOpenDialog(true);
  };

  const handleOpenDialog = () => {
    setEditingLoan(null);
    setFormData({
      loan_type: "Education Loan",
      principal_amount: undefined as any,
      interest_rate: 8.5,
      term_months: undefined as any,
      college_id: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      gender: "",
      whatsapp_number: "",
      description: "",
    });
    setOpenDialog(true);
  };

  // Pagination helper functions
  const getPaginatedData = (
    data: Loan[],
    page: number,
    itemsPerPage: number
  ) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: Loan[], itemsPerPage: number) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "under_review":
        return "info";
      default:
        return "warning";
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Access Loan Applications
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Please login to view and manage your loan applications
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="lg">
        <>
          {/* Header */}
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <MonetizationOn sx={{ fontSize: 48, color: "#1976D2" }} />
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
                  mb: 0,
                }}
              >
                Loan Applications
              </Typography>
            </Box>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
            >
              Apply for education loans and manage your loan applications. Track
              your application status and requirements.
            </Typography>
          </Box>

          {/* Application Section */}
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
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#2c3e50" }}
                >
                  💰 Loan Management
                </Typography>
                <Box display="flex" gap={2} flexWrap="nowrap">
                  <Button
                    variant="outlined"
                    startIcon={
                      isRefreshing ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Refresh />
                      )
                    }
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    sx={{
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                  <IconButton
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    size="large"
                    sx={{
                      display: { xs: "flex", sm: "none" },
                    }}
                    aria-label="Refresh"
                  >
                    {isRefreshing ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Refresh />
                    )}
                  </IconButton>
                  <AnimatedButton
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    sx={{
                      minWidth: { xs: "auto", sm: "auto" },
                      px: { xs: 2, sm: 3 },
                      background: "linear-gradient(45deg, #1976D2, #42A5F5)",
                      fontWeight: 600,
                      "&:hover": {
                        background: "linear-gradient(45deg, #1565C0, #1976D2)",
                      },
                    }}
                  >
                    <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                      Apply for Loan
                    </Box>
                    <Box sx={{ display: { xs: "inline", sm: "none" } }}>
                      Apply
                    </Box>
                  </AnimatedButton>
                </Box>
              </Box>
            </CardContent>
          </Card>

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
              Failed to load loan applications. Please try again.
            </Alert>
          )}

          {/* Loans List */}
          {!isLoading && !error && (
            <AnimatedList
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
              staggerDelay={0.08}
            >
              {loans.length === 0 ? (
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Alert severity="info">
                    No loan applications found. Apply for a loan to get started.
                  </Alert>
                </Box>
              ) : (
                getPaginatedData(loans, page, itemsPerPage).map(
                  (loan: Loan, index: number) => (
                    <AnimatedCard key={loan.loan_id} delay={index * 0.08}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                          border: "1px solid rgba(0,0,0,0.05)",
                          borderRadius: 3,
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                            borderColor: "#1976D2",
                            "& .loan-card-overlay": {
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
                            background:
                              "linear-gradient(90deg, #1976D2, #42A5F5)",
                            transform: "scaleX(0)",
                            transition: "transform 0.3s ease",
                          },
                          "&:hover::before": {
                            transform: "scaleX(1)",
                          },
                        }}
                      >
                        <Box
                          className="loan-card-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            zIndex: 1,
                          }}
                        />
                        <CardContent
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            zIndex: 2,
                          }}
                        >
                          {/* Header with status */}
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            mb={2}
                          >
                            <Typography variant="h6" component="h3">
                              {loan.loan_type}
                            </Typography>
                            <Chip
                              label={loan.status
                                .replace("_", " ")
                                .toUpperCase()}
                              color={getStatusColor(loan.status) as any}
                              size="small"
                            />
                          </Box>

                          {/* Loan details */}
                          <Box flex={1} mb={3}>
                            <Typography
                              variant="h5"
                              color="primary.main"
                              fontWeight="bold"
                              gutterBottom
                            >
                              ₹{loan.principal_amount.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Interest Rate: {loan.interest_rate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Term: {loan.term_months} months
                            </Typography>
                          </Box>

                          {/* Action buttons */}
                          <Box
                            display="flex"
                            gap={1}
                            flexWrap="wrap"
                            justifyContent="center"
                          >
                            <AnimatedButton
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => navigate(`/loans/${loan.loan_id}`)}
                              sx={{
                                minWidth: "auto",
                                flex: 1,
                                fontWeight: 600,
                                borderRadius: 2,
                                "&:hover": {
                                  background:
                                    "linear-gradient(45deg, #1976D2, #42A5F5)",
                                  color: "white",
                                  borderColor: "transparent",
                                },
                              }}
                            >
                              View Details
                            </AnimatedButton>
                            {loan.status === "submitted" ? (
                              <AnimatedButton
                                variant="contained"
                                size="small"
                                startIcon={<Edit />}
                                onClick={() => handleEditLoan(loan)}
                                sx={{
                                  minWidth: "auto",
                                  flex: 1,
                                  background:
                                    "linear-gradient(45deg, #1976D2, #42A5F5)",
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  "&:hover": {
                                    background:
                                      "linear-gradient(45deg, #1565C0, #1976D2)",
                                  },
                                }}
                              >
                                Edit
                              </AnimatedButton>
                            ) : (
                              <AnimatedButton
                                variant="outlined"
                                size="small"
                                startIcon={<Edit />}
                                disabled
                                sx={{
                                  minWidth: "auto",
                                  flex: 1,
                                  opacity: 0.5,
                                  color: "text.disabled",
                                  borderColor: "text.disabled",
                                }}
                                title={`Only pending loans can be edited. This loan is ${loan.status
                                  .replace("_", " ")
                                  .toLowerCase()}.`}
                              >
                                Edit
                              </AnimatedButton>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </AnimatedCard>
                  )
                )
              )}
            </AnimatedList>
          )}

          {/* Pagination */}
          {!isLoading && !error && loans.length > itemsPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={getTotalPages(loans, itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Loan Application Dialog */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {editingLoan
                ? "Edit Education Loan Application"
                : "Apply for Education Loan"}
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                {/* Name Fields */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    placeholder="Enter your first name"
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    placeholder="Enter your last name"
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Gender Radio Buttons */}
                <FormControl fullWidth>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup
                    row
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                  </RadioGroup>
                </FormControl>

                {/* College Selection */}
                <FormControl fullWidth>
                  <InputLabel>College</InputLabel>
                  <Select
                    value={formData.college_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        college_id: e.target.value,
                      }))
                    }
                    label="College"
                  >
                    {colleges.map((college) => (
                      <MenuItem
                        key={college.college_id}
                        value={college.college_id}
                      >
                        {college.college_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Phone Number */}
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone_number: e.target.value,
                    }))
                  }
                  placeholder="Enter your phone number"
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <FormControl fullWidth>
                  <FormLabel>
                    Is the phone number above your WhatsApp number?
                  </FormLabel>
                  <RadioGroup
                    row
                    value={
                      formData.phone_number === formData.whatsapp_number
                        ? "yes"
                        : "no"
                    }
                    onChange={(e) => {
                      if (e.target.value === "yes") {
                        setFormData((prev) => ({
                          ...prev,
                          whatsapp_number: prev.phone_number,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          whatsapp_number: "",
                        }));
                      }
                    }}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>

                {formData.phone_number !== formData.whatsapp_number && (
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    type="tel"
                    value={formData.whatsapp_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        whatsapp_number: e.target.value,
                      }))
                    }
                    placeholder="Enter your WhatsApp number"
                    InputLabelProps={{ shrink: true }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Principal Amount (₹)"
                  type="number"
                  value={formData.principal_amount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      principal_amount: e.target.value
                        ? Number(e.target.value)
                        : (undefined as any),
                    }))
                  }
                  placeholder="Enter loan amount"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="Interest Rate (%)"
                  type="number"
                  value={formData.interest_rate}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                    },
                  }}
                  helperText="Interest rate is fixed by the bank"
                />

                <FormControl fullWidth>
                  <InputLabel>Tenure (months)</InputLabel>
                  <Select
                    value={formData.term_months || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        term_months: e.target.value
                          ? Number(e.target.value)
                          : (undefined as any),
                      }))
                    }
                    label="Tenure (months)"
                  >
                    <MenuItem value={6}>6 months</MenuItem>
                    <MenuItem value={9}>9 months</MenuItem>
                    <MenuItem value={12}>12 months</MenuItem>
                    <MenuItem value={18}>18 months</MenuItem>
                    <MenuItem value={24}>24 months</MenuItem>
                    <MenuItem value={36}>36 months</MenuItem>
                    <MenuItem value={48}>48 months</MenuItem>
                    <MenuItem value={60}>60 months</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                  setEditingLoan(null);
                  setFormData({
                    loan_type: "Education Loan",
                    principal_amount: undefined as any,
                    interest_rate: 8.5,
                    term_months: undefined as any,
                    college_id: "",
                    phone_number: "",
                    first_name: "",
                    last_name: "",
                    gender: "",
                    whatsapp_number: "",
                    description: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={
                  createLoanMutation.isLoading ||
                  updateLoanMutation.isLoading ||
                  mutationInProgress
                }
              >
                {createLoanMutation.isLoading ||
                updateLoanMutation.isLoading ? (
                  <CircularProgress size={24} />
                ) : editingLoan ? (
                  "Update Application"
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </Container>
    </AnimatedPage>
  );
};

export default Loans;
