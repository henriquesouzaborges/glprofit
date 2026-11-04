import React, { useState } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  X, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { SYSTEM_VERSION_INFO } from '../version';

export const Footer: React.FC = () => {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  return (
    <>
      <footer 
        id="gl-system-footer"
        className="mt-auto border-t border-slate-200 bg-white/95 backdrop-blur-xs px-4 py-3 sm:px-6 text-xs text-slate-500 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Left: Branding & Current Version Badge */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span className="font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              GL PRO FIT
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-700 border border-slate-200">
              <GitBranch className="h-3 w-3 text-emerald-600" />
              Versão {SYSTEM_VERSION_INFO.version}
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline text-[11px] text-slate-400">
              Build {SYSTEM_VERSION_INFO.buildNumber} ({SYSTEM_VERSION_INFO.releaseDate})
            </span>
          </div>

          {/* Right: Status indicator and Changelog trigger */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/80 font-medium">
              <Activity className="h-3 w-3 text-emerald-600" />
              <span>Ambiente Ativo</span>
            </div>

            <button
              id="btn-view-version-changelog"
              type="button"
              onClick={() => setIsChangelogOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline transition-colors cursor-pointer"
              title="Visualizar histórico e notas de versão"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Notas de Atualização</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Version Notes / Changelog Modal */}
      {isChangelogOpen && (
        <div 
          id="modal-changelog-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsChangelogOpen(false)}
        >
          <div 
            id="modal-changelog-content"
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Notas de Atualização do Sistema</h3>
                  <p className="text-xs text-slate-300">
                    GL PRO FIT • Versão Corrente: <strong className="text-emerald-400 font-mono">{SYSTEM_VERSION_INFO.version}</strong>
                  </p>
                </div>
              </div>

              <button
                id="btn-close-changelog"
                type="button"
                onClick={() => setIsChangelogOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current Active Release Banner */}
            <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Build de Produção Estável:</strong> {SYSTEM_VERSION_INFO.versionName} ({SYSTEM_VERSION_INFO.releaseDate})
                </span>
              </div>
              <span className="font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                ONLINE
              </span>
            </div>

            {/* Changelog Timeline List */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
              {SYSTEM_VERSION_INFO.changelog.map((item, index) => {
                const isLatest = index === 0;
                return (
                  <div key={item.version} className="relative pl-6 border-l-2 border-slate-200 last:border-l-0 pb-1">
                    {/* Timeline bullet */}
                    <div 
                      className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        isLatest ? 'border-emerald-600 text-emerald-600 ring-4 ring-emerald-50' : 'border-slate-400 text-slate-400'
                      }`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${isLatest ? 'bg-emerald-600' : 'bg-slate-400'}`}></div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          isLatest ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.version}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] uppercase tracking-wide font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            Atual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mb-2">
                      {item.description}
                    </p>

                    <ul className="space-y-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      {item.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Atualizado continuamente a cada alteração do sistema.</span>
              <button
                type="button"
                onClick={() => setIsChangelogOpen(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
