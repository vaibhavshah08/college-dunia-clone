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
  Home,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import Footer from "./Footer";

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

  // Create full name from first_name and last_name
  const fullName = user ? `${user.first_name} ${user.last_name}` : "";
  const firstName = user?.first_name || "";

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

  // Define navigation items based on user role
  const getMenuItems = () => {
    if (!isAuthenticated) {
      return [{ text: "Home", path: "/", icon: <Home /> }];
    }

    if (user?.is_admin) {
      return [
        {
          text: "Admin Dashboard",
          path: "/admin",
          icon: <AdminPanelSettings />,
        },
      ];
    }

    // Regular student users
    return [
      { text: "Home", path: "/", icon: <Home /> },
      { text: "Colleges", path: "/colleges", icon: <School /> },
      { text: "Loans", path: "/loans", icon: <AccountBalance /> },
      { text: "Documents", path: "/documents", icon: <Description /> },
    ];
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          CampusConnect
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
                backgroundColor:
                  location.pathname === item.path
                    ? "primary.dark"
                    : "action.hover",
              },
              transition: "all 0.2s",
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? "white" : "inherit",
                minWidth: 40,
              }}
            >
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
        <Toolbar sx={{ px: { xs: 1, sm: 2 }, color: "text.primary" }}>
          {isMobile && (
            <IconButton
              color="primary"
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
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
            onClick={() => navigate("/")}
          >
            CampusConnect
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="primary"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor:
                      location.pathname === item.path
                        ? "rgba(25, 118, 210, 0.1)"
                        : "transparent",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
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
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="primary"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                  {firstName.charAt(0)}
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
                  borderRadius: 1,
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

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "background.default",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Container component="main" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
