import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Printer, 
  Send, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';
import { WorkoutPlan, Student } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface WorkoutShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutPlan;
  student?: Student;
}

export const WorkoutShareModal: React.FC<WorkoutShareModalProps> = ({
  isOpen,
  onClose,
  workout,
  student
}) => {
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState(student?.phone || '');

  if (!isOpen) return null;

  // Build WhatsApp formatted message text
  const generateWhatsAppMessage = () => {
    let msg = `🏋️ *GL PRO FIT - Sua Nova Prescrição de Treino Está Pronta!* 🏋️\n\n`;
    msg += `Olá, *${workout.studentName}*! Seu treinador preparou uma rotina personalizada:\n\n`;
    msg += `📋 *Plano:* ${workout.title}\n`;
    msg += `🎯 *Objetivo:* ${workout.objective}\n`;
    msg += `⚡ *Nível:* ${workout.level}\n`;
    msg += `📅 *Vigência:* ${workout.startDate} até ${workout.validUntil}\n`;
    msg += `👨‍🏫 *Treinador:* ${workout.instructor}\n\n`;
    msg += `*RESUMO DAS DIVISÕES:* \n`;

    workout.splits.forEach((split, sIdx) => {
      msg += `\n📌 *${split.name}*\n`;
      split.exercises.forEach((ex, exIdx) => {
        msg += ` ${exIdx + 1}. *${ex.name}* — ${ex.sets}x${ex.reps} | ${ex.restSec}s desc.`;
        if (ex.method && ex.method !== 'Tradicional') {
          msg += ` (${ex.method})`;
        }
        if (ex.weightKg) {
          msg += ` [${ex.weightKg}kg]`;
        }
        msg += `\n`;
      });
    });

    if (workout.notes) {
      msg += `\n💡 *Orientações:* ${workout.notes}\n`;
    }

    msg += `\n📲 Acesse o App GL PRO FIT para registrar suas cargas e conferir os vídeos de execução!`;
    return msg;
  };

  const messageText = generateWhatsAppMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    sendWhatsAppMessage(customPhone, messageText, student?.name, student?.id);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Enviar & Imprimir Ficha de Treino
              </h3>
              <p className="text-xs text-emerald-100">
                Compartilhamento direto via WhatsApp ou impressão profissional
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* WhatsApp Box */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Envio Rápido por WhatsApp</span>
              </div>
              
              <div className="text-xs text-slate-600">
                Insira o telefone do aluno (com DDD) para enviar o treino formatado com 1 clique:
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="flex-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold focus:border-emerald-600 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>

            {/* Print / PDF Box */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <Printer className="w-4 h-4" />
                <span>Ficha para Impressão / PDF</span>
              </div>

              <div className="text-xs text-slate-600">
                Gera o layout oficial da academia com logo GL PRO FIT e campos para anotação semanal:
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Salvar em PDF</span>
              </button>
            </div>
          </div>

          {/* Text Message Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Prévia do Texto Gerado
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed border border-slate-800">
              {messageText}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
