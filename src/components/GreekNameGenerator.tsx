import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shuffle, Copy, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GreekNameGeneratorProps {
  onNameSelect: (name: string, type: 'character' | 'god') => void;
}

export const GreekNameGenerator: React.FC<GreekNameGeneratorProps> = ({ onNameSelect }) => {
  const [generatedNames, setGeneratedNames] = useState<{character: string, god: string}>({
    character: '',
    god: ''
  });

  const greekCharacterNames = {
    male: [
      'Alexandros', 'Nikias', 'Lysander', 'Theron', 'Demetrios', 'Odysseus', 'Achilleus',
      'Hektor', 'Perseus', 'Theseus', 'Orion', 'Apollo', 'Hermes', 'Dionysios',
      'Aristides', 'Kleomenes', 'Pericles', 'Sophokles', 'Euripides', 'Aeschylus'
    ],
    female: [
      'Kassandra', 'Penelope', 'Andromeda', 'Ariadne', 'Elektra', 'Antigone', 'Iphigenia',
      'Helena', 'Klytemnestra', 'Medea', 'Daphne', 'Artemis', 'Athena', 'Persephone',
      'Sappho', 'Aspasia', 'Lysistrata', 'Antigone', 'Ismene', 'Eurydice'
    ]
  };

  const greekGods = [
    'Zeus', 'Hera', 'Poseidon', 'Demeter', 'Athena', 'Apollo', 'Artemis', 'Ares',
    'Aphrodite', 'Hephaestus', 'Hermes', 'Dionysus', 'Hades', 'Persephone', 'Hestia',
    'Hecate', 'Pan', 'Nyx', 'Helios', 'Selene', 'Eos', 'Iris', 'Nemesis', 'Tyche',
    'Hypnos', 'Morpheus', 'Thanatos', 'Erebus', 'Chaos', 'Gaia'
  ];

  const generateNames = () => {
    // Generate character name (mix of male and female names)
    const allCharacterNames = [...greekCharacterNames.male, ...greekCharacterNames.female];
    const randomCharacterName = allCharacterNames[Math.floor(Math.random() * allCharacterNames.length)];
    
    // Generate god name
    const randomGodName = greekGods[Math.floor(Math.random() * greekGods.length)];
    
    setGeneratedNames({
      character: randomCharacterName,
      god: randomGodName
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Nome Copiado! ✨",
      description: `${type} "${text}" foi copiado para a área de transferência.`,
    });
  };

  const useGeneratedName = (name: string, type: 'character' | 'god') => {
    onNameSelect(name, type);
    toast({
      title: "Nome Aplicado! 🏛️",
      description: `O nome "${name}" foi aplicado à sua ficha divina.`,
    });
  };

  return (
    <div className="card-divine">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🏺</span>
        <h2 className="text-xl font-cinzel font-bold text-divine-gold">
          Oráculo de Nomes
        </h2>
      </div>

      <div className="text-center mb-6">
        <p className="text-starlight font-cinzel mb-4">
          Invoque os antigos nomes dos heróis e deuses gregos
        </p>
        
        <Button
          variant="divine"
          onClick={generateNames}
          className="mb-6"
        >
          <Shuffle className="h-4 w-4 mr-2" />
          Consultar o Oráculo
        </Button>
      </div>

      {generatedNames.character && (
        <div className="space-y-4">
          {/* Character Name */}
          <Card className="p-4 bg-cosmic-night-light border-mystical-purple-bright/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-cinzel font-bold text-celestial-blue">Nome do Herói</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatedNames.character, 'Nome do herói')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => useGeneratedName(generatedNames.character, 'character')}
                >
                  <Heart className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
            <p className="text-2xl font-divine text-divine-gold text-center">
              {generatedNames.character}
            </p>
          </Card>

          {/* God Name */}
          <Card className="p-4 bg-cosmic-night-light border-mystical-purple-bright/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-cinzel font-bold text-celestial-blue">Divindade Ancestral</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatedNames.god, 'Nome da divindade')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => useGeneratedName(generatedNames.god, 'god')}
                >
                  <Heart className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
            <p className="text-2xl font-divine text-divine-gold text-center">
              {generatedNames.god}
            </p>
          </Card>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-papyrus-aged font-cinzel">
          "Os nomes carregam o poder dos ancestrais divinos"
        </p>
      </div>
    </div>
  );
};