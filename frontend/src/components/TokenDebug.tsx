import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { getToken, parseToken, getTokenExpiry, isAuthenticated } from '../utils/tokenManager';

interface TokenDebugProps {
  show?: boolean;
}

const TokenDebug: React.FC<TokenDebugProps> = ({ show = false }) => {
  if (!show || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const token = getToken();
  const tokenPayload = token ? parseToken(token) : null;
  const expiry = getTokenExpiry();
  const authenticated = isAuthenticated();

  return (
    <Paper sx={{ p: 2, m: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        🔐 Token Debug Info (Development Only)
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Authenticated:</strong> {authenticated ? '✅ Yes' : '❌ No'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          <strong>Token Present:</strong> {token ? '✅ Yes' : '❌ No'}
        </Typography>
        
        {expiry && (
          <Typography variant="body2" color="text.secondary">
            <strong>Expires:</strong> {expiry.toLocaleString()}
          </Typography>
        )}
      </Box>

      {tokenPayload && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Token Payload:</strong>
          </Typography>
          <Box 
            component="pre" 
            sx={{ 
              fontSize: '0.75rem', 
              backgroundColor: '#fff', 
              p: 1, 
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '200px'
            }}
          >
            {JSON.stringify(tokenPayload, null, 2)}
          </Box>
        </Box>
      )}

      {token && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Token (first 50 chars):</strong>
          </Typography>
          <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
            {token.substring(0, 50)}...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TokenDebug;

