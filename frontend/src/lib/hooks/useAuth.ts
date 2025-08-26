import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import authApi from "../../services/modules/auth.api";
import { queryKeys } from "../../store/queryClient";
import type { LoginRequest, SignupRequest, UserProfile } from "../../types/api";

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
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem("token"),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(queryKeys.auth.profile, {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Login successful!");

      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed");
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(queryKeys.auth.profile, {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Registration successful!");
      navigate("/dashboard", { replace: true });
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed");
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    },
    onError: () => {
      // Even if logout API fails, clear local state
      localStorage.removeItem("token");
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  // Login function
  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  // Signup function
  const signup = async (userData: SignupRequest) => {
    await signupMutation.mutateAsync(userData);
  };

  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !!localStorage.getItem("token");

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  return {
    // State
    user,
    isAuthenticated,
    isAdmin,
    isLoadingUser,
    userError,

    // Loading states
    isLoggingIn: loginMutation.isLoading,
    isSigningUp: signupMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,

    // Functions
    login,
    signup,
    logout,

    // Mutations (for advanced usage)
    loginMutation,
    signupMutation,
    logoutMutation,
  };
};
