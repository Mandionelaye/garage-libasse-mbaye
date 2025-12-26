import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Printer } from 'lucide-react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Invoice } from '../types';
import { Card, CardContent } from '../components/UI/Card';
import { formatCurrencyCFA } from '../utils/numberToWords';
import { InvoicePDFDownloadLink } from '../components/PDF/InvoicePDF';
import { format } from 'date-fns';

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'invoices', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setInvoice({
            id: docSnap.id,
            ...data,
            date: typeof data.date === 'string'
                          ? new Date(data.date)
                          : data.date && 'toDate' in data.date
                          ? data.date.toDate()
                          : (data.date as Date),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Invoice);
        } else {
          setError('Facture non trouvée');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError('Erreur lors du chargement de la facture');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await deleteDoc(doc(db, 'invoices', id));
        navigate('/');
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Erreur lors de la suppression de la facture');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600">{error || 'Facture introuvable'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="mb-6 no-print">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Retour au tableau de bord</span>
              <span className="md:hidden">Retour</span>
            </button>
            
            <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
              <button
                onClick={handlePrint}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimer</span>
              </button>
              
              <button
                onClick={() => navigate(`/invoices/${id}/edit`)}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Modifier</span>
              </button>
              
              <div onClick={(e) => e.stopPropagation()}>
                <InvoicePDFDownloadLink invoice={invoice} />
              </div>
              
              <button
                onClick={handleDelete}
                className="px-3 py-2 border border-red-300 rounded hover:bg-red-50 inline-flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Invoice */}
        <Card className="shadow-lg bg-white relative overflow-hidden">
          <CardContent className="p-0">
            {/* Top Gray Diagonal Banner */}
            <div className="relative bg-white">
              {/* Header Content */}
              <div className="relative z-10 px-4 sm:px-8 pt-8 pb-6">
                <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-4">
                  {/* Left: FACTURE Title */}
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">FACTURE</h1>
                    <p className="text-sm text-black">N° : {invoice.invoiceNumber}</p>
                    <p className="text-sm text-black">
                      Date : {format(typeof invoice.date === 'string'
                          ? new Date(invoice.date)
                          : invoice.date && 'toDate' in invoice.date
                          ? invoice.date.toDate()
                          : (invoice.date as Date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  
                  {/* Right: Logo and Company Info */}
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="inline-block mb-2">
                       <img src="/garage-logo.png" alt="lm" className='w-32 sm:w-40' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-8 py-6">
              {/* FACTURE Title Box */}
              <div className="border-4 border-black rounded-lg p-2 sm:p-3 text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">FACTURE</h2>
              </div>

              {/* Client Info */}
              <div className="mb-6">
                <p className="text-base"><span className="font-bold">Client :</span> {invoice.clientName}</p>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                {/* Mobile View */}
                <div className="md:hidden border border-gray-400 rounded-lg overflow-hidden">
                  {invoice.items.map((item, index) => (
                    <div key={index} className="bg-gray-100 p-3 border-b border-gray-400 last:border-b-0">
                      <p className="font-bold">{item.designation}</p>
                      <div className="grid grid-cols-2 gap-x-2 mt-1 text-sm">
                        <p className="text-gray-600">QTE</p><p className="text-right">{item.quantity.toString().padStart(2, '0')}</p>
                        <p className="text-gray-600">P.U.</p><p className="text-right">{formatCurrencyCFA(item.unitPrice).replace(' CFA', '')}</p>
                        <p className="text-gray-600">Montant</p><p className="text-right">{formatCurrencyCFA(item.amount).replace(' CFA', '')} <sup>F</sup></p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <table className="hidden md:table w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 px-3 py-2 text-left font-bold text-sm">QTE</th>
                      <th className="border border-gray-400 px-3 py-2 text-left font-bold text-sm">DESIGNATION</th>
                      <th className="border border-gray-400 px-3 py-2 text-left font-bold text-sm">PRIX UNIT</th>
                      <th className="border border-gray-400 px-3 py-2 text-right font-bold text-sm">MONTANT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="bg-gray-100">
                        <td className="border border-gray-400 px-3 py-2 text-sm">{item.quantity.toString().padStart(2, '0')}</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{item.designation}</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{formatCurrencyCFA(item.unitPrice).replace(' CFA', '')}</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm text-right">{formatCurrencyCFA(item.amount).replace(' CFA', '')} <sup>F</sup></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-full md:w-1/2 lg:w-2/5 space-y-2">
                  {(invoice.deliveryFees > 0 || invoice.laborCost > 0) && (
                    <div className="border-b border-gray-300 pb-2">
                      {invoice.deliveryFees > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Frais de livraison</span>
                          <span>{formatCurrencyCFA(invoice.deliveryFees)}</span>
                        </div>
                      )}
                      {invoice.laborCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Main d'œuvre</span>
                          <span>{formatCurrencyCFA(invoice.laborCost)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold">TOTAL</span>
                    <span className="text-lg font-bold">{formatCurrencyCFA(invoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Total in Words */}
              <div className="mb-6">
                <p className="text-sm">
                  La présente facture est arrêtée à la somme de : <span className="font-bold">{invoice.totalInWords}</span>
                </p>
              </div>

              {/* Payment Terms */}
              <div className="mb-8">
                <p className="text-sm font-bold text-red-600 mb-1">Conditions et modalités de paiement</p>
                <p className="text-sm">Le paiement est effectué en espèces</p>
              </div>
            </div>

            {/* Bottom Gray Diagonal Section */}
            {/* <div className="relative h-48 bg-white overflow-hidden">
              <div className="absolute bottom-0 right-0 w-full h-full bg-gray-400 origin-bottom-right transform skew-y-12"></div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewInvoice;