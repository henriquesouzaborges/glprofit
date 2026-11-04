import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  UserCheck, 
  AlertTriangle,
  Play,
  RotateCcw,
  Smartphone
} from 'lucide-react';

interface WhatsappDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const WhatsappDashboard: React.FC<WhatsappDashboardProps> = ({ onNavigateToTab }) => {
  const [testSending, setTestSending] = useState(false);

  const sentThisMonth = 1240;
  const deliveryRate = 99.4;
  const replyRate = 82.6;
  const conversions = 24;

  const automationRules = [
    { 
      name: 'Boas-Vindas & Acesso ao App', 
      trigger: 'Ao confirmar nova matrícula', 
      status: 'ativo', 
      sent: 34, 
      replied: '98%',
      description: 'Envia dados de login do aplicativo VB SPORT Aluno e guia de treino.' 
    },
    { 
      name: 'Resgate de Ausência (7 Dias sem Catraca)', 
      trigger: '7 dias consecutivos sem passar na catraca', 
      status: 'ativo', 
      sent: 52, 
      replied: '78%',
      description: '"Sentimos sua falta! O que podemos fazer para te ajudar a treinar hoje?"' 
    },
    { 
      name: 'Parabéns no Aniversário com Brinde', 
      trigger: 'Data de aniversário do aluno', 
      status: 'ativo', 
      sent: 18, 
      replied: '94%',
      description: 'Mensagem carinhosa com voucher para retirar um shake na lanchonete da academia.' 
    },
    { 
      name: 'Lembrete Amigável de Vencimento', 
      trigger: '2 dias antes do vencimento do plano', 
      status: 'ativo', 
      sent: 112, 
      replied: '88%',
      description: 'Envia código PIX Copia e Cola para pagamento sem filas na recepção.' 
    },
    { 
      name: 'Recuperação de Mensalidade Atrasada', 
      trigger: '3 dias de atraso na fatura', 
      status: 'ativo', 
      sent: 26, 
      replied: '73%',
      description: 'Aviso respeitoso com link direto do GL Profit Pay para regularização imediata.' 
    }
  ];

  const recentMessages = [
    { recipient: 'Gian Luca Marinho', phone: '(11) 98877-6655', type: 'Lembrete PIX', time: 'Há 12 min', status: 'lido' },
    { recipient: 'Mariana Castro', phone: '(11) 97766-5544', type: 'Parabéns Aniversário', time: 'Há 45 min', status: 'respondido' },
    { recipient: 'Carlos Eduardo', phone: '(11) 96655-4433', type: 'Alerta Ausência (7d)', time: 'Há 2 horas', status: 'entregue' },
    { recipient: 'Beatriz Vasconcelos', phone: '(11) 99123-8877', type: 'Boas-Vindas Matrícula', time: 'Há 3 horas', status: 'respondido' }
  ];

  const handleTestBroadcast = () => {
    setTestSending(true);
    setTimeout(() => {
      setTestSending(false);
      alert("Disparo de teste concluído com sucesso via WhatsApp Business API!");
    }, 1200);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de WhatsApp & Automações VB SPORT</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Disparos automáticos de retenção, lembretes de pagamento, boas-vindas e engajamento
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            WhatsApp API Conectado
          </span>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('whatsapp')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs"
            >
              <Smartphone className="h-3.5 w-3.5" />
              Central WhatsApp Multi-Atendimento
            </button>
          )}

          <button
            onClick={handleTestBroadcast}
            disabled={testSending}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            {testSending ? 'Disparando...' : 'Testar Automação'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Mensagens Disparadas no Mês</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Send className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {sentThisMonth}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            Economia de ~40 horas de recepção
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa de Entrega Oficial</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {deliveryRate}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Quase zero bloqueios ou bounce</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa de Resposta / Interação</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <MessageCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {replyRate}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-700 font-bold">
            <span>Canal com maior abertura dos alunos</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Renovações &amp; Vendas pelo Bot</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">
            {conversions} matrículas
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <span>R$ 29.400 gerados via links no zap</span>
          </div>
        </div>
      </div>

      {/* Grid: Automation Rules & Recent Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Automation Rules (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Regras de Automação do WhatsApp</h3>
              <p className="text-[11px] text-slate-500">Disparos configurados para engajar e reter alunos sem trabalho manual</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              5 Gatilhos Ativos
            </span>
          </div>

          <div className="space-y-3">
            {automationRules.map((rule) => (
              <div key={rule.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    {rule.name}
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500 font-mono">{rule.sent} disparos</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {rule.replied} respondem
                    </span>
                  </div>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  {rule.description}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Gatilho: {rule.trigger}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
            <strong>Impacto Comprovado:</strong> O lembrete de PIX 2 dias antes reduz o comparecimento ao balcão e elimina 74% dos atrasos de mensalidade por simples esquecimento.
          </div>
        </div>

        {/* Live Message Log (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Últimos Disparos</h3>
              <p className="text-[11px] text-slate-500">Monitoramento ao vivo de entrega</p>
            </div>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-2.5">
            {recentMessages.map((msg, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="truncate">{msg.recipient}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{msg.time}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{msg.type}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    msg.status === 'respondido' ? 'bg-emerald-100 text-emerald-800' :
                    msg.status === 'lido' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {msg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <Smartphone className="h-4 w-4 text-emerald-600" />
              <span>Linha do WhatsApp da Academia</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              +55 (11) 97711-2233
            </div>
            <div className="text-[10px] text-slate-400">
              Conexão via QR Code criptografado de ponta a ponta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
