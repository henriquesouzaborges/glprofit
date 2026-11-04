import React from 'react';
import {
  MessageSquare,
  MessageCircle,
  Clock,
  TrendingUp,
  CheckCircle2,
  Users,
  Smartphone,
  ExternalLink,
  Bot,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { WhatsappConnectionInfo, WhatsappChat } from '../../../types';
import { WHATSAPP_AGENTS } from '../../../mockWhatsappData';

interface WhatsappDashboardViewProps {
  connection: WhatsappConnectionInfo;
  chats: WhatsappChat[];
  onNavigateSubTab: (subTab: any) => void;
}

export const WhatsappDashboardView: React.FC<WhatsappDashboardViewProps> = ({
  connection,
  chats,
  onNavigateSubTab
}) => {
  const activeChatsCount = chats.filter(c => c.status !== 'finalizado').length;
  const waitingQueueCount = chats.filter(c => c.status === 'aguardando').length;

  const hourlyVolume = [
    { hour: '06h', in: 12, out: 18 },
    { hour: '08h', in: 48, out: 62 },
    { hour: '10h', in: 95, out: 110 },
    { hour: '12h', in: 82, out: 94 },
    { hour: '14h', in: 73, out: 88 },
    { hour: '16h', in: 112, out: 130 },
    { hour: '18h', in: 146, out: 165 },
    { hour: '20h', in: 90, out: 104 },
    { hour: '22h', in: 34, out: 40 },
  ];

  const maxVolume = Math.max(...hourlyVolume.map(h => h.in + h.out));

  return (
    <div className="space-y-6">
      {/* WhatsApp Multi-Atendimento Header Banner */}
      <div className="rounded-xl border border-slate-200 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  WhatsApp Multi-Atendimento
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Conexão Ativa
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
                <span>VB SPORT</span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  (ID Empresa: 37054276)
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Número Oficial: <strong className="text-white">{connection.phone}</strong> • Meta Cloud API & Robô de IA ativos
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateSubTab('atendimento')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors"
            >
              <Headphones className="h-4 w-4" />
              Abrir Atendimento ao Vivo
            </button>
            <button
              onClick={() => onNavigateSubTab('conexoes')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              title="Abrir configurações de conexão"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Painel de Conexão
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Conversas Hoje</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <MessageCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">148</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +18.4%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Ativas: <strong>{activeChatsCount}</strong></span>
            <span>Na fila: <strong className="text-amber-600">{waitingQueueCount}</strong></span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tempo Médio 1ª Resposta</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">1m 42s</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> -35s
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Com resposta imediata do robô VB IA
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tempo Médio Atendimento</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">8m 15s</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <CheckCircle2 className="h-3 w-3" /> Alta agilidade
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Resolução de matrículas e dúvidas
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Taxa de Resolução / CSAT</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">96.8%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              4.9/5.0 ★
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Avaliações dos alunos no WhatsApp
          </div>
        </div>
      </div>

      {/* Hourly Volume Chart & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hourly chart (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Volume de Mensagens por Horário</h3>
              <p className="text-xs text-slate-500">Tráfego de mensagens enviadas e recebidas hoje na VB SPORT</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500"></span> Recebidas
              </span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <span className="h-2.5 w-2.5 rounded-xs bg-blue-700"></span> Enviadas
              </span>
            </div>
          </div>

          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-2 h-44">
              {hourlyVolume.map((item, idx) => {
                const total = item.in + item.out;
                const heightPercent = Math.max(15, (total / maxVolume) * 100);
                const inPercent = (item.in / total) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white text-[10px] rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      {item.hour}: {item.in} recebidas, {item.out} enviadas
                    </div>

                    <div className="w-full max-w-[32px] rounded-t-md overflow-hidden bg-slate-100 flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                      <div className="w-full bg-blue-700 transition-all group-hover:bg-blue-800" style={{ height: `${100 - inPercent}%` }}></div>
                      <div className="w-full bg-emerald-500 transition-all group-hover:bg-emerald-600" style={{ height: `${inPercent}%` }}></div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">{item.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span>Picos de atendimento: <strong>10h - 12h</strong> e <strong>18h - 20h</strong> (horário de saída do trabalho e treinos).</span>
            <button
              onClick={() => onNavigateSubTab('disparos')}
              className="text-blue-700 font-semibold hover:underline"
            >
              Criar Campanha de Disparo →
            </button>
          </div>
        </div>

        {/* Queues & Distribution (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Filas & Setores</h3>
            <p className="text-xs text-slate-500">Distribuição das conversas ativas</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Comercial & Matrículas (CRM)
                </span>
                <span>48% (71)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                  Recepção & Aulas Coletivas
                </span>
                <span>32% (47)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                  Financeiro & Cobrança (PIX)
                </span>
                <span>14% (21)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                  Suporte Treino & App
                </span>
                <span>6% (9)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-blue-700" />
              Robô IA em Operação
            </div>
            <p className="text-[11px] leading-relaxed">
              O bot respondeu <strong>43 conversas</strong> automaticamente sem necessidade de atendente humano hoje.
            </p>
          </div>
        </div>
      </div>

      {/* Agents Performance Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Equipe de Atendentes VB SPORT</h3>
              <p className="text-xs text-slate-500">Métricas em tempo real por atendente conectado</p>
            </div>
            <button
              onClick={() => onNavigateSubTab('conexoes')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Configurar Conexões →
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 font-bold">Atendente</th>
                  <th className="py-2.5 font-bold">Setor</th>
                  <th className="py-2.5 font-bold">Status</th>
                  <th className="py-2.5 font-bold">Em Aberto</th>
                  <th className="py-2.5 font-bold">Finalizados</th>
                  <th className="py-2.5 font-bold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WHATSAPP_AGENTS.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-700">
                        {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span>{agent.name}</span>
                    </td>
                    <td className="py-3 text-slate-600">{agent.role}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Online
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">{agent.activeChats}</td>
                    <td className="py-3 font-medium text-slate-500">{agent.activeChats * 4 + 8}</td>
                    <td className="py-3">
                      <button
                        onClick={() => onNavigateSubTab('atendimento')}
                        className="text-blue-700 font-semibold hover:underline"
                      >
                        Ver Chats
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Ações Rápidas de Atendimento</h3>
          <div className="space-y-2">
            <button
              onClick={() => onNavigateSubTab('atendimento')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <MessageSquare className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Atendimento ao Vivo</div>
                  <div className="text-[11px] text-slate-500">Responder leads e alunos no chat</div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateSubTab('kanban')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Users className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">CRM Kanban WhatsApp</div>
                  <div className="text-[11px] text-slate-500">Pipeline visual de vendas</div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateSubTab('disparos')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Disparador em Massa</div>
                  <div className="text-[11px] text-slate-500">Envio de campanhas com delay anti-ban</div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateSubTab('chatbot')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Robô & IA VB SPORT</div>
                  <div className="text-[11px] text-slate-500">Ajustar prompts e fluxos do bot</div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
