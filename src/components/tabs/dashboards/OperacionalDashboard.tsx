import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  Users, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { AccessLog } from '../../../types';

interface OperacionalDashboardProps {
  accessLogs: AccessLog[];
  onNavigateToTab?: (tab: string) => void;
}

export const OperacionalDashboard: React.FC<OperacionalDashboardProps> = ({ accessLogs, onNavigateToTab }) => {
  const [selectedDay, setSelectedDay] = useState<'hoje' | 'ontem' | 'semana'>('hoje');

  const accessesToday = 184;
  const currentInGym = 42;
  const gymCapacity = 75;
  const occupancyRate = ((currentInGym / gymCapacity) * 100).toFixed(0);
  const avgWorkoutMinutes = 58;

  const hourlyFlow = [
    { hour: '06:00', accesses: 18, capacity: 45, label: 'Moderado' },
    { hour: '07:00', accesses: 34, capacity: 85, label: 'Intenso' },
    { hour: '08:00', accesses: 26, capacity: 65, label: 'Moderado' },
    { hour: '09:00', accesses: 16, capacity: 40, label: 'Tranquilo' },
    { hour: '10:00', accesses: 12, capacity: 30, label: 'Tranquilo' },
    { hour: '11:00', accesses: 14, capacity: 35, label: 'Tranquilo' },
    { hour: '12:00', accesses: 24, capacity: 60, label: 'Almoço' },
    { hour: '13:00', accesses: 15, capacity: 38, label: 'Tranquilo' },
    { hour: '14:00', accesses: 10, capacity: 25, label: 'Baixo' },
    { hour: '15:00', accesses: 18, capacity: 45, label: 'Moderado' },
    { hour: '16:00', accesses: 25, capacity: 62, label: 'Subindo' },
    { hour: '17:00', accesses: 32, capacity: 80, label: 'Intenso' },
    { hour: '18:00', accesses: 41, capacity: 98, label: 'Pico Máximo', isPeak: true },
    { hour: '19:00', accesses: 38, capacity: 92, label: 'Muito Cheio' },
    { hour: '20:00', accesses: 28, capacity: 70, label: 'Moderado' },
    { hour: '21:00', accesses: 15, capacity: 38, label: 'Esvaziando' }
  ];

  const equipments = [
    { name: 'Esteira Movement RT250 #01', sector: 'Cardio', status: 'operacional', lastCheck: '02/09/2026' },
    { name: 'Esteira Movement RT250 #02', sector: 'Cardio', status: 'operacional', lastCheck: '02/09/2026' },
    { name: 'Esteira Movement RT250 #03', sector: 'Cardio', status: 'operacional', lastCheck: '01/09/2026' },
    { name: 'Esteira Movement RT250 #04', sector: 'Cardio', status: 'manutencao', lastCheck: 'Ajuste de lona agendado' },
    { name: 'Bicicleta Ergométrica Indoor #01 a #08', sector: 'Spinning', status: 'operacional', lastCheck: 'Todas calibradas' },
    { name: 'Leg Press 45º Articulado', sector: 'Musculação', status: 'operacional', lastCheck: 'Lubrificado' },
    { name: 'Crossover com Polia Regulável', sector: 'Musculação', status: 'operacional', lastCheck: 'Cabos de aço novos' },
    { name: 'Ar-Condicionado Inverter Salão Principal', sector: 'Climatização', status: 'operacional', lastCheck: 'Filtro limpo 03/09' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Activity className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard Operacional & Manutenção</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Lotação instantânea, fluxo de catraca, conservação de máquinas e incidentes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('catraca')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs"
            >
              Abrir Catraca ao Vivo <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Acessos na Catraca Hoje</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {accessesToday}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <span>98.9% de liberações com biometria/cartão</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Ocupação no Salão Agora</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {currentInGym} / {gymCapacity} alunos
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600 font-bold">
            <span>{occupancyRate}% da capacidade de conforto</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Tempo Médio por Treino</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {avgWorkoutMinutes} min
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Rotatividade rápida dos aparelhos</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Equipamentos Operacionais</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Wrench className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            41 / 42 (97.6%)
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <span>Apenas 1 equipamento em ajuste preventivo</span>
          </div>
        </div>
      </div>

      {/* Hourly Flow Chart & Machine Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hourly Flow (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Curva de Ocupação da Academia por Horário</h3>
              <p className="text-[11px] text-slate-500">Média de alunos simultâneos das 06:00 às 22:00</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
              <Flame className="h-3 w-3" /> Pico: 18h00
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {hourlyFlow.map((item) => (
              <div key={item.hour} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-mono font-medium text-slate-500">{item.hour}</span>
                <div className="flex-1 h-4 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isPeak ? 'bg-red-600' : item.capacity > 75 ? 'bg-amber-500' : 'bg-blue-700'
                    }`}
                    style={{ width: `${item.capacity}%` }}
                  />
                </div>
                <span className={`w-28 text-right font-mono text-[11px] ${
                  item.isPeak ? 'text-red-700 font-bold' : 'text-slate-600'
                }`}>
                  {item.accesses} al. ({item.capacity}%)
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span><strong>Recomendação Operacional:</strong> Reforçar 1 professor na musculação entre 17h30 e 19h30 para atendimento às correções posturais.</span>
          </div>
        </div>

        {/* Equipment Status (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conservação & Máquinas</h3>
              <p className="text-[11px] text-slate-500">Inspeções e manutenções do parque</p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {equipments.map((eq, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 truncate">{eq.name}</span>
                  {eq.status === 'operacional' ? (
                    <span className="shrink-0 flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> 100%
                    </span>
                  ) : (
                    <span className="shrink-0 flex items-center gap-1 text-[10px] text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                      <Wrench className="h-3 w-3" /> Manutenção
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Setor: {eq.sector}</span>
                  <span className="text-[10px]">{eq.lastCheck}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert("Checklist diário de abertura e fechamento enviado ao responsável!")}
            className="w-full py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Emitir Checklist de Abertura
          </button>
        </div>
      </div>
    </div>
  );
};
