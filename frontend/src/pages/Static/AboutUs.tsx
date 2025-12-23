import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { School, People, EmojiEvents } from "@mui/icons-material";
import { AnimatedPage } from "../../components/Motion";

const AboutUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      icon: <School sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Search Colleges & Courses",
      description:
        "Explore detailed college profiles and course information in one place.",
    },
    {
      icon: <People sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Apply for Education Loan",
      description:
        "Apply for a loan specifically for your chosen college via the platform.",
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Document Upload & Management",
      description:
        "Securely upload and manage your documents within the portal.",
    },
  ];

  const stats = [
    { number: "1000+", label: "Students Supported" },
    { number: "50+", label: "Expert Mentors" },
    { number: "95%", label: "Success Rate" },
    { number: "5+", label: "Years of Service" },
  ];

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            About Meraki Connect
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto", mb: 4 }}
          >
            We combine clarity, trust, and support to help students navigate
            higher education — from discovery to enrollment.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label="Colleges & Courses"
              color="primary"
              variant="outlined"
            />
            <Chip label="Loan & Docs" color="primary" variant="outlined" />
            <Chip label="Student Support" color="primary" variant="outlined" />
          </Box>
        </Box>

        {/* About Us Section */}
        <Card sx={{ mb: 6 }}>
          <CardContent sx={{ p: 6 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                alignItems: "center",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  About Us
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, fontSize: "1.1rem" }}
                >
                  Meraki Connect is committed to making education accessible and
                  actionable. Through our platform, students can explore
                  colleges and courses, apply for loans, and manage required
                  documents — all in one seamless environment.
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem" }}
                >
                  With a student-first philosophy, we adapt our guidance to your
                  individual strengths and simplify every step of the admission
                  journey.
                </Typography>
              </Box>

              {/* Image from Meraki site */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 300,
                  width: { xs: "100%", md: "50%" },
                }}
              >
                <img
                  src="https://merakiedu.co/assets/images/about_us.jpg"
                  alt="About Meraki"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Our Impact
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{ flex: { xs: "1 1 45%", md: "1 1 22%" }, minWidth: 200 }}
              >
                <Card sx={{ textAlign: "center", p: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h3"
                      color="primary.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Features */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            What We Offer
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  flex: { xs: "1 1 100%", md: "1 1 45%", lg: "1 1 30%" },
                  minWidth: 300,
                }}
              >
                <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Why Choose Us */}
        <Card sx={{ mb: 6 }}>
          <CardContent sx={{ p: 6 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                alignItems: "center",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Why Choose Meraki Connect
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, fontSize: "1.1rem" }}
                >
                  We guide you in choosing courses and specializations that
                  align with your natural abilities—whether analytical,
                  creative, or academic. You get access to a unified hub of
                  institutions and courses, plus a smooth admission process
                  through digital applications and interviews.
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem" }}
                >
                  Beyond admission, Meraki Connect supports you with logistics
                  such as hostels and banking, and provides inclusive support
                  for learners with challenges. We eliminate dependency on local
                  intermediaries and bring transparency, efficiency, and trust
                  to your educational journey.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Founder’s Message */}
        <Card sx={{ mb: 6 }}>
          <CardContent sx={{ p: 6 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                alignItems: "center",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Founder’s Message
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", fontSize: "1.1rem" }}
                >
                  “Education serves as the cornerstone of intellectual
                  evolution, igniting critical discernment, pioneering
                  innovation, and driving transformative societal progress.
                  Through the seamless fusion of acumen, erudition, and
                  pragmatic guidance, visionary career empowerment transcends
                  conventional educational frontiers, catalyzes
                  paradigm-shifting breakthroughs, and architects a future where
                  wisdom, integrity, and ingenuity converge to redefine
                  excellence.”
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </AnimatedPage>
  );
};

export default AboutUs;
