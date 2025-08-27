import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School,
  Dashboard,
  Person,
  Description,
  AccountBalance,
  AdminPanelSettings,
  Logout,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    ...(isAuthenticated
      ? user?.is_admin
        ? [
            // Admin users only see Dashboard
            { text: "Dashboard", path: "/admin", icon: <AdminPanelSettings /> },
          ]
        : [
            // Regular users see all tabs including Home and Colleges
            { text: "Home", path: "/", icon: <School /> },
            { text: "Colleges", path: "/colleges", icon: <School /> },
            { text: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
            { text: "Profile", path: "/profile", icon: <Person /> },
            { text: "Loans", path: "/loans", icon: <AccountBalance /> },
            { text: "Documents", path: "/documents", icon: <Description /> },
          ]
      : [
          // Non-authenticated users see Home and Colleges
          { text: "Home", path: "/", icon: <School /> },
          { text: "Colleges", path: "/colleges", icon: <School /> },
        ]),
  ];

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          College Dunia
        </Typography>
      </Box>
      <List sx={{ pt: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              backgroundColor:
                location.pathname === item.path
                  ? "primary.main"
                  : "transparent",
              color: location.pathname === item.path ? "white" : "inherit",
              "&:hover": {
                backgroundColor: location.pathname === item.path
                  ? "primary.dark"
                  : "action.hover",
              },
              transition: "all 0.2s",
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? "white" : "inherit",
              minWidth: 40 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.25rem" }
            }}
            onClick={() => navigate("/")}
          >
            College Dunia
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor:
                      location.pathname === item.path
                        ? "rgba(255, 255, 255, 0.1)"
                        : "transparent",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  display: { xs: "none", sm: "block" },
                  fontWeight: 500 
                }}
              >
                {user?.name}
                {user?.is_admin && (
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.25,
                      backgroundColor: "secondary.main",
                      color: "white",
                      borderRadius: 1,
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Admin
                  </Box>
                )}
              </Typography>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
              <Button 
                color="inherit" 
                onClick={() => navigate("/login")}
                sx={{ 
                  display: { xs: "none", sm: "block" },
                  borderRadius: 1 
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/register")}
                sx={{ borderRadius: 1 }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
