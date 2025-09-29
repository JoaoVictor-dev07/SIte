import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DelphiOracleProps {
  characterData: any;
}

export const DelphiOracle: React.FC<DelphiOracleProps> = ({ characterData }) => {
  const [currentProphecy, setCurrentProphecy] = useState<string>('');
  const [isRevealing, setIsRevealing] = useState(false);
  
  const prophecyTemplates = [
    "Quando {attribute} for testado, {god} observará de perto...",
    "O filho de {god} encontrará {challenge} em sua jornada...",
    "Beware quando sua {lowStat} for desafiada, pois {consequence}...",
    "Sua força em {highStat} será a chave para {opportunity}...",
    "Os ventos sussurram que {god} tem planos para você...",
    "Quando as estrelas se alinharem, sua {skill} será crucial...",
    "O oráculo prevê que {prediction} em tempos sombrios...",
    "Sua conexão divina de {connection}% indica que {divineMessage}...",
    "Os fados tecem que {fate} quando menos esperar...",
    "Cuidado com aqueles que subestimam seu {strength}, pois {warning}..."
  ];

  const prophecyElements = {
    challenges: [
      "uma grande traição", "um dilema moral", "uma criatura mítica",
      "um deus irritado", "uma profecia sombria", "um labirinto mágico",
      "uma escolha impossível", "um sacrifício necessário"
    ],
    consequences: [
      "isso será sua queda", "mas também sua salvação", "os deuses intervirão",
      "um aliado se revelará inimigo", "uma verdade oculta emergirá",
      "o destino mudará seu curso", "um novo poder despertará"
    ],
    opportunities: [
      "salvar o Olimpo", "descobrir sua verdadeira origem", "forjar uma lenda",
      "reunir os semideuses", "restaurar o equilíbrio", "despertar poderes ocultos",
      "conquistar o reconhecimento divino", "proteger os mortais"
    ],
    predictions: [
      "você encontrará seu verdadeiro amor", "um antigo inimigo retornará",
      "um segredo familiar será revelado", "você liderará uma grande batalha",
      "uma jornada épica o aguarda", "um poder ancestral despertará",
      "você salvará quem menos espera", "o impossível se tornará possível"
    ],
    divineMessages: [
      "você está no caminho certo", "maiores desafios estão por vir",
      "sua força interior está crescendo", "os deuses estão orgulhosos",
      "você deve confiar em seus instintos", "grandes responsabilidades o aguardam",
      "sua lealdade será testada", "o poder verdadeiro está dentro de você"
    ],
    fates: [
      "a vitória virá de onde menos espera", "um sacrifício mudará tudo",
      "o passado retornará para ser resolvido", "uma nova aliança se formará",
      "o impossível se tornará sua especialidade", "você quebrará uma maldição antiga"
    ],
    warnings: [
      "sua vingança será terrível", "eles despertarão a ira divina",
      "o destino os punirá severamente", "você provará seu valor",
      "os deuses mostrarão seu poder através de você", "a justiça divina prevalecerá"
    ]
  };

  const generateProphecy = () => {
    const template = prophecyTemplates[Math.floor(Math.random() * prophecyTemplates.length)];
    
    // Get character stats for personalization
    const stats = {
      strength: characterData.strength || 50,
      dexterity: characterData.dexterity || 50,
      intelligence: characterData.intelligence || 50,
      charisma: characterData.charisma || 50,
      magic: characterData.magic || 50,
      health: characterData.health || 50,
      sanity: characterData.sanity || 50
    };
    
    const statNames = Object.keys(stats);
    const highestStat = statNames.reduce((a, b) => stats[a] > stats[b] ? a : b);
    const lowestStat = statNames.reduce((a, b) => stats[a] < stats[b] ? a : b);
    
    const statLabels = {
      strength: 'Força',
      dexterity: 'Destreza', 
      intelligence: 'Inteligência',
      charisma: 'Carisma',
      magic: 'Magia',
      health: 'Vitalidade',
      sanity: 'Sanidade'
    };

    const replacements = {
      '{god}': characterData.godName || 'Zeus',
      '{attribute}': statLabels[statNames[Math.floor(Math.random() * statNames.length)]],
      '{highStat}': statLabels[highestStat],
      '{lowStat}': statLabels[lowestStat],
      '{skill}': statLabels[statNames[Math.floor(Math.random() * statNames.length)]],
      '{connection}': characterData.connectionLevel || 50,
      '{challenge}': prophecyElements.challenges[Math.floor(Math.random() * prophecyElements.challenges.length)],
      '{consequence}': prophecyElements.consequences[Math.floor(Math.random() * prophecyElements.consequences.length)],
      '{opportunity}': prophecyElements.opportunities[Math.floor(Math.random() * prophecyElements.opportunities.length)],
      '{prediction}': prophecyElements.predictions[Math.floor(Math.random() * prophecyElements.predictions.length)],
      '{divineMessage}': prophecyElements.divineMessages[Math.floor(Math.random() * prophecyElements.divineMessages.length)],
      '{fate}': prophecyElements.fates[Math.floor(Math.random() * prophecyElements.fates.length)],
      '{warning}': prophecyElements.warnings[Math.floor(Math.random() * prophecyElements.warnings.length)],
      '{strength}': statLabels[highestStat]
    };

    let prophecy = template;
    Object.entries(replacements).forEach(([key, value]) => {
      prophecy = prophecy.replace(new RegExp(key, 'g'), value);
    });

    return prophecy;
  };

  const revealProphecy = () => {
    if (isRevealing) return;
    
    setIsRevealing(true);
    setCurrentProphecy('');
    
    setTimeout(() => {
      const newProphecy = generateProphecy();
      setCurrentProphecy(newProphecy);
      setIsRevealing(false);
    }, 1500);
  };

  useEffect(() => {
    // Generate initial prophecy
    if (!currentProphecy) {
      setCurrentProphecy(generateProphecy());
    }
  }, [characterData]);

  return (
    <div className="card-divine">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔮</span>
        <h2 className="text-xl font-cinzel font-bold text-divine-gold">
          Oráculo de Delfos
        </h2>
        <Eye className="h-5 w-5 text-mystical-purple-bright animate-pulse" />
      </div>

      <Card className={cn(
        "p-6 border-2 transition-all duration-1000 relative overflow-hidden",
        isRevealing 
          ? "border-divine-gold bg-divine-gold/10 animate-pulse" 
          : "border-mystical-purple-bright bg-cosmic-night-light/80"
      )}>
        {/* Mystical background effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-mystical-purple-bright/20 via-transparent to-divine-gold/20 animate-pulse" />
        </div>
        
        <div className="relative z-10">
          {isRevealing ? (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-divine-gold animate-spin" />
              <p className="text-mystical-purple-bright font-cinzel animate-pulse">
                Os vapores sagrados se erguem...
              </p>
              <p className="text-sm text-papyrus-aged mt-2">
                A Pítia consulta os deuses...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <span className="text-3xl">🏛️</span>
              </div>
              <blockquote className="text-lg font-cinzel text-starlight leading-relaxed mb-4 italic">
                "{currentProphecy}"
              </blockquote>
              <p className="text-xs text-divine-gold font-cinzel">
                — Profetisa de Apolo, Oráculo de Delfos
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="text-center mt-4">
        <Button
          variant="mystical"
          onClick={revealProphecy}
          disabled={isRevealing}
          className="mb-2"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isRevealing && "animate-spin")} />
          Nova Profecia
        </Button>
        
        <p className="text-xs text-papyrus-aged font-cinzel">
          "Conhece-te a ti mesmo" - Inscrição no Templo de Apolo
        </p>
      </div>
    </div>
  );
};