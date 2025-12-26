import { Timestamp } from 'firebase/firestore';

export interface InvoiceItem {
  id: string;
  quantity: number;
  designation: string;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date | Timestamp;
  clientName: string;
  items: InvoiceItem[];
  deliveryFees: number;
  laborCost: number;
  subtotal: number;
  total: number;
  totalInWords: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalInvoices: number;
  totalAmount: number;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  recentInvoices: Invoice[];
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  items: Omit<InvoiceItem, 'id'>[];
  deliveryFees: number;
  laborCost: number;
}