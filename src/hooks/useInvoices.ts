import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Invoice, InvoiceFormData, DateRange } from '../types';
import { numberToWordsCFA } from '../utils/numberToWords';

export function useInvoices(dateRange?: DateRange) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q = query(
      collection(db, 'invoices'),
      orderBy('createdAt', 'desc')
    );

    if (dateRange?.startDate && dateRange?.endDate) {
      // format date to yyyy-mm-dd
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      q = query(
        collection(db, 'invoices'),
        where('date', '>=', startDate.toISOString().split('T')[0]),
        where('date', '<=', endDate.toISOString().split('T')[0]),
        orderBy('date', 'desc')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const invoicesData: Invoice[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          invoicesData.push({
            id: doc.id,
            ...data,
            date: data.date || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Invoice);
        });
        setInvoices(invoicesData);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dateRange]);

  const createInvoice = async (data: InvoiceFormData): Promise<string> => {
    try {
      const total = calculateTotal(data);
      const totalInWords = numberToWordsCFA(total);
      
      const docRef = await addDoc(collection(db, 'invoices'), {
        ...data,
        total,
        totalInWords,
        subtotal: calculateSubtotal(data),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  };

  const updateInvoice = async (id: string, data: Partial<InvoiceFormData>): Promise<void> => {
    try {
      const updates: any = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      if ('items' in data || 'deliveryFees' in data || 'laborCost' in data) {
        const currentInvoice = invoices.find(inv => inv.id === id);
        if (currentInvoice) {
          const updatedData = {
            ...currentInvoice,
            ...data,
          }as InvoiceFormData;
          updates.total = calculateTotal(updatedData);
          updates.totalInWords = numberToWordsCFA(updates.total);
          updates.subtotal = calculateSubtotal(updatedData);
        }
      }

      await updateDoc(doc(db, 'invoices', id), updates);
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  };

  const deleteInvoice = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'invoices', id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  };

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  };
}


export function useInvoice(id?: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'invoices', id);

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setInvoice({
            id: doc.id,
            ...data,
            date: data.date,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as Invoice);
        } else {
          setError(new Error('Invoice not found'));
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  return { invoice, loading, error };
}

export function useDashboardStats(dateRange?: DateRange) {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    recentInvoices: [] as Invoice[],
    totalClients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let q = query(
          collection(db, 'invoices'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );

        if (dateRange?.startDate && dateRange?.endDate) {
            const startDate = new Date(dateRange.startDate);
          const endDate = new Date(dateRange.endDate);
      
          q = query(
            collection(db, 'invoices'),
            where('date', '>=', startDate.toISOString().split('T')[0]),
            where('date', '<=', endDate.toISOString().split('T')[0]),
            orderBy('date', 'desc')
          );
        }

        const invoicesSnapshot = await getCountFromServer(collection(db, 'invoices'));
        const totalInvoices = invoicesSnapshot.data().count;

         await new Promise<Invoice[]>((resolve, reject) => {
          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const invoicesData: Invoice[] = [];
              let totalRevenue = 0;
              
              snapshot.forEach((doc) => {
                const data = doc.data();
                const invoice = {
                  id: doc.id,
                  ...data,
                  date: data.date || new Date(),
                  createdAt: data.createdAt?.toDate() || new Date(),
                  updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Invoice;
                
                invoicesData.push(invoice);
                totalRevenue += invoice.total;
              });

              resolve(invoicesData);

              // calcule le nombre de client en comparend les id des clients dans les factures
              const uniqueClients = new Set(invoicesData.map(inv => inv.clientName));
              const totalClients = uniqueClients.size;

              setStats({
                totalClients,
                totalInvoices,
                totalRevenue,
                recentInvoices: invoicesData,
              });
            },
            reject
          );

          return unsubscribe;
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  return { stats, loading };
}

function calculateSubtotal(data: InvoiceFormData): number {
  const itemsTotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  return itemsTotal;
}

function calculateTotal(data: InvoiceFormData): number {
  const subtotal = calculateSubtotal(data);
  return subtotal + (data.deliveryFees || 0) + (data.laborCost || 0);
}