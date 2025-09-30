import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  YouTube,
  WhatsApp,
} from "@mui/icons-material";
import Logo from "../Logo/Logo";

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
            <Logo color="white" variant="footer" />
            <Typography
              variant="body2"
              sx={{ mb: 2, color: "rgba(255, 255, 255, 0.9)" }}
            >
              Through a combination of lectures, readings, discussions, students
              will gain solid foundation in educational.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Follow us on Instagram">
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/merakiedu_official/",
                      "_blank"
                    )
                  }
                >
                  <Instagram />
                </IconButton>
              </Tooltip>
              <Tooltip title="Connect with us on LinkedIn">
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                  onClick={() =>
                    window.open("https://www.linkedin.com/", "_blank")
                  }
                >
                  <LinkedIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Chat with us on WhatsApp">
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                  onClick={() =>
                    window.open("https://wa.me/916909300369", "_blank")
                  }
                >
                  <WhatsApp />
                </IconButton>
              </Tooltip>
              <Tooltip title="Subscribe to our YouTube channel">
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/channel/UC76u8xQVChUo4NtPTyRmdwA",
                      "_blank"
                    )
                  }
                >
                  <YouTube />
                </IconButton>
              </Tooltip>
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
                  merakiofficial0369@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone fontSize="small" sx={{ color: "white" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  +91 6909300369
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn fontSize="small" sx={{ color: "white" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                >
                  KJP Assembly Conference Centre, Opp. State Central Library,
                  I.G.P. Road, Shillong-793001, Meghalaya
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
            © {currentYear} Meraki Connect. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Link
              component={RouterLink}
              to="/about-us"
              sx={{
                textDecoration: "none",
                color: "white",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              About Us
            </Link>
            <Link
              component={RouterLink}
              to="/contact-us"
              sx={{
                textDecoration: "none",
                color: "white",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Contact Us
            </Link>
            <Link
              component={RouterLink}
              to="/privacy-policy"
              sx={{
                textDecoration: "none",
                color: "white",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms-of-service"
              sx={{
                textDecoration: "none",
                color: "white",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Terms of Service
            </Link>
            <Link
              component={RouterLink}
              to="/help-support"
              sx={{
                textDecoration: "none",
                color: "white",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              FAQ's
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
