import { useState, useEffect } from 'react';
import { invoiceService, Invoice, InvoiceFilters, InvoiceStatistics } from '../services/invoiceService';

export interface UseInvoicesReturn {
  invoices: Invoice[];
  invoiceStatistics: InvoiceStatistics | null;
  loading: boolean;
  error: string | null;
  refreshInvoices: (filters?: InvoiceFilters) => Promise<void>;
  refreshStatistics: () => Promise<void>;
  getInvoiceById: (id: string) => Promise<Invoice>;
  generatePDF: (id: string) => Promise<string>;
}

export const useInvoices = (): UseInvoicesReturn => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceStatistics, setInvoiceStatistics] = useState<InvoiceStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    refreshInvoices();
    refreshStatistics();
  }, []);

  const refreshInvoices = async (filters?: InvoiceFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoiceService.getInvoices(filters, 1, 50);
      setInvoices(result.invoices);
    } catch (err) {
      console.error('Error refreshing invoices:', err);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const refreshStatistics = async () => {
    try {
      const stats = await invoiceService.getInvoiceStatistics();
      setInvoiceStatistics(stats);
    } catch (err) {
      console.error('Error refreshing invoice statistics:', err);
      // Don't set error for statistics as it's not critical
    }
  };

  const getInvoiceById = async (id: string): Promise<Invoice> => {
    try {
      setLoading(true);
      setError(null);
      const invoice = await invoiceService.getInvoiceById(id);
      return invoice;
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setError('Failed to load invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (id: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const pdfUrl = await invoiceService.generateInvoicePDF(id);
      return pdfUrl;
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    invoices,
    invoiceStatistics,
    loading,
    error,
    refreshInvoices,
    refreshStatistics,
    getInvoiceById,
    generatePDF,
  };
};