// API Response Types

// Base response envelope

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
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    name: string;
    sub: string;
    email: string;
    is_admin: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// College Types
export interface CollegeListQuery {
  q?: string;
  stream?: string;
  location?: string;
  rankingMin?: number;
  rankingMax?: number;
  feesMin?: number;
  feesMax?: number;
  cutoffMin?: number;
  cutoffMax?: number;
  exams?: string[];
  facilities?: string[];
  ownership?: string;
  accreditation?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  ownership: string;
  ranking: number;
  fees: number;
  cutoff: number;
  description: string;
  facilities: FacilityInfo;
  examsAccepted: string[];
  createdAt: string;
  updatedAt: string;
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

// Loan Types
export interface LoanCreate {
  fullName: string;
  phone: string;
  email: string;
  program: string;
  collegeId?: string;
  fees: number;
  amountRequested: number;
  notes?: string;
}

export interface Loan {
  id: string;
  userId: string;
  status: "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  fullName: string;
  phone: string;
  email: string;
  program: string;
  collegeId?: string;
  fees: number;
  amountRequested: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanStatusUpdate {
  status: "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";
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
