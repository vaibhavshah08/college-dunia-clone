import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import {
  School,
  People,
  EmojiEvents,
  Lightbulb,
  TrendingUp,
  Support,
} from "@mui/icons-material";

const AboutUs: React.FC = () => {
  const features = [
    {
      icon: <School sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Quality Education",
      description:
        "We provide comprehensive educational resources and support to help students achieve their academic goals.",
    },
    {
      icon: <People sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Expert Guidance",
      description:
        "Our experienced team of educators and counselors guide students through their educational journey.",
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Proven Results",
      description:
        "Through our structured approach, students gain solid foundation in educational excellence.",
    },
    {
      icon: <Lightbulb sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Innovative Learning",
      description:
        "We combine lectures, readings, and discussions to create an engaging learning environment.",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Career Growth",
      description:
        "Our programs are designed to help students build successful careers in their chosen fields.",
    },
    {
      icon: <Support sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "24/7 Support",
      description:
        "We provide continuous support to ensure our students never feel alone in their journey.",
    },
  ];

  const stats = [
    { number: "1000+", label: "Students Helped" },
    { number: "50+", label: "Expert Educators" },
    { number: "95%", label: "Success Rate" },
    { number: "5+", label: "Years Experience" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          About Merraki Connect
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", mb: 4 }}
        >
          Through a combination of lectures, readings, discussions, students
          will gain solid foundation in educational.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Chip label="Quality Education" color="primary" variant="outlined" />
          <Chip label="Expert Guidance" color="primary" variant="outlined" />
          <Chip label="Proven Results" color="primary" variant="outlined" />
        </Box>
      </Box>

      {/* Mission Section */}
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
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Our Mission
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, fontSize: "1.1rem" }}
              >
                At Merraki Connect, we believe that education is the foundation
                of success. Our mission is to provide comprehensive educational
                support that empowers students to achieve their academic and
                career goals.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.1rem" }}
              >
                We are committed to creating an environment where learning is
                engaging, accessible, and transformative. Through our innovative
                approach combining traditional and modern educational methods,
                we help students build the knowledge and skills they need to
                succeed in today's competitive world.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
                width: { xs: "100%", md: "50%" },
                bgcolor: "primary.main",
                borderRadius: 2,
                color: "white",
              }}
            >
              <School sx={{ fontSize: 120, opacity: 0.3 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Section */}
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

      {/* Features Section */}
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

      {/* Values Section */}
      <Card sx={{ mb: 6 }}>
        <CardContent sx={{ p: 6 }}>
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Our Values
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" }, minWidth: 250 }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Lightbulb sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Innovation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We continuously innovate our teaching methods to provide the
                  best learning experience.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" }, minWidth: 250 }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <People sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Community
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We foster a supportive community where students can learn and
                  grow together.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{ flex: { xs: "1 1 100%", md: "1 1 30%" }, minWidth: 250 }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Excellence
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We strive for excellence in everything we do, setting high
                  standards for our students.
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card sx={{ bgcolor: "primary.main", color: "white" }}>
        <CardContent sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Ready to Start Your Educational Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students who have already transformed their lives
            through education.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Contact us today to learn more about our programs and how we can
            help you achieve your goals.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AboutUs;
