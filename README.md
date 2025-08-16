# College Dunia Clone

A comprehensive college management platform built with modern technologies, featuring college listings, loan applications, document management, and admin dashboard.

## 🚀 Features

### Core Features

- **College Management**: Browse, search, filter, and compare colleges
- **User Authentication**: JWT-based authentication with Google OAuth
- **Loan Applications**: Apply for and track educational loans
- **Document Management**: Upload and manage important documents
- **Admin Dashboard**: Comprehensive admin panel for management
- **Responsive Design**: Works seamlessly on all devices

### User Roles

- **Students**: Browse colleges, apply for loans, upload documents
- **Admins**: Manage users, colleges, loans, and documents

## 🛠 Tech Stack

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Authentication**: JWT + Passport.js
- **File Storage**: AWS S3
- **Validation**: class-validator, class-transformer

### Frontend

- **Framework**: React 19 with TypeScript
- **UI Library**: Material-UI (MUI) v7
- **State Management**: React Context API
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Data Fetching**: React Query

## 📋 Prerequisites

- Node.js 22.x
- MySQL 8.0+
- Yarn package manager
- AWS S3 bucket (for document storage)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd college-dunia-clone
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Update .env file with your configuration
# - Database credentials
# - JWT secrets
# - Google OAuth credentials
# - AWS S3 credentials

# Create MySQL database
mysql -u root -p
CREATE DATABASE college_dunia;
exit

# Start the development server
npm run start:dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env

# Start the development server
yarn start
```

The frontend will run on `http://localhost:3001`

## 📁 Project Structure

```
college-dunia-clone/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── config/         # Configuration files
│   ├── env.example         # Environment variables template
│   └── README.md           # Backend documentation
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── contexts/       # React contexts
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=college_dunia

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=college-dunia-documents

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/google` - Google OAuth initiation
- `POST /api/auth/refresh` - Refresh JWT token

### College Endpoints

- `GET /api/colleges` - Get colleges with filters
- `GET /api/colleges/:id` - Get college details
- `GET /api/colleges/compare/:ids` - Compare colleges

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Loan Endpoints

- `POST /api/loans` - Submit loan application
- `GET /api/loans/my-applications` - Get user's loan applications

### Document Endpoints

- `POST /api/documents` - Upload document
- `GET /api/documents/my-documents` - Get user's documents

## 🎯 Key Features Implementation

### Authentication System

- JWT-based authentication
- Google OAuth integration
- Role-based access control
- Protected routes

### College Management

- Advanced search and filtering
- College comparison tool
- Detailed college information
- Course management

### Loan Application System

- Multi-step application process
- Status tracking
- Admin approval workflow
- Document verification

### Document Management

- Secure file upload
- Multiple file types support
- Document verification system
- AWS S3 integration

### Admin Dashboard

- User management
- College management
- Loan application management
- Document verification
- Analytics and statistics

## 🚀 Deployment

### Backend Deployment

1. Build the application:

   ```bash
   cd backend
   npm run build
   ```

2. Set production environment variables

3. Start the application:
   ```bash
   npm run start:prod
   ```

### Frontend Deployment

1. Build the application:

   ```bash
   cd frontend
   yarn build
   ```

2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation in each directory
- Review the API endpoints
- Check the environment configuration

## 🔄 Development Workflow

1. **Backend Development**:

   - Use `npm run start:dev` for development
   - Use `npm run test` for testing
   - Use `npm run build` for production build

2. **Frontend Development**:

   - Use `yarn start` for development
   - Use `yarn test` for testing
   - Use `yarn build` for production build

3. **Database**:
   - The application will automatically create tables on first run
   - Use `synchronize: true` in development only

## 🎉 Getting Started

1. Follow the setup instructions above
2. Start both backend and frontend servers
3. Visit `http://localhost:3001` to access the application
4. Register a new account or use the admin credentials
5. Explore the features and start building!

---

**Happy Coding! 🚀**
