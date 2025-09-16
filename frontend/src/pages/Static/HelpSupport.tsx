import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  ExpandMore,
  Email,
  Phone,
  Chat,
  Help,
  School,
  AccountBalance,
  Description,
  Send,
} from "@mui/icons-material";

const HelpSupport: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a backend
    console.log("Contact form submitted:", contactForm);
    setFormSubmitted(true);
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

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
        Help & Support
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

      {/* Contact Form */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Contact Us
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 4,
          }}
        >
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Send us a message
            </Typography>

            {formSubmitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for your message! We'll get back to you within 24
                hours.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={contactForm.name}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={contactForm.message}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<Send />}
                fullWidth
                size="large"
              >
                Send Message
              </Button>
            </form>
          </Paper>

          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Other ways to reach us
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Email sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Email Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@collegedunia.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Phone sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Phone Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Chat sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Live Chat
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Mon-Fri, 9 AM - 6 PM
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Response Times
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label="Email: 24 hours"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label="Phone: Immediate"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label="Live Chat: 5 minutes"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default HelpSupport;
