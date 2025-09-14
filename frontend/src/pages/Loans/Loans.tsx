import React, { useState } from "react";
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
} from "@mui/material";
import { Add, Visibility, Refresh, Edit } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import loansApi from "../../services/modules/loans.api";
import collegesApi from "../../services/modules/colleges.api";
import { Loan, LoanCreate } from "../../types/api";
import { useToast } from "../../contexts/ToastContext";

const Loans: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const [formData, setFormData] = useState<LoanCreate>({
    loan_type: "Education Loan",
    principal_amount: undefined as any,
    interest_rate: 8.5,
    term_months: undefined as any,
    college_id: "",
    description: "",
  });

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
          description: "",
        });
        toast.success("Loan application submitted successfully");
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

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["loans", "me"] });
    queryClient.invalidateQueries({ queryKey: ["colleges"] });
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
    <Container maxWidth="lg">
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Loan Applications
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Apply for Loan
            </Button>
          </Box>
        </Box>

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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {loans.length === 0 ? (
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Alert severity="info">
                  No loan applications found. Apply for a loan to get started.
                </Alert>
              </Box>
            ) : (
              getPaginatedData(loans, page, itemsPerPage).map((loan: Loan) => (
                <Card
                  key={loan.loan_id}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
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
                        label={loan.status.replace("_", " ").toUpperCase()}
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
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/loans/${loan.loan_id}`)}
                        sx={{ minWidth: "auto", flex: 1 }}
                      >
                        View Details
                      </Button>
                      {loan.status === "submitted" ? (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEditLoan(loan)}
                          color="primary"
                          sx={{ minWidth: "auto", flex: 1 }}
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
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
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
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
            {editingLoan ? "Edit Loan Application" : "Apply for Education Loan"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <FormControl fullWidth>
                <InputLabel>Loan Type</InputLabel>
                <Select
                  value={formData.loan_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      loan_type: e.target.value,
                    }))
                  }
                  label="Loan Type"
                >
                  <MenuItem value="Education Loan">Education Loan</MenuItem>
                  <MenuItem value="Personal Loan">Personal Loan</MenuItem>
                  <MenuItem value="Home Loan">Home Loan</MenuItem>
                </Select>
              </FormControl>

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
              {createLoanMutation.isLoading || updateLoanMutation.isLoading ? (
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
  );
};

export default Loans;
