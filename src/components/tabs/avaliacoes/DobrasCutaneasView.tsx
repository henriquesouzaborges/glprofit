import React, { useState, useMemo, useEffect } from 'react';
import { 
  Layers, 
  Calculator, 
  Save, 
  Share2, 
  Printer, 
  Scale, 
  CheckCircle2, 
  Info, 
  TrendingDown, 
  Activity, 
  User, 
  Calendar 
} from 'lucide-react';
import { Student } from '../../../types';

interface DobrasCutaneasViewProps {
  student: Student;
  onSave?: (data: any) => void;
  initialWeightKg?: number;
  initialHeightCm?: number;
}

type ProtocolType = 'pollock_7' | 'pollock_3' | 'guedes_3' | 'petroski_4' | 'faulkner_4';

export const DobrasCutaneasView: React.FC<DobrasCutaneasViewProps> = ({ 
  student, 
  onSave,
  initialWeightKg,
  initialHeightCm 
}) => {
  const STORAGE_KEY = `glprofit_dobras_${student?.id || 'default'}`;

  const [protocol, setProtocol] = useState<ProtocolType>('pollock_7');
  const [gender, setGender] = useState<'masculino' | 'feminino'>('masculino');
  const [age, setAge] = useState<number>(() => {
    if (student?.birthDate) {
      const birthYear = new Date(student.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(birthYear) && currentYear > birthYear) return currentYear - birthYear;
    }
    return 28;
  });
  const [weightKg, setWeightKg] = useState<number>(() => initialWeightKg || 75.0);
  const [heightCm, setHeightCm] = useState<number>(() => initialHeightCm || 175);
  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluator, setEvaluator] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');

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

  // Medidas de Dobras (em mm)
  const [folds, setFolds] = useState<Record<string, number>>({
    triceps: 12,
    subescapular: 14,
    peitoral: 10,
    axilar_media: 12,
    suprailiaca: 15,
    abdominal: 18,
    coxa: 16,
    panturrilha: 11
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Carrega medições salvas
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.protocol) setProtocol(parsed.protocol);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.age) setAge(parsed.age);
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
        if (parsed.folds) setFolds(parsed.folds);
        if (parsed.evaluationDate) setEvaluationDate(parsed.evaluationDate);
        if (parsed.evaluator) setEvaluator(parsed.evaluator);
      }
    } catch {
      // Ignora erro
    }
  }, [STORAGE_KEY]);

  const handleFoldChange = (field: string, val: number) => {
    setFolds(prev => ({
      ...prev,
      [field]: Math.max(0, val || 0)
    }));
  };

  // Define quais dobras são obrigatórias com base no protocolo e sexo
  const activeFoldsConfig = useMemo(() => {
    switch (protocol) {
      case 'pollock_7':
        return [
          { key: 'peitoral', label: 'Peitoral', desc: 'Prega diagonal no terço proximal' },
          { key: 'axilar_media', label: 'Axilar Média', desc: 'Prega horizontal na linha axilar' },
          { key: 'triceps', label: 'Tríceps', desc: 'Prega vertical no ponto médio braço' },
          { key: 'subescapular', label: 'Subescapular', desc: 'Prega oblíqua 2cm abaixo do ângulo inferior da escápula' },
          { key: 'abdominal', label: 'Abdominal', desc: 'Prega vertical 2cm à direita da cicatriz umbilical' },
          { key: 'suprailiaca', label: 'Supra-ilíaca', desc: 'Prega oblíqua sobre a crista ilíaca' },
          { key: 'coxa', label: 'Coxa', desc: 'Prega vertical na linha média anterior da coxa' }
        ];

      case 'pollock_3':
        if (gender === 'masculino') {
          return [
            { key: 'peitoral', label: 'Peitoral', desc: 'Prega diagonal entre axila e mamilo' },
            { key: 'abdominal', label: 'Abdominal', desc: 'Prega vertical 2cm à direita da cicatriz umbilical' },
            { key: 'coxa', label: 'Coxa', desc: 'Prega vertical na linha média anterior da coxa' }
          ];
        } else {
          return [
            { key: 'triceps', label: 'Tríceps', desc: 'Prega vertical no ponto médio braço' },
            { key: 'suprailiaca', label: 'Supra-ilíaca', desc: 'Prega oblíqua sobre a crista ilíaca' },
            { key: 'coxa', label: 'Coxa', desc: 'Prega vertical na linha média anterior da coxa' }
          ];
        }

      case 'guedes_3':
        if (gender === 'masculino') {
          return [
            { key: 'triceps', label: 'Tríceps', desc: 'Prega vertical posterior' },
            { key: 'suprailiaca', label: 'Supra-ilíaca', desc: 'Prega oblíqua sobre a crista' },
            { key: 'abdominal', label: 'Abdominal', desc: 'Prega vertical paraumbilical' }
          ];
        } else {
          return [
            { key: 'subescapular', label: 'Subescapular', desc: 'Prega oblíqua subescapular' },
            { key: 'suprailiaca', label: 'Supra-ilíaca', desc: 'Prega oblíqua crista ilíaca' },
            { key: 'coxa', label: 'Coxa', desc: 'Prega vertical anterior' }
          ];
        }

      case 'petroski_4':
        return [
          { key: 'subescapular', label: 'Subescapular', desc: 'Prega oblíqua da escápula' },
          { key: 'triceps', label: 'Tríceps', desc: 'Prega vertical do tríceps' },
          { key: 'suprailiaca', label: 'Supra-ilíaca', desc: 'Prega oblíqua crista ilíaca' },
          { key: 'panturrilha', label: 'Panturrilha Medial', desc: 'Prega vertical no maior perímetro' }
        ];

      case 'faulkner_4':
        return [
          { key: 'triceps', label: 'Tríceps', desc: 'Prega vertical posterior' },
          { key: 'subescapular', label: 'Subescapular', desc: 'Prega oblíqua subescapular' },
          { key: 'suprailiaca', label: 'Supra-ilíaca', desc: 'Prega oblíqua crista ilíaca' },
          { key: 'abdominal', label: 'Abdominal', desc: 'Prega vertical paraumbilical' }
        ];

      default:
        return [];
    }
  }, [protocol, gender]);

  // Cálculos cineantropométricos em tempo real
  const calculations = useMemo(() => {
    const sumFolds = activeFoldsConfig.reduce((acc, f) => acc + (folds[f.key] || 0), 0);

    let bodyDensity = 1.05;
    let bodyFatPercent = 15.0;

    if (protocol === 'pollock_7') {
      if (gender === 'masculino') {
        bodyDensity = 1.112 - (0.00043499 * sumFolds) + (0.00000055 * Math.pow(sumFolds, 2)) - (0.00028826 * age);
      } else {
        bodyDensity = 1.097 - (0.00046971 * sumFolds) + (0.00000056 * Math.pow(sumFolds, 2)) - (0.00012828 * age);
      }
      bodyFatPercent = ((4.95 / bodyDensity) - 4.50) * 100;
    } else if (protocol === 'pollock_3') {
      if (gender === 'masculino') {
        bodyDensity = 1.10938 - (0.0008267 * sumFolds) + (0.0000016 * Math.pow(sumFolds, 2)) - (0.0002574 * age);
      } else {
        bodyDensity = 1.0994921 - (0.0009929 * sumFolds) + (0.0000023 * Math.pow(sumFolds, 2)) - (0.0001392 * age);
      }
      bodyFatPercent = ((4.95 / bodyDensity) - 4.50) * 100;
    } else if (protocol === 'guedes_3') {
      if (gender === 'masculino') {
        bodyDensity = 1.17136 - (0.06706 * Math.log10(Math.max(1, sumFolds)));
      } else {
        bodyDensity = 1.16650 - (0.07063 * Math.log10(Math.max(1, sumFolds)));
      }
      bodyFatPercent = ((4.95 / bodyDensity) - 4.50) * 100;
    } else if (protocol === 'petroski_4') {
      if (gender === 'masculino') {
        bodyDensity = 1.10726863 - (0.00081201 * sumFolds) + (0.00000212 * Math.pow(sumFolds, 2)) - (0.00041761 * age);
      } else {
        bodyDensity = 1.10726863 - (0.00081201 * sumFolds) + (0.00000212 * Math.pow(sumFolds, 2)) - (0.00041761 * age);
      }
      bodyFatPercent = ((4.95 / bodyDensity) - 4.50) * 100;
    } else if (protocol === 'faulkner_4') {
      bodyFatPercent = (sumFolds * 0.153) + 5.783;
    }

    // Normalização de limites seguros
    bodyFatPercent = Math.max(3, Math.min(60, bodyFatPercent));

    const fatMassKg = (weightKg * (bodyFatPercent / 100));
    const leanMassKg = Math.max(0, weightKg - fatMassKg);

    // Classificação Pollock / ACSM
    let classification = 'Médio';
    let classColor = 'text-blue-700 bg-blue-50 border-blue-200';

    if (gender === 'masculino') {
      if (bodyFatPercent < 6) { classification = 'Risco (Muito Baixo)'; classColor = 'text-amber-700 bg-amber-50 border-amber-300'; }
      else if (bodyFatPercent <= 10) { classification = 'Excelente (Atleta)'; classColor = 'text-emerald-700 bg-emerald-50 border-emerald-300'; }
      else if (bodyFatPercent <= 14) { classification = 'Bom / Atlético'; classColor = 'text-emerald-700 bg-emerald-50 border-emerald-300'; }
      else if (bodyFatPercent <= 17) { classification = 'Média Saudável'; classColor = 'text-blue-700 bg-blue-50 border-blue-200'; }
      else if (bodyFatPercent <= 24) { classification = 'Acima da Média'; classColor = 'text-amber-700 bg-amber-50 border-amber-300'; }
      else { classification = 'Obesidade / Atenção'; classColor = 'text-red-700 bg-red-50 border-red-300'; }
    } else {
      if (bodyFatPercent < 12) { classification = 'Risco (Muito Baixo)'; classColor = 'text-amber-700 bg-amber-50 border-amber-300'; }
      else if (bodyFatPercent <= 16) { classification = 'Excelente (Atleta)'; classColor = 'text-emerald-700 bg-emerald-50 border-emerald-300'; }
      else if (bodyFatPercent <= 20) { classification = 'Bom / Atlético'; classColor = 'text-emerald-700 bg-emerald-50 border-emerald-300'; }
      else if (bodyFatPercent <= 24) { classification = 'Média Saudável'; classColor = 'text-blue-700 bg-blue-50 border-blue-200'; }
      else if (bodyFatPercent <= 31) { classification = 'Acima da Média'; classColor = 'text-amber-700 bg-amber-50 border-amber-300'; }
      else { classification = 'Obesidade / Atenção'; classColor = 'text-red-700 bg-red-50 border-red-300'; }
    }

    return {
      sumFolds: Number(sumFolds.toFixed(1)),
      bodyDensity: Number(bodyDensity.toFixed(4)),
      bodyFatPercent: Number(bodyFatPercent.toFixed(1)),
      fatMassKg: Number(fatMassKg.toFixed(1)),
      leanMassKg: Number(leanMassKg.toFixed(1)),
      classification,
      classColor
    };
  }, [activeFoldsConfig, folds, protocol, gender, age, weightKg]);

  const handleSaveDobras = () => {
    const payload = {
      studentId: student.id,
      studentName: student.name,
      evaluationDate,
      evaluator,
      protocol,
      gender,
      age,
      weightKg,
      heightCm,
      folds,
      calculations,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (onSave) onSave(payload);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const formattedDate = evaluationDate.split('-').reverse().join('/');
    let msg = `📊 *GL PRO FIT • AVALIAÇÃO DE DOBRAS CUTÂNEAS*\n`;
    msg += `👤 *Aluno:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Protocolo:* ${protocol.toUpperCase()}\n\n`;
    msg += `⚖️ *Peso Corporal:* ${weightKg} kg\n`;
    msg += `🔥 *Percentual de Gordura:* ${calculations.bodyFatPercent}%\n`;
    msg += `🏷️ *Classificação:* ${calculations.classification}\n`;
    msg += `💪 *Massa Magra:* ${calculations.leanMassKg} kg\n`;
    msg += `🥩 *Massa Gorda:* ${calculations.fatMassKg} kg\n`;
    msg += `📏 *Soma das Dobras:* ${calculations.sumFolds} mm\n\n`;
    msg += `👨‍🏫 *Avaliador Responsável:* ${evaluator}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Adipometria Clínica
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Preenchimento Ágil de Dobras
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Dobras Cutâneas & Composição Corporal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cálculo instantâneo de % de gordura, densidade corporal, massa magra e massa gorda de <strong>{student.name}</strong>
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
            onClick={handleSaveDobras}
            className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Dobras</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Avaliação de dobras cutâneas de {student.name} calculada e salva com sucesso!</span>
        </div>
      )}

      {/* PAINEL DE RESULTADOS EM TEMPO REAL (CARDS PRINCIPAIS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xs">
          <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">
            % Gordura Corporal
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1">
            {calculations.bodyFatPercent}%
          </div>
          <div className="mt-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${calculations.classColor}`}>
              {calculations.classification}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Massa Magra Total
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {calculations.leanMassKg} <span className="text-xs text-slate-400">kg</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">
            {((calculations.leanMassKg / weightKg) * 100).toFixed(1)}% do peso total
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Massa Gorda Total
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {calculations.fatMassKg} <span className="text-xs text-slate-400">kg</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block mt-1">
            Gordura acumulada
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Soma das Dobras (Σ)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {calculations.sumFolds} <span className="text-xs text-slate-400">mm</span>
          </div>
          <span className="text-[11px] text-blue-600 font-bold block mt-1">
            Densidade: {calculations.bodyDensity} g/ml
          </span>
        </div>
      </div>

      {/* SELEÇÃO DO PROTOCOLO E DADOS BÁSICOS */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
            1. Selecione o Protocolo Científico de Adipometria:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {[
              { id: 'pollock_7', label: 'Pollock 7 Dobras', tag: 'Padrão Ouro / Mais Preciso' },
              { id: 'pollock_3', label: 'Pollock 3 Dobras', tag: 'Prático e Rápido' },
              { id: 'guedes_3', label: 'Guedes 3 Dobras', tag: 'Clínico Brasil' },
              { id: 'petroski_4', label: 'Petroski 4 Dobras', tag: 'População Brasileira' },
              { id: 'faulkner_4', label: 'Faulkner 4 Dobras', tag: 'Tradicional / 4 Dobras' }
            ].map((p) => {
              const isActive = protocol === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProtocol(p.id as ProtocolType)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-800 text-white border-blue-800 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-xs font-black block">{p.label}</span>
                  <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                    {p.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dados Básicos: Sexo, Idade, Peso, Estatura */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
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
              Idade (Anos)
            </label>
            <input
              type="number"
              min={10}
              max={100}
              value={age}
              onChange={(e) => setAge(Number(e.target.value) || 28)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Peso Atual (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value) || 70)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Estatura (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value) || 170)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* PREENCHIMENTO SUPER SIMPLES DAS DOBRAS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              2. Preenchimento de Medidas do Adipômetro (em milímetros - mm)
            </h3>
            <p className="text-[11px] text-slate-500">
              Digite os valores em mm obtidos na pinçagem da prega cutânea
            </p>
          </div>

          <div className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
            {activeFoldsConfig.length} dobras requeridas
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {activeFoldsConfig.map((item) => {
            const currentValue = folds[item.key] || 0;
            return (
              <div
                key={item.key}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all space-y-2 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 group-hover:text-blue-900 transition-colors uppercase">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">mm</span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFoldChange(item.key, currentValue - 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-black text-xs hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min={0}
                    max={80}
                    step="0.5"
                    value={currentValue}
                    onChange={(e) => handleFoldChange(item.key, Number(e.target.value))}
                    className="flex-1 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-black text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <button
                    type="button"
                    onClick={() => handleFoldChange(item.key, currentValue + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-black text-xs hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
