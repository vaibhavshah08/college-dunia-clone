# CollegeDunia Clone - Education Portal

A production-ready education portal built with React, TypeScript, Material-UI, and NestJS. This project provides a comprehensive platform for college discovery, comparison, and loan applications.

## 🚀 Features

### Core Features

- **Authentication**: Email/password signup and login with JWT
- **College Discovery**: Advanced search and filtering with real-time results
- **College Comparison**: Compare up to 4 colleges side-by-side
- **Loan Applications**: Multi-step loan application process
- **User Dashboard**: Track applications, favorites, and comparisons
- **Admin Panel**: Manage colleges, users, loans, and content

### Technical Features

- **TypeScript**: Full type safety across frontend and backend
- **React Query**: Efficient server state management with caching
- **Material-UI**: Modern, responsive UI components
- **Error Boundaries**: Graceful error handling
- **Code Splitting**: Lazy-loaded routes for optimal performance
- **URL State Sync**: Filters and pagination synced to URL
- **Toast Notifications**: User feedback for all actions

## 🏗️ Architecture

### Frontend Structure

```
frontend/src/
├── app/                    # App-level components
├── components/             # Shared UI components
├── features/               # Feature-based modules
├── services/               # Centralized API layer
├── lib/                    # Utilities and helpers
├── types/                  # TypeScript definitions
├── store/                  # State management
└── config/                 # Configuration
```

### Backend Structure

```
backend/src/
├── auth/                   # Authentication
├── colleges/               # College management
├── loans/                  # Loan applications
├── reviews/                # Reviews system
├── user/                   # User management
├── static-pages/           # Content management
├── admin/                  # Admin functionality
├── common/                 # Shared utilities
└── core/                   # Core services
```

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **Material-UI** for UI components
- **React Query** for server state
- **React Router** for navigation
- **Axios** for HTTP requests
- **React Toastify** for notifications

### Backend

- **NestJS** with TypeScript
- **TypeORM** for database operations
- **MySQL** database
- **JWT** for authentication
- **Class-validator** for validation
- **Winston** for logging

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MySQL 8.0+
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd meraki-connect
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update environment variables
# Edit .env with your database credentials

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update environment variables
# Set REACT_APP_API_BASE_URL to your backend URL

# Start development server
npm start
```

### 4. Environment Variables

#### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=meraki_connect

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3000
NODE_ENV=development
```

#### Frontend (.env)

```env
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_ENVIRONMENT=development
```

## 📁 Project Structure

### Frontend Architecture

#### Services Layer

- `services/apiClient.ts` - Centralized HTTP client with interceptors
- `services/endpoints.ts` - API route constants
- `services/modules/*.api.ts` - Feature-specific API modules

#### State Management

- `store/queryClient.ts` - React Query configuration
- `lib/hooks/useAuth.ts` - Authentication state
- `lib/hooks/useColleges.ts` - College data management
- `lib/hooks/useQueryParams.ts` - URL state management

#### Components

- `components/ErrorBoundary.tsx` - Error handling
- `components/Layout/` - Layout components
- `components/Auth/` - Authentication components
- `features/*/components/` - Feature-specific components

### Backend Architecture

#### Modules

- `auth/` - JWT authentication and authorization
- `colleges/` - College CRUD operations
- `loans/` - Loan application management
- `reviews/` - Review system
- `user/` - User management
- `static-pages/` - Content management

#### Core Services

- `core/logger/` - Centralized logging
- `core/correlation/` - Request correlation
- `core/custom-error/` - Error handling
- `core/interceptors/` - Request/response interceptors

## 🔧 Development

### Available Scripts

#### Backend

```bash
npm run start:dev      # Start development server
npm run build          # Build for production
npm run start:prod     # Start production server
npm run test           # Run tests
npm run test:e2e       # Run E2E tests
npm run migration:run  # Run database migrations
npm run migration:revert # Revert last migration
```

#### Frontend

```bash
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
npm run eject          # Eject from Create React App
```

### Code Quality

#### TypeScript

- Strict mode enabled
- Comprehensive type definitions
- API response typing

#### ESLint & Prettier

- Consistent code formatting
- TypeScript-aware linting
- Import organization

#### Testing

- Unit tests for services and utilities
- Component tests with React Testing Library
- E2E tests with Playwright (planned)

## 🚀 Deployment

### Backend Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations
4. Start the server: `npm run start:prod`

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables

## 📊 API Documentation

### Authentication

- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile

### Colleges

- `GET /api/colleges` - List colleges with filters
- `GET /api/colleges/:id` - Get college details
- `GET /api/colleges/compare/list` - Compare colleges
- `GET /api/colleges/filters` - Get available filters

### Loans

- `POST /api/loans` - Create loan application
- `GET /api/loans/me` - Get user's loans
- `GET /api/loans/admin` - Admin: Get all loans
- `PATCH /api/loans/:id/status` - Admin: Update loan status

### Admin

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🔒 Security

### Authentication

- JWT tokens with expiration
- Secure password hashing with bcrypt
- Role-based access control

### API Security

- Request validation with class-validator
- CORS configuration
- Rate limiting (planned)
- Input sanitization

### Frontend Security

- XSS protection
- CSRF protection (planned)
- Secure token storage
- Error boundary protection

## 📈 Performance

### Frontend Optimization

- Code splitting with React.lazy
- React Query caching
- Image optimization
- Bundle size optimization

### Backend Optimization

- Database query optimization
- Response caching
- Connection pooling
- Logging and monitoring

## 🧪 Testing

### Unit Tests

```bash
# Backend
npm run test

# Frontend
npm test
```

### E2E Tests

```bash
# Backend
npm run test:e2e

# Frontend (planned)
npm run test:e2e
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow the existing code structure

## 🐛 Troubleshooting

### Common Issues

#### Backend

- **Database connection failed**: Check database credentials and connection
- **JWT errors**: Verify JWT_SECRET is set correctly
- **Migration errors**: Ensure database schema is up to date

#### Frontend

- **API calls failing**: Check REACT_APP_API_BASE_URL
- **Build errors**: Clear node_modules and reinstall dependencies
- **Type errors**: Run `npm run type-check`

### Debug Mode

- Backend: Set `NODE_ENV=development` for detailed logs
- Frontend: Use React Developer Tools and browser dev tools

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

## 🗺️ Roadmap

### Phase 1 (Current)

- ✅ Core authentication
- ✅ College listing and search
- ✅ Basic comparison functionality
- ✅ Loan application system

### Phase 2 (Planned)

- 🔄 Advanced filtering and sorting
- 🔄 User reviews and ratings
- 🔄 Document upload system
- 🔄 Email notifications

### Phase 3 (Future)

- 📋 Mobile app development
- 📋 Advanced analytics
- 📋 Payment integration
- 📋 Multi-language support
