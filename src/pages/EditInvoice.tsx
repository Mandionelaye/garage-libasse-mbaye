import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/UI/Card';
import { useInvoice, useInvoices } from '../hooks/useInvoices';
import { InvoiceFormData } from '../types';
import { formatCurrencyCFA } from '../utils/numberToWords';

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoice, loading: loadingInvoice } = useInvoice(id);
  const { updateInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      clientName: '',
      items: [
        { quantity: 1, designation: '', unitPrice: 0, amount: 0 },
      ],
      deliveryFees: 0,
      laborCost: 0,
    },
  });

  useEffect(() => {
    if (invoice) {
      reset({
        ...invoice,
        date:invoice.date.toString().split('T')[0],
      });
    }
  }, [invoice, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const deliveryFees = watch('deliveryFees') || 0;
  const laborCost = watch('laborCost') || 0;

  const calculateItemAmount = (index: number) => {
    const item = items[index];
    if (!item) return 0;
    return (item.quantity || 0) * (item.unitPrice || 0);
  };

  const subtotal = items.reduce((sum, _, index) => sum + calculateItemAmount(index), 0);
  const total = subtotal + deliveryFees + laborCost;

  const onSubmit = async (data: InvoiceFormData) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      
      const itemsWithAmounts = data.items.map(item => ({
        ...item,
        amount: item.quantity * item.unitPrice,
      }));
      
      const invoiceData = {
        ...data,
        items: itemsWithAmounts,
      };
      
      await updateInvoice(id, invoiceData);
      
      navigate(`/invoices/${id}`);
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Erreur lors de la mise à jour de la facture');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    append({ quantity: 1, designation: '', unitPrice: 0, amount: 0 });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (loadingInvoice) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/invoices/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la facture
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Modifier la facture</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Numéro de facture *</label>
                    <input
                      type="text"
                      {...register('invoiceNumber', { required: 'Numéro de facture requis' })}
                      className="input"
                      readOnly
                    />
                    {errors.invoiceNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="label">Date *</label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date requise' })}
                      className="input"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="label">Nom du client *</label>
                  <input
                    type="text"
                    {...register('clientName', { required: 'Nom du client requis' })}
                    className="input"
                    placeholder="Ex: Libasse"
                  />
                  {errors.clientName && (
                    <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Articles</h2>
                  <button
                    type="button"
                    onClick={addItem}
                    className="btn btn-outline inline-flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">QTE</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">DÉSIGNATION</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">PRIX UNIT</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">MONTANT</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => (
                        <tr key={field.id} className="border-b border-gray-100">
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="1"
                              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                              className="input w-16 text-center"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              {...register(`items.${index}.designation`)}
                              className="input w-full"
                              placeholder="Désignation de l'article"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min="0"
                              step="100"
                              {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                              className="input w-24"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-sm">
                            {formatCurrencyCFA(calculateItemAmount(index))}
                          </td>
                          <td className="py-2 px-3">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-1 text-red-400 hover:text-red-600"
                              disabled={fields.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Frais de livraison</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        {...register('deliveryFees', { valueAsNumber: true })}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="label">Main d'œuvre</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        {...register('laborCost', { valueAsNumber: true })}
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-700">Sous-total</span>
                        <span className="font-mono text-sm">{formatCurrencyCFA(subtotal)}</span>
                      </div>
                      
                      {deliveryFees > 0 && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-gray-700">Frais de livraison</span>
                          <span className="font-mono text-sm">{formatCurrencyCFA(deliveryFees)}</span>
                        </div>
                      )}
                      
                      {laborCost > 0 && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-gray-700">Main d'œuvre</span>
                          <span className="font-mono text-sm">{formatCurrencyCFA(laborCost)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center py-3 border-t border-gray-300">
                        <span className="text-lg font-bold text-gray-900">TOTAL</span>
                        <span className="text-lg font-bold font-mono">{formatCurrencyCFA(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/invoices/${id}`)}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Mise à jour...' : 'Mettre à jour la facture'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInvoice;