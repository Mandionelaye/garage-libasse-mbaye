import React from 'react';
import { Edit, Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Invoice } from '../../types';
import { formatCurrencyCFA } from '../../utils/numberToWords';
import { InvoicePDFDownloadLink } from '../PDF/InvoicePDF';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecentInvoicesProps {
  invoices: Invoice[];
  loading?: boolean;
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
}

export const RecentInvoices: React.FC<RecentInvoicesProps> = ({
  invoices,
  loading = false,
  onViewInvoice,
  onEditInvoice,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Dernières Factures</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Dernières Factures</h2>
          <span className="text-sm text-gray-500">
            {invoices.length} facture{invoices.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucune facture trouvée</p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      Facture #{invoice.invoiceNumber}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.total > 50000
                          ? 'bg-green-100 text-green-800'
                          : invoice.total > 20000
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {formatCurrencyCFA(invoice.total)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600 truncate">
                      {invoice.clientName}
                    </span>
                    <span className="text-xs text-gray-400">
                     {format(
                        typeof invoice.date === 'string'
                          ? new Date(invoice.date)
                          : invoice.date && 'toDate' in invoice.date
                          ? invoice.date.toDate()
                          : (invoice.date as Date),
                        'dd MMM yyyy',
                        { locale: fr }
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewInvoice(invoice)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditInvoice(invoice)}
                    className="p-2 text-yellow-400 hover:text-yellow-600 hover:bg-yellow-100 rounded-md transition-colors"
                    title="Editer la facture"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <div onClick={(e) => e.stopPropagation()}>
                    <InvoicePDFDownloadLink invoice={invoice} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};