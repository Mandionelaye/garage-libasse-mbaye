import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { RecentInvoices } from '../components/Dashboard/RecentInvoices';
import { DateRangePicker } from '../components/Dashboard/DateRangePicker';
import { useInvoices, useDashboardStats } from '../hooks/useInvoices';
import { DateRange } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const navigate = useNavigate();
  
  const { stats, loading: statsLoading } = useDashboardStats(dateRange);
  const { invoices, loading: invoicesLoading } = useInvoices(dateRange);

  const handleViewInvoice = (invoice: any) => {
    navigate(`/invoices/${invoice.id}`);
  };

  const handleEditInvoice = (invoice: any) => {
    navigate(`/invoices/${invoice.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-6 text-gray-900 sm:truncate">
                Tableau de bord
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Vue d'ensemble de votre activité de facturation
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
              <DateRangePicker onDateChange={setDateRange} />
              <button
                type="button"
                className="btn btn-primary inline-flex items-center gap-2"
                onClick={() => navigate('/invoices/create')}
              >
                <Plus className="w-4 h-4" />
                Nouvelle facture
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards
            totalInvoices={stats.totalInvoices}
            totalRevenue={stats.totalRevenue}
            totalClients={stats.totalClients} // À implémenter avec useClients
            loading={statsLoading}
          />
        </div>

        {/* Recent Invoices */}
        <RecentInvoices
          invoices={invoices.slice(0, 5)} // Limiter aux 5 dernières
          loading={invoicesLoading}
          onViewInvoice={handleViewInvoice}
          onEditInvoice={handleEditInvoice}
        />
      </div>
    </div>
  );
};

export default Dashboard;