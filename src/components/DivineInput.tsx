import React from 'react';
import { cn } from '@/lib/utils';

interface DivineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  variant?: 'default' | 'numeric';
  error?: string;
}

export const DivineInput: React.FC<DivineInputProps> = ({
  label,
  icon,
  variant = 'default',
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-divine-gold text-lg">
            {icon}
          </span>
        )}
        <label className="text-sm font-cinzel text-starlight font-semibold">
          {label}
        </label>
      </div>
      
      <input
        {...props}
        className={cn(
          "input-divine text-base", // Increased font size
          variant === 'numeric' && "text-center font-bold text-xl text-divine-gold", // Increased numeric text size
          error && "border-divine-blood focus:ring-divine-blood",
          className
        )}
      />
      
      {error && (
        <p className="text-xs text-divine-blood mt-1">
          {error}
        </p>
      )}
    </div>
  );
};