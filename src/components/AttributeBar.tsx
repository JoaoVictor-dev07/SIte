import React from 'react';
import { cn } from '@/lib/utils';

interface AttributeBarProps {
  value: number;
  maxValue?: number;
  label: string;
  type?: 'default' | 'health' | 'mana';
  className?: string;
  showBonus?: boolean;
  bonus?: number;
}

export const AttributeBar: React.FC<AttributeBarProps> = ({
  value,
  maxValue = 100,
  label,
  type = 'default',
  className,
  showBonus = false,
  bonus = 0
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getBarColor = () => {
    switch (type) {
      case 'health':
        return 'attribute-bar-health';
      case 'mana':
        return 'attribute-bar-mana';
      default:
        return 'attribute-bar-fill';
    }
  };

  const formatBonus = (bonus: number) => {
    if (bonus === 0) return '';
    return bonus > 0 ? `(+${bonus})` : `(${bonus})`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-cinzel text-starlight">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-divine-gold">
            {value}
          </span>
          {showBonus && bonus !== 0 && (
            <span className="text-sm font-semibold text-celestial-blue"> {/* Increased modifier size */}
              {formatBonus(Math.floor(value / 5))}
            </span>
          )}
        </div>
      </div>
      
      <div className="attribute-bar">
        <div 
          className={cn("attribute-bar-fill", getBarColor())}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Visual segments for better readability */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }, (_, i) => (
            <div 
              key={i}
              className="flex-1 border-r border-mystical-purple-deep/30 last:border-r-0"
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-papyrus-aged">
        <span>0</span>
        <span>{maxValue}</span>
      </div>
    </div>
  );
};