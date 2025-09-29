import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap, Shield, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DivineTransformationProps {
  characterData: any;
}

export const DivineTransformation: React.FC<DivineTransformationProps> = ({ characterData }) => {
  const [transformationLevel, setTransformationLevel] = useState(0);
  const [isTransformed, setIsTransformed] = useState(false);
  
  useEffect(() => {
    // Calculate transformation level based on connection and other factors
    const connectionBonus = characterData.connectionLevel || 0;
    const magicBonus = Math.floor((characterData.magic || 0) / 10);
    const healthBonus = characterData.health > 80 ? 10 : 0;
    const sanityBonus = characterData.sanity > 70 ? 5 : 0;
    
    const level = Math.min(100, connectionBonus + magicBonus + healthBonus + sanityBonus);
    setTransformationLevel(level);
    setIsTransformed(level >= 80);
  }, [characterData]);

  const getTransformationStage = () => {
    if (transformationLevel >= 90) return { name: 'Ascensão Divina', color: 'text-divine-gold', icon: Crown };
    if (transformationLevel >= 80) return { name: 'Poder Divino', color: 'text-celestial-blue', icon: Zap };
    if (transformationLevel >= 60) return { name: 'Despertar', color: 'text-mystical-purple-bright', icon: Eye };
    if (transformationLevel >= 40) return { name: 'Conexão', color: 'text-starlight', icon: Shield };
    return { name: 'Mortal', color: 'text-papyrus-aged', icon: Shield };
  };

  const getTransformationEffects = () => {
    const effects = [];
    
    if (transformationLevel >= 40) {
      effects.push('Regeneração lenta de vida');
    }
    if (transformationLevel >= 60) {
      effects.push('Visão além do véu místico');
      effects.push('Resistência a efeitos mentais');
    }
    if (transformationLevel >= 80) {
      effects.push('Força divina (+2 em testes)');
      effects.push('Aura de comando');
    }
    if (transformationLevel >= 90) {
      effects.push('Forma semi-divina');
      effects.push('Comunicação com o deus pai');
      effects.push('Imunidade a doenças mortais');
    }
    
    return effects;
  };

  const stage = getTransformationStage();
  const effects = getTransformationEffects();
  const IconComponent = stage.icon;

  return (
    <div className={cn(
      "card-divine transition-all duration-1000",
      isTransformed && "ring-2 ring-divine-gold shadow-lg shadow-divine-gold/20"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">⚡</span>
        <h2 className="text-xl font-cinzel font-bold text-divine-gold">
          Transformação Divina
        </h2>
        <IconComponent className={cn("h-5 w-5", stage.color, isTransformed && "animate-pulse")} />
      </div>

      {/* Transformation Progress */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-cinzel text-starlight">Nível de Transformação</span>
          <span className={cn("font-bold", stage.color)}>{transformationLevel}%</span>
        </div>
        
        <Progress 
          value={transformationLevel} 
          className="h-3"
        />
        
        <div className="text-center">
          <span className={cn("text-lg font-cinzel font-bold", stage.color)}>
            {stage.name}
          </span>
        </div>
      </div>

      {/* Current State */}
      <Card className={cn(
        "p-4 border transition-all duration-500",
        isTransformed 
          ? "border-divine-gold bg-divine-gold/10" 
          : "border-mystical-purple-deep bg-cosmic-night-light/50"
      )}>
        {isTransformed ? (
          <div className="text-center">
            <div className="text-4xl mb-2 animate-bounce">✨</div>
            <h3 className="font-cinzel font-bold text-divine-gold mb-2">
              Forma Divina Ativa!
            </h3>
            <p className="text-celestial-blue text-sm">
              Seu sangue divino pulsa com poder ancestral
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-3xl mb-2 opacity-60">🌙</div>
            <h3 className="font-cinzel text-starlight mb-2">
              Forma Mortal
            </h3>
            <p className="text-papyrus-aged text-sm">
              Sua divindade interior aguarda o despertar
            </p>
          </div>
        )}
      </Card>

      {/* Active Effects */}
      {effects.length > 0 && (
        <div className="mt-6">
          <h4 className="font-cinzel font-bold text-celestial-blue mb-3">
            Bênçãos Ativas
          </h4>
          <div className="space-y-2">
            {effects.map((effect, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-divine-gold animate-pulse" />
                <span className="text-starlight">{effect}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements for next level */}
      {transformationLevel < 100 && (
        <div className="mt-6 p-3 rounded-lg bg-cosmic-night-light/30 border border-mystical-purple-deep/50">
          <h4 className="font-cinzel text-mystical-purple-bright text-sm mb-2">
            Para alcançar o próximo nível:
          </h4>
          <div className="text-xs text-papyrus-aged space-y-1">
            {transformationLevel < 80 && (
              <p>• Aumente sua Conexão Divina para 80+</p>
            )}
            {transformationLevel < 90 && characterData.magic < 80 && (
              <p>• Desenvolva sua Magia para 80+</p>
            )}
            {characterData.health < 80 && (
              <p>• Mantenha sua Vida acima de 80</p>
            )}
            {characterData.sanity < 70 && (
              <p>• Mantenha sua Sanidade acima de 70</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};