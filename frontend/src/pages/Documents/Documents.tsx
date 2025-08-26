import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import { Add, Description } from "@mui/icons-material";

const Documents: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Documents
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Upload Document
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Description sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Document {item}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Type:{" "}
                {item === 1
                  ? "Admission Letter"
                  : item === 2
                  ? "Identity Proof"
                  : "Income Certificate"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Uploaded: {new Date().toLocaleDateString()}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Chip
                  label={item === 1 ? "Verified" : "Pending"}
                  color={item === 1 ? "success" : "warning"}
                  size="small"
                />
                <Button size="small" variant="outlined">
                  View
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Documents;
