import React, { useState } from 'react';
import { useCharacterSheet } from '@/hooks/useCharacterSheet';
import { AttributeSection } from '@/components/AttributeSection';
import { DivinePowersSection } from '@/components/DivinePowersSection';
import { DivineDiceRoller } from '@/components/DivineDiceRoller';
import { GreekNameGenerator } from '@/components/GreekNameGenerator';
import { DelphiOracle } from '@/components/DelphiOracle';
import { DivineTransformation } from '@/components/DivineTransformation';
import { CombatCalculator } from '@/components/CombatCalculator';
import { DivineInput } from '@/components/DivineInput';
import { DivineTextarea } from '@/components/DivineTextarea';
import { GodSelector } from '@/components/GodSelector';
import { Button } from '@/components/ui/button';
import { Save, FileText, Plus, Download, Upload, Trash2 } from 'lucide-react';
import divineHeroBg from '@/assets/divine-hero-bg.jpg';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Index = () => {
  const {
    characterData,
    updateCharacterData,
    currentSheetName,
    savedSheets,
    saveSheet,
    loadSheet,
    newSheet,
    deleteSheet
  } = useCharacterSheet();

  const [sheetName, setSheetName] = useState(currentSheetName);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  const handleSave = () => {
    if (saveSheet(sheetName)) {
      setShowSaveDialog(false);
    }
  };

  const handleLoad = (selectedSheet: string) => {
    if (loadSheet(selectedSheet)) {
      setSheetName(selectedSheet);
      setShowLoadDialog(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(characterData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${sheetName || 'divine_sheet'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          updateCharacterData(importedData);
          setSheetName(file.name.replace('.json', ''));
        } catch (error) {
          console.error('Error importing file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleNameSelect = (name: string, type: 'character' | 'god') => {
    if (type === 'character') {
      updateCharacterData({ characterName: name });
    } else {
      updateCharacterData({ godName: name });
    }
  };

  const primaryAttributes = [
    { key: 'strength' as const, label: 'Força', icon: '💪' },
    { key: 'dexterity' as const, label: 'Destreza', icon: '🤸' },
    { key: 'constitution' as const, label: 'Constituição', icon: '🛡️' },
    { key: 'agility' as const, label: 'Agilidade', icon: '⚡' },
    { key: 'intelligence' as const, label: 'Inteligência', icon: '🧠' },
    { key: 'charisma' as const, label: 'Carisma', icon: '✨' },
    { key: 'willpower' as const, label: 'Vontade', icon: '🧘' },
    { key: 'education' as const, label: 'Educação', icon: '🎓' },
    { key: 'stealth' as const, label: 'Furtividade', icon: '🕵️' },
  ];

  const specialSkills = [
    { key: 'magic' as const, label: 'Magia', icon: '🪄' },
    { key: 'unarmedCombat' as const, label: 'Luta Desarmada', icon: '🥊' },
    { key: 'meleeWeapons' as const, label: 'Armas Brancas', icon: '⚔️' },
    { key: 'firearms' as const, label: 'Armas de Fogo', icon: '🔫' },
    { key: 'investigation' as const, label: 'Investigação', icon: '🔍' },
    { key: 'history' as const, label: 'História', icon: '📜' },
    { key: 'linguistics' as const, label: 'Linguística', icon: '🗣️' },
    { key: 'dodge' as const, label: 'Esquiva', icon: '💨' },
    { key: 'perception' as const, label: 'Percepção', icon: '👁️' },
  ];

  const healthAttributes = [
    { key: 'health' as const, label: 'Vida', icon: '❤️' },
    { key: 'sanity' as const, label: 'Sanidade', icon: '🧠' },
  ];

  // Determine progressive critical states
  const getHealthState = (health: number) => {
    if (health <= 25) return 'health-25';
    if (health <= 50) return 'health-50';
    if (health <= 75) return 'health-75';
    return '';
  };
  
  const getSanityState = (sanity: number) => {
    if (sanity <= 25) return 'sanity-25';
    if (sanity <= 50) return 'sanity-50';
    if (sanity <= 75) return 'sanity-75';
    return '';
  };
  
  const getGodTheme = (selectedGod: string) => {
    return selectedGod ? `theme-${selectedGod}` : '';
  };
  
  const getGodClass = (selectedGod: string) => {
    return selectedGod ? `god-${selectedGod}` : '';
  };
  
  const criticalStateClass = cn(
    getHealthState(characterData.health),
    getSanityState(characterData.sanity),
    getGodTheme(characterData.selectedGod),
    getGodClass(characterData.selectedGod)
  );

  return (
    <div 
      className={cn(
        "min-h-screen relative overflow-x-hidden",
        criticalStateClass
      )}
      style={{
        backgroundImage: `
          linear-gradient(135deg, hsl(var(--cosmic-night) / 0.95) 0%, hsl(var(--cosmic-night-light) / 0.9) 50%, hsl(var(--mystical-purple-deep) / 0.95) 100%),
          url('${divineHeroBg}')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Divine Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="text-9xl font-divine text-divine-gold animate-divine-pulse">
              ✦
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-divine text-divine-gold mb-4 relative z-10 animate-cosmic-float">
            ✦☾█▓▒░ 𝔽𝓲𝓬𝓱𝓪 𝓭𝓸 𝔻𝓮𝓾𝓼 ░▒▓█☽✦
          </h1>
          
          <p className="text-lg text-mystical-purple-bright font-cinzel">
            Crônicas dos Filhos dos Deuses • Legado de Percy Jackson
          </p>
        </div>

        {/* Control Panel */}
        <div className="card-divine mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <DivineInput
                label=""
                placeholder="Nome da ficha sagrada"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="flex-1 max-w-md"
              />
              
              <div className="text-sm text-starlight">
                {currentSheetName ? (
                  <span className="text-divine-gold">
                    ✨ {currentSheetName}
                  </span>
                ) : (
                  <span className="text-papyrus-aged">
                    Ficha não salva
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button variant="divine" size="sm">
                    <Save className="h-4 w-4" />
                    Salvar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-cosmic-night border-mystical-purple-bright">
                  <DialogHeader>
                    <DialogTitle className="text-divine-gold">⚡ Preservar Pergaminho Divino</DialogTitle>
                    <DialogDescription className="text-starlight">
                      Digite o nome para gravar esta ficha nos arquivos sagrados.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <DivineInput
                      label="Nome da Ficha"
                      value={sheetName}
                      onChange={(e) => setSheetName(e.target.value)}
                      placeholder="Ex: Zeus - Herói dos Ventos"
                    />
                    <div className="flex gap-2">
                      <Button variant="divine" onClick={handleSave} className="flex-1">
                        <Save className="h-4 w-4" />
                        Preservar
                      </Button>
                      <Button variant="cosmic" onClick={() => setShowSaveDialog(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
                <DialogTrigger asChild>
                  <Button variant="mystical" size="sm">
                    <FileText className="h-4 w-4" />
                    Carregar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-cosmic-night border-mystical-purple-bright">
                  <DialogHeader>
                    <DialogTitle className="text-divine-gold">📜 Recuperar Pergaminhos</DialogTitle>
                    <DialogDescription className="text-starlight">
                      Escolha uma ficha salva para restaurar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {savedSheets.length > 0 ? (
                      <div className="grid gap-2">
                        {savedSheets.map((sheet) => (
                          <div key={sheet} className="flex items-center justify-between p-3 rounded-lg bg-cosmic-night-light border border-mystical-purple-deep">
                            <span className="text-starlight font-cinzel">{sheet}</span>
                            <div className="flex gap-2">
                              <Button variant="gold" size="sm" onClick={() => handleLoad(sheet)}>
                                Carregar
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteSheet(sheet)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-papyrus-aged text-center py-4">
                        Nenhum pergaminho encontrado nos arquivos divinos.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="cosmic" size="sm" onClick={newSheet}>
                <Plus className="h-4 w-4" />
                Nova
              </Button>

              <Button variant="gold" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Exportar
              </Button>

              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Importar
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card-divine mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🌀</span>
            <h2 className="text-xl font-cinzel font-bold text-divine-gold">
              Essência Divina
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DivineInput
              label="Nome do Mortal"
              icon="🌌"
              value={characterData.characterName}
              onChange={(e) => updateCharacterData({ characterName: e.target.value })}
              placeholder="Nome do avatar mortal"
            />

            <div className="space-y-2">
              <GodSelector
                value={characterData.selectedGod}
                onChange={(value) => updateCharacterData({ selectedGod: value, godName: value })}
              />
            </div>

            <DivineInput
              label="Idade"
              icon="🎂"
              type="number"
              variant="numeric"
              value={characterData.age}
              onChange={(e) => updateCharacterData({ age: parseInt(e.target.value) || 20 })}
              min="20"
              max="23"
            />

            <DivineInput
              label="Grupo Social"
              icon="🏛️"
              value={characterData.socialGroup}
              onChange={(e) => updateCharacterData({ socialGroup: e.target.value })}
              placeholder="Acampamento Meio-Sangue..."
            />

            <DivineInput
              label="Nacionalidade"
              icon="🌎"
              value={characterData.nationality}
              onChange={(e) => updateCharacterData({ nationality: e.target.value })}
              placeholder="Americana, Brasileira..."
            />

            <DivineInput
              label="Nível de Conexão"
              icon="🔗"
              type="number"
              variant="numeric"
              value={characterData.connectionLevel}
              onChange={(e) => updateCharacterData({ connectionLevel: parseInt(e.target.value) || 50 })}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Health & Sanity */}
        <AttributeSection
          title="Estado Vital"
          icon="💫"
          attributes={healthAttributes}
          characterData={characterData}
          onAttributeChange={(key, value) => updateCharacterData({ [key]: value })}
          type="health"
          useDraggable={true}
        />

        {/* Primary Attributes */}
        <AttributeSection
          title="Atributos Primários"
          icon="⚔️"
          attributes={primaryAttributes}
          characterData={characterData}
          onAttributeChange={(key, value) => updateCharacterData({ [key]: value })}
          type="primary"
          useDraggable={true}
        />

        {/* Special Skills */}
        <AttributeSection
          title="Habilidades Especiais"
          icon="🔮"
          attributes={specialSkills}
          characterData={characterData}
          onAttributeChange={(key, value) => updateCharacterData({ [key]: value })}
          type="skills"
          useDraggable={true}
        />

        {/* Divine Powers */}
        <DivinePowersSection
          powers={characterData.divinePowers}
          onUpdatePowers={(powers) => updateCharacterData({ divinePowers: powers })}
        />

        {/* Character Development */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card-divine">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">👤</span>
              <h2 className="text-xl font-cinzel font-bold text-divine-gold">
                Aparência
              </h2>
            </div>
            <DivineTextarea
              label=""
              value={characterData.appearance}
              onChange={(e) => updateCharacterData({ appearance: e.target.value })}
              placeholder="Descreva a aparência física do seu personagem..."
              rows={6}
            />
          </div>

          <div className="card-divine">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl font-cinzel font-bold text-divine-gold">
                História Pessoal
              </h2>
            </div>
            <DivineTextarea
              label=""
              value={characterData.personalHistory}
              onChange={(e) => updateCharacterData({ personalHistory: e.target.value })}
              placeholder="Conte a história do seu personagem..."
              rows={6}
            />
          </div>

          <div className="card-divine">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🤝</span>
              <h2 className="text-xl font-cinzel font-bold text-divine-gold">
                Aliados e Amigos
              </h2>
            </div>
            <DivineTextarea
              label=""
              value={characterData.alliesAndFriends}
              onChange={(e) => updateCharacterData({ alliesAndFriends: e.target.value })}
              placeholder="Liste seus aliados, amigos e contatos importantes..."
              rows={6}
            />
          </div>

          <div className="card-divine">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏛️</span>
              <h2 className="text-xl font-cinzel font-bold text-divine-gold">
                Domínios Divinos
              </h2>
            </div>
            <DivineTextarea
              label=""
              value={characterData.domains}
              onChange={(e) => updateCharacterData({ domains: e.target.value })}
              placeholder="Quais são os domínios de poder da sua divindade..."
              rows={6}
            />
          </div>
        </div>

        {/* Equipment & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card-divine">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🎒</span>
              <h2 className="text-xl font-cinzel font-bold text-divine-gold">
                Equipamentos
              </h2>
            </div>
            <DivineTextarea
              label=""
              value={characterData.equipment}
              onChange={(e) => updateCharacterData({ equipment: e.target.value })}
              placeholder="Espada celestial, escudo de bronze..."
              rows={6}
            />
          </div>

          <div className="card-divine">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🛡️</span>
              <h2 className="text-xl font-cinzel font-bold text-divine-gold">
                Habilidades
              </h2>
            </div>
            <DivineTextarea
              label=""
              value={characterData.abilities}
              onChange={(e) => updateCharacterData({ abilities: e.target.value })}
              placeholder="Controle de raios, cura divina..."
              rows={6}
            />
          </div>

          <div className="card-divine">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏛️</span>
              <h2 className="text-xl font-cinzel font-bold text-divine-gold">
                Observações
              </h2>
            </div>
            <DivineTextarea
              label=""
              value={characterData.observations}
              onChange={(e) => updateCharacterData({ observations: e.target.value })}
              placeholder="Relações com outros deuses, eventos importantes..."
              rows={6}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-papyrus-aged">
          <p className="font-cinzel">
            ✦ Que os deuses guiem seu destino ✦
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
