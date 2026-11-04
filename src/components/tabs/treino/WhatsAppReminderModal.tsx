import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Check, 
  Clock, 
  Sparkles, 
  Bell, 
  Award, 
  Calendar, 
  ExternalLink, 
  Dumbbell, 
  ShieldCheck,
  CheckCheck,
  Smartphone,
  Save,
  Flame,
  Settings2
} from 'lucide-react';
import { Student } from '../../../types';

export interface WhatsAppReminderConfig {
  studentId: string;
  enabled: boolean;
  phone: string;
  triggerType: 'on_new_load' | 'weekly_review' | 'pr_only';
  weeklyDay: string;
  weeklyTime: string;
  includePrMetrics: boolean;
  includeAppLink: boolean;
  customGreeting: string;
  lastSentAt?: string;
}

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  selectedExerciseName: string;
  latestWeightKg: number;
  latestReps: number;
  estimated1RM: number;
  progressionKg?: number;
  currentConfig?: WhatsAppReminderConfig;
  onSaveConfig: (config: WhatsAppReminderConfig) => void;
  onTriggerSendNow?: (phone: string, text: string) => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  student,
  selectedExerciseName,
  latestWeightKg,
  latestReps,
  estimated1RM,
  progressionKg = 0,
  currentConfig,
  onSaveConfig,
  onTriggerSendNow
}) => {
  // Initial config states
  const [enabled, setEnabled] = useState<boolean>(currentConfig?.enabled ?? true);
  const [phone, setPhone] = useState<string>(
    currentConfig?.phone || student.phone || '(11) 98765-4321'
  );
  const [triggerType, setTriggerType] = useState<'on_new_load' | 'weekly_review' | 'pr_only'>(
    currentConfig?.triggerType || 'on_new_load'
  );
  const [weeklyDay, setWeeklyDay] = useState<string>(currentConfig?.weeklyDay || 'Segunda-feira');
  const [weeklyTime, setWeeklyTime] = useState<string>(currentConfig?.weeklyTime || '08:00');
  const [includePrMetrics, setIncludePrMetrics] = useState<boolean>(
    currentConfig?.includePrMetrics ?? true
  );
  const [includeAppLink, setIncludeAppLink] = useState<boolean>(
    currentConfig?.includeAppLink ?? true
  );
  const [customGreeting, setCustomGreeting] = useState<string>(
    currentConfig?.customGreeting || 'Fala'
  );

  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);

  if (!isOpen) return null;

  // Clean phone number for WhatsApp link (removes non-digits)
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedWhatsAppPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  // Current formatted timestamp
  const currentTimeString = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Dynamic WhatsApp message text
  const generateMessageText = () => {
    const studentFirstName = student.name.split(' ')[0];
    const coachName = 'Prof. Gianluca Marinho';

    let text = `${customGreeting}, ${studentFirstName}! 🏋️‍♂️💪\n\n`;
    text += `O seu treinador *${coachName}* acabou de registrar uma atualização no seu *Controle de Carga* no *GL PRO FIT*!\n\n`;
    text += `🔥 *Detalhes da Nova Marca:*\n`;
    text += `• *Exercício:* ${selectedExerciseName}\n`;
    text += `• *Carga Atual:* ${latestWeightKg} kg (${latestReps} reps)\n`;

    if (includePrMetrics) {
      text += `• *1RM Teórico Estimado:* ${estimated1RM} kg\n`;
      if (progressionKg > 0) {
        text += `• *Progressão Acumulada:* +${progressionKg} kg de evolução! 🚀\n`;
      }
    }

    text += `\nParabéns pela dedicação! Manter a sobrecarga progressiva com técnica correta é a chave para os seus resultados.\n`;

    if (includeAppLink) {
      text += `\n📲 *Acompanhe seu gráfico de evolução completo no app:*\nhttps://app.glprofit.com.br/cargas\n`;
    }

    text += `\nBons treinos! 🔥👊\n_Equipe GL PRO FIT • CT Ville Blanche Sport_`;

    return text;
  };

  const fullMessageText = generateMessageText();

  const handleSave = () => {
    const newConfig: WhatsAppReminderConfig = {
      studentId: student.id,
      enabled,
      phone,
      triggerType,
      weeklyDay,
      weeklyTime,
      includePrMetrics,
      includeAppLink,
      customGreeting,
      lastSentAt: new Date().toISOString()
    };

    onSaveConfig(newConfig);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleSendNow = () => {
    if (onTriggerSendNow) {
      onTriggerSendNow(formattedWhatsAppPhone, fullMessageText);
    } else {
      const url = `https://api.whatsapp.com/send?phone=${formattedWhatsAppPhone}&text=${encodeURIComponent(fullMessageText)}`;
      window.open(url, '_blank');
    }

    setIsSentSuccess(true);
    setTimeout(() => setIsSentSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
              <MessageCircle className="w-5 h-5 fill-white text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Lembrete Automático via WhatsApp
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                  Notificação Inteligente
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Configure notificações automáticas para avisar o aluno sobre atualizações de carga e recordes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-slate-800">
          
          {/* Student & Phone Header Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{student.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                    {student.code || 'GL001'}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Plano: <strong>{student.planName || 'Anual Black VIP'}</strong> • Status: <span className="text-emerald-600 font-semibold">Ativo</span>
                </div>
              </div>
            </div>

            {/* Toggle Status */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-800">
                  {enabled ? 'Automação Ativa' : 'Automação Desativada'}
                </span>
                <span className="block text-[10px] text-slate-500">
                  {enabled ? 'Notifica o aluno' : 'Pausado para este aluno'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setEnabled(prev => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  enabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Grid Layout: Settings (Left) + WhatsApp Live Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column: Triggers and Settings (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* WhatsApp Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  Número do WhatsApp do Aluno (com DDD)
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-600">
                    🇧🇷 +55
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Trigger Frequency / Regra de Disparo */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-emerald-600" />
                  Gatilho de Disparo da Notificação
                </label>

                <div className="space-y-2">
                  {/* Option 1: On New Load */}
                  <label 
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      triggerType === 'on_new_load' 
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="triggerType"
                      checked={triggerType === 'on_new_load'}
                      onChange={() => setTriggerType('on_new_load')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span>⚡ Ao Registrar Nova Carga (Recomendado)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-extrabold">Instantâneo</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Dispara o lembrete assim que o treinador registrar ou atualizar uma nova carga no sistema.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: PR Only */}
                  <label 
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      triggerType === 'pr_only' 
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="triggerType"
                      checked={triggerType === 'pr_only'}
                      onChange={() => setTriggerType('pr_only')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span>🏆 Apenas quando Bater Recorde Pessoal (PR)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-extrabold">Celebração</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Envia apenas quando a nova carga superar o 1RM histórico do exercício, comemorando a conquista.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: Weekly Review */}
                  <label 
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      triggerType === 'weekly_review' 
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="triggerType"
                      checked={triggerType === 'weekly_review'}
                      onChange={() => setTriggerType('weekly_review')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs flex-1">
                      <div className="font-bold text-slate-900">
                        📅 Lembrete Semanal Programado
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Dispara semanalmente com o resumo das cargas atualizadas da semana.
                      </p>

                      {triggerType === 'weekly_review' && (
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-200">
                          <div>
                            <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Dia da Semana:</span>
                            <select
                              value={weeklyDay}
                              onChange={(e) => setWeeklyDay(e.target.value)}
                              className="w-full rounded-lg border border-slate-300 bg-white p-1.5 text-xs font-bold text-slate-800"
                            >
                              <option value="Segunda-feira">Segunda-feira</option>
                              <option value="Quarta-feira">Quarta-feira</option>
                              <option value="Sexta-feira">Sexta-feira</option>
                              <option value="Domingo">Domingo</option>
                            </select>
                          </div>

                          <div>
                            <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Horário:</span>
                            <input
                              type="time"
                              value={weeklyTime}
                              onChange={(e) => setWeeklyTime(e.target.value)}
                              className="w-full rounded-lg border border-slate-300 bg-white p-1.5 text-xs font-bold text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Message Customization Options */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700">
                  Conteúdo da Notificação
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePrMetrics}
                      onChange={(e) => setIncludePrMetrics(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Incluir 1RM Teórico e indicador de sobrecarga progressiva (+kg)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAppLink}
                      onChange={(e) => setIncludeAppLink(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Incluir link direto para o aluno acessar o gráfico no aplicativo</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Realistic WhatsApp Live Chat Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Pré-visualização no WhatsApp
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Simulação Real</span>
              </label>

              {/* WhatsApp Smartphone Mockup Container */}
              <div className="flex-1 rounded-2xl bg-[#efeae2] border border-slate-300 shadow-inner flex flex-col overflow-hidden min-h-[340px]">
                
                {/* Chat Top Header */}
                <div className="bg-[#075e54] text-white p-2.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white text-[#075e54] font-black text-xs flex items-center justify-center">
                      GL
                    </div>
                    <div className="leading-tight">
                      <div className="font-bold text-xs">GL PRO FIT • Central</div>
                      <div className="text-[9px] text-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        online agora
                      </div>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>

                {/* Message Bubble Container */}
                <div className="flex-1 p-3 flex flex-col justify-end space-y-2 overflow-y-auto">
                  <div className="text-center">
                    <span className="px-2 py-0.5 rounded-md bg-white/70 text-[9px] text-slate-600 shadow-2xs">
                      HOJE
                    </span>
                  </div>

                  {/* Incoming WhatsApp Bubble */}
                  <div className="relative self-start max-w-[95%] bg-[#dcf8c6] rounded-xl rounded-tl-none p-3 shadow-xs border border-[#cbebb2] text-xs text-slate-900 space-y-1.5 leading-relaxed whitespace-pre-line break-words">
                    {/* Simulated Tail */}
                    <div className="absolute top-0 -left-1.5 w-0 h-0 border-t-8 border-t-[#dcf8c6] border-l-8 border-l-transparent"></div>

                    {fullMessageText}

                    {/* Timestamp & double checks */}
                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500 pt-1">
                      <span>{currentTimeString}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Chat Footer Mockup */}
                <div className="bg-slate-100 p-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate">Para: <strong>{phone || 'Número do Aluno'}</strong></span>
                  <button
                    type="button"
                    onClick={handleSendNow}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Disparar Agora</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Feedback Banners */}
          {isSentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Janela de envio do WhatsApp aberta com sucesso! A mensagem foi pré-formatada.</span>
            </div>
          )}

          {isSavedSuccess && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-300 text-blue-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Configuração de lembrete automático do WhatsApp salva com sucesso!</span>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Disparos automáticos serão realizados para <strong>{student.name}</strong> quando configurado.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSendNow}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
              title="Abrir o WhatsApp com a mensagem pronta para envio imediato"
            >
              <Send className="w-4 h-4" />
              <span>Enviar WhatsApp Agora</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configuração</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WhatsAppReminderModal;
