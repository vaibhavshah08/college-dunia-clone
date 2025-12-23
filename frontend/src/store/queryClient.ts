import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000), // Faster retry delays
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnMount: "always",
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
  courses: {
    all: ["courses"] as const,
    lists: () => [...queryKeys.courses.all, "list"] as const,
    list: (filters: any) => [...queryKeys.courses.lists(), filters] as const,
    details: () => [...queryKeys.courses.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    byIds: (ids: string[]) => [...queryKeys.courses.all, "byIds", ids] as const,
  },
  documents: {
    all: ["documents"] as const,
    lists: () => [...queryKeys.documents.all, "list"] as const,
    list: (filters: any) => [...queryKeys.documents.lists(), filters] as const,
    userList: (userId: string) =>
      [...queryKeys.documents.all, "user", userId] as const,
    adminList: () => [...queryKeys.documents.all, "admin", "list"] as const,
  },
  messages: {
    all: ["messages"] as const,
    lists: () => [...queryKeys.messages.all, "list"] as const,
    list: (filters: any) => [...queryKeys.messages.lists(), filters] as const,
    unreadCount: ["messages", "unreadCount"] as const,
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
