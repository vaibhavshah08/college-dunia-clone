import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setGlobalToast } from "./services/apiClient";

// Layout
import Layout from "./components/Layout/Layout";

// Contexts
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { ToastProvider } from "./contexts/ToastContext";
import { MotionProvider } from "./contexts/MotionContext";

// Components
import ToastInitializer from "./components/ToastInitializer";

// Auth Components
import AdminRoute from "./components/Auth/AdminRoute";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import HomeRoute from "./components/Auth/HomeRoute";
import UserRoute from "./components/Auth/UserRoute";
import PublicRoute from "./components/Auth/PublicRoute";

// Pages
import Home from "./pages/Home/Home";
import Colleges from "./pages/Colleges/Colleges";
import CollegeDetail from "./pages/Colleges/CollegeDetail";
import CollegeComparison from "./pages/Colleges/CollegeComparison";
import Courses from "./pages/Courses/Courses";
import CourseDetail from "./pages/Courses/CourseDetail";
import Loans from "./pages/Loans/Loans";
import LoanDetail from "./pages/Loans/LoanDetail";
import Documents from "./pages/Documents/Documents";
import Profile from "./pages/Profile/Profile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import GoogleSuccess from "./pages/Auth/GoogleSuccess";
import GoogleError from "./pages/Auth/GoogleError";
import NotFound from "./pages/Error/NotFound";
import PrivacyPolicy from "./pages/Static/PrivacyPolicy";
import TermsOfService from "./pages/Static/TermsOfService";
import FAQ from "./pages/Static/FAQ";
import ContactUs from "./pages/Static/ContactUs";
import AboutUs from "./pages/Static/AboutUs";

// Create a modern, high-contrast theme
const theme = createTheme({
  palette: {
    mode: "light", // Switch to light mode for better readability
    primary: {
      main: "#1976D2", // Deep blue
      light: "#42A5F5",
      dark: "#1565C0",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FF6F00", // Orange for accents
      light: "#FF8F00",
      dark: "#E65100",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FAFAFA", // Very light grey background
      paper: "#FFFFFF", // Pure white for cards
    },
    text: {
      primary: "#212121", // Dark grey for excellent contrast
      secondary: "#757575", // Medium grey for secondary text
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.125rem",
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "12px 24px",
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.2s ease",
          // Mobile responsive sizing
          "@media (max-width: 600px)": {
            padding: "8px 16px",
            fontSize: "0.875rem",
            minHeight: 36,
          },
        },
        contained: {
          backgroundColor: "#1976D2",
          color: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
          "&:hover": {
            backgroundColor: "#1565C0",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor: "#1976D2",
          color: "#1976D2",
          "&:hover": {
            borderColor: "#1565C0",
            backgroundColor: "rgba(25, 118, 210, 0.08)",
            transform: "translateY(-1px)",
          },
        },
        text: {
          color: "#1976D2",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Mobile responsive sizing for IconButton
          "@media (max-width: 600px)": {
            padding: "8px",
            minHeight: 36,
            minWidth: 36,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // Pure white for maximum contrast
          boxShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
          borderRadius: 12,
          border: "1px solid #E0E0E0", // Light border
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
            transform: "translateY(-2px)",
            borderColor: "#1976D2",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
          borderBottom: "1px solid #E0E0E0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF", // Pure white
          border: "1px solid #E0E0E0", // Light border
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#FFFFFF",
            transition: "all 0.2s ease",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976D2",
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976D2",
                borderWidth: 2,
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#BDBDBD",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#757575",
            "&.Mui-focused": {
              color: "#1976D2",
            },
          },
          "& .MuiInputBase-input": {
            color: "#212121",
            "&::placeholder": {
              color: "#9E9E9E",
              opacity: 1,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          backgroundColor: "#1976D2",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#1565C0",
          },
        },
        colorPrimary: {
          backgroundColor: "#1976D2",
          color: "#FFFFFF",
        },
        colorSecondary: {
          backgroundColor: "#FF6F00",
          color: "#FFFFFF",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
          color: "#212121",
          border: "1px solid #E0E0E0",
        },
        standardSuccess: {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "#10B981",
        },
        standardError: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "#EF4444",
        },
        standardWarning: {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderColor: "#F59E0B",
        },
        standardInfo: {
          backgroundColor: "rgba(25, 118, 210, 0.1)",
          borderColor: "#1976D2",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "#212121",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#BDBDBD",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976D2",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976D2",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#212121",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(25, 118, 210, 0.12)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.16)",
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#757575",
          "&.Mui-focused": {
            color: "#1976D2",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#212121",
        },
        h1: {
          color: "#212121",
          fontWeight: 700,
        },
        h2: {
          color: "#212121",
          fontWeight: 600,
        },
        h3: {
          color: "#212121",
          fontWeight: 600,
        },
        h4: {
          color: "#212121",
          fontWeight: 600,
        },
        h5: {
          color: "#212121",
          fontWeight: 500,
        },
        h6: {
          color: "#212121",
          fontWeight: 500,
        },
        body1: {
          color: "#212121",
        },
        body2: {
          color: "#757575",
          fontWeight: 400,
        },
      },
    },
  },
});

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <ToastInitializer />
          <MotionProvider>
            <ComparisonProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <HomeRoute>
                          <Home />
                        </HomeRoute>
                      }
                    />
                    <Route
                      path="/colleges"
                      element={
                        <UserRoute>
                          <Colleges />
                        </UserRoute>
                      }
                    />
                    <Route
                      path="/colleges/:id"
                      element={
                        <UserRoute>
                          <CollegeDetail />
                        </UserRoute>
                      }
                    />
                    <Route
                      path="/colleges/compare"
                      element={
                        <UserRoute>
                          <CollegeComparison />
                        </UserRoute>
                      }
                    />
                    <Route
                      path="/courses"
                      element={
                        <UserRoute>
                          <Courses />
                        </UserRoute>
                      }
                    />
                    <Route
                      path="/courses/:id"
                      element={
                        <UserRoute>
                          <CourseDetail />
                        </UserRoute>
                      }
                    />
                    <Route
                      path="/loans"
                      element={
                        <UserRoute>
                          <Loans />
                        </UserRoute>
                      }
                    />
                    <Route
                      path="/loans/:id"
                      element={
                        <UserRoute>
                          <LoanDetail />
                        </UserRoute>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <UserRoute>
                          <Documents />
                        </UserRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/auth/google/success"
                      element={<GoogleSuccess />}
                    />
                    <Route
                      path="/auth/google/error"
                      element={<GoogleError />}
                    />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route
                      path="/terms-of-service"
                      element={<TermsOfService />}
                    />
                    <Route path="/help-support" element={<FAQ />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </Router>
            </ComparisonProvider>
          </MotionProvider>
        </ToastProvider>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
