import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'success' | 'danger' | 'info' | 'warning' | 'neutral';
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'neutral'
}) => {
  const colorStyles = {
    success: 'text-success',
    danger: 'text-danger',
    info: 'text-info',
    warning: 'text-warning',
    neutral: 'text-gray-600'
  };

  const bgColorStyles = {
    success: 'bg-green-100',
    danger: 'bg-red-100',
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    neutral: 'bg-gray-100'
  };

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className={`text-3xl font-bold ${colorStyles[color]} mb-1`}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
              {trend === 'up' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${bgColorStyles[color]}`}>
            <div className={colorStyles[color]}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default KpiCard;
