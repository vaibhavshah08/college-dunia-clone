import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  People,
  School,
  AccountBalance,
  Description,
} from "@mui/icons-material";

const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography variant="h4">1,250</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <School sx={{ fontSize: 40, color: "secondary.main", mr: 2 }} />
                <Box>
                  <Typography variant="h4">150</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Colleges
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalance
                  sx={{ fontSize: 40, color: "success.main", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4">45</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Loans
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Description
                  sx={{ fontSize: 40, color: "warning.main", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4">320</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Documents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
