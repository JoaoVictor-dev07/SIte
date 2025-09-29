import React, { useState } from 'react';
import { DivinePower } from '@/hooks/useCharacterSheet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DivineInput } from '@/components/DivineInput';
import { DivineTextarea } from '@/components/DivineTextarea';
import { Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DivinePowerCardProps {
  power: DivinePower;
  onUpdate: (power: DivinePower) => void;
  onDelete: (id: string) => void;
}

export const DivinePowerCard: React.FC<DivinePowerCardProps> = ({
  power,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<DivinePower>(power);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(power);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <Card className="p-4 bg-cosmic-night-light border-mystical-purple-deep">
        <div className="space-y-4">
          <DivineInput
            label="Nome do Poder"
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Raio de Zeus"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DivineInput
              label="Custo"
              type="number"
              variant="numeric"
              value={editData.cost}
              onChange={(e) => setEditData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
              placeholder="Ex: 10"
            />
            
            <DivineInput
              label="Dano"
              value={editData.damage}
              onChange={(e) => setEditData(prev => ({ ...prev, damage: e.target.value }))}
              placeholder="Ex: 2d6 + 5"
            />
            
            <DivineInput
              label="Tipo"
              value={editData.type}
              onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
              placeholder="Ex: Ataque, Defesa, Buff"
            />
          </div>
          
          <DivineTextarea
            label="Descrição"
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o poder e seus efeitos..."
            rows={3}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-cinzel text-starlight">Imagem do Poder</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </Button>
              {editData.image && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setEditData(prev => ({ ...prev, image: undefined }))}
                >
                  Remover
                </Button>
              )}
            </div>
            {editData.image && (
              <img 
                src={editData.image} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded-lg border border-mystical-purple-deep"
              />
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="divine" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Salvar
            </Button>
            <Button variant="cosmic" onClick={handleCancel}>
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "p-4 bg-cosmic-night-light border-mystical-purple-deep transition-all duration-300",
      "hover:border-divine-gold/50 hover:shadow-lg hover:shadow-divine-gold/20"
    )}>
      <div className="flex items-start gap-4">
        {power.image && (
          <img 
            src={power.image} 
            alt={power.name}
            className="w-16 h-16 object-cover rounded-lg border border-mystical-purple-deep flex-shrink-0"
          />
        )}
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel font-bold text-divine-gold">
              {power.name}
            </h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 text-celestial-blue" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(power.id)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-papyrus-aged">Custo:</span>
              <span className="text-celestial-blue ml-2">{power.cost}</span>
            </div>
            {power.damage && (
              <div>
                <span className="text-papyrus-aged">Dano:</span>
                <span className="text-red-400 ml-2">{power.damage}</span>
              </div>
            )}
            <div>
              <span className="text-papyrus-aged">Tipo:</span>
              <span className="text-mystical-purple-bright ml-2">{power.type}</span>
            </div>
          </div>
          
          {power.description && (
            <p className="text-sm text-starlight">
              {power.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};