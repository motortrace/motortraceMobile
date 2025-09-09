import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UploadConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

class ImageUploadService {
  private baseUrl = 'http://10.0.2.2:3000'; // Android emulator localhost

  /**
   * Get upload configuration from backend
   */
  async getUploadConfig(): Promise<UploadConfig | null> {
    try {
      const response = await fetch(`${this.baseUrl}/storage/config`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to get upload config:', error);
      return null;
    }
  }

  /**
   * Upload profile image to backend
   */
  async uploadProfileImage(imageUri: string): Promise<UploadResult> {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found'
        };
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg', // Default type, will be detected by backend
        name: 'profile-image.jpg'
      } as any);

      const response = await fetch(`${this.baseUrl}/storage/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Upload failed'
        };
      }

      if (data.success) {
        return {
          success: true,
          imageUrl: data.data.imageUrl
        };
      }

      return {
        success: false,
        error: 'Upload failed'
      };

    } catch (error: any) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }

  /**
   * Upload car image to dedicated car-image endpoint
   */
  async uploadCarImage(imageUri: string): Promise<UploadResult> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return { success: false, error: 'No authentication token found' };

      const formData = new FormData();
      formData.append('carImage', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'car-image.jpg'
      } as any);

      const response = await fetch(`${this.baseUrl}/storage/car-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Upload failed' };
      }

      if (data.success) {
        return { success: true, imageUrl: data.data.imageUrl };
      }

      return { success: false, error: 'Upload failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Upload failed' };
    }
  }

  /**
   * Delete profile image from backend
   */
  async deleteProfileImage(imageUrl: string): Promise<UploadResult> {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found'
        };
      }

      const response = await fetch(`${this.baseUrl}/storage/profile-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Delete failed'
        };
      }

      return {
        success: data.success,
        error: data.success ? undefined : 'Delete failed'
      };

    } catch (error: any) {
      console.error('Image delete error:', error);
      return {
        success: false,
        error: error.message || 'Delete failed'
      };
    }
  }

  /**
   * Validate image file before upload
   */
  validateImage(imageUri: string, config: UploadConfig): { valid: boolean; error?: string } {
    // Basic validation - in a real app, you might want to check file size, type, etc.
    if (!imageUri) {
      return { valid: false, error: 'No image selected' };
    }

    // You could add more validation here based on the config
    return { valid: true };
  }
}

export const imageUploadService = new ImageUploadService();
