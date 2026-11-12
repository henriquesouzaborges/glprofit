import React, { useState } from 'react';
import { MessageCircle, Send, ChevronRight } from 'lucide-react';
import { Lead, Student } from '../../../types';

interface WhatsappDashboardProps {
  leads?: Lead[];
  students?: Student[];
  onNavigateToTab?: (tab: string) => void;
}

export const WhatsappDashboard: React.FC<WhatsappDashboardProps> = ({ leads = [], students = [], onNavigateToTab }) => {
  const totalContacts = leads.length + students.length;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de WhatsApp & Automações VB SPORT</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Métricas de disparos automáticos baseadas na base real de contatos</p>
        </div>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('whatsapp')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs cursor-pointer"
          >
            Abrir WhatsApp <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {totalContacts === 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-xs text-blue-900">
          Nenhum contato ou lead cadastrado para disparos. Cadastre alunos ou leads para iniciar as automações de WhatsApp.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Contatos Aptos para Disparo</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalContacts}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Automações Ativas</div>
          <div className="mt-2 text-2xl font-black text-slate-900">5 regras</div>
        </div>
      </div>
    </div>
  );
};
