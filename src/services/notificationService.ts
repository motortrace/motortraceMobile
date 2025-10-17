import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  userProfileId: string;
  workOrderId?: string;
  type: string;
  title: string;
  message: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  sentViaEmail: boolean;
  sentViaPush: boolean;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  userProfileId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  workOrderStatusChanges: boolean;
  serviceApprovals: boolean;
  partApprovals: boolean;
  inspectionReports: boolean;
  paymentConfirmations: boolean;
  appointmentReminders: boolean;
  vehicleReadyAlerts: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

class NotificationService {
  private baseUrl: string;

  constructor() {
    // Use the correct IP for Android emulator
    this.baseUrl = 'http://10.0.2.2:3000';
  }

  /**
   * Get all notifications for the current user
   */
  async getNotifications(limit?: number): Promise<Notification[]> {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');

      if (!token || !userStr) {
        throw new Error('User not authenticated');
      }

      const user = JSON.parse(userStr);
      const url = limit
        ? `${this.baseUrl}/notifications?userProfileId=${user.id}&limit=${limit}`
        : `${this.baseUrl}/notifications?userProfileId=${user.id}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');

      if (!token || !userStr) {
        throw new Error('User not authenticated');
      }

      const user = JSON.parse(userStr);

      const response = await fetch(`${this.baseUrl}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfileId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences | null> {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');

      if (!token || !userStr) {
        throw new Error('User not authenticated');
      }

      const user = JSON.parse(userStr);

      const response = await fetch(`${this.baseUrl}/notifications/preferences?userProfileId=${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No preferences set yet
        }
        throw new Error(`Failed to fetch preferences: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');

      if (!token || !userStr) {
        throw new Error('User not authenticated');
      }

      const user = JSON.parse(userStr);

      const response = await fetch(`${this.baseUrl}/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfileId: user.id,
          ...preferences,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');

      if (!token || !userStr) {
        return 0;
      }

      const user = JSON.parse(userStr);

      const response = await fetch(`${this.baseUrl}/notifications/unread-count?userProfileId=${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Failed to fetch unread count:', response.status);
        return 0;
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      return 0;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();