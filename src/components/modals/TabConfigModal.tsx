import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  SlidersHorizontal, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { TabType } from '../Sidebar';
import { 
  getTabConfiguration, 
  saveTabConfiguration, 
  resetTabConfiguration, 
  TabConfiguration 
} from '../../services/tabSettingsService';

interface TabConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabType;
  currentSubTab?: string;
  onNavigateToGeneralSettings?: () => void;
  onToast?: (message: string) => void;
}

export const TabConfigModal: React.FC<TabConfigModalProps> = ({
  isOpen,
  onClose,
  currentTab,
  currentSubTab,
  onNavigateToGeneralSettings,
  onToast
}) => {
  const [config, setConfig] = useState<TabConfiguration | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  // Carrega as configurações sempre que o modal abre ou a aba/sub-aba muda
  useEffect(() => {
    if (isOpen) {
      const loaded = getTabConfiguration(currentTab, currentSubTab);
      setConfig(loaded);
      if (loaded.groups.length > 0) {
        setActiveGroupId(loaded.groups[0].id);
      }
      setIsSaved(false);
    }
  }, [isOpen, currentTab, currentSubTab]);

  // Tecla Esc fecha modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !config) return null;

  const handleFieldChange = (groupId: string, fieldId: string, newValue: any) => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.map(group => {
          if (group.id !== groupId) return group;
          return {
            ...group,
            fields: group.fields.map(field => {
              if (field.id !== fieldId) return field;
              return { ...field, value: newValue };
            })
          };
        })
      };
    });
  };

  const handleSave = () => {
    if (!config) return;
    saveTabConfiguration(config);
    setIsSaved(true);
    if (onToast) {
      onToast(`Configurações de ${config.title} salvas com sucesso!`);
    }
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (confirm(`Deseja restaurar as configurações padrão de "${config.title}"?`)) {
      const reset = resetTabConfiguration(currentTab, currentSubTab);
      setConfig(reset);
      if (onToast) {
        onToast(`Configurações de ${config.title} restauradas para os padrões.`);
      }
    }
  };

  const activeGroup = config.groups.find(g => g.id === activeGroupId) || config.groups[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-blue-200" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Configurações Rápidas
                </span>
                {currentSubTab && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Sub-aba: {currentSubTab.replace('_', ' ')}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight mt-0.5">
                {config.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle / Context Info */}
        <div className="px-5 sm:px-6 py-2.5 bg-blue-50/50 border-b border-blue-100/60 text-xs text-blue-900/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>{config.description}</span>
          </div>

          {onNavigateToGeneralSettings && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToGeneralSettings();
              }}
              className="hidden sm:inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline shrink-0 text-[11px] cursor-pointer"
            >
              <span>Painel Geral</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Group Tabs (if more than 1 group) */}
        {config.groups.length > 1 && (
          <div className="px-5 sm:px-6 pt-3 flex gap-2 border-b border-slate-100 overflow-x-auto">
            {config.groups.map(group => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroupId(group.id)}
                className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeGroup?.id === group.id
                    ? 'border-blue-800 text-blue-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {group.title}
              </button>
            ))}
          </div>
        )}

        {/* Modal Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-main-scrollbar">
          {activeGroup ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 pb-1">
                {activeGroup.description}
              </div>

              <div className="divide-y divide-slate-100 space-y-4">
                {activeGroup.fields.map(field => (
                  <div key={field.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="max-w-md pr-2">
                      <label className="text-xs sm:text-sm font-bold text-slate-900 block">
                        {field.label}
                      </label>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {field.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center justify-end">
                      {/* TOGGLE */}
                      {field.type === 'toggle' && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange(activeGroup.id, field.id, !field.value)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            field.value ? 'bg-blue-700' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              field.value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      )}

                      {/* NUMBER */}
                      {field.type === 'number' && (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={field.value}
                            onChange={(e) => handleFieldChange(activeGroup.id, field.id, Number(e.target.value))}
                            className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-right font-black text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                          />
                          {field.unit && (
                            <span className="text-xs font-semibold text-slate-500 min-w-8">
                              {field.unit}
                            </span>
                          )}
                        </div>
                      )}

                      {/* TEXT */}
                      {field.type === 'text' && (
                        <input
                          type="text"
                          value={field.value || ''}
                          onChange={(e) => handleFieldChange(activeGroup.id, field.id, e.target.value)}
                          className="w-48 sm:w-60 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                        />
                      )}

                      {/* SELECT */}
                      {field.type === 'select' && (
                        <select
                          value={field.value}
                          onChange={(e) => handleFieldChange(activeGroup.id, field.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-500"
                        >
                          {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              Nenhum grupo de parâmetros encontrado para esta aba.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer w-full sm:w-auto justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões da Aba</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex-1 sm:flex-initial"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex-1 sm:flex-initial"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Parâmetros</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
