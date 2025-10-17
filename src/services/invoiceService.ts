import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - change this to your computer's IP if using real device
const API_BASE_URL = 'http://10.0.2.2:3000'; // Change this if needed

export interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  status: string;
  subtotalServices: number;
  subtotalParts: number;
  subtotalInspections: number;
  subtotalAppointments: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  updatedAt: string;
  workOrder?: {
    id: string;
    workOrderNumber: string;
    complaint: string;
    customer: {
      userProfile: {
        name: string;
        phone: string;
        email: string;
      };
    };
  };
  lineItems?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id: string;
  type: 'SERVICE' | 'PART' | 'INSPECTION' | 'APPOINTMENT';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface InvoiceFilters {
  workOrderId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface InvoiceStatistics {
  totalInvoices: number;
  totalRevenue: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceAmount: number;
}

class InvoiceService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Get invoice by ID
  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }

  // Get invoices with filters
  async getInvoices(
    filters?: InvoiceFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ invoices: Invoice[]; total: number; page: number; limit: number }> {
    try {
      const headers = await this.getAuthHeaders();
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      const url = `${API_BASE_URL}/invoices?${queryParams.toString()}`;
      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      return {
        invoices: data.data?.invoices || [],
        total: data.data?.total || 0,
        page: data.data?.page || page,
        limit: data.data?.limit || limit,
      };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  // Get invoices by work order
  async getInvoicesByWorkOrder(workOrderId: string): Promise<Invoice[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/invoices/work-orders/${workOrderId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch work order invoices');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching work order invoices:', error);
      throw error;
    }
  }

  // Get invoice statistics
  async getInvoiceStatistics(): Promise<InvoiceStatistics> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/invoices/statistics`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoice statistics');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching invoice statistics:', error);
      // Return default statistics if API fails
      return {
        totalInvoices: 0,
        totalRevenue: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        averageInvoiceAmount: 0,
      };
    }
  }

  // Generate invoice PDF
  async generateInvoicePDF(invoiceId: string): Promise<string> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/pdf`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice PDF');
      }

      const data = await response.json();
      return data.data?.url || '';
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw error;
    }
  }

  // Download invoice PDF (returns blob for mobile)
  async downloadInvoicePDF(invoiceId: string): Promise<Blob> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/pdf/download`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice PDF');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading invoice PDF:', error);
      throw error;
    }
  }

  // Get invoice status options
  getInvoiceStatuses(): Array<{ value: string; label: string }> {
    return [
      { value: 'DRAFT', label: 'Draft' },
      { value: 'SENT', label: 'Sent' },
      { value: 'CONFIRMED', label: 'Confirmed' },
      { value: 'PAID', label: 'Paid' },
      { value: 'OVERDUE', label: 'Overdue' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ];
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Check if invoice is overdue
  isInvoiceOverdue(invoice: Invoice): boolean {
    if (invoice.status !== 'SENT') return false;
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    return dueDate < today;
  }

  // Get invoice status color
  getInvoiceStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return '#10B981'; // Green
      case 'sent':
        return '#3B82F6'; // Blue
      case 'confirmed':
        return '#8B5CF6'; // Purple
      case 'overdue':
        return '#EF4444'; // Red
      case 'cancelled':
        return '#6B7280'; // Gray
      case 'draft':
      default:
        return '#F59E0B'; // Yellow
    }
  }

  // Get invoice status badge text
  getInvoiceStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'Paid';
      case 'sent':
        return 'Sent';
      case 'confirmed':
        return 'Confirmed';
      case 'overdue':
        return 'Overdue';
      case 'cancelled':
        return 'Cancelled';
      case 'draft':
      default:
        return 'Draft';
    }
  }
}

export const invoiceService = new InvoiceService();