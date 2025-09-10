# REFACTOR_PLAN.md - CollegeDunia Clone Architecture & Implementation

## New Architecture Overview

### Frontend Structure (Proposed)

```
frontend/src/
├── app/                    # App-level components
│   ├── App.tsx
│   ├── AppProvider.tsx     # All providers
│   └── ErrorBoundary.tsx
├── components/             # Shared UI components
│   ├── ui/                 # Base UI components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   └── feedback/           # Toast, alerts, etc.
├── features/               # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── auth.api.ts
│   ├── colleges/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── colleges.api.ts
│   ├── compare/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── compare.api.ts
│   ├── loans/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── loans.api.ts
│   ├── profile/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── profile.api.ts
│   └── admin/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── admin.api.ts
├── services/               # Centralized API layer
│   ├── apiClient.ts        # Axios wrapper with interceptors
│   ├── endpoints.ts        # Route constants
│   └── modules/            # Feature API modules
│       ├── auth.api.ts
│       ├── colleges.api.ts
│       ├── compare.api.ts
│       ├── loans.api.ts
│       ├── profile.api.ts
│       └── admin.api.ts
├── lib/                    # Utilities and helpers
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useQueryParams.ts
│   │   └── useLocalStorage.ts
│   ├── utils/              # Utility functions
│   │   ├── errorUtils.ts
│   │   ├── validationUtils.ts
│   │   └── formatUtils.ts
│   └── constants/          # App constants
├── types/                  # Global type definitions
│   ├── api.ts
│   ├── common.ts
│   └── index.ts
├── store/                  # State management
│   ├── queryClient.ts      # React Query config
│   └── providers.ts        # Context providers
└── config/                 # Configuration
    ├── env.ts
    └── constants.ts
```

### Backend Structure (Current + Improvements)

```
backend/src/
├── auth/                   # ✅ Already implemented
├── colleges/               # ✅ Already implemented
├── loans/                  # ✅ Already implemented
├── reviews/                # ✅ Already implemented
├── user/                   # ✅ Already implemented
├── static-pages/           # ❌ Need to recreate
├── admin/                  # ❌ Need to create
├── common/                 # ❌ Need to create
│   ├── dto/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── filters/
└── core/                   # ✅ Already implemented
```

## Implementation Phases

### Phase 1: Foundation (Week 1)

#### 1.1 Centralized API Layer

- [ ] Create `services/apiClient.ts` with proper interceptors
- [ ] Create `services/endpoints.ts` with route constants
- [ ] Create `services/modules/*.api.ts` for each feature
- [ ] Add proper error normalization and request cancellation

#### 1.2 Type Definitions

- [ ] Create comprehensive TypeScript interfaces
- [ ] Define API response types
- [ ] Create form validation schemas

#### 1.3 React Query Setup

- [ ] Configure React Query with proper defaults
- [ ] Create custom hooks for each feature
- [ ] Implement proper caching strategies

#### 1.4 Error Handling

- [ ] Create ErrorBoundary component
- [ ] Implement toast notification system
- [ ] Add proper error states for all components

### Phase 2: Core Features (Week 2)

#### 2.1 Authentication

- [ ] Fix auth flow with proper redirects
- [ ] Implement refresh token logic
- [ ] Add proper session management
- [ ] Create protected route components

#### 2.2 College Listing

- [ ] Implement real API integration
- [ ] Add URL state sync for filters
- [ ] Implement pagination and sorting
- [ ] Add search functionality

#### 2.3 College Detail

- [ ] Create tabbed interface
- [ ] Implement all required tabs
- [ ] Add related colleges sidebar
- [ ] Implement loan application widget

#### 2.4 Compare Feature

- [ ] Implement compare state management
- [ ] Create sticky compare tray
- [ ] Build comparison table
- [ ] Add deep linking support

### Phase 3: Advanced Features (Week 3)

#### 3.1 Loan Application

- [ ] Create multi-step form
- [ ] Implement form validation
- [ ] Add progress tracking
- [ ] Create success/status pages

#### 3.2 Profile Dashboard

- [ ] Implement user dashboard
- [ ] Add applications tracking
- [ ] Create favorites system
- [ ] Add recent comparisons

#### 3.3 Admin Panel

- [ ] Create admin dashboard
- [ ] Implement CRUD operations
- [ ] Add data tables
- [ ] Create loan management

#### 3.4 Static Pages

- [ ] Create static page system
- [ ] Implement CMS functionality
- [ ] Add SEO optimization
- [ ] Create about/privacy/terms pages

### Phase 4: Polish & Testing (Week 4)

#### 4.1 Performance Optimization

- [ ] Implement code splitting
- [ ] Add lazy loading
- [ ] Optimize bundle size
- [ ] Add image optimization

#### 4.2 Accessibility

- [ ] Add ARIA labels
- [ ] Implement keyboard navigation
- [ ] Add focus management
- [ ] Test with screen readers

#### 4.3 Testing

- [ ] Add unit tests for services
- [ ] Create component tests
- [ ] Implement E2E tests
- [ ] Add integration tests

#### 4.4 Documentation

- [ ] Update README
- [ ] Create API documentation
- [ ] Add component documentation
- [ ] Create deployment guide

## API Contracts

### Authentication

```typescript
// POST /auth/signup
interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// POST /auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// GET /auth/me
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "admin";
  isActive: boolean;
}
```

### Colleges

```typescript
// GET /colleges
interface CollegeListQuery {
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

// GET /colleges/:id
interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  ownership: string;
  ranking: number;
  fees: number;
  cutoff: number;
  placements: PlacementInfo;
  facilities: string[];
  examsAccepted: string[];
  description: string;
  overview: CollegeOverview;
  courses: Course[];
  admissions: AdmissionInfo;
  cutoffs: CutoffInfo;
  placements: PlacementInfo;
  facilities: FacilityInfo;
  faqs: FAQ[];
}
```

### Loans

```typescript
// POST /loans
interface LoanCreate {
  fullName: string;
  phone: string;
  email: string;
  program: string;
  collegeId?: string;
  fees: number;
  amountRequested: number;
  notes?: string;
}

// GET /loans?userId=me
interface Loan {
  id: string;
  userId: string;
  status: "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  fullName: string;
  program: string;
  amountRequested: number;
  notes?: string;
}
```

### Static Pages

```typescript
// GET /pages/:slug
interface PageContent {
  slug: string;
  title: string;
  body: string;
  metaDescription?: string;
  updatedAt: string;
}
```

## Response Format Standardization

### Success Response

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    size?: number;
    total?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  message?: string;
}
```

### Error Response

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  status: number;
}
```

## State Management Strategy

### React Query for Server State

- Colleges listing with filters
- User profile and authentication
- Loan applications
- Admin data

### Local State for UI

- Form data
- Modal states
- Compare selections
- Navigation state

### URL State for Navigation

- Filters and search
- Pagination
- Compare selections
- Current page/tab

## Performance Targets

- **Lighthouse Score**: > 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Security Measures

- [ ] Implement CSRF protection
- [ ] Use httpOnly cookies for tokens
- [ ] Add rate limiting
- [ ] Implement input validation
- [ ] Add XSS protection
- [ ] Use HTTPS only

## Testing Strategy

### Unit Tests

- API service modules
- Utility functions
- Custom hooks
- Form validation

### Component Tests

- Form components
- Data display components
- Navigation components
- Error states

### E2E Tests

- User registration/login
- College search and filtering
- Compare functionality
- Loan application flow
- Admin operations

## Deployment Strategy

### Frontend

- Build optimization
- CDN configuration
- Environment variables
- Health checks

### Backend

- Database migrations
- Environment configuration
- Logging and monitoring
- Backup strategy

## Success Criteria

- [ ] All P0 issues resolved
- [ ] Core user flows working end-to-end
- [ ] 80%+ test coverage
- [ ] Lighthouse score > 90
- [ ] Zero console errors in production
- [ ] All accessibility issues resolved
- [ ] Mobile responsive design
- [ ] SEO optimized
- [ ] Performance targets met
- [ ] Security audit passed
