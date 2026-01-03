import { Calendar } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { useRef } from 'react';

const presets = [
  { label: '최근 7일', days: 7 },
  { label: '최근 30일', days: 30 },
  { label: '최근 90일', days: 90 },
];

const subDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

export function DateRangePicker() {
  const { dateRange, setDateRange } = useFilterStore();
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setDateRange({ start, end });
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={20} className="text-emerald-600" />
          <span className="font-medium">기간 선택:</span>
        </div>
        
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset.days}
              onClick={() => handlePresetClick(preset.days)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
          <div 
            className="relative cursor-pointer"
            onClick={() => startDateRef.current?.click()}
          >
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              ref={startDateRef}
              type="date"
              value={formatDate(dateRange.start)}
              onChange={(e) => {
                const newStart = new Date(e.target.value);
                setDateRange({ ...dateRange, start: newStart });
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            />
          </div>
          <span className="text-gray-400">~</span>
          <div 
            className="relative cursor-pointer"
            onClick={() => endDateRef.current?.click()}
          >
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              ref={endDateRef}
              type="date"
              value={formatDate(dateRange.end)}
              onChange={(e) => {
                const newEnd = new Date(e.target.value);
                setDateRange({ ...dateRange, end: newEnd });
              }}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}