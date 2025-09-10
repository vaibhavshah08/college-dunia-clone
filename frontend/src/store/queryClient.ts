import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
      onError: (error: any) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

// Query keys factory for better type safety
export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  colleges: {
    all: ["colleges"] as const,
    lists: () => [...queryKeys.colleges.all, "list"] as const,
    list: (filters: any) => [...queryKeys.colleges.lists(), filters] as const,
    details: () => [...queryKeys.colleges.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.colleges.details(), id] as const,
    filters: ["colleges", "filters"] as const,
    compare: (ids: string[]) => ["colleges", "compare", ids] as const,
  },
  loans: {
    all: ["loans"] as const,
    lists: () => [...queryKeys.loans.all, "list"] as const,
    list: () => [...queryKeys.loans.lists()] as const,
    adminList: () => [...queryKeys.loans.all, "admin", "list"] as const,
    details: () => [...queryKeys.loans.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.loans.details(), id] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    lists: () => [...queryKeys.reviews.all, "list"] as const,
    list: (courseId: string) =>
      [...queryKeys.reviews.lists(), courseId] as const,
    adminList: () => [...queryKeys.reviews.all, "admin", "list"] as const,
  },
  pages: {
    all: ["pages"] as const,
    detail: (slug: string) => [...queryKeys.pages.all, slug] as const,
    adminList: () => [...queryKeys.pages.all, "admin", "list"] as const,
  },
  admin: {
    stats: ["admin", "stats"] as const,
    users: {
      all: ["admin", "users"] as const,
      lists: () => [...queryKeys.admin.users.all, "list"] as const,
      list: (filters: any) =>
        [...queryKeys.admin.users.lists(), filters] as const,
      details: () => [...queryKeys.admin.users.all, "detail"] as const,
      detail: (id: string) => [...queryKeys.admin.users.details(), id] as const,
    },
  },
} as const;

export default queryClient;
