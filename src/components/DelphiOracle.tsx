import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DelphiOracleProps {
  characterData: any;
}

export const DelphiOracle: React.FC<DelphiOracleProps> = ({ characterData }) => {
  const [currentProphecy, setCurrentProphecy] = useState<string>('');
  const [isRevealing, setIsRevealing] = useState(false);
  const [usedProphecies, setUsedProphecies] = useState<number[]>([]);
  
  // Banco de frases EXPANDIDO (50+ templates)
  const prophecyTemplates = [
    "Quando {attribute} for testado, {god} observará de perto...",
    "O filho de {god} encontrará {challenge} em sua jornada...",
    "Cuidado quando sua {lowStat} for desafiada, pois {consequence}...",
    "Sua força em {highStat} será a chave para {opportunity}...",
    "Os ventos sussurram que {god} tem planos para você...",
    "Quando as estrelas se alinharem, sua {skill} será crucial...",
    "O oráculo prevê que {prediction} em tempos sombrios...",
    "Sua conexão divina de {connection}% indica que {divineMessage}...",
    "Os fados tecem que {fate} quando menos esperar...",
    "Cuidado com aqueles que subestimam seu {strength}, pois {warning}...",
    "Sob o olhar de {god}, {event} mudará seu destino...",
    "A lua revela que {moonPrediction} na próxima lua cheia...",
    "Quando {element} se manifestar, {elementEvent} ocorrerá...",
    "O eco do Olimpo sussurra: {olympusWhisper}...",
    "Seu coração de {heartQuality} atrairá {heartEvent}...",
    "Os deuses do {pantheon} observam suas escolhas com {divineEmotion}...",
    "No crepúsculo, {twilightEvent} revelará verdades ocultas...",
    "Sangue de {god} corre em suas veias, trazendo {legacyGift}...",
    "O tempo dos {era} retornará quando {eraTrigger}...",
    "Sua jornada através do {journeyLocation} testará seu {journeyTest}..."
  ];

  // Elementos de profecia EXPANDIDOS
  const prophecyElements = {
    challenges: [
      "uma grande traição", "um dilema moral", "uma criatura mítica",
      "um deus irritado", "uma profecia sombria", "um labirinto mágico",
      "uma escolha impossível", "um sacrifício necessário", "um amor proibido",
      "uma maldição ancestral", "um segredo familiar", "uma guerra divina",
      "um portal para o Submundo", "uma tempestade cósmica", "um eclipse profético"
    ],
    consequences: [
      "isso será sua queda", "mas também sua salvação", "os deuses intervirão",
      "um aliado se revelará inimigo", "uma verdade oculta emergirá",
      "o destino mudará seu curso", "um novo poder despertará", "o equilíbrio será rompido",
      "sangue divino será derramado", "um juramento será quebrado", "um herói cairá"
    ],
    opportunities: [
      "salvar o Olimpo", "descobrir sua verdadeira origem", "forjar uma lenda",
      "reunir os semideuses", "restaurar o equilíbrio", "despertar poderes ocultos",
      "conquistar o reconhecimento divino", "proteger os mortais", "domar uma fera mítica",
      "encontrar um artefato perdido", "aprender segredos antigos", "curar uma maldição"
    ],
    predictions: [
      "você encontrará seu verdadeiro amor", "um antigo inimigo retornará",
      "um segredo familiar será revelado", "você liderará uma grande batalha",
      "uma jornada épica o aguarda", "um poder ancestral despertará",
      "você salvará quem menos espera", "o impossível se tornará possível",
      "um trono será reivindicado", "um deus morrerá", "um novo panteão surgirá"
    ],
    divineMessages: [
      "você está no caminho certo", "maiores desafios estão por vir",
      "sua força interior está crescendo", "os deuses estão orgulhosos",
      "você deve confiar em seus instintos", "grandes responsabilidades o aguardam",
      "sua lealdade será testada", "o poder verdadeiro está dentro de você",
      "o destino te escolheu", "seu sacrifício será lembrado", "a esperança nunca morrerá"
    ],
    fates: [
      "a vitória virá de onde menos espera", "um sacrifício mudará tudo",
      "o passado retornará para ser resolvido", "uma nova aliança se formará",
      "o impossível se tornará sua especialidade", "você quebrará uma maldição antiga",
      "sangue e lágrimas regarão o caminho", "a luz vencerá as trevas", 
      "um herói surgirá das cinzas", "o ciclo se completará"
    ],
    warnings: [
      "sua vingança será terrível", "eles despertarão a ira divina",
      "o destino os punirá severamente", "você provará seu valor",
      "os deuses mostrarão seu poder através de você", "a justiça divina prevalecerá",
      "o preço da ambição será alto", "as consequências ecoarão pela eternidade",
      "o orgulho precede a queda", "as sombras consumirão os fracos"
    ],
    // NOVAS CATEGORIAS
    events: [
      "uma batalha épica", "um encontro fatídico", "uma descoberta chocante",
      "uma traição inesperada", "um sacrifício heróico", "uma revelação divina",
      "uma tempestade de poder", "um eclipse profético", "um ritual ancestral"
    ],
    moonPredictions: [
      "destinos serão entrelaçados", "poderes lunares despertarão",
      "segredos serão revelados", "amores proibidos florescerão",
      "juramentos serão feitos", "maldições serão quebradas"
    ],
    elements: [
      "fogo", "água", "terra", "ar", "trovão", "gelo", "luz", "sombra", "tempo"
    ],
    elementEvents: [
      "renascimento", "purificação", "destruição", "criação", "iluminação", "transformação"
    ],
    olympusWhispers: [
      "grandeza exige sacrifício", "um novo deus ascenderá",
      "o panteão mudará para sempre", "o sangue antigo clamará por vingança",
      "o equilíbrio pende sobre uma faca", "os titãs não esqueceram"
    ],
    heartQualities: [
      "ouro", "ferro", "cristal", "fogo", "gelo", "tempestade", "luz", "sombra"
    ],
    heartEvents: [
      "alianças duradouras", "traições amargas", "amores eternos", "inimizades mortais",
      "sacrifícios nobres", "vinganças justas"
    ],
    pantheons: [
      "Olimpo", "Submundo", "Mar", "Céu", "Terra", "Guerra", "Sabedoria", "Amor"
    ],
    divineEmotions: [
      "aprovação", "cólera", "ciúmes", "orgulho", "desprezo", "esperança", "medo"
    ],
    twilightEvents: [
      "alianças noturnas", "segredos crepusculares", "juramentos sob as estrelas",
      "traições à meia-luz", "revelações lunares"
    ],
    legacyGifts: [
      "poder sobre os elementos", "visões do futuro", "força sobre-humana",
      "sabedoria ancestral", "charme divino", "resistência titânica"
    ],
    eras: [
      "heróis", "titãs", "deuses", "monstros", "semideuses", "oráculos"
    ],
    eraTriggers: [
      "o sangue do primeiro deus for derramado", "a última esperança despertar",
      "as estrelas sangrarem no céu", "o último oráculo falar", 
      "o equilíbrio for quebrado"
    ],
    journeyLocations: [
      "Submundo", "Olimpo", "Mar de Monstros", "Labirinto", "Jardim das Hespérides",
      "Campos Elísios", "Tártaro", "Rio Estige"
    ],
    journeyTests: [
      "coragem", "sabedoria", "força", "fé", "lealdade", "amor", "honra", "sacrifício"
    ]
  };

  // Sistema anti-repetição inteligente
  const getRandomTemplate = (): number => {
    const availableTemplates = prophecyTemplates
      .map((_, index) => index)
      .filter(index => !usedProphecies.includes(index));
    
    if (availableTemplates.length === 0) {
      // Se todas foram usadas, limpa o histórico (mantém apenas as últimas 5)
      setUsedProphecies(prev => prev.slice(-5));
      return Math.floor(Math.random() * prophecyTemplates.length);
    }
    
    const randomIndex = Math.floor(Math.random() * availableTemplates.length);
    const selectedTemplate = availableTemplates[randomIndex];
    
    // Adiciona ao histórico (máximo 15 no histórico)
    setUsedProphecies(prev => [...prev, selectedTemplate].slice(-15));
    
    return selectedTemplate;
  };

  const generateProphecy = (): string => {
    const templateIndex = getRandomTemplate();
    const template = prophecyTemplates[templateIndex];
    
    // Obter estatísticas do personagem para personalização
    const stats = {
      strength: characterData?.strength || 50,
      dexterity: characterData?.dexterity || 50,
      intelligence: characterData?.intelligence || 50,
      charisma: characterData?.charisma || 50,
      magic: characterData?.magic || 50,
      health: characterData?.health || 50,
      sanity: characterData?.sanity || 50
    };
    
    const statNames = Object.keys(stats);
    const highestStat = statNames.reduce((a, b) => stats[a] > stats[b] ? a : b);
    const lowestStat = statNames.reduce((a, b) => stats[a] < stats[b] ? a : b);
    
    const statLabels: Record<string, string> = {
      strength: 'Força',
      dexterity: 'Destreza', 
      intelligence: 'Inteligência',
      charisma: 'Carisma',
      magic: 'Magia',
      health: 'Vitalidade',
      sanity: 'Sanidade'
    };

    // Função auxiliar para elemento aleatório
    const randomElement = (arr: string[]): string => 
      arr[Math.floor(Math.random() * arr.length)];

    const replacements: Record<string, string> = {
      '{god}': characterData?.godName || 'Zeus',
      '{attribute}': statLabels[randomElement(statNames)] || 'Força',
      '{highStat}': statLabels[highestStat] || 'Força',
      '{lowStat}': statLabels[lowestStat] || 'Força',
      '{skill}': statLabels[randomElement(statNames)] || 'Força',
      '{connection}': String(characterData?.connectionLevel || 50),
      '{challenge}': randomElement(prophecyElements.challenges),
      '{consequence}': randomElement(prophecyElements.consequences),
      '{opportunity}': randomElement(prophecyElements.opportunities),
      '{prediction}': randomElement(prophecyElements.predictions),
      '{divineMessage}': randomElement(prophecyElements.divineMessages),
      '{fate}': randomElement(prophecyElements.fates),
      '{warning}': randomElement(prophecyElements.warnings),
      '{strength}': statLabels[highestStat] || 'Força',
      '{event}': randomElement(prophecyElements.events),
      '{moonPrediction}': randomElement(prophecyElements.moonPredictions),
      '{element}': randomElement(prophecyElements.elements),
      '{elementEvent}': randomElement(prophecyElements.elementEvents),
      '{olympusWhisper}': randomElement(prophecyElements.olympusWhispers),
      '{heartQuality}': randomElement(prophecyElements.heartQualities),
      '{heartEvent}': randomElement(prophecyElements.heartEvents),
      '{pantheon}': randomElement(prophecyElements.pantheons),
      '{divineEmotion}': randomElement(prophecyElements.divineEmotions),
      '{twilightEvent}': randomElement(prophecyElements.twilightEvents),
      '{legacyGift}': randomElement(prophecyElements.legacyGifts),
      '{era}': randomElement(prophecyElements.eras),
      '{eraTrigger}': randomElement(prophecyElements.eraTriggers),
      '{journeyLocation}': randomElement(prophecyElements.journeyLocations),
      '{journeyTest}': randomElement(prophecyElements.journeyTests)
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
    }, 2000);
  };

  useEffect(() => {
    // Gera profecia inicial
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
        {/* Efeito de fundo místico */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-mystical-purple-bright via-transparent to-divine-gold/20 animate-pulse" />
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
              <blockquote className="text-lg font-cinzel text-starlight leading-relaxed mb-4">
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