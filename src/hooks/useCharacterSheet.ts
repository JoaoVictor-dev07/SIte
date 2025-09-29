import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface DivinePower {
  id: string;
  name: string;
  cost: number;
  damage: string;
  type: string;
  description: string;
  image?: string;
}

export interface CharacterData {
  // Basic Information
  characterName: string;
  godName: string;
  selectedGod: string;
  age: number;
  socialGroup: string;
  nationality: string;
  connectionLevel: number;
  
  // Character Development
  appearance: string;
  personalHistory: string;
  alliesAndFriends: string;
  domains: string;
  
  // Health & Sanity
  health: number;
  sanity: number;
  
  // Primary Attributes
  strength: number;
  dexterity: number;
  constitution: number;
  agility: number;
  intelligence: number;
  charisma: number;
  willpower: number;
  education: number;
  stealth: number;
  
  // Special Skills
  magic: number;
  unarmedCombat: number;
  meleeWeapons: number;
  firearms: number;
  investigation: number;
  history: number;
  linguistics: number;
  dodge: number;
  perception: number;
  
  // Divine Powers
  divinePowers: DivinePower[];
  
  // Equipment & Notes
  equipment: string;
  abilities: string;
  observations: string;
}

const defaultCharacterData: CharacterData = {
  characterName: '',
  godName: '',
  selectedGod: '',
  age: 20,
  socialGroup: '',
  nationality: '',
  connectionLevel: 0,
  appearance: '',
  personalHistory: '',
  alliesAndFriends: '',
  domains: '',
  health: 100,
  sanity: 100,
  strength: 0,
  dexterity: 0,
  constitution: 0,
  agility: 0,
  intelligence: 0,
  charisma: 0,
  willpower: 0,
  education: 0,
  stealth: 0,
  magic: 0,
  unarmedCombat: 0,
  meleeWeapons: 0,
  firearms: 0,
  investigation: 0,
  history: 0,
  linguistics: 0,
  dodge: 0,
  perception: 0,
  divinePowers: [],
  equipment: '',
  abilities: '',
  observations: ''
};

export const useCharacterSheet = () => {
  const [characterData, setCharacterData] = useState<CharacterData>(defaultCharacterData);
  const [currentSheetName, setCurrentSheetName] = useState<string>('');
  const [savedSheets, setSavedSheets] = useState<string[]>([]);

  // Calculate attribute bonus (divide by 5, rounded down)
  const getAttributeBonus = useCallback((value: number) => {
    return Math.floor(value / 5);
  }, []);

  // Load saved sheets list
  useEffect(() => {
    const loadSavedSheets = () => {
      const sheets: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('divine_sheet_')) {
          sheets.push(key.replace('divine_sheet_', ''));
        }
      }
      setSavedSheets(sheets);
    };

    loadSavedSheets();

    // Load last sheet if exists
    const lastSheet = localStorage.getItem('last_divine_sheet');
    if (lastSheet) {
      loadSheet(lastSheet);
    }
  }, []);

  const updateCharacterData = useCallback((updates: Partial<CharacterData>) => {
    setCharacterData(prev => ({ ...prev, ...updates }));
  }, []);

  const saveSheet = useCallback((sheetName: string) => {
    if (!sheetName.trim()) {
      toast({
        title: "Erro Divino",
        description: "Por favor, forneça um nome para a ficha sagrada.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const sheetData = {
        ...characterData,
        savedAt: new Date().toISOString(),
        version: '1.0'
      };

      localStorage.setItem(`divine_sheet_${sheetName}`, JSON.stringify(sheetData));
      localStorage.setItem('last_divine_sheet', sheetName);
      
      setCurrentSheetName(sheetName);
      setSavedSheets(prev => {
        if (!prev.includes(sheetName)) {
          return [...prev, sheetName];
        }
        return prev;
      });

      toast({
        title: "✨ Ficha Preservada",
        description: "Os pergaminhos divinos foram gravados com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error saving sheet:', error);
      toast({
        title: "⚡ Erro Místico",
        description: "Falha ao preservar os pergaminhos sagrados.",
        variant: "destructive"
      });
      return false;
    }
  }, [characterData]);

  const loadSheet = useCallback((sheetName: string) => {
    try {
      const savedData = localStorage.getItem(`divine_sheet_${sheetName}`);
      if (!savedData) {
        toast({
          title: "Pergaminho Perdido",
          description: "A ficha solicitada não foi encontrada nos arquivos divinos.",
          variant: "destructive"
        });
        return false;
      }

      const sheetData = JSON.parse(savedData);
      setCharacterData({ ...defaultCharacterData, ...sheetData });
      setCurrentSheetName(sheetName);
      localStorage.setItem('last_divine_sheet', sheetName);

      toast({
        title: "📜 Pergaminhos Recuperados",
        description: "As crônicas divinas foram restauradas com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error loading sheet:', error);
      toast({
        title: "⚡ Erro Arcano",
        description: "Falha ao decifrar os pergaminhos antigos.",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  const newSheet = useCallback(() => {
    setCharacterData(defaultCharacterData);
    setCurrentSheetName('');
    
    toast({
      title: "✨ Novo Pergaminho",
      description: "Um novo pergaminho divino foi preparado para as suas crônicas.",
    });
  }, []);

  const deleteSheet = useCallback((sheetName: string) => {
    try {
      localStorage.removeItem(`divine_sheet_${sheetName}`);
      setSavedSheets(prev => prev.filter(name => name !== sheetName));
      
      if (currentSheetName === sheetName) {
        newSheet();
      }

      toast({
        title: "🔥 Pergaminho Incinerado",
        description: "A ficha foi removida dos arquivos divinos.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting sheet:', error);
      toast({
        title: "⚡ Erro Místico",
        description: "Falha ao incinerar o pergaminho.",
        variant: "destructive"
      });
      return false;
    }
  }, [currentSheetName, newSheet]);

  return {
    characterData,
    updateCharacterData,
    currentSheetName,
    savedSheets,
    saveSheet,
    loadSheet,
    newSheet,
    deleteSheet,
    getAttributeBonus
  };
};