import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Plus, 
  Trash2, 
  Package, 
  Target, 
  MapPin, 
  Dumbbell, 
  Users, 
  Check, 
  RotateCcw
} from 'lucide-react';

export interface PlanoTreinoSettings {
  materials: string[];
  objectives: string[];
  locations: string[];
  modalities: string[];
  targetGroups: string[];
}

export const DEFAULT_PLAN_SETTINGS: PlanoTreinoSettings = {
  materials: [
    'Colchonetes',
    'Cones Demarcatórios',
    'Halteres',
    'Kettlebells',
    'Mini-bands',
    'Corda Naval',
    'Barra Olímpica',
    'Anilhas',
    'Fita TRX',
    'Medicine Ball',
    'Caixa de Salto (Box)',
    'Step',
    'Escada de Agilidade',
    'Bola Suíça',
    'Elásticos Superband',
    'Bolas de Futebol',
    'Coletes de Treino',
    'Mini-barreiras de Salto',
    'Minigols / Estacas',
    'Cronômetro'
  ],
  objectives: [
    'Desenvolvimento de Força Muscular e Hipertrofia',
    'Resistência Cardiorrespiratória e Queima Calórica',
    'Coordenação Motora e Agilidade em Deslocamento',
    'Potência Muscular de Membros Inferiores',
    'Mobilidade Articular e Estabilização de Core',
    'Aprimoramento Técnico e Consciência Postural',
    'Treinamento Intervalado de Alta Intensidade (HIIT)',
    'Posse de Bola, Rondo e Transição Rápida',
    'Finalização e Chute com Potência e Precisão'
  ],
  locations: [
    'Campo de Futebol Society 1',
    'Campo de Futebol Society 2',
    'Quadra Poliesportiva Coberta',
    'Sala de Treinamento Funcional',
    'Box de Areia / Beach Sports',
    'Pista de Corrida & Agilidade',
    'Área Externa Gramada'
  ],
  modalities: [
    'Futebol Society / Coletivo',
    'Treinamento Funcional em Grupo',
    'Condicionamento Físico & HIIT',
    'Cross Training & Agilidade',
    'Beach Tennis em Turma',
    'Corrida & Atletismo Coletivo'
  ],
  targetGroups: [
    'Sub-15 Futebol (Tarde)',
    'Sub-17 Futebol (Noite)',
    'Turma Funcional Manhã (07h)',
    'Turma Funcional Noite (19h)',
    'Turma Master Intermediária',
    'Iniciantes Terça / Quinta (08h)',
    'Grupo Avançado de Performance (Sábado)'
  ]
};

interface PlanoTreinoConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlanoTreinoSettings;
  onSaveSettings: (newSettings: PlanoTreinoSettings) => void;
}

export const PlanoTreinoConfigModal: React.FC<PlanoTreinoConfigModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'objectives' | 'locations' | 'modalities' | 'targetGroups'>('materials');
  const [localSettings, setLocalSettings] = useState<PlanoTreinoSettings>(settings);
  const [newItemText, setNewItemText] = useState('');

  if (!isOpen) return null;

  const handleAddItem = () => {
    const trimmed = newItemText.trim();
    if (!trimmed) return;

    if (localSettings[activeTab].includes(trimmed)) {
      return;
    }

    setLocalSettings(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], trimmed]
    }));
    setNewItemText('');
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(i => i !== itemToRemove)
    }));
  };

  const handleRestoreDefaults = () => {
    setLocalSettings(DEFAULT_PLAN_SETTINGS);
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const TABS_CONFIG = [
    { id: 'materials', label: 'Materiais', icon: Package, count: localSettings.materials.length },
    { id: 'objectives', label: 'Objetivos', icon: Target, count: localSettings.objectives.length },
    { id: 'locations', label: 'Local de Treino', icon: MapPin, count: localSettings.locations.length },
    { id: 'modalities', label: 'Modalidade', icon: Dumbbell, count: localSettings.modalities.length },
    { id: 'targetGroups', label: 'Turma Alvo', icon: Users, count: localSettings.targetGroups.length }
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Configurações de Plano de Treino
              </h3>
              <p className="text-xs text-slate-300">
                Gerencie opções pré-cadastradas para atividades exclusivas em grupo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto shrink-0 p-1.5 gap-1">
          {TABS_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setNewItemText('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-main-scrollbar">
          {/* Adicionar novo item */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              placeholder={`Digitar novo item para ${TABS_CONFIG.find(t => t.id === activeTab)?.label}...`}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>

          {/* Lista de itens cadastrados */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Itens Ativos ({localSettings[activeTab].length}):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {localSettings[activeTab].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors text-xs font-semibold text-slate-800 group"
                >
                  <span className="truncate pr-2">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
