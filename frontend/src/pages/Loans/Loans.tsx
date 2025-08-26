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
import { Add } from "@mui/icons-material";

const Loans: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Loan Applications
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Apply for Loan
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
        {[1, 2].map((item) => (
          <Card key={item}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Loan Application #{item}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Amount: ₹{item * 50000}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    College: Sample College {item}
                  </Typography>
                </Box>
                <Chip
                  label={item === 1 ? "Pending" : "Approved"}
                  color={item === 1 ? "warning" : "success"}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Loans;
