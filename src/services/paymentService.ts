import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - change this to your computer's IP if using real device
const API_BASE_URL = 'http://10.0.2.2:3000'; // Change this if needed

export interface PaymentMethod {
  value: string;
  label: string;
}

export interface PaymentStatus {
  value: string;
  label: string;
}

export interface Payment {
  id: string;
  workOrderId: string;
  method: string;
  amount: number;
  status: string;
  reference?: string;
  paidAt: string;
  processedBy?: {
    userProfile?: {
      firstName: string;
      lastName: string;
    };
  };
  notes?: string;
  paymentImage?: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  payments: Payment[];
  lastPaymentDate?: string;
}

export interface CreatePaymentRequest {
  workOrderId: string;
  amount: number;
  method: string;
  notes?: string;
  paymentImage?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentIntentRequest {
  workOrderId: string;
  amount: number;
  currency?: string;
  description?: string;
}

class PaymentService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Get payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payments/methods`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Return default payment methods if API fails
      return [
        { value: 'CASH', label: 'Cash' },
        { value: 'CARD', label: 'Credit Card' },
        { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
        { value: 'CHECK', label: 'Check' },
      ];
    }
  }

  // Get payment statuses
  async getPaymentStatuses(): Promise<PaymentStatus[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payments/statuses`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment statuses');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching payment statuses:', error);
      // Return default payment statuses if API fails
      return [
        { value: 'PENDING', label: 'Pending' },
        { value: 'PAID', label: 'Paid' },
        { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
        { value: 'REFUNDED', label: 'Refunded' },
        { value: 'FAILED', label: 'Failed' },
      ];
    }
  }

  // Get work order payment summary
  async getWorkOrderPaymentSummary(workOrderId: string): Promise<PaymentSummary> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payments/work-orders/${workOrderId}/summary`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment summary');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      throw error;
    }
  }

  // Get work order payments
  async getWorkOrderPayments(workOrderId: string): Promise<Payment[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/work-orders/${workOrderId}/payments`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch work order payments');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching work order payments:', error);
      throw error;
    }
  }

  // Create manual payment
  async createManualPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    try {
      const headers = await this.getAuthHeaders();
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const requestData = {
        ...paymentData,
        processedById: user?.id,
      };

      const response = await fetch(`${API_BASE_URL}/payments/manual`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating manual payment:', error);
      throw error;
    }
  }

  // Create payment intent for online payment
  async createPaymentIntent(paymentData: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/payments/payment-intents`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Process online payment
  async processOnlinePayment(paymentData: CreatePaymentIntentRequest): Promise<Payment> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/payments/online`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process online payment');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error processing online payment:', error);
      throw error;
    }
  }

  // Get payment by ID
  async getPayment(paymentId: string): Promise<Payment> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Get all payments with filters
  async getPayments(filters?: {
    workOrderId?: string;
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Payment[]> {
    try {
      const headers = await this.getAuthHeaders();
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      const url = `${API_BASE_URL}/payments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  // Mark payment as paid (for manual payments)
  async markAsPaid(paymentId: string, paymentImage?: string): Promise<Payment> {
    try {
      const headers = await this.getAuthHeaders();
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const requestData = {
        processedById: user?.id,
        paymentImage,
      };

      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/mark-as-paid`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark payment as paid');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      throw error;
    }
  }

  // Test sandbox payment (for development)
  async testSandboxPayment(workOrderId: string, amount: number): Promise<Payment> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/payments/test/sandbox`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          workOrderId,
          amount,
          currency: 'USD',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process sandbox payment');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error processing sandbox payment:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();