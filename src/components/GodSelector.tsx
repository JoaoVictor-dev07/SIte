import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const gods = [
  { id: 'helio', name: 'Hélio', player: 'Nescau', symbol: '☀️', description: 'Deus do Sol' },
  { id: 'artemis', name: 'Ártemis', player: 'Jão', symbol: '🏹', description: 'Deusa da Caça' },
  { id: 'hecate', name: 'Hécate', player: 'Azatoth', symbol: '🔮', description: 'Deusa da Magia' },
  { id: 'dionysus', name: 'Dionísio', player: 'Elf', symbol: '🍷', description: 'Deus do Vinho' },
  { id: 'demeter', name: 'Deméter', player: 'JV', symbol: '🌾', description: 'Deusa da Colheita' },
  { id: 'poseidon', name: 'Poseidon', player: 'Choko', symbol: '🌊', description: 'Deus dos Mares' },
];

export const GodSelector: React.FC<GodSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-divine-gold font-cinzel">
        🏛️ Divindade Patrona
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="input-divine h-12 text-base">
          <SelectValue placeholder="Escolha sua divindade..." />
        </SelectTrigger>
        <SelectContent className="bg-cosmic-night border-mystical-purple-bright">
          {gods.map((god) => (
            <SelectItem 
              key={god.id} 
              value={god.id}
              className="text-starlight hover:bg-mystical-purple-deep focus:bg-mystical-purple-deep cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{god.symbol}</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-divine-gold">{god.name}</span>
                  <span className="text-xs text-papyrus-aged">
                    {god.player} • {god.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};