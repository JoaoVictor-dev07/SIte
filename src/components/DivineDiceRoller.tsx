import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiceRollResult {
  dice: number[];
  total: number;
  modifier: number;
  finalResult: number;
  type: string;
}

interface DivineDiceRollerProps {
  characterData: any;
}

export const DivineDiceRoller: React.FC<DivineDiceRollerProps> = ({ characterData }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<DiceRollResult | null>(null);
  const [rollHistory, setRollHistory] = useState<DiceRollResult[]>([]);

  const getDiceIcon = (value: number) => {
    switch (value) {
      case 1: return <Dice1 className="h-8 w-8" />;
      case 2: return <Dice2 className="h-8 w-8" />;
      case 3: return <Dice3 className="h-8 w-8" />;
      case 4: return <Dice4 className="h-8 w-8" />;
      case 5: return <Dice5 className="h-8 w-8" />;
      case 6: return <Dice6 className="h-8 w-8" />;
      default: return <Dice1 className="h-8 w-8" />;
    }
  };

  const rollDice = (sides: number, count: number, modifier: number, type: string) => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Simulate rolling animation
    setTimeout(() => {
      const dice = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
      const total = dice.reduce((sum, die) => sum + die, 0);
      const finalResult = total + modifier;
      
      const result: DiceRollResult = {
        dice,
        total,
        modifier,
        finalResult,
        type
      };
      
      setLastRoll(result);
      setRollHistory(prev => [result, ...prev.slice(0, 4)]);
      setIsRolling(false);
    }, 1000);
  };

  const commonRolls = [
    { name: 'Teste de Força', dice: 1, sides: 20, modifier: Math.floor(characterData.strength / 5) },
    { name: 'Teste de Destreza', dice: 1, sides: 20, modifier: Math.floor(characterData.dexterity / 5) },
    { name: 'Teste de Inteligência', dice: 1, sides: 20, modifier: Math.floor(characterData.intelligence / 5) },
    { name: 'Teste de Carisma', dice: 1, sides: 20, modifier: Math.floor(characterData.charisma / 5) },
    { name: 'Ataque Corpo a Corpo', dice: 1, sides: 20, modifier: Math.floor(characterData.meleeWeapons / 5) },
    { name: 'Poder Mágico', dice: 2, sides: 8, modifier: Math.floor(characterData.magic / 5) },
  ];

  return (
    <div className="card-divine">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🎲</span>
        <h2 className="text-xl font-cinzel font-bold text-divine-gold">
          Dados Divinos
        </h2>
        <Sparkles className="h-5 w-5 text-celestial-blue animate-pulse" />
      </div>

      {/* Dice Animation Area */}
      <div className="relative mb-6">
        <div className={cn(
          "flex justify-center items-center p-8 rounded-lg border-2 border-dashed transition-all duration-1000",
          isRolling 
            ? "border-divine-gold bg-divine-gold/10 animate-pulse" 
            : "border-mystical-purple-deep bg-cosmic-night-light/50"
        )}>
          {isRolling ? (
            <div className="flex gap-2 animate-bounce">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="text-divine-gold animate-spin">
                  {getDiceIcon(Math.floor(Math.random() * 6) + 1)}
                </div>
              ))}
            </div>
          ) : lastRoll ? (
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-4">
                {lastRoll.dice.map((die, i) => (
                  <div key={i} className="text-divine-gold">
                    {getDiceIcon(die)}
                  </div>
                ))}
              </div>
              <div className="text-2xl font-bold text-divine-gold mb-2">
                {lastRoll.finalResult}
              </div>
              <div className="text-sm text-celestial-blue">
                {lastRoll.type} • {lastRoll.total} + {lastRoll.modifier}
              </div>
            </div>
          ) : (
            <div className="text-center text-papyrus-aged">
              <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Invoque o poder dos dados divinos</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Roll Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {commonRolls.map((roll) => (
          <Button
            key={roll.name}
            variant="outline"
            size="sm"
            onClick={() => rollDice(roll.sides, roll.dice, roll.modifier, roll.name)}
            disabled={isRolling}
            className="text-xs p-2 h-auto flex flex-col gap-1 border-mystical-purple-deep hover:border-divine-gold hover:bg-divine-gold/10"
          >
            <span className="font-semibold">{roll.name}</span>
            <span className="text-celestial-blue">
              {roll.dice}d{roll.sides} + {roll.modifier}
            </span>
          </Button>
        ))}
      </div>

      {/* Custom Roll */}
      <div className="flex gap-2 mb-4">
        <Button
          variant="divine"
          onClick={() => rollDice(20, 1, 0, 'D20 Personalizado')}
          disabled={isRolling}
          className="flex-1"
        >
          D20
        </Button>
        <Button
          variant="mystical"
          onClick={() => rollDice(6, 2, 0, '2D6 Personalizado')}
          disabled={isRolling}
          className="flex-1"
        >
          2D6
        </Button>
        <Button
          variant="cosmic"
          onClick={() => rollDice(10, 1, 0, 'D10 Personalizado')}
          disabled={isRolling}
          className="flex-1"
        >
          D10
        </Button>
      </div>

      {/* Roll History */}
      {rollHistory.length > 0 && (
        <div className="border-t border-mystical-purple-deep/30 pt-4">
          <h3 className="text-sm font-cinzel text-starlight mb-3">Histórico Recente</h3>
          <div className="space-y-2">
            {rollHistory.map((roll, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-2 rounded bg-cosmic-night-light/50">
                <span className="text-papyrus-aged">{roll.type}</span>
                <span className="text-divine-gold font-bold">{roll.finalResult}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};