import AsyncStorage from '@react-native-async-storage/async-storage';

interface EmailServiceResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

interface PasswordResetRequest {
  email: string;
}

interface PasswordResetResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    sentAt: string;
  };
  error?: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    updatedAt: string;
  };
  error?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    changedAt: string;
  };
  error?: string;
}

interface VerifyTokenRequest {
  token: string;
}

interface VerifyTokenResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
    isValid: boolean;
  };
  error?: string;
}

class EmailService {
  private baseUrl: string;

  constructor() {
    // Use Android emulator's host machine IP
    this.baseUrl = 'http://10.0.2.2:3000';
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'X-Client-Type': 'mobile',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/request-password-reset`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send password reset email');
      }

      return data;
    } catch (error: any) {
      console.error('❌ Password reset request error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send password reset email',
        message: 'Could not send password reset email'
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      return data;
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      return {
        success: false,
        error: error.message || 'Failed to reset password',
        message: 'Could not reset password'
      };
    }
  }

  /**
   * Change password for authenticated users
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      return data;
    } catch (error: any) {
      console.error('❌ Password change error:', error);
      return {
        success: false,
        error: error.message || 'Failed to change password',
        message: 'Could not change password'
      };
    }
  }

  /**
   * Verify reset token
   */
  async verifyResetToken(token: string): Promise<VerifyTokenResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify-reset-token`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid or expired token');
      }

      return data;
    } catch (error: any) {
      console.error('❌ Token verification error:', error);
      return {
        success: false,
        error: error.message || 'Invalid or expired token',
        message: 'Could not verify token'
      };
    }
  }

  /**
   * Store reset email and token for later use
   */
  async storeResetData(email: string, token?: string): Promise<void> {
    try {
      await AsyncStorage.setItem('resetEmail', email);
      if (token) {
        await AsyncStorage.setItem('resetToken', token);
      }
    } catch (error) {
      console.error('❌ Failed to store reset data:', error);
    }
  }

  /**
   * Clear reset data
   */
  async clearResetData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('resetEmail');
      await AsyncStorage.removeItem('resetToken');
    } catch (error) {
      console.error('❌ Failed to clear reset data:', error);
    }
  }

  /**
   * Get stored reset email
   */
  async getStoredResetEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('resetEmail');
    } catch (error) {
      console.error('❌ Failed to get stored reset email:', error);
      return null;
    }
  }

  /**
   * Get stored reset token
   */
  async getStoredResetToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('resetToken');
    } catch (error) {
      console.error('❌ Failed to get stored reset token:', error);
      return null;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
