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
} from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import loansApi from "../../services/modules/loans.api";
import collegesApi from "../../services/modules/colleges.api";
import { Loan, LoanCreate } from "../../types/api";

const Loans: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<LoanCreate>({
    loan_type: "Education Loan",
    principal_amount: undefined as any,
    interest_rate: 8.5,
    term_months: undefined as any,
    college_id: "",
    description: "",
  });

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
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!formData.principal_amount || formData.principal_amount <= 0) {
      alert("Please enter a valid principal amount");
      return;
    }
    if (!formData.term_months || formData.term_months <= 0) {
      alert("Please select a valid tenure");
      return;
    }
    if (!formData.college_id) {
      alert("Please select a college");
      return;
    }

    createLoanMutation.mutate(formData);
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
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Apply for Loan
          </Button>
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
              loans.map((loan: Loan) => (
                <Card key={loan.loan_id}>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {loan.loan_type}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Amount: ₹{loan.principal_amount.toLocaleString()}
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
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1}
                      >
                        <Chip
                          label={loan.status.replace("_", " ").toUpperCase()}
                          color={getStatusColor(loan.status) as any}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/loans/${loan.loan_id}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* Loan Application Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Apply for Education Loan</DialogTitle>
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
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={createLoanMutation.isLoading}
            >
              {createLoanMutation.isLoading ? (
                <CircularProgress size={24} />
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
