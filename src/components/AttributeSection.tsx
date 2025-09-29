import React from 'react';
import { AttributeBar } from './AttributeBar';
import { DraggableAttributeBar } from './DraggableAttributeBar';
import { DivineInput } from './DivineInput';
import { CharacterData } from '@/hooks/useCharacterSheet';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AttributeSectionProps {
  title: string;
  icon: string;
  attributes: Array<{
    key: keyof CharacterData;
    label: string;
    icon: string;
  }>;
  characterData: CharacterData;
  onAttributeChange: (key: keyof CharacterData, value: number) => void;
  type?: 'primary' | 'skills' | 'health';
  useDraggable?: boolean;
}

export const AttributeSection: React.FC<AttributeSectionProps> = ({
  title,
  icon,
  attributes,
  characterData,
  onAttributeChange,
  type = 'primary',
  useDraggable = false
}) => {
  const handleIncrement = (key: keyof CharacterData) => {
    const currentValue = characterData[key] as number;
    const newValue = Math.min(currentValue + 1, 100);
    onAttributeChange(key, newValue);
  };

  const handleDecrement = (key: keyof CharacterData) => {
    const currentValue = characterData[key] as number;
    const newValue = Math.max(currentValue - 1, 0);
    onAttributeChange(key, newValue);
  };

  const handleInputChange = (key: keyof CharacterData, value: string) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    onAttributeChange(key, numValue);
  };

  const getBarType = (key: keyof CharacterData) => {
    if (key === 'health') return 'health';
    if (key === 'sanity' || key === 'magic') return 'mana';
    return 'default';
  };

  return (
    <div className="card-divine">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl font-cinzel font-bold text-divine-gold">
          {title}
        </h2>
      </div>

      <div className={cn(
        "grid gap-6",
        type === 'health' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {attributes.map(({ key, label, icon }) => (
          <div key={key} className="space-y-3">
            {/* Mobile-first controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-cinzel text-starlight font-semibold">
                  {label}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDecrement(key)}
                  className="h-8 w-8 p-0 border-mystical-purple-deep hover:bg-mystical-purple-deep/20"
                >
                  <Minus className="h-4 w-4 text-divine-gold" />
                </Button>
                
                <DivineInput
                  value={characterData[key] as number}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  variant="numeric"
                  className="w-16 h-8 text-center px-2 py-1"
                  min="0"
                  max="100"
                  type="number"
                  label=""
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleIncrement(key)}
                  className="h-8 w-8 p-0 border-mystical-purple-deep hover:bg-mystical-purple-deep/20"
                >
                  <Plus className="h-4 w-4 text-divine-gold" />
                </Button>
              </div>
            </div>

            {/* Visual bar - draggable or regular */}
            {useDraggable ? (
              <DraggableAttributeBar
                value={characterData[key] as number}
                label=""
                type={getBarType(key)}
                showBonus={type === 'primary' || type === 'skills'}
                onChange={(value) => onAttributeChange(key, value)}
              />
            ) : (
              <AttributeBar
                value={characterData[key] as number}
                label=""
                type={getBarType(key)}
                showBonus={type === 'primary' || type === 'skills'}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};