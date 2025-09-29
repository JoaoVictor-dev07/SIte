import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sparkles, History, Zap, Sword, Shield, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiceRollResult {
  dice: number[];
  total: number;
  modifier: number;
  finalResult: number;
  type: string;
  isCritical?: boolean;
  isFumble?: boolean;
  expression?: string;
}

interface DivineDiceRollerProps {
  characterData: any;
}

export const DivineDiceRoller: React.FC<DivineDiceRollerProps> = ({ characterData }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<DiceRollResult | null>(null);
  const [rollHistory, setRollHistory] = useState<DiceRollResult[]>([]);
  const [customExpression, setCustomExpression] = useState('');

  // Sistema de dados expandido
  const diceTypes = [
    { name: 'D4', sides: 4, icon: '🎲', emoji: '4️⃣' },
    { name: 'D6', sides: 6, icon: '⚀', emoji: '6️⃣' },
    { name: 'D8', sides: 8, icon: '⚁', emoji: '8️⃣' },
    { name: 'D10', sides: 10, icon: '⚂', emoji: '🔟' },
    { name: 'D12', sides: 12, icon: '⚃', emoji: '1️⃣2️⃣' },
    { name: 'D20', sides: 20, icon: '⚄', emoji: '2️⃣0️⃣' },
    { name: 'D100', sides: 100, icon: '🎯', emoji: '💯' }
  ];

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

  // Modificadores baseados em atributos
  const getAttributeModifier = (attribute: string): number => {
    const value = characterData?.[attribute] || 50;
    return Math.floor((value - 50) / 10); // +1 para cada 10 pontos acima de 50
  };

  // Rolagem customizada (ex: "2d6+3")
  const rollCustom = () => {
    if (!customExpression.trim() || isRolling) return;

    const match = customExpression.match(/(\d*)d(\d+)([+-]\d+)?/i);
    if (!match) {
      alert('Formato inválido! Use: XdY±Z (ex: 2d6+3)');
      return;
    }

    const [, countStr, sidesStr, modifierStr] = match;
    const count = parseInt(countStr) || 1;
    const sides = parseInt(sidesStr);
    const modifier = parseInt(modifierStr) || 0;

    if (sides <= 0) {
      alert('Número de lados inválido!');
      return;
    }

    rollDice(sides, count, modifier, `Custom: ${customExpression}`);
  };

  const rollDice = (sides: number, count: number, modifier: number, type: string) => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    setTimeout(() => {
      const dice = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
      const total = dice.reduce((sum, die) => sum + die, 0);
      const finalResult = total + modifier;
      
      // Verificar críticos/falhas (apenas para d20)
      const isCritical = sides === 20 && dice.some(die => die === 20);
      const isFumble = sides === 20 && dice.some(die => die === 1);
      
      const result: DiceRollResult = {
        dice,
        total,
        modifier,
        finalResult,
        type,
        isCritical,
        isFumble,
        expression: `${count}d${sides}${modifier >= 0 ? '+' : ''}${modifier}`
      };
      
      setLastRoll(result);
      setRollHistory(prev => [result, ...prev.slice(0, 9)]); // Mantém últimas 10
      setIsRolling(false);
    }, 1000);
  };

  // Rolagens comuns expandidas
  const commonRolls = [
    { 
      name: 'Teste de Força', 
      dice: 1, 
      sides: 20, 
      modifier: getAttributeModifier('strength'),
      icon: <Sword className="h-4 w-4" />,
      variant: 'divine' as const
    },
    { 
      name: 'Teste de Destreza', 
      dice: 1, 
      sides: 20, 
      modifier: getAttributeModifier('dexterity'),
      icon: <Zap className="h-4 w-4" />,
      variant: 'mystical' as const
    },
    { 
      name: 'Teste de Inteligência', 
      dice: 1, 
      sides: 20, 
      modifier: getAttributeModifier('intelligence'),
      icon: <Sparkles className="h-4 w-4" />,
      variant: 'cosmic' as const
    },
    { 
      name: 'Teste de Carisma', 
      dice: 1, 
      sides: 20, 
      modifier: getAttributeModifier('charisma'),
      icon: <Wand2 className="h-4 w-4" />,
      variant: 'gold' as const
    },
    { 
      name: 'Ataque Corpo a Corpo', 
      dice: 1, 
      sides: 20, 
      modifier: Math.floor((characterData?.meleeWeapons || 50) / 5),
      icon: <Sword className="h-4 w-4" />,
      variant: 'divine' as const
    },
    { 
      name: 'Poder Mágico', 
      dice: 2, 
      sides: 8, 
      modifier: getAttributeModifier('magic'),
      icon: <Sparkles className="h-4 w-4" />,
      variant: 'mystical' as const
    },
    { 
      name: 'Defesa Heroica', 
      dice: 1, 
      sides: 20, 
      modifier: Math.floor((characterData?.dodge || 50) / 5),
      icon: <Shield className="h-4 w-4" />,
      variant: 'cosmic' as const
    },
    { 
      name: 'Percepção Divina', 
      dice: 1, 
      sides: 20, 
      modifier: Math.floor((characterData?.perception || 50) / 5),
      icon: <Sparkles className="h-4 w-4" />,
      variant: 'gold' as const
    },
  ];

  // Dados rápidos
  const quickDice = [
    { name: 'D4', sides: 4, count: 1, modifier: 0, emoji: '4️⃣' },
    { name: 'D6', sides: 6, count: 1, modifier: 0, emoji: '6️⃣' },
    { name: 'D8', sides: 8, count: 1, modifier: 0, emoji: '8️⃣' },
    { name: 'D10', sides: 10, count: 1, modifier: 0, emoji: '🔟' },
    { name: 'D12', sides: 12, count: 1, modifier: 0, emoji: '1️⃣2️⃣' },
    { name: 'D20', sides: 20, count: 1, modifier: 0, emoji: '2️⃣0️⃣' },
    { name: 'D100', sides: 100, count: 1, modifier: 0, emoji: '💯' },
    { name: '2D6', sides: 6, count: 2, modifier: 0, emoji: '🎲' },
  ];

  const getRollColor = () => {
    if (!lastRoll) return 'text-starlight';
    if (lastRoll.isCritical) return 'text-divine-gold animate-pulse';
    if (lastRoll.isFumble) return 'text-red-400 animate-pulse';
    return 'text-starlight';
  };

  const getRollMessage = () => {
    if (!lastRoll) return '';
    if (lastRoll.isCritical) return '✨ CRÍTICO DIVINO! ✨';
    if (lastRoll.isFumble) return '💀 FALHA ÉPICA! 💀';
    return '';
  };

  return (
    <div className="card-divine">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🎲</span>
        <h2 className="text-xl font-cinzel font-bold text-divine-gold">
          Dados Divinos
        </h2>
        <Sparkles className="h-5 w-5 text-celestial-blue animate-pulse" />
      </div>

      {/* Área de Resultado Melhorada */}
      <Card className={cn(
        "p-6 border-2 transition-all duration-500 relative overflow-hidden",
        isRolling 
          ? "border-divine-gold bg-divine-gold/20 animate-pulse" 
          : lastRoll?.isCritical
          ? "border-divine-gold bg-divine-gold/10 animate-bounce"
          : lastRoll?.isFumble
          ? "border-red-500 bg-red-500/10 animate-shake"
          : "border-mystical-purple-deep bg-cosmic-night-light/50"
      )}>
        {/* Efeito de fundo para críticos/falhas */}
        {(lastRoll?.isCritical || lastRoll?.isFumble) && (
          <div className="absolute inset-0 opacity-20">
            <div className={cn(
              "w-full h-full animate-pulse",
              lastRoll.isCritical ? "bg-divine-gold" : "bg-red-500"
            )} />
          </div>
        )}
        
        <div className="relative z-10 text-center">
          {isRolling ? (
            <div className="py-6">
              <div className="flex justify-center gap-2 mb-4 animate-bounce">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="text-divine-gold animate-spin">
                    {getDiceIcon(Math.floor(Math.random() * 6) + 1)}
                  </div>
                ))}
              </div>
              <p className="text-mystical-purple-bright font-cinzel">
                Os dados do destino estão girando...
              </p>
            </div>
          ) : lastRoll ? (
            <div className="space-y-4">
              <div className="flex justify-center gap-2 mb-4">
                {lastRoll.dice.map((die, i) => (
                  <div key={i} className={getRollColor()}>
                    {lastRoll.sides === 20 ? (
                      <span className="text-3xl">⚄</span>
                    ) : (
                      getDiceIcon(die)
                    )}
                  </div>
                ))}
              </div>
              
              <div className={cn("text-3xl font-bold font-cinzel", getRollColor())}>
                {lastRoll.finalResult}
              </div>
              
              {getRollMessage() && (
                <div className={cn("text-lg font-cinzel font-bold", getRollColor())}>
                  {getRollMessage()}
                </div>
              )}
              
              <div className="text-sm text-celestial-blue space-y-1">
                <div>{lastRoll.type}</div>
                <div className="text-papyrus-aged">
                  {lastRoll.expression || `${lastRoll.total} + ${lastRoll.modifier}`}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-papyrus-aged">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-cinzel">Invoque o poder dos dados divinos</p>
            </div>
          )}
        </div>
      </Card>

      {/* Dados Rápidos Expandidos */}
      <div className="mt-6">
        <h3 className="text-lg font-cinzel text-divine-gold mb-4 text-center">
          🎯 Dados do Olimpo
        </h3>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          {quickDice.map((dice) => (
            <Button
              key={dice.name}
              variant="outline"
              size="sm"
              onClick={() => rollDice(dice.sides, dice.count, dice.modifier, dice.name)}
              disabled={isRolling}
              className="h-12 flex flex-col gap-1 border-mystical-purple-deep hover:border-divine-gold hover:bg-divine-gold/10"
            >
              <span className="text-lg">{dice.emoji}</span>
              <span className="text-xs font-cinzel">{dice.name}</span>
            </Button>
          ))}
        </div>


        {/* Rolagem Customizada */}
        <div className="space-y-3">
          <h3 className="text-lg font-cinzel text-divine-gold text-center">
            🔮 Invocação Arcana
          </h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={customExpression}
              onChange={(e) => setCustomExpression(e.target.value)}
              placeholder="Ex: 2d6+3"
              className="flex-1 px-3 py-2 bg-cosmic-night border border-mystical-purple-deep rounded text-starlight font-cinzel text-sm placeholder-papyrus-aged"
            />
            <Button
              variant="gold"
              onClick={rollCustom}
              disabled={isRolling || !customExpression.trim()}
              className="font-cinzel"
            >
              Rolagem
            </Button>
          </div>
          
          <p className="text-xs text-papyrus-aged text-center">
            Use formato: <strong>XdY±Z</strong> (ex: 2d6+3)
          </p>
        </div>

        {/* Histórico Expandido */}
        {rollHistory.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <History className="h-4 w-4 text-divine-gold" />
              <h3 className="text-lg font-cinzel text-divine-gold">
                📜 Arquivo do Destino
              </h3>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {rollHistory.map((roll, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex justify-between items-center p-3 rounded text-sm font-cinzel border",
                    roll.isCritical 
                      ? "bg-divine-gold/20 border-divine-gold text-divine-gold" 
                      : roll.isFumble
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-cosmic-night-light border-mystical-purple-deep text-starlight"
                  )}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{roll.type}</div>
                    <div className="text-xs text-papyrus-aged">
                      {roll.expression}
                    </div>
                  </div>
                  <div className={cn(
                    "text-lg font-bold",
                    roll.isCritical ? "text-divine-gold" : 
                    roll.isFumble ? "text-red-400" : "text-celestial-blue"
                  )}>
                    {roll.finalResult}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};