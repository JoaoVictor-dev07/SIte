import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DraggableAttributeBarProps {
  value: number;
  maxValue?: number;
  label: string;
  type?: 'default' | 'health' | 'mana';
  className?: string;
  onChange: (value: number) => void;
  showBonus?: boolean;
}

export const DraggableAttributeBar: React.FC<DraggableAttributeBarProps> = ({
  value,
  maxValue = 100,
  label,
  type = 'default',
  className,
  onChange,
  showBonus = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  
  const percentage = Math.min((value / maxValue) * 100, 100);
  const bonus = Math.floor(value / 5);
  
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!barRef.current) return;
    
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = Math.round((newPercentage / 100) * maxValue);
    
    onChange(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

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
              {formatBonus(bonus)}
            </span>
          )}
        </div>
      </div>
      
      <div 
        ref={barRef}
        className={cn(
          "attribute-bar cursor-pointer select-none",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
      >
        <div 
          className={cn("attribute-bar-fill transition-all duration-150", getBarColor())}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Visual segments for better readability */}
        <div className="absolute inset-0 flex pointer-events-none">
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