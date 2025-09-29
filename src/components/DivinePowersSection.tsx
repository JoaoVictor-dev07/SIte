import React, { useState } from 'react';
import { DivinePower } from '@/hooks/useCharacterSheet';
import { DivinePowerCard } from '@/components/DivinePowerCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DivinePowersSectionProps {
  powers: DivinePower[];
  onUpdatePowers: (powers: DivinePower[]) => void;
}

export const DivinePowersSection: React.FC<DivinePowersSectionProps> = ({
  powers,
  onUpdatePowers
}) => {
  const [nextId, setNextId] = useState(powers.length + 1);

  const addNewPower = () => {
    const newPower: DivinePower = {
      id: `power_${nextId}`,
      name: '',
      cost: 0,
      damage: '',
      type: '',
      description: ''
    };
    
    onUpdatePowers([...powers, newPower]);
    setNextId(prev => prev + 1);
  };

  const updatePower = (updatedPower: DivinePower) => {
    const updatedPowers = powers.map(power => 
      power.id === updatedPower.id ? updatedPower : power
    );
    onUpdatePowers(updatedPowers);
  };

  const deletePower = (id: string) => {
    const filteredPowers = powers.filter(power => power.id !== id);
    onUpdatePowers(filteredPowers);
  };

  return (
    <div className="card-divine">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-cinzel font-bold text-divine-gold">
            Poderes Divinos
          </h2>
        </div>
        
        <Button variant="divine" onClick={addNewPower}>
          <Plus className="h-4 w-4" />
          Novo Poder
        </Button>
      </div>

      <div className="space-y-4">
        {powers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-papyrus-aged font-cinzel">
              Nenhum poder divino foi concedido ainda.
            </p>
            <p className="text-sm text-starlight mt-2">
              Clique em "Novo Poder" para despertar suas habilidades místicas.
            </p>
          </div>
        ) : (
          powers.map(power => (
            <DivinePowerCard
              key={power.id}
              power={power}
              onUpdate={updatePower}
              onDelete={deletePower}
            />
          ))
        )}
      </div>
    </div>
  );
};