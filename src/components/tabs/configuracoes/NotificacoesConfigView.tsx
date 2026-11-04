import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  GraduationCap, 
  Clock, 
  CheckSquare, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  Save, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle,
  Info,
  Sliders,
  Check
} from 'lucide-react';
import { 
  PushNotificationPreferences, 
  getPushNotificationPreferences, 
  savePushNotificationPreferences,
  DEFAULT_PUSH_PREFERENCES,
  dispatchPushNotification,
  requestBrowserNotificationPermission
} from '../../../services/notificationService';

export const NotificacoesConfigView: React.FC = () => {
  const [preferences, setPreferences] = useState<PushNotificationPreferences>(() => getPushNotificationPreferences());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [browserPermission, setBrowserPermission] = useState<string>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (key: keyof PushNotificationPreferences) => {
    setPreferences(prev => {
      const next = { ...prev, [key]: !prev[key] };
      savePushNotificationPreferences(next);
      return next;
    });
  };

  const handleResetDefaults = () => {
    if (confirm('Deseja restaurar todas as preferências de notificações para os valores padrão (todas ativadas)?')) {
      setPreferences(DEFAULT_PUSH_PREFERENCES);
      savePushNotificationPreferences(DEFAULT_PUSH_PREFERENCES);
      showToast('Preferências de notificações restauradas com sucesso!');
    }
  };

  const handleRequestBrowserPermission = async () => {
    const granted = await requestBrowserNotificationPermission();
    if (granted) {
      setBrowserPermission('granted');
      setPreferences(prev => ({ ...prev, browserPushEnabled: true }));
      showToast('Notificações no navegador ativadas com sucesso!');
    } else {
      setBrowserPermission(typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied');
      showToast('Permissão de notificações não concedida pelo navegador.');
    }
  };

  const handleTestPush = () => {
    dispatchPushNotification({
      title: 'Teste de Alerta Push',
      message: 'Este é um exemplo de como as notificações visuais aparecem para os eventos configurados!',
      type: 'success',
      module: 'sistema',
      linkTab: 'configuracoes',
      actionLabel: 'Ver Configurações'
    });
    showToast('Alerta de teste disparado!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Configurações de Notificações Push
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                  Tempo Real
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Controle granular dos alertas visuais flutuantes e sonoros para cada tipo de evento ocorrido no sistema
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTestPush}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Testar Alerta Visual</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Restaurar Padrões</span>
            </button>
          </div>
        </div>

        {/* MASTER SWITCHES CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 border-t border-slate-100">
          
          {/* 1. Master Push Toggles */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                preferences.masterPushEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  Banners Visuais Flutuantes
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {preferences.masterPushEnabled ? 'Alertas ativos na tela' : 'Desativados'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('masterPushEnabled')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                preferences.masterPushEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  preferences.masterPushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Sound Chime Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                preferences.soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {preferences.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  Som de Alerta (Chime)
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {preferences.soundEnabled ? 'Áudio ativado' : 'Silencioso'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('soundEnabled')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                preferences.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  preferences.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. Browser Push API */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                preferences.browserPushEnabled && browserPermission === 'granted' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  Alertas do Navegador
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {browserPermission === 'granted' ? 'Permitido na Área de Trabalho' : 'Requer permissão'}
                </span>
              </div>
            </div>

            {browserPermission === 'granted' ? (
              <button
                type="button"
                onClick={() => handleToggle('browserPushEnabled')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.browserPushEnabled ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.browserPushEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRequestBrowserPermission}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shrink-0 transition-colors"
              >
                Permitir
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EVENT TYPE TOGGLE CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* CATEGORY 1: CATRACA & ACESSO */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Catraca Virtual & Acessos</h3>
              <p className="text-xs text-slate-500">Notificações ao registrar passagens pela portaria física</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Event: catraca_liberada */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900">Acesso Liberado</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Alerta push a cada passagem liberada e autorizada de alunos regulares na catraca.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('catraca_liberada')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.catraca_liberada ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.catraca_liberada ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Event: catraca_bloqueada */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/40 border border-rose-200/70 hover:bg-rose-50/70 transition-colors">
              <div className="space-y-0.5 pr-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-rose-950">Acesso Bloqueado / Recusado</span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">Crítico</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Alerta urgente quando um aluno inadimplente ou não identificado tem a entrada travada.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('catraca_bloqueada')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.catraca_bloqueada ? 'bg-rose-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.catraca_bloqueada ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY 2: FINANCEIRO & VENDAS */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Financeiro, Caixa & Vendas</h3>
              <p className="text-xs text-slate-500">Alertas de faturas, inadimplência e movimentações no caixa</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Event: fatura_vencida */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 hover:bg-amber-50/70 transition-colors">
              <div className="space-y-0.5 pr-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-amber-950">Fatura Vencida / Inadimplência</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Alerta quando mensalidades atingem o vencimento sem registro de liquidação.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('fatura_vencida')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.fatura_vencida ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.fatura_vencida ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Event: pagamento_recebido */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900">Pagamento Recebido</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Confirmação instantânea na tela ao dar baixa em cobranças Pix, Cartão ou Boleto.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('pagamento_recebido')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.pagamento_recebido ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.pagamento_recebido ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Event: venda_pdv */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-slate-900">Venda Concluída no PDV</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Alerta ao finalizar vendas de produtos de balcão e comandas da lanchonete.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('venda_pdv')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.venda_pdv ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.venda_pdv ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY 3: ALUNOS & CRM */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Alunos & Funil de Vendas (CRM)</h3>
              <p className="text-xs text-slate-500">Notificações de novas matrículas e captação de leads</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Event: novo_aluno */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Novo Aluno Matriculado</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Alerta push quando uma nova matrícula ou cadastro de cliente for concluído.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('novo_aluno')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.novo_aluno ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.novo_aluno ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Event: crm_novo_lead */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span className="text-xs font-bold text-slate-900">Novo Lead / Oportunidade</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Aviso para a equipe comercial quando um novo prospect entrar no funil de vendas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('crm_novo_lead')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.crm_novo_lead ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.crm_novo_lead ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY 4: PROFESSORES, FOLHA DE PONTO & TAREFAS */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Professores, Folha & Tarefas</h3>
              <p className="text-xs text-slate-500">Alertas de presença, delegações de tarefas e agenda</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Event: folha_ponto_presenca */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <span className="text-xs font-bold text-slate-900 block">Presença / Diário Confirmado</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Alerta ao coordenador quando um professor registrar a aula dada na folha de ponto.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('folha_ponto_presenca')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.folha_ponto_presenca ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.folha_ponto_presenca ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Event: folha_ponto_lembrete */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <span className="text-xs font-bold text-slate-900 block">Lembretes de Ponto Enviados</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Confirmação visual do envio de lembretes para professores com diário pendente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('folha_ponto_lembrete')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.folha_ponto_lembrete ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.folha_ponto_lembrete ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Event: tarefa_delegada */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <span className="text-xs font-bold text-slate-900 block">Nova Tarefa Delegada</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Alerta push quando uma nova rotina do Google Tasks for atribuída ao usuário.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('tarefa_delegada')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.tarefa_delegada ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.tarefa_delegada ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Event: tarefa_concluida */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <span className="text-xs font-bold text-slate-900 block">Tarefa Concluída</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Aviso imediato quando uma tarefa for finalizada com sucesso.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('tarefa_concluida')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.tarefa_concluida ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.tarefa_concluida ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Event: agenda_compromisso */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 pr-3">
                <span className="text-xs font-bold text-slate-900 block">Novo Compromisso na Agenda</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Alerta ao agendar avaliações biomecânicas, plantões de sala ou reuniões.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('agenda_compromisso')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  preferences.agenda_compromisso ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.agenda_compromisso ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
