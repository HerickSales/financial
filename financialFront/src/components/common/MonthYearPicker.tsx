import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR);

interface MonthYearPickerProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  className?: string;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  className = '',
}) => {
  const selectedDate = new Date(selectedYear, selectedMonth, 1);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onMonthChange(date.getMonth());
      onYearChange(date.getFullYear());
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:border-gray-400 transition-base">
        <Calendar size={20} className="text-gray-500" />
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          locale="pt-BR"
          onKeyDown={(e) => e.preventDefault()}
          className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none cursor-pointer w-40"
          calendarClassName="shadow-lg"
        />
      </div>
    </div>
  );
};

export default MonthYearPicker;
