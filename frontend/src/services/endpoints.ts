// API Endpoints - Centralized route constants

// Base API path
// export const API_BASE = "/api";

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  SIGNUP: `/users/signup`,
  LOGIN: `/users/login`,
  LOGOUT: `/auth/logout`,
  REFRESH: `/auth/refresh`,
  ME: `/users/me`,
} as const;

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: `/users/profile`,
  UPDATE_PROFILE: `/users/profile`,
  CHANGE_PASSWORD: `/users/change-password`,
} as const;

// College endpoints
export const COLLEGE_ENDPOINTS = {
  LIST: `/colleges`,
  DETAIL: (id: string) => `/colleges/${id}`,
  CREATE: `/colleges`,
  UPDATE: (id: string) => `/colleges/${id}`,
  DELETE: (id: string) => `/colleges/${id}`,
  COMPARE: `/colleges/compare/list`,
  FILTERS: `/colleges/filters`,
} as const;

// Loan endpoints
export const LOAN_ENDPOINTS = {
  CREATE: `/loans`,
  LIST_MINE: `/loans/me`,
  ADMIN_LIST: `/loans/admin`,
  UPDATE_STATUS: (id: string) => `/loans/${id}/status`,
  DETAIL: (id: string) => `/loans/${id}`,
} as const;

// Review endpoints
export const REVIEW_ENDPOINTS = {
  CREATE: `/reviews`,
  LIST_BY_COURSE: (courseId: string) =>
    `/reviews/course/${courseId}`,
  ADMIN_LIST: `/reviews/admin`,
  UPDATE_STATUS: (id: string) => `/reviews/${id}/status`,
} as const;

// Static page endpoints
export const PAGE_ENDPOINTS = {
  GET: (slug: string) => `/pages/${slug}`,
  CREATE: `/pages`,
  UPDATE: (slug: string) => `/pages/${slug}`,
  DELETE: (slug: string) => `/pages/${slug}`,
  LIST: `/pages`,
} as const;

// Admin endpoints
export const ADMIN_ENDPOINTS = {
  DASHBOARD: `/admin/dashboard`,
  USERS: `/admin/users`,
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  USER_UPDATE: (id: string) => `/admin/users/${id}`,
  USER_DELETE: (id: string) => `/admin/users/${id}`,
  STATS: `/admin/stats`,
} as const;

// App endpoints
export const APP_ENDPOINTS = {
  HEALTH: `/health`,
  CONFIG: `/config`,
} as const;

// All endpoints combined
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  COLLEGE: COLLEGE_ENDPOINTS,
  LOAN: LOAN_ENDPOINTS,
  REVIEW: REVIEW_ENDPOINTS,
  PAGE: PAGE_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  APP: APP_ENDPOINTS,
} as const;

export default ENDPOINTS;
