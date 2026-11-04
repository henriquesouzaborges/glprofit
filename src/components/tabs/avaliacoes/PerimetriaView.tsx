import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Save, 
  Share2, 
  Printer, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { Student } from '../../../types';

interface PerimetriaViewProps {
  student: Student;
  onSave?: (data: any) => void;
  initialWeightKg?: number;
  initialHeightCm?: number;
}

export const PerimetriaView: React.FC<PerimetriaViewProps> = ({ 
  student, 
  onSave,
  initialWeightKg,
  initialHeightCm 
}) => {
  const STORAGE_KEY = `glprofit_perimetria_${student?.id || 'default'}`;

  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluator, setEvaluator] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [gender, setGender] = useState<'masculino' | 'feminino'>('masculino');
  const [heightCm, setHeightCm] = useState<number>(() => initialHeightCm || 175);
  const [weightKg, setWeightKg] = useState<number>(() => initialWeightKg || 76.0);

  useEffect(() => {
    if (initialWeightKg !== undefined && initialWeightKg > 0) {
      setWeightKg(initialWeightKg);
    }
  }, [initialWeightKg]);

  useEffect(() => {
    if (initialHeightCm !== undefined && initialHeightCm > 0) {
      setHeightCm(initialHeightCm);
    }
  }, [initialHeightCm]);

  // Circunferências (em cm)
  const [measures, setMeasures] = useState<Record<string, number>>({
    pescoco: 38.5,
    ombros: 118.0,
    torax: 102.5,
    torax_inspirado: 105.0,
    cintura: 81.0,
    abdomen: 84.5,
    quadril: 98.0,
    // Braços
    braco_relaxado_d: 36.0,
    braco_relaxado_e: 35.5,
    braco_contraido_d: 38.5,
    braco_contraido_e: 38.0,
    antebraco_d: 29.5,
    antebraco_e: 29.0,
    punho_d: 17.5,
    punho_e: 17.5,
    // Coxas
    coxa_proximal_d: 59.0,
    coxa_proximal_e: 58.5,
    coxa_medial_d: 55.0,
    coxa_medial_e: 54.5,
    coxa_distal_d: 46.0,
    coxa_distal_e: 45.5,
    // Panturrilhas
    panturrilha_d: 38.0,
    panturrilha_e: 37.5,
    tornozelo_d: 22.0,
    tornozelo_e: 22.0
  });

  const [notes, setNotes] = useState('Excelente simetria bilateral de membros superiores e inferiores. Diferença máxima menor que 0.5 cm.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Carrega medições salvas
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.evaluationDate) setEvaluationDate(parsed.evaluationDate);
        if (parsed.evaluator) setEvaluator(parsed.evaluator);
        if (parsed.gender) setGender(parsed.gender);
        if (initialHeightCm !== undefined && initialHeightCm > 0) {
          setHeightCm(initialHeightCm);
        } else if (parsed.heightCm) {
          setHeightCm(parsed.heightCm);
        }
        if (initialWeightKg !== undefined && initialWeightKg > 0) {
          setWeightKg(initialWeightKg);
        } else if (parsed.weightKg) {
          setWeightKg(parsed.weightKg);
        }
        if (parsed.measures) setMeasures(parsed.measures);
        if (parsed.notes) setNotes(parsed.notes);
      }
    } catch {
      // Ignora erro
    }
  }, [STORAGE_KEY]);

  const handleMeasureChange = (field: string, val: number) => {
    setMeasures(prev => ({
      ...prev,
      [field]: Math.max(0, val || 0)
    }));
  };

  // Cálculos de Risco e Assimetrias
  const analytics = useMemo(() => {
    const cintura = measures.cintura || 0;
    const quadril = measures.quadril || 1;
    const rcq = Number((cintura / quadril).toFixed(2));

    let rcqRisk = 'Baixo Risco';
    let rcqColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';

    if (gender === 'masculino') {
      if (rcq >= 0.95 && rcq < 1.0) {
        rcqRisk = 'Risco Moderado';
        rcqColor = 'text-amber-700 bg-amber-50 border-amber-300';
      } else if (rcq >= 1.0) {
        rcqRisk = 'Alto Risco Cardiovascular';
        rcqColor = 'text-red-700 bg-red-50 border-red-300';
      }
    } else {
      if (rcq >= 0.80 && rcq < 0.85) {
        rcqRisk = 'Risco Moderado';
        rcqColor = 'text-amber-700 bg-amber-50 border-amber-300';
      } else if (rcq >= 0.85) {
        rcqRisk = 'Alto Risco Cardiovascular';
        rcqColor = 'text-red-700 bg-red-50 border-red-300';
      }
    }

    const rce = heightCm > 0 ? Number((cintura / heightCm).toFixed(2)) : 0;

    // Assimetrias
    const diffBracoRelaxado = Number(Math.abs((measures.braco_relaxado_d || 0) - (measures.braco_relaxado_e || 0)).toFixed(1));
    const diffBracoContraido = Number(Math.abs((measures.braco_contraido_d || 0) - (measures.braco_contraido_e || 0)).toFixed(1));
    const diffCoxa = Number(Math.abs((measures.coxa_medial_d || 0) - (measures.coxa_medial_e || 0)).toFixed(1));
    const diffPanturrilha = Number(Math.abs((measures.panturrilha_d || 0) - (measures.panturrilha_e || 0)).toFixed(1));

    return {
      rcq,
      rcqRisk,
      rcqColor,
      rce,
      diffBracoRelaxado,
      diffBracoContraido,
      diffCoxa,
      diffPanturrilha
    };
  }, [measures, gender, heightCm]);

  const handleSavePerimetria = () => {
    const payload = {
      studentId: student.id,
      studentName: student.name,
      evaluationDate,
      evaluator,
      gender,
      heightCm,
      weightKg,
      measures,
      analytics,
      notes,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (onSave) onSave(payload);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const formattedDate = evaluationDate.split('-').reverse().join('/');
    let msg = `📐 *GL PRO FIT • RELATÓRIO DE PERIMETRIA*\n`;
    msg += `👤 *Aluno:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Avaliador:* ${evaluator}\n\n`;
    msg += `📏 *Circunferências Principais:*\n`;
    msg += `• Tórax: ${measures.torax} cm\n`;
    msg += `• Cintura: ${measures.cintura} cm | Abdômen: ${measures.abdomen} cm\n`;
    msg += `• Quadril: ${measures.quadril} cm | RCQ: ${analytics.rcq} (${analytics.rcqRisk})\n`;
    msg += `• Braço Contraído D: ${measures.braco_contraido_d} cm | E: ${measures.braco_contraido_e} cm\n`;
    msg += `• Coxa Medial D: ${measures.coxa_medial_d} cm | E: ${measures.coxa_medial_e} cm\n`;
    msg += `• Panturrilha D: ${measures.panturrilha_d} cm | E: ${measures.panturrilha_e} cm\n\n`;
    msg += `⚖️ *Assimetria:* Braço: ${analytics.diffBracoContraido}cm | Coxa: ${analytics.diffCoxa}cm\n`;
    msg += `📝 *Parecer:* ${notes}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Antropometria de Circunferências
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Todos os Campos Disponíveis
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Perimetria Corporal & Simetria Bilateral
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de fita métrica para tórax, membros superiores, tronco e membros inferiores de <strong>{student.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={handleSavePerimetria}
            className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Perimetria</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Medições de perimetria de {student.name} salvas com sucesso!</span>
        </div>
      )}

      {/* CARDS DE ANÁLISE AUTOMÁTICA (RCQ, RCE E SIMETRIA) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-xs">
          <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">
            Relação Cintura-Quadril (RCQ)
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1">
            {analytics.rcq}
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border inline-block mt-2 ${analytics.rcqColor}`}>
            {analytics.rcqRisk}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Relação Cintura / Estatura
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {analytics.rce}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">
            {analytics.rce <= 0.5 ? '✓ Faixa Saudável (< 0.5)' : '⚠️ Atenção (> 0.5)'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Assimetria de Braços
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {analytics.diffBracoContraido} <span className="text-xs text-slate-400">cm</span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold block mt-1">
            {analytics.diffBracoContraido <= 1.0 ? 'Simetria Ideal (< 1cm)' : 'Assimetria Notável'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Assimetria de Coxas
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {analytics.diffCoxa} <span className="text-xs text-slate-400">cm</span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold block mt-1">
            {analytics.diffCoxa <= 1.0 ? 'Simetria Ideal (< 1cm)' : 'Assimetria Notável'}
          </span>
        </div>
      </div>

      {/* METADADOS BÁSICOS */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Data da Medição
          </label>
          <input
            type="date"
            value={evaluationDate}
            onChange={(e) => setEvaluationDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Sexo Biológico
          </label>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setGender('masculino')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                gender === 'masculino' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Masc
            </button>
            <button
              type="button"
              onClick={() => setGender('feminino')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                gender === 'feminino' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Fem
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Estatura (cm)
          </label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value) || 170)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 text-center"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value) || 70)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 text-center"
          />
        </div>
      </div>

      {/* BLOCO 1: TRONCO & CINTURA (TÓRAX, CINTURA, ABDÔMEN, QUADRIL, PESCOÇO, OMBROS) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>1. Tronco & Circunferências Centrais (em cm)</span>
          <span className="text-[10px] text-slate-400 font-semibold">Fita Antropométrica Flexível</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pescoço
            </label>
            <input
              type="number"
              step="0.1"
              value={measures.pescoco}
              onChange={(e) => handleMeasureChange('pescoco', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ombros
            </label>
            <input
              type="number"
              step="0.1"
              value={measures.ombros}
              onChange={(e) => handleMeasureChange('ombros', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tórax (Normal)
            </label>
            <input
              type="number"
              step="0.1"
              value={measures.torax}
              onChange={(e) => handleMeasureChange('torax', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cintura (Menor) *
            </label>
            <input
              type="number"
              step="0.1"
              value={measures.cintura}
              onChange={(e) => handleMeasureChange('cintura', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/40 text-xs font-black text-amber-950 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Abdômen (Umbilical)
            </label>
            <input
              type="number"
              step="0.1"
              value={measures.abdomen}
              onChange={(e) => handleMeasureChange('abdomen', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Quadril (Glúteo) *
            </label>
            <input
              type="number"
              step="0.1"
              value={measures.quadril}
              onChange={(e) => handleMeasureChange('quadril', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/40 text-xs font-black text-amber-950 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* BLOCO 2: MEMBROS SUPERIORES (BRAÇOS, ANTEBRAÇOS, PUNHOS D E E) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>2. Membros Superiores (Comparações Bilaterais D e E)</span>
          <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">Direito vs Esquerdo</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Braço Relaxado */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase block">
              Braço Relaxado
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Direito (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.braco_relaxado_d}
                  onChange={(e) => handleMeasureChange('braco_relaxado_d', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Esquerdo (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.braco_relaxado_e}
                  onChange={(e) => handleMeasureChange('braco_relaxado_e', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold text-center">
              Dif: {analytics.diffBracoRelaxado} cm
            </div>
          </div>

          {/* Braço Contraído */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
            <span className="text-xs font-extrabold text-blue-900 uppercase block">
              Braço Contraído / Flexionado
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-blue-700 block">Direito (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.braco_contraido_d}
                  onChange={(e) => handleMeasureChange('braco_contraido_d', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-blue-300 bg-white text-xs font-bold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 block">Esquerdo (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.braco_contraido_e}
                  onChange={(e) => handleMeasureChange('braco_contraido_e', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-blue-300 bg-white text-xs font-bold text-center"
                />
              </div>
            </div>
            <div className="text-[10px] text-blue-700 font-bold text-center">
              Dif: {analytics.diffBracoContraido} cm
            </div>
          </div>

          {/* Antebraço */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase block">
              Antebraço
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Direito (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.antebraco_d}
                  onChange={(e) => handleMeasureChange('antebraco_d', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Esquerdo (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.antebraco_e}
                  onChange={(e) => handleMeasureChange('antebraco_e', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold text-center">
              Ponto de maior volume
            </div>
          </div>

          {/* Punho */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase block">
              Punho (Diâmetro Ósseo)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Direito (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.punho_d}
                  onChange={(e) => handleMeasureChange('punho_d', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Esquerdo (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.punho_e}
                  onChange={(e) => handleMeasureChange('punho_e', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold text-center">
              Estrutura óssea
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO 3: MEMBROS INFERIORES (COXA PROXIMAL, MEDIAL, DISTAL, PANTURRILHA E TORNOZELO) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>3. Membros Inferiores (Coxas e Panturrilhas Bilaterais)</span>
          <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">Direito vs Esquerdo</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Coxa Proximal */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase block">
              Coxa Proximal (Alta)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Direita (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.coxa_proximal_d}
                  onChange={(e) => handleMeasureChange('coxa_proximal_d', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Esquerda (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.coxa_proximal_e}
                  onChange={(e) => handleMeasureChange('coxa_proximal_e', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold text-center">
              Logo abaixo da prega glútea
            </div>
          </div>

          {/* Coxa Medial */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
            <span className="text-xs font-extrabold text-blue-900 uppercase block">
              Coxa Medial (Ponto Médio)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-blue-700 block">Direita (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.coxa_medial_d}
                  onChange={(e) => handleMeasureChange('coxa_medial_d', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-blue-300 bg-white text-xs font-bold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 block">Esquerda (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.coxa_medial_e}
                  onChange={(e) => handleMeasureChange('coxa_medial_e', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-blue-300 bg-white text-xs font-bold text-center"
                />
              </div>
            </div>
            <div className="text-[10px] text-blue-700 font-bold text-center">
              Dif: {analytics.diffCoxa} cm
            </div>
          </div>

          {/* Panturrilha */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase block">
              Panturrilha (Maior Diâmetro)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Direita (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.panturrilha_d}
                  onChange={(e) => handleMeasureChange('panturrilha_d', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Esquerda (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.panturrilha_e}
                  onChange={(e) => handleMeasureChange('panturrilha_e', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold text-center">
              Dif: {analytics.diffPanturrilha} cm
            </div>
          </div>

          {/* Tornozelo */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase block">
              Tornozelo (Maleolar)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Direito (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.tornozelo_d}
                  onChange={(e) => handleMeasureChange('tornozelo_d', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Esquerdo (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  value={measures.tornozelo_e}
                  onChange={(e) => handleMeasureChange('tornozelo_e', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center"
                />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold text-center">
              Região supra-maleolar
            </div>
          </div>
        </div>
      </div>

      {/* PARECER FINAL */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          Parecer Descritivo e Evolução de Perímetros
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anotações sobre pontos de assimetria, hipertrofia localizada ou redução de circunferência abdominal..."
          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>
  );
};
