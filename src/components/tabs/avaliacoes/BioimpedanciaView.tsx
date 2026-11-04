import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Activity, 
  Save, 
  Share2, 
  Printer, 
  CheckCircle2, 
  Heart, 
  Zap, 
  Flame, 
  Droplet, 
  User, 
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Student } from '../../../types';

interface BioimpedanciaViewProps {
  student: Student;
  onSave?: (data: any) => void;
  initialWeightKg?: number;
  initialHeightCm?: number;
}

export const BioimpedanciaView: React.FC<BioimpedanciaViewProps> = ({ 
  student, 
  onSave,
  initialWeightKg,
  initialHeightCm 
}) => {
  const STORAGE_KEY = `glprofit_bio_${student?.id || 'default'}`;

  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluator, setEvaluator] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [deviceModel, setDeviceModel] = useState('InBody 270 (Tetrapolar Octapolar)');

  // Campos Básicos
  const [weightKg, setWeightKg] = useState<number>(() => initialWeightKg || 76.4);
  const [heightCm, setHeightCm] = useState<number>(() => initialHeightCm || 176);

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
  const [age, setAge] = useState<number>(() => {
    if (student?.birthDate) {
      const birthYear = new Date(student.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(birthYear) && currentYear > birthYear) return currentYear - birthYear;
    }
    return 29;
  });
  const [gender, setGender] = useState<'masculino' | 'feminino'>('masculino');

  // Campos Específicos de Bioimpedância
  const [bodyFatPercent, setBodyFatPercent] = useState<number>(16.2);
  const [skeletalMuscleKg, setSkeletalMuscleKg] = useState<number>(35.8);
  const [fatMassKg, setFatMassKg] = useState<number>(12.4);
  const [leanMassKg, setLeanMassKg] = useState<number>(64.0);
  const [totalBodyWaterLiters, setTotalBodyWaterLiters] = useState<number>(46.8);
  const [visceralFatLevel, setVisceralFatLevel] = useState<number>(5);
  const [basalMetabolicRateKcal, setBasalMetabolicRateKcal] = useState<number>(1780);
  const [metabolicAge, setMetabolicAge] = useState<number>(24);
  const [boneMassKg, setBoneMassKg] = useState<number>(3.2);
  const [phaseAngleDeg, setPhaseAngleDeg] = useState<number>(7.4);
  const [ecwRatio, setEcwRatio] = useState<number>(0.380); // Água Extracelular / Total

  const [clinicalNotes, setClinicalNotes] = useState(
    'Excelente estado de hidratação celular. Massa muscular esquelética bem desenvolvida. Gordura visceral em nível ideal de baixo risco cardiovascular.'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Carrega dados salvos
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.evaluationDate) setEvaluationDate(parsed.evaluationDate);
        if (parsed.evaluator) setEvaluator(parsed.evaluator);
        if (parsed.deviceModel) setDeviceModel(parsed.deviceModel);
        if (initialWeightKg !== undefined && initialWeightKg > 0) {
          setWeightKg(initialWeightKg);
        } else if (parsed.weightKg) {
          setWeightKg(parsed.weightKg);
        }
        if (initialHeightCm !== undefined && initialHeightCm > 0) {
          setHeightCm(initialHeightCm);
        } else if (parsed.heightCm) {
          setHeightCm(parsed.heightCm);
        }
        if (parsed.age) setAge(parsed.age);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.bodyFatPercent) setBodyFatPercent(parsed.bodyFatPercent);
        if (parsed.skeletalMuscleKg) setSkeletalMuscleKg(parsed.skeletalMuscleKg);
        if (parsed.fatMassKg) setFatMassKg(parsed.fatMassKg);
        if (parsed.leanMassKg) setLeanMassKg(parsed.leanMassKg);
        if (parsed.totalBodyWaterLiters) setTotalBodyWaterLiters(parsed.totalBodyWaterLiters);
        if (parsed.visceralFatLevel) setVisceralFatLevel(parsed.visceralFatLevel);
        if (parsed.basalMetabolicRateKcal) setBasalMetabolicRateKcal(parsed.basalMetabolicRateKcal);
        if (parsed.metabolicAge) setMetabolicAge(parsed.metabolicAge);
        if (parsed.boneMassKg) setBoneMassKg(parsed.boneMassKg);
        if (parsed.phaseAngleDeg) setPhaseAngleDeg(parsed.phaseAngleDeg);
        if (parsed.ecwRatio) setEcwRatio(parsed.ecwRatio);
        if (parsed.clinicalNotes) setClinicalNotes(parsed.clinicalNotes);
      }
    } catch {
      // Ignora erro
    }
  }, [STORAGE_KEY]);

  // Cálculos automáticos de IMC e indicadores
  const metrics = useMemo(() => {
    const heightM = heightCm / 100;
    const imc = heightM > 0 ? Number((weightKg / (heightM * heightM)).toFixed(1)) : 0;

    let imcCategory = 'Normal';
    let imcColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (imc < 18.5) { imcCategory = 'Abaixo do Peso'; imcColor = 'text-amber-700 bg-amber-50 border-amber-300'; }
    else if (imc <= 24.9) { imcCategory = 'Peso Saudável'; imcColor = 'text-emerald-700 bg-emerald-50 border-emerald-300'; }
    else if (imc <= 29.9) { imcCategory = 'Sobrepeso'; imcColor = 'text-amber-700 bg-amber-50 border-amber-300'; }
    else { imcCategory = 'Obesidade'; imcColor = 'text-red-700 bg-red-50 border-red-300'; }

    let visceralCategory = 'Ideal (Baixo Risco)';
    let visceralColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (visceralFatLevel >= 10 && visceralFatLevel <= 14) {
      visceralCategory = 'Atenção (Moderado)';
      visceralColor = 'text-amber-700 bg-amber-50 border-amber-300';
    } else if (visceralFatLevel >= 15) {
      visceralCategory = 'Alto Risco (Gordura Visceral Elevada)';
      visceralColor = 'text-red-700 bg-red-50 border-red-300';
    }

    const waterPercent = weightKg > 0 ? Number(((totalBodyWaterLiters / weightKg) * 100).toFixed(1)) : 0;

    return {
      imc,
      imcCategory,
      imcColor,
      visceralCategory,
      visceralColor,
      waterPercent
    };
  }, [weightKg, heightCm, visceralFatLevel, totalBodyWaterLiters]);

  const handleSaveBio = () => {
    const payload = {
      studentId: student.id,
      studentName: student.name,
      evaluationDate,
      evaluator,
      deviceModel,
      weightKg,
      heightCm,
      age,
      gender,
      bodyFatPercent,
      skeletalMuscleKg,
      fatMassKg,
      leanMassKg,
      totalBodyWaterLiters,
      visceralFatLevel,
      basalMetabolicRateKcal,
      metabolicAge,
      boneMassKg,
      phaseAngleDeg,
      ecwRatio,
      clinicalNotes,
      metrics,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (onSave) onSave(payload);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const formattedDate = evaluationDate.split('-').reverse().join('/');
    let msg = `⚡ *GL PRO FIT • LAUDO DE BIOIMPEDÂNCIA*\n`;
    msg += `👤 *Aluno:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Aparelho:* ${deviceModel}\n\n`;
    msg += `⚖️ *Peso:* ${weightKg} kg | *IMC:* ${metrics.imc} (${metrics.imcCategory})\n`;
    msg += `🔥 *% de Gordura (%BF):* ${bodyFatPercent}%\n`;
    msg += `💪 *Massa Muscular:* ${skeletalMuscleKg} kg\n`;
    msg += `🥩 *Massa Gorda:* ${fatMassKg} kg\n`;
    msg += `💧 *Água Corporal:* ${totalBodyWaterLiters} L (${metrics.waterPercent}%)\n`;
    msg += `🫀 *Gordura Visceral:* Nível ${visceralFatLevel} (${metrics.visceralCategory})\n`;
    msg += `⚡ *Taxa Metabólica Basal (TMB):* ${basalMetabolicRateKcal} kcal\n`;
    msg += `🎂 *Idade Metabólica:* ${metabolicAge} anos (Cronológica: ${age} anos)\n\n`;
    msg += `👨‍🏫 *Avaliador Responsável:* ${evaluator}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Análise Bioelétrica
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Disponibilidade Completa de Campos
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Bioimpedância Tetrapolar & Composição
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro detalhado de impedância, hidratação celular e gordura visceral de <strong>{student.name}</strong>
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
            onClick={handleSaveBio}
            className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Bioimpedância</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Avaliação de bioimpedância de {student.name} salva com sucesso!</span>
        </div>
      )}

      {/* CARDS COM MÉTRICAS CHAVE */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xs">
          <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">
            Gordura Corporal (% BF)
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1">
            {bodyFatPercent}%
          </div>
          <span className="text-[11px] text-indigo-300 font-medium block mt-1">
            {fatMassKg} kg de massa gorda
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Massa Muscular Esquelética
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {skeletalMuscleKg} <span className="text-xs text-slate-400">kg</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">
            {((skeletalMuscleKg / weightKg) * 100).toFixed(1)}% do peso corporal
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Gordura Visceral
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Nível {visceralFatLevel}
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border inline-block mt-1 ${metrics.visceralColor}`}>
            {metrics.visceralCategory}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Taxa Metabólica Basal
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {basalMetabolicRateKcal} <span className="text-xs text-slate-400">kcal</span>
          </div>
          <span className="text-[11px] text-blue-600 font-bold block mt-1">
            Idade Metabólica: {metabolicAge} anos
          </span>
        </div>
      </div>

      {/* METADADOS DO APARELHO E DATA */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Data do Exame
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
            Equipamento / Analisador
          </label>
          <select
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="InBody 270 (Tetrapolar Octapolar)">InBody 270 (Tetrapolar Octapolar)</option>
            <option value="InBody 370 / 770 Clínico">InBody 370 / 770 Clínico</option>
            <option value="Tanita BC-549 / IronMan">Tanita BC-549 / IronMan</option>
            <option value="Omron HBF-514C (Bilateral)">Omron HBF-514C (Bilateral)</option>
            <option value="Biodynamics 310e / 450">Biodynamics 310e / 450</option>
            <option value="Outro Aparelho Homologado">Outro Aparelho Homologado</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Avaliador Responsável
          </label>
          <input
            type="text"
            value={evaluator}
            onChange={(e) => setEvaluator(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* FORMULÁRIO COMPLETO COM TODOS OS CAMPOS DE PREENCHIMENTO */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-700" />
          <span>Campos de Preenchimento da Bioimpedância</span>
        </h3>

        {/* Grupo 1: Antropometria Básica */}
        <div>
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
            1. Dados Antropométricos Básicos
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Peso Atual (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Estatura (cm) *
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                IMC Calculado
              </label>
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-900">
                {metrics.imc} kg/m² ({metrics.imcCategory})
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Idade Cronológica
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Grupo 2: Distribuição de Massas */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
            2. Massas Corporais & Gordura
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                % Gordura Corporal (%BF)
              </label>
              <input
                type="number"
                step="0.1"
                value={bodyFatPercent}
                onChange={(e) => setBodyFatPercent(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Massa Muscular Esquelética (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={skeletalMuscleKg}
                onChange={(e) => setSkeletalMuscleKg(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Massa Magra Livre de Gordura (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={leanMassKg}
                onChange={(e) => setLeanMassKg(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Massa Gorda Total (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={fatMassKg}
                onChange={(e) => setFatMassKg(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Grupo 3: Água, Metabolismo e Saúde Celular */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
            3. Hidratação, Visceral e Metabolismo
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Água Total (L)
              </label>
              <input
                type="number"
                step="0.1"
                value={totalBodyWaterLiters}
                onChange={(e) => setTotalBodyWaterLiters(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Gordura Visceral (Nível)
              </label>
              <input
                type="number"
                min={1}
                max={59}
                value={visceralFatLevel}
                onChange={(e) => setVisceralFatLevel(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                TMB (kcal)
              </label>
              <input
                type="number"
                value={basalMetabolicRateKcal}
                onChange={(e) => setBasalMetabolicRateKcal(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Idade Metabólica
              </label>
              <input
                type="number"
                value={metabolicAge}
                onChange={(e) => setMetabolicAge(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Massa Óssea (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={boneMassKg}
                onChange={(e) => setBoneMassKg(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Ângulo de Fase (°)
              </label>
              <input
                type="number"
                step="0.1"
                value={phaseAngleDeg}
                onChange={(e) => setPhaseAngleDeg(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Parecer Clínico do Avaliador */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Parecer e Conclusões da Bioimpedância
          </label>
          <textarea
            rows={3}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Anotações do avaliador sobre resultados de hidratação celular, taxa metabólica e diretrizes nutricionais..."
            className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>
    </div>
  );
};
