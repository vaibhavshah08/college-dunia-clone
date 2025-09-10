import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ArrowBack,
  AttachMoney,
  Schedule,
  School,
  CheckCircle,
  Pending,
  Cancel,
  RateReview,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useAuth } from "../../lib/hooks/useAuth";
import loansApi from "../../services/modules/loans.api";
import collegesApi from "../../services/modules/colleges.api";
import { Loan } from "../../types/api";

const LoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Fetch loan details
  const {
    data: loan,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["loan", id],
    queryFn: () => loansApi.getLoan(id!),
    enabled: !!id && isAuthenticated,
  });

  // Fetch college details if loan exists
  const { data: college } = useQuery({
    queryKey: ["college", loan?.college_id],
    queryFn: () => collegesApi.getCollege(loan!.college_id),
    enabled: !!loan?.college_id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle color="success" />;
      case "rejected":
        return <Cancel color="error" />;
      case "under_review":
        return <RateReview color="info" />;
      default:
        return <Pending color="warning" />;
    }
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

  const calculateMonthlyPayment = (
    principal: number,
    rate: number,
    months: number
  ) => {
    const monthlyRate = rate / 100 / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
  };

  const calculateTotalInterest = (
    principal: number,
    rate: number,
    months: number
  ) => {
    const monthlyPayment = calculateMonthlyPayment(principal, rate, months);
    return monthlyPayment * months - principal;
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
            Access Loan Details
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Please login to view loan details
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !loan) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load loan details. Please try again.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/loans")}
        >
          Back to Loans
        </Button>
      </Container>
    );
  }

  const monthlyPayment = calculateMonthlyPayment(
    loan.principal_amount,
    loan.interest_rate,
    loan.term_months
  );
  const totalInterest = calculateTotalInterest(
    loan.principal_amount,
    loan.interest_rate,
    loan.term_months
  );
  const totalAmount = loan.principal_amount + totalInterest;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/loans")}
          sx={{ mb: 2 }}
        >
          Back to Loans
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Loan Application Details
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Loan Overview */}
        <Box sx={{ flex: { md: 2 } }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h5" component="h2">
                  {loan.loan_type}
                </Typography>
                <Chip
                  icon={getStatusIcon(loan.status)}
                  label={loan.status.replace("_", " ").toUpperCase()}
                  color={getStatusColor(loan.status) as any}
                  variant="outlined"
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3,
                }}
              >
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AttachMoney sx={{ mr: 1, color: "primary.main" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Principal Amount
                      </Typography>
                      <Typography variant="h6">
                        ₹{loan.principal_amount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 3,
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <RateReview sx={{ mr: 1, color: "primary.main" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Interest Rate
                      </Typography>
                      <Typography variant="h6">
                        {loan.interest_rate}% per annum
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 3,
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Schedule sx={{ mr: 1, color: "primary.main" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Loan Term
                      </Typography>
                      <Typography variant="h6">
                        {loan.term_months} months
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 3,
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <School sx={{ mr: 1, color: "primary.main" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        College
                      </Typography>
                      <Typography variant="h6">
                        {college?.college_name || "Loading..."}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {loan.description && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loan.description}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Breakdown
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: 2,
                }}
              >
                <Box>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="grey.50"
                    borderRadius={1}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Monthly Payment
                    </Typography>
                    <Typography variant="h5" color="primary.main">
                      ₹{monthlyPayment.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="grey.50"
                    borderRadius={1}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Total Interest
                    </Typography>
                    <Typography variant="h5" color="secondary.main">
                      ₹{totalInterest.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Box
                    textAlign="center"
                    p={2}
                    bgcolor="grey.50"
                    borderRadius={1}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      ₹{totalAmount.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Loan Information */}
        <Box sx={{ flex: { md: 1 } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Application Date"
                    secondary={new Date(loan.created_at).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Loan ID" secondary={loan.loan_id} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={
                      <Chip
                        label={loan.status.replace("_", " ").toUpperCase()}
                        color={getStatusColor(loan.status) as any}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Next Steps
              </Typography>
              <List dense>
                {loan.status === "submitted" && (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <Pending color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Application Under Review"
                        secondary="Your application is being reviewed by our team"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Processing Time"
                        secondary="Typically 3-5 business days"
                      />
                    </ListItem>
                  </>
                )}
                {loan.status === "under_review" && (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <RateReview color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Detailed Review"
                        secondary="Your application is being thoroughly reviewed"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Expected Decision"
                        secondary="Within 2-3 business days"
                      />
                    </ListItem>
                  </>
                )}
                {loan.status === "approved" && (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Congratulations!"
                        secondary="Your loan has been approved"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AttachMoney color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Disbursement"
                        secondary="Funds will be disbursed within 1-2 business days"
                      />
                    </ListItem>
                  </>
                )}
                {loan.status === "rejected" && (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <Cancel color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Application Rejected"
                        secondary="Please contact support for more information"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Reapply"
                        secondary="You can submit a new application after 30 days"
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default LoanDetail;
