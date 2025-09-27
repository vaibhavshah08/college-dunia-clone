import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Terms of Service
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing and using CollegeDunia, you accept and agree to be bound
          by the terms and provision of this agreement. If you do not agree to
          abide by the above, please do not use this service.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          2. Description of Service
        </Typography>
        <Typography variant="body1" paragraph>
          CollegeDunia provides a platform for students to:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Search and compare colleges and universities
            </Typography>
          </li>
          <li>
            <Typography variant="body1">Apply for education loans</Typography>
          </li>
          <li>
            <Typography variant="body1">Upload and manage documents</Typography>
          </li>
          <li>
            <Typography variant="body1">
              Access educational resources and information
            </Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          3. User Accounts
        </Typography>
        <Typography variant="body1" paragraph>
          To access certain features of the service, you must register for an
          account. You agree to:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Provide accurate and complete information
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Maintain the security of your password
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Accept responsibility for all activities under your account
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Notify us immediately of any unauthorized use
            </Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          4. User Conduct
        </Typography>
        <Typography variant="body1" paragraph>
          You agree not to use the service to:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Violate any laws or regulations
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Infringe on intellectual property rights
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Transmit harmful or malicious code
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Attempt to gain unauthorized access to our systems
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Interfere with the proper functioning of the service
            </Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          5. Loan Applications
        </Typography>
        <Typography variant="body1" paragraph>
          When applying for loans through our platform:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              You must provide accurate financial information
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              All documents must be authentic and current
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Loan approval is subject to lender criteria
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              We are not responsible for loan decisions
            </Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          6. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          The service and its original content, features, and functionality are
          owned by CollegeDunia and are protected by international copyright,
          trademark, patent, trade secret, and other intellectual property laws.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          7. Disclaimers
        </Typography>
        <Typography variant="body1" paragraph>
          The service is provided "as is" without warranties of any kind. We do
          not guarantee:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Accuracy of college information
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Availability of loan products
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Uninterrupted service access
            </Typography>
          </li>
          <li>
            <Typography variant="body1">Error-free operation</Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          8. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          In no event shall CollegeDunia be liable for any indirect, incidental,
          special, consequential, or punitive damages, including without
          limitation, loss of profits, data, use, goodwill, or other intangible
          losses.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          9. Termination
        </Typography>
        <Typography variant="body1" paragraph>
          We may terminate or suspend your account immediately, without prior
          notice or liability, for any reason whatsoever, including without
          limitation if you breach the Terms.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          10. Changes to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to modify or replace these Terms at any time. If
          a revision is material, we will try to provide at least 30 days notice
          prior to any new terms taking effect.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsOfService;
