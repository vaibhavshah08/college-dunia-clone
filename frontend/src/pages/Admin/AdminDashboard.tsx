import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from "@mui/material";
import {
  People,
  School,
  AccountBalance,
  Description,
  Add,
  Upload,
  Edit,
  Delete,
  Download,
} from "@mui/icons-material";
import { downloadExcelTemplate, parseExcelFile } from "../../utils/excelUtils";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [collegeForm, setCollegeForm] = useState({
    name: "",
    location: "",
    courseType: "",
    fees: "",
    ranking: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Sample colleges data
  const [colleges] = useState([
    {
      id: 1,
      name: "IIT Bombay",
      location: "Mumbai, Maharashtra",
      courseType: "Engineering",
      fees: "₹2,00,000",
      ranking: "#1",
      status: "Active",
    },
    {
      id: 2,
      name: "AIIMS Delhi",
      location: "Delhi",
      courseType: "Medical",
      fees: "₹1,50,000",
      ranking: "#2",
      status: "Active",
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCollegeFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | (Event & { target: { value: string; name: string } })) => {
    const target = e.target as { name: string; value: string };
    const { name, value } = target;
    setCollegeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'College added successfully!' });
      setCollegeForm({
        name: "",
        location: "",
        courseType: "",
        fees: "",
        ranking: "",
        description: "",
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add college. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Parse the uploaded file
      const data = await parseExcelFile(file);
      console.log('Parsed data:', data);
      
      // Simulate API call to save colleges
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ 
        type: 'success', 
        text: `Excel file uploaded successfully! ${data.length} colleges imported.` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to upload file. Please check the format and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <People sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  1,250
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <School sx={{ fontSize: 40, color: "secondary.main", mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  150
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Colleges
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <AccountBalance
                sx={{ fontSize: 40, color: "success.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  45
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Loans
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <Description
                sx={{ fontSize: 40, color: "warning.main", mr: 2 }}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  320
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Documents
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Admin Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Manage Colleges" />
          <Tab label="Manage Users" />
          <Tab label="Loan Applications" />
          <Tab label="Documents" />
          <Tab label="Reports" />
          <Tab label="Settings" />
        </Tabs>

        {/* Manage Colleges Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Manage Colleges
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add colleges manually or upload via Excel sheet
            </Typography>
          </Box>

          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          {/* Manual College Addition */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add College Manually
              </Typography>
              <Box component="form" onSubmit={handleAddCollege}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                    },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    label="College Name"
                    name="name"
                    value={collegeForm.name}
                    onChange={handleCollegeFormChange}
                    disabled={isSubmitting}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Location"
                    name="location"
                    value={collegeForm.location}
                    onChange={handleCollegeFormChange}
                    disabled={isSubmitting}
                  />
                  <FormControl fullWidth required>
                    <InputLabel>Course Type</InputLabel>
                    <Select
                      name="courseType"
                      value={collegeForm.courseType}
                      onChange={handleCollegeFormChange}
                      disabled={isSubmitting}
                    >
                      <MenuItem value="Engineering">Engineering</MenuItem>
                      <MenuItem value="Medical">Medical</MenuItem>
                      <MenuItem value="Arts">Arts</MenuItem>
                      <MenuItem value="Commerce">Commerce</MenuItem>
                      <MenuItem value="Science">Science</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    required
                    fullWidth
                    label="Fees (₹)"
                    name="fees"
                    value={collegeForm.fees}
                    onChange={handleCollegeFormChange}
                    disabled={isSubmitting}
                  />
                  <TextField
                    fullWidth
                    label="Ranking"
                    name="ranking"
                    value={collegeForm.ranking}
                    onChange={handleCollegeFormChange}
                    disabled={isSubmitting}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={3}
                    value={collegeForm.description}
                    onChange={handleCollegeFormChange}
                    disabled={isSubmitting}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Add />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={20} /> : "Add College"}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Excel Upload */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Colleges via Excel
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload an Excel file with college data. Download the template below.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  disabled={isSubmitting}
                  onClick={handleDownloadTemplate}
                >
                  Download Template
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<Upload />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={20} /> : "Upload Excel"}
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                  />
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Colleges Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Existing Colleges
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Course Type</TableCell>
                      <TableCell>Fees</TableCell>
                      <TableCell>Ranking</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {colleges.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell>{college.name}</TableCell>
                        <TableCell>{college.location}</TableCell>
                        <TableCell>{college.courseType}</TableCell>
                        <TableCell>{college.fees}</TableCell>
                        <TableCell>{college.ranking}</TableCell>
                        <TableCell>
                          <Chip
                            label={college.status}
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Manage Users Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Manage Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User management functionality coming soon...
          </Typography>
        </TabPanel>

        {/* Loan Applications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Loan Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Loan application management functionality coming soon...
          </Typography>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Document management functionality coming soon...
          </Typography>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h5" gutterBottom>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analytics and reporting functionality coming soon...
          </Typography>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h5" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            System settings and configuration coming soon...
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
