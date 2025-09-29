import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DivineInput } from '@/components/DivineInput';
import { Swords, Shield, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CombatCalculatorProps {
  characterData: any;
}

interface CombatResult {
  attackRoll: number;
  damage: number;
  total: number;
  isCritical: boolean;
  description: string;
}

export const CombatCalculator: React.FC<CombatCalculatorProps> = ({ characterData }) => {
  const [enemyArmor, setEnemyArmor] = useState(10);
  const [selectedWeapon, setSelectedWeapon] = useState('melee');
  const [lastResult, setLastResult] = useState<CombatResult | null>(null);

  const weapons = {
    melee: {
      name: 'Arma Branca',
      skill: characterData.meleeWeapons || 0,
      baseDamage: '1d8',
      icon: Swords,
      description: 'Espada, machado ou lança'
    },
    ranged: {
      name: 'Arma de Fogo',
      skill: characterData.firearms || 0,
      baseDamage: '2d6',
      icon: Zap,
      description: 'Pistola, rifle ou arco'
    },
    unarmed: {
      name: 'Luta Desarmada',
      skill: characterData.unarmedCombat || 0,
      baseDamage: '1d4',
      icon: Shield,
      description: 'Punhos, chutes ou grappling'
    },
    magic: {
      name: 'Poder Mágico',
      skill: characterData.magic || 0,
      baseDamage: '2d8',
      icon: Zap,
      description: 'Raios, fogo ou energia divina'
    }
  };

  const rollDice = (sides: number, count: number = 1) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1)
      .reduce((sum, roll) => sum + roll, 0);
  };

  const calculateAttack = () => {
    const weapon = weapons[selectedWeapon as keyof typeof weapons];
    const skillModifier = Math.floor(weapon.skill / 5);
    
    // Attack roll (d20 + skill modifier)
    const attackRoll = rollDice(20) + skillModifier;
    const isCritical = attackRoll >= 20;
    const hits = attackRoll >= enemyArmor;
    
    if (!hits && !isCritical) {
      setLastResult({
        attackRoll,
        damage: 0,
        total: 0,
        isCritical: false,
        description: `Falhou! (${attackRoll} vs CA ${enemyArmor})`
      });
      return;
    }

    // Damage calculation
    let damage = 0;
    switch (selectedWeapon) {
      case 'melee':
        damage = rollDice(8) + Math.floor(characterData.strength / 10);
        break;
      case 'ranged':
        damage = rollDice(6, 2) + Math.floor(characterData.dexterity / 10);
        break;
      case 'unarmed':
        damage = rollDice(4) + Math.floor(characterData.strength / 10);
        break;
      case 'magic':
        damage = rollDice(8, 2) + Math.floor(characterData.magic / 10);
        break;
    }

    // Critical hit doubles damage
    if (isCritical) {
      damage *= 2;
    }

    const total = Math.max(1, damage); // Minimum 1 damage

    setLastResult({
      attackRoll,
      damage,
      total,
      isCritical,
      description: isCritical ? 'CRÍTICO!' : 'Acertou!'
    });
  };

  const calculateDefense = () => {
    const dodgeModifier = Math.floor((characterData.dodge || 0) / 5);
    const agilityModifier = Math.floor((characterData.agility || 0) / 10);
    
    const defenseRoll = rollDice(20) + dodgeModifier + agilityModifier;
    
    setLastResult({
      attackRoll: defenseRoll,
      damage: 0,
      total: defenseRoll,
      isCritical: defenseRoll >= 20,
      description: `Defesa: ${defenseRoll} (Esquiva +${dodgeModifier}, Agilidade +${agilityModifier})`
    });
  };

  return (
    <div className="card-divine">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">⚔️</span>
        <h2 className="text-xl font-cinzel font-bold text-divine-gold">
          Calculadora de Combate
        </h2>
      </div>

      {/* Weapon Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {Object.entries(weapons).map(([key, weapon]) => {
          const IconComponent = weapon.icon;
          return (
            <Button
              key={key}
              variant={selectedWeapon === key ? "divine" : "outline"}
              size="sm"
              onClick={() => setSelectedWeapon(key)}
              className="flex flex-col h-auto p-3 gap-1"
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-xs">{weapon.name}</span>
              <span className="text-xs text-celestial-blue">
                +{Math.floor(weapon.skill / 5)}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Current Weapon Info */}
      <Card className="p-4 mb-6 bg-cosmic-night-light border-mystical-purple-deep">
        <div className="flex items-center gap-3 mb-2">
          {React.createElement(weapons[selectedWeapon as keyof typeof weapons].icon, { className: "h-5 w-5 text-celestial-blue" })}
          <h3 className="font-cinzel font-bold text-starlight">
            {weapons[selectedWeapon as keyof typeof weapons].name}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-papyrus-aged">Perícia: </span>
            <span className="text-divine-gold">{weapons[selectedWeapon as keyof typeof weapons].skill}</span>
          </div>
          <div>
            <span className="text-papyrus-aged">Modificador: </span>
            <span className="text-celestial-blue">+{Math.floor(weapons[selectedWeapon as keyof typeof weapons].skill / 5)}</span>
          </div>
          <div>
            <span className="text-papyrus-aged">Dano Base: </span>
            <span className="text-red-400">{weapons[selectedWeapon as keyof typeof weapons].baseDamage}</span>
          </div>
          <div className="col-span-2">
            <span className="text-xs text-papyrus-aged italic">
              {weapons[selectedWeapon as keyof typeof weapons].description}
            </span>
          </div>
        </div>
      </Card>

      {/* Enemy Settings */}
      <div className="mb-6">
        <DivineInput
          label="Classe de Armadura do Inimigo"
          type="number"
          variant="numeric"
          value={enemyArmor}
          onChange={(e) => setEnemyArmor(parseInt(e.target.value) || 10)}
          min="1"
          max="30"
          className="max-w-xs"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          variant="divine"
          onClick={calculateAttack}
          className="flex items-center gap-2"
        >
          <Swords className="h-4 w-4" />
          Atacar
        </Button>
        <Button
          variant="mystical"
          onClick={calculateDefense}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Defender
        </Button>
      </div>

      {/* Results */}
      {lastResult && (
        <Card className={cn(
          "p-4 border-2 transition-all duration-500",
          lastResult.isCritical 
            ? "border-divine-gold bg-divine-gold/10 animate-pulse" 
            : lastResult.total > 0 
              ? "border-celestial-blue bg-celestial-blue/10"
              : "border-red-400 bg-red-400/10"
        )}>
          <div className="text-center">
            <h3 className={cn(
              "font-cinzel font-bold text-lg mb-2",
              lastResult.isCritical ? "text-divine-gold" : "text-starlight"
            )}>
              {lastResult.description}
            </h3>
            
            {lastResult.total > 0 && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-papyrus-aged">Rolagem: </span>
                  <span className="text-celestial-blue font-bold">{lastResult.attackRoll}</span>
                </div>
                {lastResult.damage > 0 && (
                  <div>
                    <span className="text-papyrus-aged">Dano: </span>
                    <span className="text-red-400 font-bold">{lastResult.total}</span>
                  </div>
                )}
              </div>
            )}
            
            {lastResult.isCritical && (
              <div className="mt-2 text-xs text-divine-gold animate-pulse">
                ⚡ ACERTO CRÍTICO! ⚡
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Quick Reference */}
      <div className="mt-6 text-xs text-papyrus-aged space-y-1">
        <p>• <strong>Ataque:</strong> 1d20 + mod. perícia vs CA inimigo</p>
        <p>• <strong>Crítico:</strong> Rolagem natural 20 (dobra o dano)</p>
        <p>• <strong>Defesa:</strong> 1d20 + esquiva + agilidade</p>
      </div>
    </div>
  );
};