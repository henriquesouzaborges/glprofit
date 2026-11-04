import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Plus, 
  Trash2, 
  Share2, 
  Printer, 
  Heart, 
  Activity, 
  HelpCircle, 
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  User,
  Calendar,
  Clock,
  Target,
  Dumbbell,
  Flame,
  Zap,
  CalendarDays,
  Check
} from 'lucide-react';
import { Student } from '../../../types';

interface AnamneseViewProps {
  student: Student;
  onSave?: (data: any) => void;
}

interface CustomQuestion {
  id: string;
  question: string;
  type: 'yes_no' | 'text' | 'scale_10';
  category: string;
  answer: string;
}

// Opções predefinidas de Objetivos e Frequência Alvo para prescrição clínica e esportiva
export const PREDEFINED_OBJECTIVE_GROUPS = [
  {
    group: 'Hipertrofia & Força Muscular',
    options: [
      'Hipertrofia & Ganho de Massa Muscular',
      'Definição Muscular & Tonificação',
      'Ganho de Força Pura & Cargas Máximas',
      'Potência Muscular & Explosão'
    ]
  },
  {
    group: 'Emagrecimento & Composição Corporal',
    options: [
      'Emagrecimento & Redução de Gordura Corporal',
      'Recomposição Corporal (Massa Magra + Queima de Gordura)',
      'Manutenção de Peso & Estilo de Vida Saudável'
    ]
  },
  {
    group: 'Saúde, Postura & Reabilitação',
    options: [
      'Saúde Geral, Longevidade & Bem-Estar',
      'Reabilitação Postural & Alívio de Dores (Lombar / Ombros / Joelhos)',
      'Prevenção de Lesões & Fortalecimento Articular',
      'Melhora de Flexibilidade, Mobilidade & Alongamento',
      'Controle Metabólico (Glicemia, Hipertensão, Lipídios)'
    ]
  },
  {
    group: 'Performance Esportiva & Condicionamento',
    options: [
      'Condicionamento Físico & Resistência Cardiorrespiratória',
      'Preparação Física para Futebol & Esportes Coletivos',
      'Rendimento em Corrida de Rua, Maratona & Ciclismo',
      'Condicionamento para Lutas & Artes Marciais'
    ]
  },
  {
    group: 'Populações Especiais',
    options: [
      'Autonomia Funcional & Terceira Idade (Envelhecimento Ativo)',
      'Gestação Saudável / Recuperação Pós-Parto'
    ]
  }
];

export const POPULAR_OBJECTIVES = [
  { label: 'Hipertrofia & Massa', value: 'Hipertrofia & Ganho de Massa Muscular', emoji: '💪' },
  { label: 'Emagrecimento & Gordura', value: 'Emagrecimento & Redução de Gordura Corporal', emoji: '🔥' },
  { label: 'Definição & Tônus', value: 'Definição Muscular & Tonificação', emoji: '✨' },
  { label: 'Reabilitação & Postura', value: 'Reabilitação Postural & Alívio de Dores (Lombar / Ombros / Joelhos)', emoji: '🩺' },
  { label: 'Condicionamento Físico', value: 'Condicionamento Físico & Resistência Cardiorrespiratória', emoji: '🏃' },
  { label: 'Futebol & Esportes', value: 'Preparação Física para Futebol & Esportes Coletivos', emoji: '⚽' },
  { label: 'Saúde & Longevidade', value: 'Saúde Geral, Longevidade & Bem-Estar', emoji: '🌿' }
];

export const PREDEFINED_FREQUENCIES = [
  { label: '1 a 2 vezes por semana (Iniciante / Adaptação)', value: '1 a 2 vezes por semana (Iniciante / Adaptação)', short: '1-2x/sem' },
  { label: '2 vezes por semana (Manutenção Básica)', value: '2 vezes por semana (Manutenção Básica)', short: '2x/sem' },
  { label: '3 vezes por semana (Segunda, Quarta e Sexta)', value: '3 vezes por semana (Seg, Qua e Sex)', short: '3x/sem (Seg/Qua/Sex)' },
  { label: '3 vezes por semana (Terça, Quinta e Sábado)', value: '3 vezes por semana (Ter, Qui e Sáb)', short: '3x/sem (Ter/Qui/Sáb)' },
  { label: '4 vezes por semana (Segunda, Terça, Quinta e Sexta)', value: '4 vezes por semana (Seg, Ter, Qui e Sex)', short: '4x/sem' },
  { label: '4 vezes por semana (Divisão Upper / Lower ou AB)', value: '4 vezes por semana (Divisão Upper/Lower)', short: '4x/sem (Upper/Lower)' },
  { label: '5 vezes por semana (Segunda a Sexta-feira)', value: '5 vezes por semana (Segunda a Sexta)', short: '5x/sem (Seg a Sex)' },
  { label: '6 vezes por semana (Segunda a Sábado / Alta Frequência)', value: '6 vezes por semana (Segunda a Sábado)', short: '6x/sem (Seg a Sáb)' },
  { label: 'Todos os dias (7x por semana / Atleta)', value: 'Todos os dias (7x por semana)', short: 'Todos os dias (7x)' },
  { label: 'Dias Alternados (1 dia treino / 1 dia descanso)', value: 'Dias Alternados (1 dia treino / 1 dia descanso)', short: 'Dias Alternados' }
];

export const POPULAR_FREQUENCIES = [
  { label: '2x / sem', value: '2 vezes por semana (Manutenção Básica)' },
  { label: '3x / sem (Seg/Qua/Sex)', value: '3 vezes por semana (Seg, Qua e Sex)' },
  { label: '4x / sem (Seg/Ter/Qui/Sex)', value: '4 vezes por semana (Seg, Ter, Qui e Sex)' },
  { label: '5x / sem (Seg a Sex)', value: '5 vezes por semana (Segunda a Sexta)' },
  { label: '6x / sem', value: '6 vezes por semana (Segunda a Sábado)' },
  { label: 'Dias Alternados', value: 'Dias Alternados (1 dia treino / 1 dia descanso)' }
];

export const PREDEFINED_SHIFTS = [
  'Manhã (06:00 às 10:00)',
  'Almoço / Intermediário (11:00 às 14:00)',
  'Tarde (14:00 às 18:00)',
  'Noite (18:00 às 22:00)',
  'Horário Flexível / Variável'
];

export const PREDEFINED_DURATIONS = [
  '30 a 45 minutos (Express / Alta Intensidade)',
  '45 a 60 minutos (Padrão Recomendado)',
  '60 a 75 minutos (Musculação + Cardio)',
  '90 minutos ou mais (Treinamento Avançado / Atleta)'
];

export const COMPLEMENTARY_GOALS_LIST = [
  'Aumento de Cargas & Força',
  'Mobilidade de Quadril e Tornozelo',
  'Fortalecimento de Core e Abdômen',
  'Alívio de Dores Lombares e Cervicais',
  'Melhora do Fôlego / VO2 Máx',
  'Redução de Gordura Abdominal',
  'Correção de Assimetrias Bilaterais'
];

export const AnamneseView: React.FC<AnamneseViewProps> = ({ student, onSave }) => {
  const STORAGE_KEY = `glprofit_anamnese_${student?.id || 'default'}`;

  // PAR-Q Oficial de 7 perguntas
  const DEFAULT_PARQ = [
    {
      id: 'parq_1',
      question: 'Algum médico já disse que você possui algum problema de coração ou pressão alta e que só deve realizar atividade física supervisionada por profissionais de saúde?',
      answer: false
    },
    {
      id: 'parq_2',
      question: 'Você sente dores ou aperto no peito quando pratica atividade física?',
      answer: false
    },
    {
      id: 'parq_3',
      question: 'No último mês, você sentiu dor no peito quando NÃO estava praticando atividade física?',
      answer: false
    },
    {
      id: 'parq_4',
      question: 'Você perde o equilíbrio por causa de tontura ou alguma vez perdeu a consciência / desmaiou?',
      answer: false
    },
    {
      id: 'parq_5',
      question: 'Você possui algum problema ósseo, articular ou na coluna que poderia ser agravado pela atividade física?',
      answer: false
    },
    {
      id: 'parq_6',
      question: 'O seu médico prescreve atualmente medicamentos para a sua pressão arterial ou problema cardíaco?',
      answer: false
    },
    {
      id: 'parq_7',
      question: 'Você conhece alguma outra razão pela qual você não deva praticar atividade física ou deva realizar exames antes?',
      answer: false
    }
  ];

  const [parqAnswers, setParqAnswers] = useState(DEFAULT_PARQ);
  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluatorName, setEvaluatorName] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  
  // Histórico Clínico
  const [conditions, setConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState('');
  const [surgeries, setSurgeries] = useState('');
  const [allergies, setAllergies] = useState('');

  // Estilo de Vida
  const [smoking, setSmoking] = useState<'nao_fuma' | 'fumante' | 'ex_fumante'>('nao_fuma');
  const [alcohol, setAlcohol] = useState<'nao_consome' | 'socialmente' | 'frequente'>('socialmente');
  const [sleepHours, setSleepHours] = useState('7 a 8 horas');
  const [stressLevel, setStressLevel] = useState(4);
  const [physicalActivityLevel, setPhysicalActivityLevel] = useState<'sedentario' | 'iniciante' | 'intermediario' | 'avancado'>('intermediario');

  // Objetivos & Frequência Alvo (com opções predefinidas)
  const [mainGoal, setMainGoal] = useState('Hipertrofia & Ganho de Massa Muscular');
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>([]);
  const [targetFrequency, setTargetFrequency] = useState('4 vezes por semana (Seg, Ter, Qui e Sex)');
  const [preferredShift, setPreferredShift] = useState('Manhã (06:00 às 10:00)');
  const [sessionDuration, setSessionDuration] = useState('45 a 60 minutos (Padrão Recomendado)');
  const [customGoalMode, setCustomGoalMode] = useState(false);
  const [customFrequencyMode, setCustomFrequencyMode] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Perguntas personalizáveis
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([
    {
      id: 'cq_1',
      question: 'Pratica ou já praticou modalidades esportivas anteriormente (ex: futebol, natação, lutas)?',
      type: 'text',
      category: 'Histórico Esportivo',
      answer: 'Sim, musculação por 1 ano e futebol society aos fins de semana.'
    },
    {
      id: 'cq_2',
      question: 'Apresenta desconforto ou estalos no joelho ou ombro ao agachar ou levantar peso?',
      type: 'yes_no',
      category: 'Articular',
      answer: 'nao'
    }
  ]);

  // Modal para adicionar nova pergunta personalizada
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<'yes_no' | 'text' | 'scale_10'>('yes_no');
  const [newQuestionCategory, setNewQuestionCategory] = useState('Geral');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Carrega anamnese salva do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.parqAnswers) setParqAnswers(parsed.parqAnswers);
        if (parsed.evaluationDate) setEvaluationDate(parsed.evaluationDate);
        if (parsed.evaluatorName) setEvaluatorName(parsed.evaluatorName);
        if (parsed.conditions) setConditions(parsed.conditions);
        if (parsed.medications) setMedications(parsed.medications);
        if (parsed.surgeries) setSurgeries(parsed.surgeries);
        if (parsed.allergies) setAllergies(parsed.allergies);
        if (parsed.smoking) setSmoking(parsed.smoking);
        if (parsed.alcohol) setAlcohol(parsed.alcohol);
        if (parsed.sleepHours) setSleepHours(parsed.sleepHours);
        if (parsed.stressLevel !== undefined) setStressLevel(parsed.stressLevel);
        if (parsed.physicalActivityLevel) setPhysicalActivityLevel(parsed.physicalActivityLevel);
        if (parsed.mainGoal) setMainGoal(parsed.mainGoal);
        if (parsed.secondaryGoals) setSecondaryGoals(parsed.secondaryGoals);
        if (parsed.targetFrequency) setTargetFrequency(parsed.targetFrequency);
        if (parsed.preferredShift) setPreferredShift(parsed.preferredShift);
        if (parsed.sessionDuration) setSessionDuration(parsed.sessionDuration);
        if (parsed.clinicalNotes) setClinicalNotes(parsed.clinicalNotes);
        if (parsed.customQuestions) setCustomQuestions(parsed.customQuestions);
      }
    } catch {
      // Ignora erro de parse
    }
  }, [STORAGE_KEY]);

  const hasParqRisk = parqAnswers.some(q => q.answer === true);

  const handleToggleParq = (index: number, value: boolean) => {
    setParqAnswers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], answer: value };
      return copy;
    });
  };

  const handleToggleCondition = (cond: string) => {
    setConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const handleToggleSecondaryGoal = (goal: string) => {
    setSecondaryGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleAppendClinicalNote = (note: string) => {
    setClinicalNotes(prev => {
      if (!prev) return note;
      if (prev.includes(note)) return prev;
      return `${prev}\n• ${note}`;
    });
  };

  const handleAddCustomQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQ: CustomQuestion = {
      id: `cq_${Date.now()}`,
      question: newQuestionText.trim(),
      type: newQuestionType,
      category: newQuestionCategory.trim() || 'Geral',
      answer: newQuestionType === 'yes_no' ? 'nao' : newQuestionType === 'scale_10' ? '5' : ''
    };
    setCustomQuestions(prev => [...prev, newQ]);
    setNewQuestionText('');
    setIsAddQuestionOpen(false);
  };

  const handleRemoveCustomQuestion = (id: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleUpdateCustomAnswer = (id: string, val: string) => {
    setCustomQuestions(prev => prev.map(q => q.id === id ? { ...q, answer: val } : q));
  };

  const handleSaveAnamnese = () => {
    const payload = {
      studentId: student.id,
      studentName: student.name,
      evaluationDate,
      evaluatorName,
      hasParqRisk,
      parqAnswers,
      conditions,
      medications,
      surgeries,
      allergies,
      smoking,
      alcohol,
      sleepHours,
      stressLevel,
      physicalActivityLevel,
      mainGoal,
      secondaryGoals,
      targetFrequency,
      preferredShift,
      sessionDuration,
      clinicalNotes,
      customQuestions,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (onSave) onSave(payload);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const formattedDate = evaluationDate.split('-').reverse().join('/');
    let msg = `📋 *GL PRO FIT • ANAMNESE CLÍNICA & PAR-Q*\n`;
    msg += `👤 *Aluno:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Avaliador:* ${evaluatorName}\n`;
    msg += `🩺 *Status PAR-Q:* ${hasParqRisk ? '⚠️ ATENÇÃO: Respondeu SIM a uma ou mais perguntas (Atestado Recomendado)' : '✅ APTO: Respondeu NÃO a todas as perguntas'}\n\n`;
    msg += `🎯 *Objetivo Principal:* ${mainGoal}\n`;
    if (secondaryGoals.length > 0) {
      msg += `✨ *Metas Complementares:* ${secondaryGoals.join(', ')}\n`;
    }
    msg += `⚡ *Frequência Alvo:* ${targetFrequency}\n`;
    if (preferredShift || sessionDuration) {
      msg += `⏰ *Turno & Duração:* ${preferredShift} • ${sessionDuration}\n`;
    }
    msg += `🩺 *Patologias/Condições:* ${conditions.length > 0 ? conditions.join(', ') : 'Nenhuma relatada'}\n`;
    msg += `💊 *Medicamentos:* ${medications || 'Nenhum'}\n`;
    msg += `📝 *Observações:* ${clinicalNotes || 'Sem observações adicionais'}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header com Metadados e Ações */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Prontuário de Avaliação
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              PAR-Q + Questionário Personalizável
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Anamnese Clínica & Prontidão
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeamento de histórico de saúde, restrições ortopédicas e estilo de vida de <strong>{student.name}</strong>
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
            onClick={handleSaveAnamnese}
            className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Anamnese</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Anamnese e questionário de {student.name} salvos com sucesso no sistema!</span>
        </div>
      )}

      {/* METADADOS DA AVALIAÇÃO: DATA E AVALIADOR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Data da Anamnese
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
            Profissional Avaliador (CREF)
          </label>
          <input
            type="text"
            value={evaluatorName}
            onChange={(e) => setEvaluatorName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Status Geral de Prontidão
          </label>
          <div className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            hasParqRisk 
              ? 'bg-amber-50 text-amber-900 border-amber-300' 
              : 'bg-emerald-50 text-emerald-900 border-emerald-300'
          }`}>
            {hasParqRisk ? (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Liberação Médica Recomendada</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Apto sem Restrições Clínicas</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: PAR-Q (QUESTIONÁRIO DE PRONTIDÃO PARA ATIVIDADE FÍSICA) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                PAR-Q • Questionário de Prontidão para Atividade Física
              </h3>
              <p className="text-[11px] text-slate-500">
                Padrão internacional da CSEP / ACSM para triagem pré-exercício
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500">
            Responda com honestidade (Sim / Não)
          </div>
        </div>

        {hasParqRisk && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1">
            <div className="flex items-center gap-2 font-black text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>ATENÇÃO: Uma ou mais respostas indicaram risco potencial ("SIM")</span>
            </div>
            <p className="leading-relaxed text-amber-900/90 font-medium">
              Recomenda-se que o aluno consulte um médico antes de iniciar ou aumentar significativamente a intensidade de treinos. O professor deve solicitar atestado médico ou limitar exercícios de alta sobrecarga cardiovascular.
            </p>
          </div>
        )}

        <div className="space-y-2.5">
          {parqAnswers.map((item, idx) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.answer 
                  ? 'bg-red-50/60 border-red-200' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 text-xs font-black text-slate-700 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {item.question}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleParq(idx, false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !item.answer
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  NÃO
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleParq(idx, true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    item.answer
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  SIM
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 2: HISTÓRICO CLÍNICO, PATOLOGIAS & MEDICAMENTOS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Histórico Médico, Patologias & Cirurgias
            </h3>
            <p className="text-[11px] text-slate-500">
              Assinale as condições diagnosticadas ou em tratamento
            </p>
          </div>
        </div>

        {/* Checkboxes de patologias comuns */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Condições / Patologias Diagnosticadas:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[
              'Hipertensão Arterial',
              'Diabetes Mellitus',
              'Colesterol Alto / Dislipidemia',
              'Cardiopatia / Arritmia',
              'Hérnia de Disco / Lombalgia',
              'Condromalácia Patelar',
              'Lesão de Menisco / LCA',
              'Tendinite / Bursite de Ombro',
              'Labirintite / Vertigem',
              'Asma / Bronquite',
              'Varizes / Má Circulação',
              'Osteoporose / Osteopenia'
            ].map((cond) => {
              const checked = conditions.includes(cond);
              return (
                <div
                  key={cond}
                  onClick={() => handleToggleCondition(cond)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                    checked
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    checked ? 'bg-blue-700 border-blue-700 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {checked && <span className="text-[10px] font-black">✓</span>}
                  </div>
                  <span className="truncate">{cond}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Medicamentos em Uso Contínuo:
            </label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="Ex: Anti-hipertensivo, ansiolítico, insulina..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cirurgias Prévias & Fraturas:
            </label>
            <input
              type="text"
              value={surgeries}
              onChange={(e) => setSurgeries(e.target.value)}
              placeholder="Ex: Artroscopia joelho (2022), apêndice..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alergias ou Restrições:
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Ex: Alergia a picadas, poeira, intolerância..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: HÁBITOS, ESTILO DE VIDA & NÍVEL ATUAL */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Estilo de Vida, Hábitos & Rotina
            </h3>
            <p className="text-[11px] text-slate-500">
              Fatores comportamentais que impactam recuperação e evolução
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tabagismo
            </label>
            <select
              value={smoking}
              onChange={(e) => setSmoking(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="nao_fuma">Não fuma</option>
              <option value="fumante">Fumante ativo</option>
              <option value="ex_fumante">Ex-fumante</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Consumo de Álcool
            </label>
            <select
              value={alcohol}
              onChange={(e) => setAlcohol(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="nao_consome">Não consome</option>
              <option value="socialmente">Socialmente / Ocasional</option>
              <option value="frequente">Consumo Frequente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sono Diário (Horas)
            </label>
            <select
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Menos de 5 horas">Menos de 5 horas</option>
              <option value="5 a 6 horas">5 a 6 horas</option>
              <option value="7 a 8 horas">7 a 8 horas (Ideal)</option>
              <option value="Mais de 8 horas">Mais de 8 horas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nível Atual de Atividade
            </label>
            <select
              value={physicalActivityLevel}
              onChange={(e) => setPhysicalActivityLevel(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="sedentario">Sedentário (Sem exercícios)</option>
              <option value="iniciante">Iniciante (1 a 2x/semana)</option>
              <option value="intermediario">Intermediário (3 a 4x/semana)</option>
              <option value="avancado">Avançado / Atleta (5+ x/semana)</option>
            </select>
          </div>
        </div>

        {/* Nível de Estresse */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Nível Autopercebido de Estresse na Rotina:</span>
            <span className="text-blue-700 font-black">{stressLevel} de 10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))}
            className="w-full accent-blue-700 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
            <span>1 (Muito Baixo / Relaxado)</span>
            <span>5 (Moderado)</span>
            <span>10 (Muito Elevado / Sobrecarga)</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 4: OBJETIVOS PRINCIPAIS & METAS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Objetivos & Frequência Alvo
              </h3>
              <p className="text-[11px] text-slate-500">
                Opções clínicas e esportivas pré-definidas para prescrição do treino e metas de aderência
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            Opções Pré-definidas
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* COLUNA 1: OBJETIVO PRINCIPAL */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Objetivo Principal da Avaliação:</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomGoalMode(!customGoalMode)}
                className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer"
              >
                {customGoalMode ? '← Ver opções predefinidas' : 'Digitar personalizado'}
              </button>
            </div>

            {/* Select Predefinido */}
            {!customGoalMode ? (
              <select
                value={PREDEFINED_OBJECTIVE_GROUPS.some(g => g.options.includes(mainGoal)) ? mainGoal : '__custom__'}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomGoalMode(true);
                  } else {
                    setMainGoal(e.target.value);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
              >
                {PREDEFINED_OBJECTIVE_GROUPS.map((group) => (
                  <optgroup key={group.group} label={group.group} className="font-bold text-slate-900">
                    {group.options.map((opt) => (
                      <option key={opt} value={opt} className="font-normal text-slate-800">
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="__custom__" className="font-bold text-indigo-700">
                  ✍️ Outro (Especificar Personalizado)...
                </option>
              </select>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  autoFocus
                  value={mainGoal}
                  onChange={(e) => setMainGoal(e.target.value)}
                  placeholder="Ex: Ganho de força, hipertrofia de membros inferiores e alívio lombar"
                  className="w-full px-3 py-2.5 rounded-xl border border-indigo-400 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
                />
                <p className="text-[10px] text-slate-500">
                  Modo personalizado ativo. Você pode digitar livremente ou voltar à lista predefinida.
                </p>
              </div>
            )}

            {/* Chips de Objetivos Populares Pré-definidos */}
            <div className="pt-1">
              <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                ⚡ Seleção Rápida de Objetivos Mais Comuns:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_OBJECTIVES.map((pop) => {
                  const isSelected = mainGoal === pop.value && !customGoalMode;
                  return (
                    <button
                      key={pop.value}
                      type="button"
                      onClick={() => {
                        setMainGoal(pop.value);
                        setCustomGoalMode(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50/70 hover:border-indigo-300'
                      }`}
                    >
                      <span>{pop.emoji}</span>
                      <span>{pop.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metas Complementares Opcionais */}
            <div className="pt-2 border-t border-slate-200/60">
              <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                ✨ Metas Complementares & Foco Adicional (Opcional):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMPLEMENTARY_GOALS_LIST.map((comp) => {
                  const isChecked = secondaryGoals.includes(comp);
                  return (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => handleToggleSecondaryGoal(comp)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer border ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={isChecked ? 'text-emerald-700 font-black' : 'text-slate-400'}>
                        {isChecked ? '✓' : '+'}
                      </span>
                      <span>{comp}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUNA 2: FREQUÊNCIA ALVO */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                <span>Frequência Semanal Pretendida:</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomFrequencyMode(!customFrequencyMode)}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
              >
                {customFrequencyMode ? '← Ver opções predefinidas' : 'Digitar personalizado'}
              </button>
            </div>

            {/* Select Predefinido */}
            {!customFrequencyMode ? (
              <select
                value={PREDEFINED_FREQUENCIES.some(f => f.value === targetFrequency) ? targetFrequency : '__custom__'}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomFrequencyMode(true);
                  } else {
                    setTargetFrequency(e.target.value);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
              >
                {PREDEFINED_FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value} className="text-slate-800">
                    {freq.label}
                  </option>
                ))}
                <option value="__custom__" className="font-bold text-blue-700">
                  ✍️ Outro (Especificar Personalizado)...
                </option>
              </select>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  autoFocus
                  value={targetFrequency}
                  onChange={(e) => setTargetFrequency(e.target.value)}
                  placeholder="Ex: 3x musculação na academia + 2x corrida no parque"
                  className="w-full px-3 py-2.5 rounded-xl border border-blue-400 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
                />
                <p className="text-[10px] text-slate-500">
                  Modo personalizado ativo. Você pode digitar a rotina exata do aluno.
                </p>
              </div>
            )}

            {/* Chips de Frequência Mais Utilizadas */}
            <div className="pt-1">
              <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                📅 Frequências Predefinidas Mais Comuns:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_FREQUENCIES.map((freq) => {
                  const isSelected = targetFrequency === freq.value && !customFrequencyMode;
                  return (
                    <button
                      key={freq.value}
                      type="button"
                      onClick={() => {
                        setTargetFrequency(freq.value);
                        setCustomFrequencyMode(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-700 text-white border-blue-800 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <span>{freq.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Turno Preferencial & Duração Estimada */}
            <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  🌅 Turno Preferencial:
                </label>
                <select
                  value={preferredShift}
                  onChange={(e) => setPreferredShift(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {PREDEFINED_SHIFTS.map((shift) => (
                    <option key={shift} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  ⏱️ Duração Alvo por Sessão:
                </label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {PREDEFINED_DURATIONS.map((dur) => (
                    <option key={dur} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* OBSERVAÇÕES CLÍNICAS & CONDUTA INICIAL */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Observações Gerais & Conduta Inicial do Professor
            </label>
            <span className="text-[10px] text-slate-400">
              Clique nas sugestões abaixo para inserir rapidamente
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              'Adaptação neuromuscular nas primeiras 3 semanas',
              'Priorizar mobilidade de quadril e tornozelo',
              'Evitar sobrecarga axial na coluna e impacto articular',
              'Cadência excêntrica controlada (3s) e foco biomecânico',
              'Cardio aeróbico moderado 20min pós-musculação'
            ].map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleAppendClinicalNote(sug)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                + {sug}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Anotações do avaliador sobre restrições de amplitude, adaptações necessárias e recomendações para prescrição do treino..."
            className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* SEÇÃO 5: QUESTIONÁRIO PERSONALIZÁVEL (CRIADOR DE PERGUNTAS) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Perguntas Personalizadas da Academia / Avaliador
              </h3>
              <p className="text-[11px] text-slate-500">
                Adicione perguntas específicas para sua metodologia ou modalidade
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddQuestionOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Adicionar Pergunta</span>
          </button>
        </div>

        {/* Modal de Adicionar Pergunta Customizada */}
        {isAddQuestionOpen && (
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-3">
            <h4 className="text-xs font-bold text-purple-950 uppercase">
              Nova Pergunta Personalizada
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Ex: Costuma sentir fadiga excessiva após treinos intensos?"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <select
                  value={newQuestionType}
                  onChange={(e) => setNewQuestionType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-slate-800"
                >
                  <option value="yes_no">Tipo: Sim / Não</option>
                  <option value="text">Tipo: Resposta em Texto</option>
                  <option value="scale_10">Tipo: Escala de 1 a 10</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddQuestionOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddCustomQuestion}
                className="px-4 py-1.5 rounded-lg bg-purple-800 text-white text-xs font-bold hover:bg-purple-700"
              >
                Adicionar ao Questionário
              </button>
            </div>
          </div>
        )}

        {/* Lista de Perguntas Customizadas */}
        <div className="space-y-3">
          {customQuestions.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Nenhuma pergunta personalizada adicionada. Clique no botão acima para incluir.
            </p>
          ) : (
            customQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                      {q.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {q.question}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCustomQuestion(q.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    title="Remover pergunta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Input de Resposta baseado no Tipo */}
                {q.type === 'yes_no' ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateCustomAnswer(q.id, 'sim')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        q.answer === 'sim' ? 'bg-blue-700 text-white' : 'bg-white border text-slate-600'
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateCustomAnswer(q.id, 'nao')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        q.answer === 'nao' ? 'bg-blue-700 text-white' : 'bg-white border text-slate-600'
                      }`}
                    >
                      Não
                    </button>
                  </div>
                ) : q.type === 'scale_10' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={Number(q.answer) || 5}
                      onChange={(e) => handleUpdateCustomAnswer(q.id, e.target.value)}
                      className="w-48 accent-purple-700"
                    />
                    <span className="text-xs font-bold text-purple-900">{q.answer || 5}/10</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => handleUpdateCustomAnswer(q.id, e.target.value)}
                    placeholder="Digite a resposta do aluno..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
