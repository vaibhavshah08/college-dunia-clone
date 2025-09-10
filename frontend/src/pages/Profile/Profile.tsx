import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { useAuth } from "../../lib/hooks/useAuth";
import { useMutation, useQueryClient } from "react-query";
import userApi from "../../services/modules/user.api";
import { getErrorMessage } from "../../utils/errorHandler";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    password: "",
  } as {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password?: string;
  });

  const fullName = user ? `${user.first_name} ${user.last_name}` : "User";
  const firstName = user?.first_name || "U";

  const updateProfileMutation = useMutation(
    (data: typeof editForm) => userApi.updateProfile(user?.user_id || "", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user", "profile"]);
        toast.success("Profile updated successfully!");
        setEditDialogOpen(false);
        setEditForm({
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          email: user?.email || "",
          phone_number: user?.phone_number || "",
          password: "",
        });
      },
      onError: (error: any) => {
        toast.error(getErrorMessage(error));
      },
    }
  );

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToUpdate = {
      first_name: editForm.first_name,
      last_name: editForm.last_name,
      email: editForm.email,
      phone_number: editForm.phone_number,
      ...(editForm.password && { password: editForm.password }),
    };
    updateProfileMutation.mutate(dataToUpdate);
  };

  const handleEditClick = () => {
    setEditForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      password: "",
    });
    setEditDialogOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 2fr",
          },
          gap: 3,
        }}
      >
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}>
              {firstName.charAt(0) || <Person sx={{ fontSize: 60 }} />}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email || "user@example.com"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                mt: 1,
              }}
            >
              {user?.is_admin && (
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: "secondary.main",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Admin
                </Typography>
              )}
              <Button variant="outlined" onClick={handleEditClick}>
                Edit Profile
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1">
                  {user?.first_name || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1">
                  {user?.last_name || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user?.email || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {user?.phone_number || "Not provided"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1">
                  {user?.user_id || "Not available"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">
                  {user?.is_admin ? "Administrator" : "Student"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1">
                  {user?.is_active ? "Active" : "Inactive"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Not available"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mt: 1,
              }}
            >
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={editForm.first_name}
                onChange={handleEditFormChange}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={editForm.last_name}
                onChange={handleEditFormChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditFormChange}
                required
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={editForm.phone_number}
                onChange={handleEditFormChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                label="New Password (optional)"
                name="password"
                type="password"
                value={editForm.password}
                onChange={handleEditFormChange}
                sx={{ gridColumn: "span 2" }}
                helperText="Leave blank to keep current password"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateProfileMutation.isLoading}
            >
              {updateProfileMutation.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Profile;
