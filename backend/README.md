# College Dunia Backend

A NestJS backend application for the College Dunia platform, providing APIs for college listings, loan applications, document management, and user authentication.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Google OAuth integration
  - Role-based access control (Student/Admin)

- **User Management**
  - User registration and login
  - Profile management
  - Admin user management

- **College Management**
  - College listings with search and filters
  - Course management
  - College comparison tool

- **Loan Applications**
  - Loan application submission
  - Application status tracking
  - Admin approval/rejection system

- **Document Management**
  - Document upload and storage
  - Document verification system
  - AWS S3 integration

- **Admin Dashboard**
  - Statistics and analytics
  - User management
  - Content management

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Authentication**: JWT + Passport.js
- **File Storage**: AWS S3
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js 22.x
- MySQL 8.0+
- AWS S3 bucket (for document storage)

## Installation

1. **Clone the repository and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:
   - Database credentials
   - JWT secrets
   - Google OAuth credentials
   - AWS S3 credentials

4. **Database Setup**
   - Create a MySQL database named `college_dunia`
   - The application will automatically create tables on first run

5. **Run the application**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/refresh` - Refresh JWT token

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/toggle-status` - Toggle user status (Admin only)

### Colleges

- `GET /api/colleges` - Get colleges with filters
- `GET /api/colleges/:id` - Get college details
- `GET /api/colleges/compare/:ids` - Compare colleges
- `POST /api/colleges` - Create college (Admin only)
- `PUT /api/colleges/:id` - Update college (Admin only)
- `DELETE /api/colleges/:id` - Delete college (Admin only)

### Loans

- `POST /api/loans` - Submit loan application
- `GET /api/loans/my-applications` - Get user's loan applications
- `GET /api/loans` - Get all loan applications (Admin only)
- `GET /api/loans/:id` - Get loan application details
- `PUT /api/loans/:id/status` - Update loan status (Admin only)

### Documents

- `POST /api/documents` - Upload document
- `GET /api/documents/my-documents` - Get user's documents
- `GET /api/documents` - Get all documents (Admin only)
- `GET /api/documents/:id` - Get document details
- `PUT /api/documents/:id/verify` - Verify document (Admin only)
- `DELETE /api/documents/:id` - Delete document

### Admin

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/recent-activity` - Get recent activity

## Database Schema

The application uses the following main entities:

- **Users**: User accounts and profiles
- **Colleges**: College information and details
- **Courses**: Course offerings by colleges
- **LoanApplications**: Student loan applications
- **Documents**: Uploaded documents and files

## Environment Variables

| Variable                | Description                | Default       |
| ----------------------- | -------------------------- | ------------- |
| `DB_HOST`               | Database host              | localhost     |
| `DB_PORT`               | Database port              | 3306          |
| `DB_USERNAME`           | Database username          | root          |
| `DB_PASSWORD`           | Database password          | -             |
| `DB_NAME`               | Database name              | college_dunia |
| `JWT_SECRET`            | JWT signing secret         | -             |
| `JWT_EXPIRES_IN`        | JWT expiration time        | 7d            |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID     | -             |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret | -             |
| `AWS_ACCESS_KEY_ID`     | AWS access key             | -             |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key             | -             |
| `AWS_S3_BUCKET`         | S3 bucket name             | -             |

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Formatting

```bash
npm run format
npm run lint
```

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the application:
   ```bash
   npm run start:prod
   ```

## Contributing

1. Follow the NestJS coding standards
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is licensed under the MIT License.
