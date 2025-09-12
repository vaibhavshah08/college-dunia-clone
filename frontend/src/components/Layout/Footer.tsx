import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        py: 4,
        mt: "auto",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 4,
          }}
        >
          {/* Company Info */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              CampusConnect
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, color: "rgba(255, 255, 255, 0.9)" }}
            >
              Your trusted partner in educational journey. Find the best
              colleges, secure loans, and manage your academic documents all in
              one place.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email fontSize="small" sx={{ color: "white" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  support@collegedunia.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone fontSize="small" sx={{ color: "white" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn fontSize="small" sx={{ color: "white" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  123 Education St, Learning City, LC 12345
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.3)" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            © {currentYear} CampusConnect. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link
              href="/privacy"
              sx={{
                textDecoration: "none",
                color: "white",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              sx={{
                textDecoration: "none",
                color: "white",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/help"
              sx={{
                textDecoration: "none",
                color: "white",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Help & Support
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
