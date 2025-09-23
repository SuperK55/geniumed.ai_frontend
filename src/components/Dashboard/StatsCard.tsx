import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'destructive';
}

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          card: 'border-primary/20 bg-primary/5',
          icon: 'bg-primary text-white',
          value: 'text-primary'
        };
      case 'secondary':
        return {
          card: 'border-secondary/20 bg-secondary/5',
          icon: 'bg-secondary text-white',
          value: 'text-secondary'
        };
      case 'accent':
        return {
          card: 'border-accent/20 bg-accent/5',
          icon: 'bg-accent text-white',
          value: 'text-accent'
        };
      case 'success':
        return {
          card: 'border-success/20 bg-success/5',
          icon: 'bg-success text-white',
          value: 'text-success'
        };
      case 'destructive':
        return {
          card: 'border-red-200 bg-red-50',
          icon: 'bg-red-500 text-white',
          value: 'text-red-600'
        };
      default:
        return {
          card: 'border-gray-200 bg-white',
          icon: 'bg-gray-100 text-gray-600',
          value: 'text-gray-900'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={`${styles.card} shadow-sm hover:shadow-md transition-all duration-200 rounded-xl`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className={`text-2xl font-bold ${styles.value}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </h3>
              {trend && (
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-lg ${
                    trend.isPositive 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-red-700 bg-red-100'
                  }`}
                >
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${styles.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;