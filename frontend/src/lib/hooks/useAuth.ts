import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import authApi from "../../services/modules/auth.api";
import { queryKeys } from "../../store/queryClient";
import { LoginRequest, SignupRequest } from "../../types/api";
import { saveToken, removeToken, isAuthenticated } from "../../utils/tokenManager";

// Custom error types
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: any;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current user profile
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authApi.getProfile,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) or 403 (forbidden)
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated(), // Use token manager to check authentication
    onError: (error: any) => {
      // Handle profile fetch errors
      if (error?.status === 401) {
        // Token expired or invalid - clear and redirect to login
        removeToken();
        queryClient.clear();
        navigate("/login", { 
          replace: true,
          state: { from: location.pathname }
        });
      } else if (error?.status === 403) {
        // User doesn't have permission
        toast.error("Access denied. Please contact support.");
      } else {
        // Other errors
        toast.error("Failed to load user profile. Please refresh the page.");
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Save token using token manager
      saveToken(data.token);
      
      queryClient.setQueryData(queryKeys.auth.profile, {
        id: data.user.sub,
        name: data.user.name,
        email: data.user.email,
        is_admin: data.user.is_admin,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Login successful!");

      // Redirect based on user type
      const from = location.state?.from?.pathname;
      if (data.user.is_admin) {
        // Admin users go to admin dashboard
        navigate(from || "/admin", { replace: true });
      } else {
        // Regular users go to user dashboard
        navigate(from || "/dashboard", { replace: true });
      }
    },
    onError: (error: any) => {
      // Enhanced error handling for login
      if (error?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error?.status === 422) {
        toast.error("Please check your input and try again.");
      } else if (error?.status === 429) {
        toast.error("Too many login attempts. Please wait a moment and try again.");
      } else if (error?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.code === "NETWORK_ERROR") {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error?.message || "Login failed. Please try again.");
      }
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Save token using token manager
      saveToken(data.token);
      
      queryClient.setQueryData(queryKeys.auth.profile, {
        id: data.user.sub,
        name: data.user.name,
        email: data.user.email,
        is_admin: data.user.is_admin,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Registration successful! Welcome to College Dunia!");
      navigate("/dashboard", { replace: true });
    },
    onError: (error: any) => {
      // Enhanced error handling for signup
      if (error?.status === 409) {
        toast.error("An account with this email already exists.");
      } else if (error?.status === 422) {
        // Handle validation errors
        if (error?.details?.validationErrors) {
          Object.values(error.details.validationErrors).forEach((message: any) => {
            toast.error(message);
          });
        } else {
          toast.error("Please check your input and try again.");
        }
      } else if (error?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.code === "NETWORK_ERROR") {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error?.message || "Registration failed. Please try again.");
      }
    },
  });

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(credentials);
    } catch (error) {
      // Error is already handled in onError
      throw error;
    }
  };

  // Signup function
  const signup = async (userData: SignupRequest) => {
    try {
      await signupMutation.mutateAsync(userData);
    } catch (error) {
      // Error is already handled in onError
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    // Simply clear token and redirect - no API call needed
    removeToken();
    queryClient.clear();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  // Check if user is authenticated using token manager
  const isUserAuthenticated = isAuthenticated() && !!user;

  // Check if user is admin
  const isAdmin = user?.is_admin;

  return {
    // State
    user,
    isAuthenticated: isUserAuthenticated,
    isAdmin,
    isLoadingUser,
    userError,

    // Loading states
    isLoggingIn: loginMutation.isLoading,
    isSigningUp: signupMutation.isLoading,
    isLoggingOut: false, // No longer needed since logout is instant

    // Functions
    login,
    signup,
    logout,

    // Mutations (for advanced usage)
    loginMutation,
    signupMutation,
  };
};
