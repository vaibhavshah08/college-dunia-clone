export interface GoogleAuthResponse {
  token: string;
  user: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    phone_number?: string;
    avatar_url?: string;
    email_verified?: boolean;
  };
}

class GoogleAuthService {
  constructor() {
    // No need for OAuth2Client in browser
  }

  async initializeGoogleAuth(): Promise<void> {
    // No longer needed since we're using server-side OAuth flow
    return Promise.resolve();
  }

  async signInWithGoogle(): Promise<GoogleAuthResponse> {
    // Redirect to backend OAuth endpoint
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:7001";
    window.location.href = `${apiUrl}/auth/google`;

    // This will never resolve as the page will redirect
    return new Promise(() => {});
  }

  renderGoogleButton(
    elementId: string,
    onSuccess: (response: GoogleAuthResponse) => void,
    onError: (error: Error) => void
  ): void {
    // For server-side OAuth, we'll handle this in the component
    // This method is kept for compatibility but won't be used
  }
}

export const googleAuthService = new GoogleAuthService();
