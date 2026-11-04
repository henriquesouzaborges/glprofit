import React, { useState, useRef, useEffect } from 'react';
import { Package, Check, ChevronDown, X, Search, Plus } from 'lucide-react';

interface PlanoTreinoMaterialSelectorProps {
  selectedMaterials: string[];
  availableMaterials: string[];
  onChange: (materials: string[]) => void;
  label?: string;
  onOpenSettings?: () => void;
}

export const PlanoTreinoMaterialSelector: React.FC<PlanoTreinoMaterialSelectorProps> = ({
  selectedMaterials = [],
  availableMaterials = [],
  onChange,
  label = 'MATERIAL (seleção de cadastrados):',
  onOpenSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleMaterial = (mat: string) => {
    if (selectedMaterials.includes(mat)) {
      onChange(selectedMaterials.filter(m => m !== mat));
    } else {
      onChange([...selectedMaterials, mat]);
    }
  };

  const handleRemoveMaterial = (mat: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedMaterials.filter(m => m !== mat));
  };

  const filteredMaterials = availableMaterials.filter(mat =>
    mat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-[10px] text-blue-700 hover:underline font-bold"
          >
            + Gerenciar Materiais
          </button>
        )}
      </div>

      {/* Caixa de Seleção Principal */}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-10 w-full p-2 rounded-xl border border-slate-300 bg-white hover:border-slate-400 focus-within:ring-2 focus-within:ring-blue-600 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs"
        >
          {/* Tags dos Selecionados */}
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selectedMaterials.length === 0 ? (
              <span className="text-xs text-slate-400 font-medium pl-1">
                Clique para selecionar os materiais cadastrados...
              </span>
            ) : (
              selectedMaterials.map((mat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold"
                >
                  <span>{mat}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveMaterial(mat, e)}
                    className="hover:bg-blue-200/80 rounded p-0.5 text-blue-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Menu Dropdown de Seleção de Materiais */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 animate-in fade-in zoom-in-95 duration-150">
            {/* Campo de Busca Rápida */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar materiais..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Lista com Checkbox */}
            <div className="max-h-48 overflow-y-auto space-y-1 custom-sidebar-scrollbar pr-1">
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  Nenhum material encontrado.
                </div>
              ) : (
                filteredMaterials.map((mat) => {
                  const isChecked = selectedMaterials.includes(mat);
                  return (
                    <div
                      key={mat}
                      onClick={() => handleToggleMaterial(mat)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-blue-700 border-blue-700 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{mat}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{selectedMaterials.length} selecionado(s)</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-md bg-blue-800 text-white font-bold hover:bg-blue-700"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
