// API Endpoints - Centralized route constants

// Base API path
export const API_BASE = "/api";

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  SIGNUP: `${API_BASE}/users/signup`,
  LOGIN: `${API_BASE}/users/login`,
  LOGOUT: `${API_BASE}/auth/logout`,
  REFRESH: `${API_BASE}/auth/refresh`,
  ME: `${API_BASE}/users/me`,
} as const;

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE}/users/profile`,
  UPDATE_PROFILE: `${API_BASE}/users/profile`,
  CHANGE_PASSWORD: `${API_BASE}/users/change-password`,
} as const;

// College endpoints
export const COLLEGE_ENDPOINTS = {
  LIST: `${API_BASE}/colleges`,
  DETAIL: (id: string) => `${API_BASE}/colleges/${id}`,
  CREATE: `${API_BASE}/colleges`,
  UPDATE: (id: string) => `${API_BASE}/colleges/${id}`,
  DELETE: (id: string) => `${API_BASE}/colleges/${id}`,
  COMPARE: `${API_BASE}/colleges/compare/list`,
  FILTERS: `${API_BASE}/colleges/filters`,
} as const;

// Loan endpoints
export const LOAN_ENDPOINTS = {
  CREATE: `${API_BASE}/loans`,
  LIST_MINE: `${API_BASE}/loans/me`,
  ADMIN_LIST: `${API_BASE}/loans/admin`,
  UPDATE_STATUS: (id: string) => `${API_BASE}/loans/${id}/status`,
  DETAIL: (id: string) => `${API_BASE}/loans/${id}`,
} as const;

// Review endpoints
export const REVIEW_ENDPOINTS = {
  CREATE: `${API_BASE}/reviews`,
  LIST_BY_COURSE: (courseId: string) =>
    `${API_BASE}/reviews/course/${courseId}`,
  ADMIN_LIST: `${API_BASE}/reviews/admin`,
  UPDATE_STATUS: (id: string) => `${API_BASE}/reviews/${id}/status`,
} as const;

// Static page endpoints
export const PAGE_ENDPOINTS = {
  GET: (slug: string) => `${API_BASE}/pages/${slug}`,
  CREATE: `${API_BASE}/pages`,
  UPDATE: (slug: string) => `${API_BASE}/pages/${slug}`,
  DELETE: (slug: string) => `${API_BASE}/pages/${slug}`,
  LIST: `${API_BASE}/pages`,
} as const;

// Admin endpoints
export const ADMIN_ENDPOINTS = {
  DASHBOARD: `${API_BASE}/admin/dashboard`,
  USERS: `${API_BASE}/admin/users`,
  USER_DETAIL: (id: string) => `${API_BASE}/admin/users/${id}`,
  USER_UPDATE: (id: string) => `${API_BASE}/admin/users/${id}`,
  USER_DELETE: (id: string) => `${API_BASE}/admin/users/${id}`,
  STATS: `${API_BASE}/admin/stats`,
} as const;

// App endpoints
export const APP_ENDPOINTS = {
  HEALTH: `${API_BASE}/health`,
  CONFIG: `${API_BASE}/config`,
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
