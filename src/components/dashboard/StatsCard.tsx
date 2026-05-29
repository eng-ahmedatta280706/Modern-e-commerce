import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;       // percentage change vs last period
  changeLabel?: string;  // e.g. "vs last month"
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';
  prefix?: string;
  suffix?: string;
}

const colorMap = {
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  red:    'bg-red-50 text-red-600',
  teal:   'bg-teal-50 text-teal-600',
};

const StatsCard: React.FC<StatsCardProps> = ({
  title, value, icon, change, changeLabel = 'vs last month',
  color = 'blue', prefix = '', suffix = '',
}) => {
  const positive = (change ?? 0) >= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-2">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          {positive ? (
            <TrendingUp size={13} className="text-green-500" />
          ) : (
            <TrendingDown size={13} className="text-red-500" />
          )}
          <span className={positive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {positive ? '+' : ''}{change}%
          </span>
          <span className="text-gray-400">{changeLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
