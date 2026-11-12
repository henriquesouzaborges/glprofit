import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Calendar,
  Clock,
  User,
  Moon,
  BatteryCharging,
  Flame,
  Zap,
  Smile,
  Activity,
  Droplets,
  Scale,
  TrendingDown,
  CheckCircle2,
  FileText,
  X,
  Save,
  Trash2,
  Edit3
} from 'lucide-react';
import { Student, WellnessCheckin, CheckinPeriod, PainPoint } from '../../../types';
import { AnatomicalMannequin, AnatomyDivision } from './AnatomicalMannequin';

interface CheckinFormViewProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudentId: (id: string) => void;
  onSaveCheckin: (checkin: WellnessCheckin) => void;
  onNavigateToPainMap?: () => void;
  mappedPainPoints?: PainPoint[];
}

export const CheckinFormView: React.FC<CheckinFormViewProps> = ({
  students,
  selectedStudentId,
  onSelectStudentId,
  onSaveCheckin,
  onNavigateToPainMap,
  mappedPainPoints = []
}) => {
  const activeStudent = (students && students.find(s => s.id === selectedStudentId)) || students[0] || {
    id: 'std-empty',
    name: 'Nenhum Aluno Selecionado',
    code: 'AL-0000',
    email: '',
    phone: '',
    status: 'cancelado',
    planId: 'plan-free',
    planName: 'Sem Plano',
    planPrice: 0,
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    dueDate: '2026-01-01',
    pendingAmount: 0,
    photo: '',
    birthDate: '2000-01-01',
    cpf: ''
  };

  // Form Fields
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formPeriod, setFormPeriod] = useState<CheckinPeriod>('manha');
  
  // 0 to 10 Scales
  const [sleepQuality, setSleepQuality] = useState<number>(8); // 0 a 10
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepDisruptions, setSleepDisruptions] = useState<number>(1);
  const [pse, setPse] = useState<number>(3); // 0 a 10 (Fadiga / Percepção Subjetiva de Esforço)
  const [eva, setEva] = useState<number>(2); // 0 a 10 (Dor Muscular)
  const [stressLevel, setStressLevel] = useState<number>(3); // 0 a 10
  const [moodState, setMoodState] = useState<number>(8); // 0 a 10
  const [psr, setPsr] = useState<number>(8); // 0 a 10 (Percepção Subjetiva de Recuperação)
  
  // New Requested Fields
  const [trainingDurationMinutes, setTrainingDurationMinutes] = useState<number>(60);
  const [weightPre, setWeightPre] = useState<number>(75.0);
  const [weightPost, setWeightPost] = useState<number>(74.3);
  const [jumpCmjPre, setJumpCmjPre] = useState<number>(38.5);
  const [jumpCmjPost, setJumpCmjPost] = useState<number>(37.2);
  const [hydrationLiters, setHydrationLiters] = useState<number>(3.0);
  const [notes, setNotes] = useState<string>('');

  // Pain Map Overlaid Card State
  const [formPainPoints, setFormPainPoints] = useState<PainPoint[]>(mappedPainPoints);
  const [showPainMapModal, setShowPainMapModal] = useState<boolean>(false);
  const [painBodySide, setPainBodySide] = useState<'anterior' | 'posterior'>('anterior');
  const [activePainModalDivision, setActivePainModalDivision] = useState<AnatomyDivision | null>(null);
  const [modalPainScale, setModalPainScale] = useState<number>(4);
  const [modalPainType, setModalPainType] = useState<'muscular' | 'articular' | 'tendinea' | 'neural' | 'trauma'>('muscular');
  const [modalPainNotes, setModalPainNotes] = useState<string>('');

  useEffect(() => {
    if (mappedPainPoints && mappedPainPoints.length > 0) {
      setFormPainPoints(mappedPainPoints);
    }
  }, [mappedPainPoints]);

  const handleAddPainPoint = () => {
    if (!activePainModalDivision) return;
    const newPoint: PainPoint = {
      id: `pain-${Date.now()}`,
      region: activePainModalDivision.label,
      bodySide: activePainModalDivision.bodySide,
      painScale: modalPainScale,
      painType: modalPainType,
      category: activePainModalDivision.category,
      notes: modalPainNotes
    };

    setFormPainPoints(prev => [...prev.filter(p => p.region !== activePainModalDivision.label), newPoint]);
    if (modalPainScale > eva) {
      setEva(modalPainScale);
    }
    setActivePainModalDivision(null);
    setModalPainNotes('');
  };

  const handleRemovePainPoint = (pointId: string) => {
    setFormPainPoints(prev => prev.filter(p => p.id !== pointId));
  };

  // Real-time calculations
  // Dehydration calculation (Delta weight)
  const weightDeltaKg = Number((weightPre - weightPost).toFixed(2));
  const dehydrationPercent = weightPre > 0 ? Number(((weightDeltaKg / weightPre) * 100).toFixed(1)) : 0;

  // CMJ neuromuscular fatigue calculation
  const cmjDeltaCm = Number((jumpCmjPost - jumpCmjPre).toFixed(1));
  const cmjFatiguePercent = jumpCmjPre > 0 ? Number(((cmjDeltaCm / jumpCmjPre) * 100).toFixed(1)) : 0;

  // Hooper Index adaptado para 0-10:
  // Invertido de sono (10 - sleepQuality) + pse + eva + stressLevel
  const hooperIndex = Math.max(0, 10 - sleepQuality) + pse + eva + stressLevel; // 0 a 40
  // Readiness (0 a 100%)
  const readinessScore = Math.max(10, Math.min(100, Math.round(100 - (hooperIndex / 40) * 80 + (psr * 2))));
  const readinessStatus: 'otimo' | 'moderado' | 'alerta' = 
    readinessScore >= 75 ? 'otimo' : readinessScore >= 55 ? 'moderado' : 'alerta';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCheckin: WellnessCheckin = {
      id: `chk-${Date.now()}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      date: formDate,
      period: formPeriod,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sleepQuality,
      sleepHours,
      sleepDisruptions,
      pse,
      eva,
      stressLevel,
      moodState,
      psr,
      trainingDurationMinutes,
      weightPre,
      weightPost,
      jumpCmjPre,
      jumpCmjPost,
      hooperIndex,
      readinessScore,
      readinessStatus,
      painPoints: formPainPoints.length > 0 
        ? formPainPoints 
        : (eva > 3 ? [
            {
              id: `pain-${Date.now()}`,
              region: 'Geral / Relatado em Check-in',
              bodySide: 'anterior',
              painScale: eva,
              painType: 'muscular',
              notes: notes || 'Desconforto muscular informado no check-in.'
            }
          ] : []),
      hydrationLiters,
      notes,
      coachAlertSent: readinessStatus === 'alerta'
    };

    onSaveCheckin(newCheckin);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Student Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" />
            Formulário Diário de Check-in de Bem-Estar
          </h3>
          <p className="text-xs text-slate-500">
            Preencha os marcadores de sono, PSE, EVA, estresse, recuperação e testes fisiológicos pré/pós treino.
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Aluno(a):</span>
          <div className="relative w-full md:w-64">
            <select
              value={selectedStudentId}
              onChange={(e) => onSelectStudentId(e.target.value)}
              className="w-full pl-8 pr-7 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 focus:border-blue-700 focus:outline-hidden cursor-pointer transition-colors"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status})
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Single Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Context & Period */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            1. Identificação e Período
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Data da Sessão</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Período do Treino</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['manha', 'tarde', 'noite'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormPeriod(p)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border capitalize transition-colors cursor-pointer text-center ${
                      formPeriod === p
                        ? 'bg-blue-800 text-white border-blue-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {p === 'manha' ? 'Manhã' : p === 'tarde' ? 'Tarde' : 'Noite'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Duração do Treino (Minutos)</label>
              <input
                type="number"
                min="10"
                max="240"
                value={trainingDurationMinutes}
                onChange={(e) => setTrainingDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 2: 0-10 Scales (Sono, PSE, EVA, Estresse, Humor, PSR) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              2. Questionário de Prontidão & Fadiga (Escala 0 a 10)
            </h4>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Protocolo Escala 0-10
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Qualidade do Sono */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  Qualidade do Sono
                </span>
                <span className="text-sm font-black text-indigo-700">{sleepQuality} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0: Péssimo / Insônia</span>
                <span>5: Regular</span>
                <span>10: Excelente / Reparador</span>
              </div>
              <div className="flex items-center gap-3 pt-2 text-xs">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 block">Horas Dormidas</span>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="14"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 block">Despertares</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={sleepDisruptions}
                    onChange={(e) => setSleepDisruptions(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
              </div>
            </div>

            {/* PSE (Percepção Subjetiva de Esforço / Fadiga) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BatteryCharging className="w-4 h-4 text-amber-600" />
                  PSE (Percepção Subjetiva de Esforço / Fadiga)
                </span>
                <span className="text-sm font-black text-amber-700">{pse} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={pse}
                onChange={(e) => setPse(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0: Totalmente descansado</span>
                <span>5: Moderado</span>
                <span>10: Exaustão extrema</span>
              </div>
            </div>

            {/* EVA (Escala Visual Analógica de Dor Muscular) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" />
                  EVA (Dor Muscular Tardia / Incômodo)
                </span>
                <span className="text-sm font-black text-rose-700">{eva} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={eva}
                onChange={(e) => setEva(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0: Nenhuma dor</span>
                <span>5: Desconforto moderado</span>
                <span>10: Dor incapacitante</span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPainMapModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all cursor-pointer shadow-xs"
                    title="Abrir card sobreposto do mapa anatômico de dor"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-white" />
                    <span>{formPainPoints.length > 0 ? 'Editar no mapa' : 'Editar no mapa (Mapear dor)'}</span>
                  </button>
                  {formPainPoints.length > 0 && (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      {formPainPoints.length} ponto(s) mapeado(s)
                    </span>
                  )}
                </div>

                {formPainPoints.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {formPainPoints.map(point => (
                      <div
                        key={point.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-900 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 font-black text-[10px]">
                            EVA {point.painScale}
                          </span>
                          <span className="font-bold truncate">{point.region}</span>
                          <span className="text-[10px] text-slate-500 capitalize">({point.painType})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePainPoint(point.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          title="Remover ponto de dor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Nível de Estresse */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-sky-600" />
                  Nível de Estresse Mental
                </span>
                <span className="text-sm font-black text-sky-700">{stressLevel} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0: Muito Calmo / Relaxado</span>
                <span>5: Neutro</span>
                <span>10: Extremamente Estressado</span>
              </div>
            </div>

            {/* Estado de Humor / Disposição */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-emerald-600" />
                  Estado de Humor / Disposição
                </span>
                <span className="text-sm font-black text-emerald-700">{moodState} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={moodState}
                onChange={(e) => setMoodState(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0: Muito Desmotivado</span>
                <span>5: Normal</span>
                <span>10: Máxima Motivação</span>
              </div>
            </div>

            {/* PSR (Percepção Subjetiva de Recuperação) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-blue-600" />
                  PSR (Percepção Subjetiva de Recuperação)
                </span>
                <span className="text-sm font-black text-blue-700">{psr} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={psr}
                onChange={(e) => setPsr(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0: Nada Recuperado</span>
                <span>5: Recuperação Parcial</span>
                <span>10: Totalmente Recuperado</span>
              </div>
            </div>

          </div>
        </div>

        {/* Step 3: Fisiologia & Carga (Peso Pré/Pós e Salto CMJ Pré/Pós) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-600" />
              3. Controle Fisiológico (Hidratação & Potência Neuromuscular)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Peso Pré e Pós Exercício */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-purple-600" />
                  Peso Corporal (Perda Hídrica)
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  dehydrationPercent > 2 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Perda: {weightDeltaKg} kg ({dehydrationPercent}%)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Peso Pré-Treino (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightPre}
                    onChange={(e) => setWeightPre(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Peso Pós-Treino (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightPost}
                    onChange={(e) => setWeightPost(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Uma perda hídrica acima de 2% do peso corporal sinaliza desidratação e risco de queda de rendimento.
              </p>
            </div>

            {/* Salto CMJ Pré e Pós Exercício */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Salto Vertical CMJ (Fadiga Neuromuscular)
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  cmjFatiguePercent < -8 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Variação: {cmjDeltaCm > 0 ? `+${cmjDeltaCm}` : cmjDeltaCm} cm ({cmjFatiguePercent}%)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">CMJ Pré-Treino (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={jumpCmjPre}
                    onChange={(e) => setJumpCmjPre(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">CMJ Pós-Treino (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={jumpCmjPost}
                    onChange={(e) => setJumpCmjPost(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Quedas superiores a 8-10% no salto CMJ pós-treino indicam fadiga do sistema nervoso central.
              </p>
            </div>

          </div>

          {/* Hidratação & Observações */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Consumo Hídrico Diário (Litros)</label>
              <input
                type="number"
                step="0.1"
                value={hydrationLiters}
                onChange={(e) => setHydrationLiters(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Observações do Atleta / Feedback</label>
              <input
                type="text"
                placeholder="Ex: Sentiu boa disposição no aquecimento, alimentação balanceada..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:shadow-blue-900/20"
          >
            Salvar Check-in de Bem-Estar
          </button>
        </div>

      </form>

      {/* ========================================================================= */}
      {/* CARD SOBREPOSTO: MAPA ANATÔMICO DE DOR (MODAL ACIONADO PELO BOTÃO DO CHECK-IN) */}
      {/* ========================================================================= */}
      {showPainMapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full p-5 sm:p-7 space-y-6 animate-in zoom-in-95 my-8">
            {/* Cabeçalho do Card Sobreposto */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 inline-block mb-1.5">
                  Card Sobreposto • Check-in de {activeStudent.name}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-600" />
                  <span>Mapa Anatômico de Dor: Divisões Musculares & Articulares</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Clique na região do boneco (anterior ou posterior) para relatar a dor e a intensidade na Escala EVA (0 a 10).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPainMapModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Boneco Anatômico Interativo */}
            <AnatomicalMannequin
              bodySide={painBodySide}
              onBodySideChange={setPainBodySide}
              registeredPainPoints={formPainPoints}
              onSelectDivision={(division) => setActivePainModalDivision(division)}
              onRemovePainPoint={handleRemovePainPoint}
            />

            {/* Rodapé do Card Sobreposto */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <span className="font-bold">Aluno:</span>
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-bold">{activeStudent.name}</span>
                <span className="text-slate-400">•</span>
                <span className="font-bold text-rose-700">{formPainPoints.length} ponto(s) mapeado(s)</span>
              </div>

              <button
                type="button"
                onClick={() => setShowPainMapModal(false)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Salvar e Fechar Mapa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SECUNDÁRIO: REGISTRAR DOR EM REGIÃO DO MAPA */}
      {activePainModalDivision && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  Relatar Dor: {activePainModalDivision.label}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActivePainModalDivision(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Intensidade da Dor (EVA: 0 a 10)</span>
                  <span className="text-rose-600 font-black">{modalPainScale} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={modalPainScale}
                  onChange={(e) => setModalPainScale(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0: Sem Dor</span>
                  <span>5: Moderada</span>
                  <span>10: Insuportável</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Tipo de Dor</label>
                <select
                  value={modalPainType}
                  onChange={(e) => setModalPainType(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="muscular">Muscular (Fadiga / Queimação)</option>
                  <option value="articular">Articular (Pressão / Desconforto na Articulação)</option>
                  <option value="tendinea">Tendínea (Pontada / Tendinite)</option>
                  <option value="neural">Neural (Formigamento / Irradiação)</option>
                  <option value="trauma">Trauma / Pancada direta</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Descrição Adicional</label>
                <input
                  type="text"
                  value={modalPainNotes}
                  onChange={(e) => setModalPainNotes(e.target.value)}
                  placeholder="Ex: Sentiu durante o agachamento..."
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePainModalDivision(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddPainPoint}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Salvar no Mapa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
