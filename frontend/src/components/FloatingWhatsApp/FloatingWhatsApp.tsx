import React from "react";
import { Fab, Tooltip, Box } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import { motion } from "framer-motion";

const FloatingWhatsApp: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/916909300369", "_blank");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Tooltip title="Chat with us on WhatsApp" placement="left">
          <Fab
            onClick={handleWhatsAppClick}
            sx={{
              background: "linear-gradient(45deg, #25D366, #128C7E)",
              color: "white",
              width: 64,
              height: 64,
              boxShadow: "0 8px 32px rgba(37, 211, 102, 0.4)",
              "&:hover": {
                background: "linear-gradient(45deg, #128C7E, #25D366)",
                boxShadow: "0 12px 40px rgba(37, 211, 102, 0.6)",
              },
            }}
          >
            <WhatsApp sx={{ fontSize: 32 }} />
          </Fab>
        </Tooltip>
      </motion.div>
    </Box>
  );
};

export default FloatingWhatsApp;
