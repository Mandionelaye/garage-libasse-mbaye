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
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              
              <button
                onClick={() => navigate(`/invoices/${id}/edit`)}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
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
              {/* <div className="absolute top-0 left-0 w-full h-32 bg-gray-400 origin-top-left transform -skew-y-3"></div> */}
              
              {/* Header Content */}
              <div className="relative z-10 px-8 pt-8 pb-6">
                <div className="flex items-start justify-between">
                  {/* Left: FACTURE Title */}
                  <div>
                    <h1 className="text-4xl font-bold text-black mb-2">FACTURE</h1>
                    <p className="text-sm text-black">N° de facture : {invoice.invoiceNumber}</p>
                    <p className="text-sm text-black">
                      Date de facturation : {format(typeof invoice.date === 'string'
                          ? new Date(invoice.date)
                          : invoice.date && 'toDate' in invoice.date
                          ? invoice.date.toDate()
                          : (invoice.date as Date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  
                  {/* Right: Logo and Company Info */}
                  <div className="text-right">
                    <div className="inline-block mb-2">
                       <img src="/garage-logo.png" alt="lm" className='w-40' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-6">
              {/* FACTURE Title Box */}
              <div className="border-4 border-black rounded-lg p-3 text-center mb-6">
                <h2 className="text-2xl font-bold">FACTURE</h2>
              </div>

              {/* Client Info */}
              <div className="mb-6">
                <p className="text-base"><span className="font-bold">Client :</span> {invoice.clientName}</p>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 px-3 py-2 text-left font-bold text-sm">QTE</th>
                      <th className="border border-gray-400 px-3 py-2 text-left font-bold text-sm">DESIGNATION</th>
                      <th className="border border-gray-400 px-3 py-2 text-left font-bold text-sm">PRIX UNIT</th>
                      <th className="border border-gray-400 px-3 py-2 text-left font-bold text-sm">MONTANT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="bg-gray-100">
                        <td className="border border-gray-400 px-3 py-2 text-sm">{item.quantity.toString().padStart(2, '0')}</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{item.designation}</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{formatCurrencyCFA(item.unitPrice).replace(' CFA', '')}</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{formatCurrencyCFA(item.amount).replace(' CFA', '')} <sup>F</sup></td>
                      </tr>
                    ))}
                    
                    {invoice.deliveryFees > 0 && (
                      <tr className="bg-gray-100">
                        <td className="border border-gray-400 px-3 py-2 text-sm"></td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">Frais de livraison</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{formatCurrencyCFA(invoice.deliveryFees).replace(' CFA', '')}</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{formatCurrencyCFA(invoice.deliveryFees).replace(' CFA', '')} <sup>F</sup></td>
                      </tr>
                    )}
                    
                    {invoice.laborCost > 0 && (
                      <tr className="bg-gray-100">
                        <td className="border border-gray-400 px-3 py-2 text-sm" colSpan={2}>Main d'œuvre</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{formatCurrencyCFA(invoice.laborCost).replace(' CFA', '')}</td>
                        <td className="border border-gray-400 px-3 py-2 text-sm">{formatCurrencyCFA(invoice.laborCost).replace(' CFA', '')} <sup>F</sup></td>
                      </tr>
                    )}
                    
                    {/* Empty rows for spacing */}
                    <tr className="bg-gray-100">
                      <td className="border border-gray-400 px-3 py-2 text-sm h-8" colSpan={4}></td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border border-gray-400 px-3 py-2 text-sm h-8" colSpan={4}></td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border border-gray-400 px-3 py-2 text-sm h-8" colSpan={4}></td>
                    </tr>
                    
                    {/* Total Row */}
                    <tr className="bg-gray-100">
                      <td className="border border-gray-400 px-3 py-2 text-sm" colSpan={3}></td>
                      <td className="border border-gray-400 px-3 py-2 text-sm font-bold">TOTAL</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border border-gray-400 px-3 py-2 text-sm" colSpan={3}></td>
                      <td className="border border-gray-400 px-3 py-2 text-base font-bold">{formatCurrencyCFA(invoice.total).replace('F CFA', '')} F CFA</td>
                    </tr>
                  </tbody>
                </table>
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