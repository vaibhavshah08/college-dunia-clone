import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import authApi from "../../services/modules/auth.api";
import { queryKeys } from "../../store/queryClient";
import { LoginRequest, SignupRequest } from "../../types/api";
import {
  saveToken,
  removeToken,
  isAuthenticated,
} from "../../utils/tokenManager";

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
  const toast = useToast();

  // Get current user profile
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
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
    staleTime: 30 * 1000, // 30 seconds - data becomes stale quickly for real-time updates
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchIntervalInBackground: true, // Continue refetching when tab is not active
    enabled: isAuthenticated(), // Use token manager to check authentication
    onError: (error: any) => {
      // Handle profile fetch errors
      if (error?.status === 401) {
        // Token expired or invalid - clear and redirect to login
        removeToken();
        queryClient.clear();
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
      } else if (error?.status === 403) {
        // User doesn't have permission
        console.error("Access denied. Please contact support.");
      } else {
        // Other errors
        console.error("Failed to load user profile. Please refresh the page.");
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log("Login successful, data:", data);
      console.log("User is_admin:", data.user.is_admin);

      // Save token using token manager
      saveToken(data.token);
      console.log("Token saved, checking authentication:", isAuthenticated());

      queryClient.setQueryData(queryKeys.auth.profile, {
        user_id: data.user.user_id,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: data.user.email,
        phone_number: data.user.phone_number,
        is_admin: data.user.is_admin,
        is_active: data.user.is_active,
        is_deleted: false,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
      });

      // Login success handled by API client

      // Redirect based on user type
      const from = location.state?.from?.pathname;
      console.log("Redirecting from:", from);

      if (data.user.is_admin) {
        console.log("Redirecting admin to /admin");
        // Admin users go to admin dashboard
        navigate(from || "/admin", { replace: true });
      } else {
        console.log("Redirecting user to /");
        // Regular users go to home page
        navigate(from || "/", { replace: true });
      }
    },
    onError: (error: any) => {
      // Error handling is done by the API client
      console.error("Login error:", error);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Don't save token or set user data since signup doesn't return a token
      // Success message handled by API client
      navigate("/login", { replace: true });
    },
    onError: (error: any) => {
      // Error handling is done by the API client
      console.error("Signup error:", error);
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
    toast.success("Logged out successfully!");
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
    refetchUser, // Manual refresh function

    // Mutations (for advanced usage)
    loginMutation,
    signupMutation,
  };
};
