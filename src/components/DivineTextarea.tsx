import React from 'react';
import { cn } from '@/lib/utils';

interface DivineTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: string;
  error?: string;
}

export const DivineTextarea: React.FC<DivineTextareaProps> = ({
  label,
  icon,
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
      
      <textarea
        {...props}
        className={cn(
          "input-divine min-h-[100px] resize-y",
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