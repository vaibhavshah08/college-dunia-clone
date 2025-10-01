// API Response Types

// Base response envelope
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Error response
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  status: number;
}

// Pagination types
export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: {
      user_id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone_number?: string;
      is_admin: boolean;
      is_active: boolean;
      google_id?: string;
      avatar_url?: string;
      email_verified?: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface SignupResponse {
  message: string;
  data: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
  };
}

export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  is_admin: boolean;
  is_active: boolean;
  is_deleted: boolean;
  google_id?: string;
  avatar_url?: string;
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  is_admin: boolean;
  is_active: boolean;
  is_deleted: boolean;
  google_id?: string;
  avatar_url?: string;
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
}

// Document Types
export type DocumentStatus = "pending" | "approved" | "rejected";
export type DocumentType = string;

export interface Document {
  document_id: string;
  user_id: string;
  loan_id?: string;
  document_path: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  document_type?: string;
  name: string;
  purpose: string;
  type: DocumentType;
  status: DocumentStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

// College Types
export interface CollegeListQuery {
  q?: string;
  state?: string;
  city?: string;
  minFees?: number;
  maxFees?: number;
  ranking?: number;
}

export interface College {
  college_id: string;
  college_name: string;
  state: string;
  city: string;
  pincode: string;
  landmark?: string;
  fees: number;
  ranking: number;
  placement_ratio: number;
  year_of_establishment: number;
  affiliation: string;
  accreditation: string;
  is_partnered: boolean;
  avg_package?: number;
  median_package?: number;
  highest_package?: number;
  placement_rate?: number;
  top_recruiters?: string[];
  placement_last_updated?: string;
  course_ids_json?: string[];
  created_at: string;
}

export interface CollegeDetail extends College {
  overview: CollegeOverview;
  courses: Course[];
  admissions: AdmissionInfo;
  cutoffs: CutoffInfo;
  placements: PlacementInfo;
  facilities: FacilityInfo;
  faqs: FAQ[];
}

export interface CollegeOverview {
  established: number;
  type: string;
  accreditation: string[];
  campusSize: string;
  studentCount: number;
  facultyCount: number;
  website: string;
  phone: string;
  email: string;
  address: string;
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  seats: number;
  eligibility: string;
  description: string;
}

export interface AdmissionInfo {
  process: string;
  requirements: string[];
  documents: string[];
  importantDates: ImportantDate[];
}

export interface ImportantDate {
  event: string;
  date: string;
  description?: string;
}

export interface CutoffInfo {
  year: number;
  rounds: CutoffRound[];
}

export interface CutoffRound {
  round: number;
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews: number;
}

export interface PlacementInfo {
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
  recruiters: string[];
  year: number;
}

export interface FacilityInfo {
  academic: string[];
  sports: string[];
  medical: string[];
  transport: string[];
  accommodation: string[];
  other: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

// College Placement Types
export interface CollegePlacement {
  placement_id: string;
  college_id: string;
  year: number;
  total_students: number;
  placed_students: number;
  highest_package: number;
  average_package: number;
}

// Loan Types
export interface LoanCreate {
  loan_type: string;
  principal_amount: number;
  interest_rate: number;
  term_months: number;
  college_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  gender: string;
  whatsapp_number?: string;
  description?: string;
}

export interface Loan {
  loan_id: string;
  user_id: string;
  loan_type: string;
  principal_amount: number;
  interest_rate: number;
  term_months: number;
  status: "submitted" | "under_review" | "approved" | "rejected";
  college_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  gender: string;
  whatsapp_number?: string;
  description?: string;
  created_at: string;
  // Optional fields for admin view
  user?: User;
  college?: College;
  approved_by?: string;
  rejected_by?: string;
  approved_by_user?: User;
  rejected_by_user?: User;
}

export interface LoanStatusUpdate {
  status: "submitted" | "under_review" | "approved" | "rejected";
  notes?: string;
}

// Review Types
export interface ReviewCreate {
  courseId: string;
  text: string;
  rating: number;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  text: string;
  rating: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface ReviewStatusUpdate {
  status: "PENDING" | "APPROVED" | "REJECTED";
}

// Static Page Types
export interface PageContent {
  slug: string;
  title: string;
  body: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageCreate {
  slug: string;
  title: string;
  body: string;
  metaDescription?: string;
}

export interface PageUpdate {
  title?: string;
  body?: string;
  metaDescription?: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalColleges: number;
  totalLoans: number;
  totalReviews: number;
  recentLoans: Loan[];
  recentUsers: UserProfile[];
}

export interface UserListQuery {
  page?: number;
  size?: number;
  search?: string;
  role?: "student" | "admin";
  isActive?: boolean;
}

// Filter Types
export interface CollegeFilters {
  locations: string[];
  streams: string[];
  ownerships: string[];
  accreditations: string[];
  exams: string[];
  facilities: string[];
  feeRanges: {
    min: number;
    max: number;
    label: string;
  }[];
  rankingRanges: {
    min: number;
    max: number;
    label: string;
  }[];
}

// Compare Types
export interface CompareRequest {
  ids: string[];
}

export interface CompareResponse {
  colleges: CollegeDetail[];
  comparison: ComparisonData;
}

export interface ComparisonData {
  fees: {
    [collegeId: string]: number;
  };
  ranking: {
    [collegeId: string]: number;
  };
  cutoff: {
    [collegeId: string]: number;
  };
  facilities: {
    [collegeId: string]: string[];
  };
  exams: {
    [collegeId: string]: string[];
  };
}
