import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/UI/Card';
import { useInvoices } from '../hooks/useInvoices';
import { InvoiceFormData } from '../types';
import { formatCurrencyCFA } from '../utils/numberToWords';

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { createInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const deliveryFees = watch('deliveryFees') || 0;
  const laborCost = watch('laborCost') || 0;

  // Calculer les totaux automatiquement
  const calculateItemAmount = (index: number) => {
    const item = items[index];
    if (!item) return 0;
    return (item.quantity || 0) * (item.unitPrice || 0);
  };

  const subtotal = items.reduce((sum, _, index) => sum + calculateItemAmount(index), 0);
  const total = subtotal + deliveryFees + laborCost;

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsSubmitting(true);
      
      // Calculer les montants des items
      const itemsWithAmounts = data.items.map(item => ({
        ...item,
        amount: item.quantity * item.unitPrice,
      }));
      
      const invoiceData = {
        ...data,
        items: itemsWithAmounts,
      };
      
      const invoiceId = await createInvoice(invoiceData);
      
      // Rediriger vers la page de visualisation
      navigate(`/invoices/${invoiceId}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Erreur lors de la création de la facture');
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

  // fonction qui genere et retourn le Numéro de facture
  const generateInvoiceNumber = () => {
    const today = new Date().toISOString().split('T')[0];
    return `F-${today}-${Math.floor(Math.random() * 1000)}`;
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle facture</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Informations générales */}
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
                      placeholder="Ex: 001"
                      value={generateInvoiceNumber()}
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

            {/* Articles */}
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
                <div className="space-y-4">
                  {/* Header for medium screens and up */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 border-b pb-2">
                    <h3 className="md:col-span-1 text-sm font-medium text-gray-700">QTE</h3>
                    <h3 className="md:col-span-5 text-sm font-medium text-gray-700">DÉSIGNATION</h3>
                    <h3 className="md:col-span-2 text-sm font-medium text-gray-700">PRIX UNIT</h3>
                    <h3 className="md:col-span-2 text-right text-sm font-medium text-gray-700">MONTANT</h3>
                    <div className="md:col-span-2"></div>
                  </div>

                  {/* Items */}
                  {fields.map((field, index) => (
                    <div key={field.id} className="rounded-lg border md:border-none p-4 md:p-0 md:grid md:grid-cols-12 md:gap-4 md:items-center space-y-2 md:space-y-0">
                      
                      {/* Mobile Header */}
                      <div className="md:hidden flex justify-between items-center">
                        <h4 className="font-semibold">Article {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-red-400 hover:text-red-600"
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-1">
                        <label className="text-xs text-gray-500 md:hidden">QTE</label>
                        <input
                          type="number"
                          min="1"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          className="input w-full text-center"
                        />
                      </div>

                      {/* Designation */}
                      <div className="md:col-span-5">
                        <label className="text-xs text-gray-500 md:hidden">DÉSIGNATION</label>
                        <textarea
                          {...register(`items.${index}.designation`)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="Désignation de l'article"
                          rows={2}
                        ></textarea>
                      </div>

                      {/* Unit Price */}
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-500 md:hidden">PRIX UNIT</label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                          className="input w-full"
                        />
                      </div>

                      {/* Amount */}
                      <div className="md:col-span-2 flex items-center justify-between md:block">
                        <label className="text-xs text-gray-500 md:hidden">MONTANT</label>
                        <p className="text-right font-mono text-sm w-full">
                          {formatCurrencyCFA(calculateItemAmount(index))}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <div className="hidden md:col-span-2 md:flex justify-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-red-400 hover:text-red-600"
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Frais supplémentaires */}
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

                {/* Total */}
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

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
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
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer la facture'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;