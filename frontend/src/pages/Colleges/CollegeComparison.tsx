import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const CollegeComparison: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Compare Colleges
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Criteria</TableCell>
              <TableCell>College A</TableCell>
              <TableCell>College B</TableCell>
              <TableCell>College C</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Mumbai</TableCell>
              <TableCell>Delhi</TableCell>
              <TableCell>Bangalore</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ranking</TableCell>
              <TableCell>#150</TableCell>
              <TableCell>#200</TableCell>
              <TableCell>#180</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Average Fees</TableCell>
              <TableCell>₹75,000</TableCell>
              <TableCell>₹85,000</TableCell>
              <TableCell>₹70,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Placement Rate</TableCell>
              <TableCell>85%</TableCell>
              <TableCell>80%</TableCell>
              <TableCell>90%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CollegeComparison;
