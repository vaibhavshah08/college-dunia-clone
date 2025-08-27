# Error Handling System

This document describes the comprehensive error handling system implemented in the College Dunia frontend application.

## Overview

The error handling system provides consistent, user-friendly error management across the entire application, with proper logging, retry mechanisms, and graceful degradation.

## Components

### 1. API Client (`src/services/apiClient.ts`)

The centralized API client handles all HTTP requests with built-in error handling:

- **Request Interceptors**: Add authentication tokens and correlation IDs
- **Response Interceptors**: Handle different HTTP status codes
- **Error Normalization**: Standardize error responses
- **Request Cancellation**: Cancel duplicate requests

#### Error Status Handling:
- `401`: Unauthorized - Clear token and redirect to login
- `403`: Forbidden - Show permission denied message
- `404`: Not found - Show resource not found message
- `422`: Validation error - Show validation messages
- `429`: Rate limited - Show retry message
- `500+`: Server error - Show generic error message
- Network errors: Show connection error message

### 2. Error Handler Utilities (`src/utils/errorHandler.ts`)

Centralized error handling utilities:

```typescript
import { handleApiError, getErrorColor, isRetryableError } from '../utils/errorHandler';

// Handle API errors consistently
const errorMessage = handleApiError(error, {
  showToast: true,
  redirectTo: '/login',
  clearToken: true
});

// Get appropriate error color for UI
const color = getErrorColor(error);

// Check if error is retryable
const canRetry = isRetryableError(error);
```

### 3. Custom Error Hook (`src/lib/hooks/useApiError.ts`)

React hook for managing API errors in components:

```typescript
import { useApiError } from '../lib/hooks/useApiError';

const MyComponent = () => {
  const { error, isError, handleError, clearError } = useApiError({
    showToast: true,
    redirectTo: '/login'
  });

  const handleApiCall = async () => {
    try {
      await apiCall();
    } catch (error) {
      handleError(error);
    }
  };
};
```

### 4. Enhanced Auth Hook (`src/lib/hooks/useAuth.ts`)

The authentication hook includes comprehensive error handling:

- **Profile Fetch Errors**: Handle token expiration and permission issues
- **Login Errors**: Handle invalid credentials, rate limiting, and validation
- **Signup Errors**: Handle duplicate emails and validation issues
- **Logout Errors**: Graceful fallback even if API fails

### 5. Error Boundary (`src/components/ErrorBoundary.tsx`)

React error boundary for catching JavaScript errors:

- **Development Mode**: Shows detailed error information
- **Production Mode**: Shows user-friendly error message
- **Retry Mechanism**: Allow users to retry the operation
- **Navigation**: Provide way to go back to home page

## Error Types and Handling

### Authentication Errors
- **401 Unauthorized**: Clear token, redirect to login
- **403 Forbidden**: Show access denied message
- **Invalid Credentials**: Show specific error message
- **Rate Limiting**: Show retry message with delay

### Validation Errors
- **422 Validation**: Display field-specific error messages
- **Form Validation**: Client-side validation with real-time feedback
- **File Upload Errors**: Handle file size, format, and content issues

### Network Errors
- **Connection Issues**: Show network error message
- **Timeout Errors**: Show timeout message with retry option
- **Server Unavailable**: Show service unavailable message

### Business Logic Errors
- **Duplicate Resources**: Show specific conflict message
- **Permission Denied**: Show access denied message
- **Resource Not Found**: Show not found message

## Best Practices

### 1. User Experience
- Always show user-friendly error messages
- Provide actionable feedback when possible
- Use appropriate error colors (error, warning, info)
- Include retry mechanisms for transient errors

### 2. Error Logging
- Log errors with context information
- Include correlation IDs for tracking
- Separate user-facing messages from technical details
- Use structured logging for better debugging

### 3. Error Recovery
- Implement retry logic for transient errors
- Provide fallback UI when services are unavailable
- Graceful degradation for non-critical features
- Clear error state when user takes action

### 4. Security
- Don't expose sensitive information in error messages
- Handle authentication errors securely
- Validate user input to prevent client-side errors
- Sanitize error messages before displaying

## Usage Examples

### Basic Error Handling
```typescript
try {
  const data = await apiCall();
  // Handle success
} catch (error) {
  const message = handleApiError(error);
  setError(message);
}
```

### With Custom Hook
```typescript
const { error, handleError, clearError } = useApiError();

const handleSubmit = async () => {
  try {
    await submitData();
    clearError();
  } catch (error) {
    handleError(error);
  }
};
```

### Component Error Display
```typescript
{error && (
  <Alert severity="error" onClose={clearError}>
    {error}
  </Alert>
)}
```

## Error Monitoring

The system is designed to integrate with error monitoring services:

- **Development**: Console logging with detailed error information
- **Production**: Structured error logging for external services
- **User Feedback**: Toast notifications for immediate feedback
- **Error Tracking**: Correlation IDs for request tracking

## Future Enhancements

1. **Error Analytics**: Track error patterns and frequency
2. **Automatic Retry**: Implement exponential backoff for retryable errors
3. **Offline Support**: Handle errors when network is unavailable
4. **Error Reporting**: Allow users to report errors with context
5. **Performance Monitoring**: Track API response times and failures

