import React from "react";
import { Box, Typography } from "@mui/material";
import { School, Image as ImageIcon } from "@mui/icons-material";

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  text?: string;
  icon?: React.ReactNode;
  variant?: "college" | "generic";
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = "100%",
  height = 200,
  text,
  icon,
  variant = "generic",
}) => {
  const defaultIcon = variant === "college" ? <School /> : <ImageIcon />;
  const defaultText = variant === "college" ? "College Image" : "Image";

  return (
    <Box
      sx={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        borderRadius: 2,
        border: "2px dashed #d1d5db",
        color: "text.secondary",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          animation: "shimmer 2s infinite",
        },
        "@keyframes shimmer": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      }}
    >
      <Box
        sx={{
          fontSize: 48,
          color: "primary.main",
          mb: 1,
          opacity: 0.7,
        }}
      >
        {icon || defaultIcon}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {text || defaultText}
      </Typography>
    </Box>
  );
};

export default ImagePlaceholder;
