import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
} from "@mui/material";
import {
  ExpandMore,
  Help,
  School,
  AccountBalance,
  Description,
} from "@mui/icons-material";

const HelpSupport: React.FC = () => {
  // Smooth scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const faqs = [
    {
      question: "How do I apply for a loan?",
      answer:
        "To apply for a loan, go to the Loans section, click 'Apply for Loan', fill out the required information including your college selection, loan amount, and upload necessary documents. Our team will review your application and get back to you within 2-3 business days.",
    },
    {
      question: "What documents do I need to upload?",
      answer:
        "Required documents typically include: Academic transcripts, Identity proof (Aadhaar/Passport), Address proof, Income proof (if applicable), College admission letter, and any other documents specific to your loan type.",
    },
    {
      question: "How long does loan approval take?",
      answer:
        "Loan approval typically takes 2-5 business days after all required documents are submitted and verified. You can track your application status in the Loans section of your dashboard.",
    },
    {
      question: "Can I compare multiple colleges?",
      answer:
        "Yes! You can select multiple colleges from the Colleges section and use the 'Compare' feature to see side-by-side comparisons of fees, courses, placements, and other important factors.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Go to your Profile section, click 'Edit Profile', make the necessary changes, and save. Some changes may require verification before they take effect.",
    },
    {
      question: "What if I forget my password?",
      answer:
        "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Check your email and follow the instructions to create a new password.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we take data security seriously. All your personal and financial information is encrypted and stored securely. We never share your information with third parties without your explicit consent.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us through the contact form below, email us at support@collegedunia.com, or call us at +1 (555) 123-4567. Our support team is available Monday-Friday, 9 AM - 6 PM.",
    },
  ];

  const supportCategories = [
    {
      title: "Account & Profile",
      icon: <Help />,
      description:
        "Account setup, profile management, and authentication issues",
    },
    {
      title: "College Search",
      icon: <School />,
      description:
        "Finding colleges, comparing options, and getting detailed information",
    },
    {
      title: "Loan Applications",
      icon: <AccountBalance />,
      description:
        "Applying for loans, document requirements, and application status",
    },
    {
      title: "Document Management",
      icon: <Description />,
      description: "Uploading, managing, and tracking your documents",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
      >
        FAQ's
      </Typography>

      {/* Support Categories */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          How can we help you?
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {supportCategories.map((category, index) => (
            <Card
              key={index}
              sx={{ height: "100%", textAlign: "center", p: 2 }}
            >
              <CardContent>
                <Box sx={{ color: "primary.main", mb: 2 }}>{category.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Frequently Asked Questions
        </Typography>
        <Paper elevation={1}>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default HelpSupport;
