import React from "react";
import { Box, Typography } from "@mui/material";

interface SafeHtmlProps {
  html: string;
  variant?: "body1" | "body2" | "caption";
  color?: string;
  sx?: any;
  maxLength?: number;
  showExpandButton?: boolean;
  onExpand?: () => void;
  isExpanded?: boolean;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({
  html,
  variant = "body2",
  color = "text.secondary",
  sx = {},
  maxLength,
  showExpandButton = false,
  onExpand,
  isExpanded = false,
}) => {
  // Function to strip HTML tags and get plain text
  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Function to safely render HTML
  const createMarkup = (html: string) => {
    // Basic sanitization - remove potentially dangerous tags
    const sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "") // Remove event handlers
      .replace(/javascript:/gi, ""); // Remove javascript: URLs

    return { __html: sanitized };
  };

  const plainText = stripHtml(html);
  const shouldTruncate = maxLength && plainText.length > maxLength;

  return (
    <Box>
      <Typography
        variant={variant}
        color={color}
        sx={sx}
        dangerouslySetInnerHTML={createMarkup(html)}
      />
      {showExpandButton && shouldTruncate && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={onExpand}
          >
            {isExpanded ? "Show less" : "Show more"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SafeHtml;
