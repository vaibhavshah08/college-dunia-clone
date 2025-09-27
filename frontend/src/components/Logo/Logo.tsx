import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { height } from "@mui/system";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showIcon?: boolean;
  color?: string;
  variant?: "header" | "footer";
}

const Logo: React.FC<LogoProps> = ({
  color = "primary.main",
  variant = "header",
}) => {
  const getLogoImage = () => {
    return variant === "header"
      ? "/assests/logo-header.png"
      : "/assests/logo-footer.png";
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <img
        src={getLogoImage()}
        alt="Merraki Logo"
        style={variant === "header" ? { height: "35px" } : { height: "60px" }}
      ></img>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: "bold",
          fontSize: variant === "header" ? "1.25rem" : "1rem",
          color: color,
          background: `linear-gradient(45deg, ${
            color === "primary.main" ? "#1976D2" : color
          }, ${color === "primary.main" ? "#42A5F5" : color})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Merraki Connect
      </Typography>
    </Box>
  );
};

export default Logo;
