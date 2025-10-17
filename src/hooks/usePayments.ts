import { useState, useEffect } from 'react';
import { paymentService, Payment, PaymentSummary, PaymentMethod, PaymentStatus } from '../services/paymentService';

export interface UsePaymentsReturn {
  payments: Payment[];
  paymentSummary: PaymentSummary | null;
  paymentMethods: PaymentMethod[];
  paymentStatuses: PaymentStatus[];
  loading: boolean;
  error: string | null;
  refreshPayments: () => Promise<void>;
  refreshPaymentSummary: (workOrderId: string) => Promise<void>;
  createManualPayment: (paymentData: any) => Promise<Payment>;
  markAsPaid: (paymentId: string, paymentImage?: string) => Promise<Payment>;
}

export const usePayments = (workOrderId?: string): UsePaymentsReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load payment methods and statuses on mount
  useEffect(() => {
    loadPaymentMetadata();
  }, []);

  // Load payments if workOrderId is provided
  useEffect(() => {
    if (workOrderId) {
      refreshPayments();
      refreshPaymentSummary(workOrderId);
    }
  }, [workOrderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPaymentMetadata = async () => {
    try {
      const [methods, statuses] = await Promise.all([
        paymentService.getPaymentMethods(),
        paymentService.getPaymentStatuses(),
      ]);
      setPaymentMethods(methods);
      setPaymentStatuses(statuses);
    } catch (err) {
      console.error('Error loading payment metadata:', err);
      // Set default values if API fails
      setPaymentMethods([
        { value: 'CASH', label: 'Cash' },
        { value: 'CARD', label: 'Credit Card' },
        { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
        { value: 'CHECK', label: 'Check' },
      ]);
      setPaymentStatuses([
        { value: 'PENDING', label: 'Pending' },
        { value: 'PAID', label: 'Paid' },
        { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
        { value: 'REFUNDED', label: 'Refunded' },
        { value: 'FAILED', label: 'Failed' },
      ]);
    }
  };

  const refreshPayments = async () => {
    if (!workOrderId) return;

    try {
      setLoading(true);
      setError(null);
      const workOrderPayments = await paymentService.getWorkOrderPayments(workOrderId);
      setPayments(workOrderPayments);
    } catch (err) {
      console.error('Error refreshing payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const refreshPaymentSummary = async (woId: string) => {
    try {
      const summary = await paymentService.getWorkOrderPaymentSummary(woId);
      setPaymentSummary(summary);
    } catch (err) {
      console.error('Error refreshing payment summary:', err);
      // Don't set error for summary as it's not critical
    }
  };

  const createManualPayment = async (paymentData: any): Promise<Payment> => {
    try {
      setLoading(true);
      setError(null);
      const newPayment = await paymentService.createManualPayment(paymentData);

      // Refresh payments and summary after creating payment
      if (workOrderId) {
        await refreshPayments();
        await refreshPaymentSummary(workOrderId);
      }

      return newPayment;
    } catch (err) {
      console.error('Error creating payment:', err);
      setError('Failed to create payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (paymentId: string, paymentImage?: string): Promise<Payment> => {
    try {
      setLoading(true);
      setError(null);
      const updatedPayment = await paymentService.markAsPaid(paymentId, paymentImage);

      // Refresh payments and summary after marking as paid
      if (workOrderId) {
        await refreshPayments();
        await refreshPaymentSummary(workOrderId);
      }

      return updatedPayment;
    } catch (err) {
      console.error('Error marking payment as paid:', err);
      setError('Failed to mark payment as paid');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    paymentSummary,
    paymentMethods,
    paymentStatuses,
    loading,
    error,
    refreshPayments,
    refreshPaymentSummary,
    createManualPayment,
    markAsPaid,
  };
};