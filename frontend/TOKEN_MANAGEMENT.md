# Token Management System

This document describes the comprehensive token management system implemented in the College Dunia frontend application.

## Overview

The token management system provides secure, centralized handling of JWT tokens for authentication across the application. It includes automatic token validation, expiry checking, and secure storage.

## Features

### ✅ **Automatic Token Handling**
- **Login**: Token automatically saved to localStorage
- **API Calls**: Bearer token automatically added to all requests
- **Logout**: Token automatically removed from localStorage
- **401 Errors**: Token automatically cleared and user redirected to login

### ✅ **Security Features**
- **Token Expiry**: Automatic expiry checking and cleanup
- **Secure Storage**: Tokens stored in localStorage with error handling
- **Automatic Cleanup**: Expired tokens automatically removed
- **Error Handling**: Graceful handling of storage errors

### ✅ **Developer Tools**
- **Token Debug**: Development component to inspect token details
- **Token Parsing**: JWT payload parsing for debugging
- **Expiry Tracking**: Token expiry time tracking

## Implementation

### 1. Token Manager (`src/utils/tokenManager.ts`)

Centralized token management utilities:

```typescript
import { 
  saveToken, 
  getToken, 
  removeToken, 
  isAuthenticated,
  getAuthToken 
} from '../utils/tokenManager';

// Save token (called on login/signup)
saveToken(token, expiresIn);

// Get token for API calls
const token = getAuthToken();

// Check if user is authenticated
const authenticated = isAuthenticated();

// Remove token (called on logout/401)
removeToken();
```

### 2. API Client Integration (`src/services/apiClient.ts`)

Automatic Bearer token injection:

```typescript
// Request interceptor automatically adds Bearer token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken(); // Clear expired token
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### 3. Authentication Hook (`src/lib/hooks/useAuth.ts`)

Enhanced authentication with token management:

```typescript
// Login success - token automatically saved
onSuccess: (data) => {
  saveToken(data.token);
  // ... rest of success handling
}

// Logout - token automatically removed
onSuccess: () => {
  removeToken();
  // ... rest of logout handling
}

// Profile fetch - uses token manager for authentication check
enabled: isAuthenticated()
```

## Token Flow

### Login Flow
1. **User submits login form**
2. **API call made to login endpoint**
3. **Server returns JWT token**
4. **Token saved to localStorage** (`saveToken()`)
5. **User redirected to dashboard**
6. **All subsequent API calls include Bearer token**

### API Call Flow
1. **Component makes API call**
2. **Request interceptor checks for token**
3. **Bearer token added to Authorization header**
4. **Request sent to server**
5. **Response received and processed**

### Logout Flow
1. **User clicks logout**
2. **Token removed from localStorage** (`removeToken()`)
3. **User redirected to login page**
4. **All cached data cleared**

### Error Handling Flow
1. **API returns 401 Unauthorized**
2. **Response interceptor catches error**
3. **Token automatically removed** (`removeToken()`)
4. **User redirected to login page**
5. **Error message shown to user**

## API Endpoints

### Expected Response Format

#### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Signup Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

## Security Considerations

### ✅ **Implemented Security Measures**
- **Token Expiry**: Automatic expiry checking
- **Secure Storage**: Tokens stored in localStorage with error handling
- **Automatic Cleanup**: Expired tokens automatically removed
- **401 Handling**: Automatic token removal on authentication failure
- **Error Handling**: Graceful handling of storage errors

### 🔒 **Best Practices**
- **Never expose tokens in URLs**
- **Use HTTPS in production**
- **Implement token refresh mechanism** (future enhancement)
- **Log security events** (future enhancement)
- **Rate limiting on auth endpoints** (backend responsibility)

## Development Tools

### Token Debug Component

For development purposes, you can add the TokenDebug component to any page:

```typescript
import TokenDebug from '../components/TokenDebug';

// In your component
<TokenDebug show={true} />
```

This will show:
- Authentication status
- Token presence
- Token expiry time
- Token payload (decoded JWT)
- Token preview (first 50 characters)

### Token Utilities

```typescript
import { 
  parseToken, 
  getTokenExpiry, 
  isTokenExpired 
} from '../utils/tokenManager';

// Parse JWT payload
const payload = parseToken(token);

// Get expiry time
const expiry = getTokenExpiry();

// Check if token is expired
const expired = isTokenExpired();
```

## Error Handling

### Storage Errors
- **localStorage unavailable**: Graceful fallback
- **Quota exceeded**: Error logged, user notified
- **Permission denied**: Error logged, user notified

### Token Errors
- **Invalid token**: Automatically removed
- **Expired token**: Automatically removed
- **Malformed token**: Error logged, token removed

### Network Errors
- **401 responses**: Token removed, user redirected
- **Network failures**: Retry mechanism (implemented in error handling)

## Future Enhancements

### 1. Token Refresh
```typescript
// Automatic token refresh before expiry
const refreshToken = async () => {
  // Call refresh endpoint
  // Update token in storage
  // Retry original request
};
```

### 2. Token Rotation
```typescript
// Implement token rotation for enhanced security
const rotateToken = async () => {
  // Get new token
  // Invalidate old token
  // Update storage
};
```

### 3. Multi-tab Synchronization
```typescript
// Sync token across browser tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    // Handle token changes
  }
});
```

### 4. Token Analytics
```typescript
// Track token usage and expiry patterns
const trackTokenUsage = () => {
  // Log token creation, usage, expiry
  // Monitor for suspicious patterns
};
```

## Testing

### Manual Testing
1. **Login**: Verify token is saved
2. **API Calls**: Verify Bearer token is sent
3. **Logout**: Verify token is removed
4. **401 Error**: Verify token is cleared and redirect occurs
5. **Token Expiry**: Verify automatic cleanup

### Automated Testing
```typescript
// Test token management functions
describe('Token Manager', () => {
  it('should save and retrieve token', () => {
    saveToken('test-token');
    expect(getToken()).toBe('test-token');
  });

  it('should remove token on logout', () => {
    saveToken('test-token');
    removeToken();
    expect(getToken()).toBeNull();
  });
});
```

## Troubleshooting

### Common Issues

#### Token Not Being Sent
- Check if token is saved in localStorage
- Verify `getAuthToken()` returns token
- Check browser network tab for Authorization header

#### 401 Errors Persist
- Clear localStorage completely
- Check token expiry
- Verify server is expecting Bearer token format

#### Token Expiry Issues
- Check token payload for expiry time
- Verify server is setting correct expiry
- Check timezone differences

### Debug Steps
1. **Open browser dev tools**
2. **Check Application > Local Storage**
3. **Look for 'token' key**
4. **Check Network tab for Authorization headers**
5. **Use TokenDebug component for detailed info**

## Conclusion

The token management system provides a robust, secure foundation for authentication in the College Dunia application. It handles all aspects of token lifecycle automatically while providing developer tools for debugging and monitoring.
