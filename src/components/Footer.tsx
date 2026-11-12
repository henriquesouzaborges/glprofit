import React from 'react';
import { SYSTEM_VERSION_INFO } from '../version';
import { ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-3 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-200">GL PRO FIT</span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> Sistema Protegido & Sincronizado
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-slate-400">
          <Cpu className="w-3.5 h-3.5" /> Versão {SYSTEM_VERSION_INFO.version} (Build {SYSTEM_VERSION_INFO.buildNumber})
        </span>
        <span>© {new Date().getFullYear()} GL PRO FIT. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
};
