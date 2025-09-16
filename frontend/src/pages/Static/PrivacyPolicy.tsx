import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Privacy Policy
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
          1. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information you provide directly to us, such as when you
          create an account, apply for loans, upload documents, or contact us
          for support. This may include:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Personal information (name, email, phone number)
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Educational information (college preferences, course details)
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Financial information (loan applications, documents)
            </Typography>
          </li>
          <li>
            <Typography variant="body1">Usage data and analytics</Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          2. How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We use the information we collect to:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Provide and improve our services
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Process loan applications and document verification
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Communicate with you about your account and services
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Ensure platform security and prevent fraud
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Comply with legal obligations
            </Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          3. Information Sharing
        </Typography>
        <Typography variant="body1" paragraph>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described in this
          policy. We may share information with:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Service providers who assist in our operations
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Financial institutions for loan processing
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Legal authorities when required by law
            </Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          4. Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          We implement appropriate security measures to protect your personal
          information against unauthorized access, alteration, disclosure, or
          destruction. However, no method of transmission over the internet is
          100% secure.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          5. Your Rights
        </Typography>
        <Typography variant="body1" paragraph>
          You have the right to:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1">
              Access and update your personal information
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Request deletion of your account and data
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Opt-out of marketing communications
            </Typography>
          </li>
          <li>
            <Typography variant="body1">Request a copy of your data</Typography>
          </li>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
        >
          6. Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </Typography>
        <Typography variant="body1" paragraph>
          Email: privacy@collegedunia.com
          <br />
          Phone: +1 (555) 123-4567
          <br />
          Address: 123 Education Street, Learning City, LC 12345
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ mt: 4, fontStyle: "italic" }}
        >
          This Privacy Policy may be updated from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
