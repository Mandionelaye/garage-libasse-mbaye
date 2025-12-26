import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from '../../types';

interface DateRangePickerProps {
  onDateChange: (dateRange: DateRange) => void;
  initialRange?: DateRange;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateChange,
  initialRange = { startDate: null, endDate: null },
}) => {
  const [dateRange, setDateRange] = useState<DateRange>(initialRange);
  const [showPicker, setShowPicker] = useState(false);

  const handleStartDateChange = (date: string) => {
    const newRange = {
      ...dateRange,
      startDate: date ? new Date(date) : null,
    };
    setDateRange(newRange);
    onDateChange(newRange);
  };

  const handleEndDateChange = (date: string) => {
    const newRange = {
      ...dateRange,
      endDate: date ? new Date(date) : null,
    };
    setDateRange(newRange);
    onDateChange(newRange);
  };

  const clearDates = () => {
    const clearedRange = { startDate: null, endDate: null };
    setDateRange(clearedRange);
    onDateChange(clearedRange);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <Calendar className="w-4 h-4" />
        <span>
          {dateRange.startDate && dateRange.endDate
            ? `${format(dateRange.startDate, 'dd/MM/yyyy')} - ${format(dateRange.endDate, 'dd/MM/yyyy')}`
            : 'Sélectionner une période'}
        </span>
      </button>

      {showPicker && (
        <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-80">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="input w-full"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={clearDates}
                className="btn btn-outline flex-1"
              >
                Tout effacer
              </button>
              <button
                onClick={() => setShowPicker(false)}
                className="btn btn-primary flex-1"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};