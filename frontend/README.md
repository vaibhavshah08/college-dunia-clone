# Meraki Frontend

A React frontend application for the Meraki platform, built with Material-UI and TypeScript.

## Features

- **Modern UI/UX**: Built with Material-UI for a beautiful and responsive design
- **Authentication**: Complete login/register system with JWT tokens
- **College Management**: Browse, search, and compare colleges
- **Loan Applications**: Apply for and track educational loans
- **Document Management**: Upload and manage important documents
- **Admin Dashboard**: Comprehensive admin panel for management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Framework**: React 19 with TypeScript
- **UI Library**: Material-UI (MUI) v7
- **State Management**: React Context API
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Data Fetching**: React Query
- **Package Manager**: Yarn

## Prerequisites

- Node.js 22.x
- Yarn package manager

## Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend directory:

   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. **Start the development server**

   ```bash
   yarn start
   ```

   The application will open at `http://localhost:3001`

## Available Scripts

- `yarn start` - Start the development server
- `yarn build` - Build the app for production
- `yarn test` - Run tests
- `yarn eject` - Eject from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   └── Layout/         # Layout and navigation
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Colleges/       # College-related pages
│   ├── Dashboard/      # User dashboard
│   ├── Admin/          # Admin pages
│   ├── Profile/        # User profile
│   ├── Loans/          # Loan management
│   └── Documents/      # Document management
├── services/           # API services
│   ├── api.ts          # Axios configuration
│   └── authService.ts  # Authentication API calls
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## Key Components

### Authentication

- **Login/Register**: Complete authentication forms with validation
- **Protected Routes**: Route protection for authenticated users
- **Admin Routes**: Special routes for admin users only

### Layout

- **Responsive Navigation**: Mobile-friendly navigation with drawer
- **User Menu**: Profile dropdown with logout functionality
- **Breadcrumbs**: Navigation breadcrumbs for better UX

### Pages

- **Home**: Landing page with hero section and features
- **Colleges**: College listing with search and filters
- **College Detail**: Detailed college information
- **College Comparison**: Side-by-side college comparison
- **Dashboard**: User dashboard with statistics
- **Admin Dashboard**: Admin panel with management tools
- **Profile**: User profile management
- **Loans**: Loan application management
- **Documents**: Document upload and management

## API Integration

The frontend communicates with the NestJS backend through:

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Centralized error handling with axios interceptors
- **Loading States**: Loading indicators for better UX

## Styling

- **Material-UI Theme**: Custom theme with brand colors
- **Responsive Design**: Mobile-first approach
- **Consistent Spacing**: Using MUI's spacing system
- **Typography**: Consistent typography hierarchy

## State Management

- **Authentication State**: Managed with React Context
- **Form State**: Local state with useState
- **API State**: React Query for server state
- **UI State**: Local component state

## Environment Variables

| Variable            | Description     | Default                     |
| ------------------- | --------------- | --------------------------- |
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:3000/api` |

## Development

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent component structure

### Best Practices

- Functional components with hooks
- TypeScript interfaces for props
- Error boundaries for error handling
- Lazy loading for better performance

## Deployment

1. **Build the application**

   ```bash
   yarn build
   ```

2. **Deploy the `build` folder**
   - The build folder contains optimized static files
   - Can be deployed to any static hosting service

## Contributing

1. Follow the existing code style
2. Write TypeScript interfaces for new components
3. Add proper error handling
4. Test on different screen sizes
5. Update documentation as needed

## License

This project is licensed under the MIT License.
