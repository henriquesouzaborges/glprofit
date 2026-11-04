import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  FileText, 
  Layers, 
  Scale, 
  Activity, 
  Camera, 
  Zap, 
  Dumbbell, 
  Flame, 
  ArrowUpRight, 
  Sliders,
  CheckCircle2,
  Info,
  Save,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Check,
  ShieldCheck,
  SlidersHorizontal,
  Grid,
  Heart,
  Timer
} from 'lucide-react';
import { Student } from '../../../types';

export type ConfigSubTab = 
  | 'anamnese'
  | 'dobras_cutaneas'
  | 'bioimpedancia'
  | 'perimetria'
  | 'fotos_postural'
  | 'testes_funcionais'
  | 'testes_forca'
  | 'testes_campo'
  | 'testes_salto'
  | 'testes_personalizados';

interface AvaliacoesConfiguracoesHubViewProps {
  student?: Student;
  initialTab?: ConfigSubTab;
  onSave?: (data: any) => void;
}

const CONFIG_TABS_LIST: { id: ConfigSubTab; label: string; shortLabel: string; icon: React.ElementType; description: string }[] = [
  { id: 'anamnese', label: 'Anamnese & PAR-Q', shortLabel: 'Anamnese', icon: FileText, description: 'Questionário de prontidão física e histórico clínico' },
  { id: 'dobras_cutaneas', label: 'Dobras Cutâneas', shortLabel: 'Dobras', icon: Layers, description: 'Protocolos de Pollock 7/3, Petroski, Guedes e Faulkner' },
  { id: 'bioimpedancia', label: 'Bioimpedância', shortLabel: 'Bioimpedância', icon: Scale, description: 'Composição corporal por impedância elétrica tetrapolar' },
  { id: 'perimetria', label: 'Perimetria Corporal', shortLabel: 'Perimetria', icon: Activity, description: 'Circunferências corporais e relação cintura-quadril' },
  { id: 'fotos_postural', label: 'Fotos & Postural', shortLabel: 'Fotos e Postura', icon: Camera, description: 'Avaliação postural computadorizada e fotogrametria' },
  { id: 'testes_funcionais', label: 'Testes Funcionais', shortLabel: 'Funcionais', icon: Zap, description: 'Bateria FMS (Gray Cook) e Banco de Wells' },
  { id: 'testes_forca', label: 'Testes de Força', shortLabel: 'Força & 1RM', icon: Dumbbell, description: '1RM preditivo, RML ACSM e Dinamometria' },
  { id: 'testes_campo', label: 'Testes de Campo', shortLabel: 'Campo', icon: Flame, description: 'Yo-Yo Test, RAST, Teste T, Cooper e 1 Milha' },
  { id: 'testes_salto', label: 'Testes de Salto', shortLabel: 'Saltos', icon: ArrowUpRight, description: 'Plataforma CMJ, SJ, Drop Jump e RSI' },
  { id: 'testes_personalizados', label: 'Testes Personalizados', shortLabel: 'Personalizados', icon: Sliders, description: 'Métricas sob demanda e biblioteca por modalidade' },
];

export const AvaliacoesConfiguracoesHubView: React.FC<AvaliacoesConfiguracoesHubViewProps> = ({
  initialTab = 'anamnese',
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<ConfigSubTab>(initialTab);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Estados de Configuração da Anamnese
  const [parqEnabled, setParqEnabled] = useState(true);
  const [customQuestions, setCustomQuestions] = useState<Array<{ id: string; question: string; category: string; type: string }>>([
    { id: 'cq_1', question: 'Pratica ou já praticou modalidades esportivas anteriormente (ex: futebol, natação, lutas)?', category: 'Histórico Esportivo', type: 'Texto' },
    { id: 'cq_2', question: 'Apresenta desconforto ou estalos no joelho ou ombro ao agachar ou levantar peso?', category: 'Articular', type: 'Sim / Não' },
    { id: 'cq_3', question: 'Qual o tempo médio de sono nas últimas 4 semanas?', category: 'Estilo de Vida', type: 'Texto' }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('Histórico Esportivo');
  const [newQuestionType, setNewQuestionType] = useState('Texto');

  // Estados de Configuração de Dobras Cutâneas
  const [defaultProtocol, setDefaultProtocol] = useState<'pollock_7' | 'pollock_3' | 'petroski_4' | 'guedes_3' | 'faulkner_4'>('pollock_7');
  const [densityEquation, setDensityEquation] = useState<'siri' | 'brozek'>('siri');
  const [adipometerTolerance, setAdipometerTolerance] = useState('1.0 mm (Recomendação ISAK)');

  // Estados de Configuração de Bioimpedância
  const [bioDeviceType, setBioDeviceType] = useState('Tetrapolar Multifrequencial (8 Eletrodos)');
  const [visceralFatThreshold, setVisceralFatThreshold] = useState('Nível 10 (Atenção) / Nível 15 (Alto Risco)');
  const [bmrEquation, setBmrEquation] = useState('Harris-Benedict Revisada');

  // Estados de Configuração de Perimetria
  const [rcqCutoffMale, setRcqCutoffMale] = useState('0.90 (Padrão OMS)');
  const [rcqCutoffFemale, setRcqCutoffFemale] = useState('0.85 (Padrão OMS)');
  const [asymmetryThreshold, setAsymmetryThreshold] = useState('1.0 cm');

  // Estados de Configuração de Fotos & Postura
  const [gridSpacing, setGridSpacing] = useState('2.0 cm (Padrão)');
  const [plumbLineColor, setPlumbLineColor] = useState('Vermelho Vivo (#EF4444)');
  const [includeWatermark, setIncludeWatermark] = useState(true);

  // Estados de Configuração de Testes Funcionais
  const [fmsRiskCutoff, setFmsRiskCutoff] = useState('14 pontos (Padrão Gray Cook)');
  const [wellsTableReference, setWellsTableReference] = useState('ACSM 10ª Edição');

  // Estados de Configuração de Força
  const [default1RmFormula, setDefault1RmFormula] = useState('Brzycki (1993)');
  const [dynamometerCutoff, setDynamometerCutoff] = useState('45 kgf (Homens) / 30 kgf (Mulheres)');

  // Estados de Configuração de Campo
  const [yoyoProtocolVersion, setYoyoProtocolVersion] = useState('Yo-Yo IR1 (Intermittent Recovery Nível 1)');
  const [rastDistance, setRastDistance] = useState<'35m' | '20m'>('35m');
  const [tTestCircuitSize, setTTestCircuitSize] = useState('10 jardas x 10 jardas (9.14m x 9.14m)');

  // Estados de Configuração de Saltos
  const [dropBoxHeight, setDropBoxHeight] = useState('30 cm');
  const [sayersFormulaActive, setSayersFormulaActive] = useState(true);
  const [unipodalAsymmetryCutoff, setUnipodalAsymmetryCutoff] = useState('10%');

  // Feedback de salvamento
  const triggerSaveNotification = (tabName: string) => {
    setSaveSuccessMessage(`Configurações de "${tabName}" salvas com sucesso no sistema da academia!`);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQ = {
      id: `cq_${Date.now()}`,
      question: newQuestionText.trim(),
      category: newQuestionCategory,
      type: newQuestionType
    };
    setCustomQuestions(prev => [...prev, newQ]);
    setNewQuestionText('');
    triggerSaveNotification('Anamnese');
  };

  const handleRemoveQuestion = (id: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
    triggerSaveNotification('Anamnese');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* BANNER SUPERIOR DA CENTRAL DE CONFIGURAÇÕES - SEM SELEÇÃO DE ALUNO */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-blue-600" />
                Central de Configurações das Avaliações
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Parâmetros Globais da Academia
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">
                10 Módulos Integrados
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-1">
              <span>Configuração dos Protocolos de Avaliação Física</span>
            </h2>
            <p className="text-xs text-slate-500">
              Personalize parâmetros científicos, tabelas normativas, fórmulas de cálculo e questionários da academia. As configurações definidas aqui serão aplicadas a todas as novas avaliações.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Navegue pelas abas abaixo para configurar cada método</span>
          </div>
        </div>

        {/* BARRA DE NAVEGAÇÃO INTERNA ENTRE AS 10 AVALIAÇÕES */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
          {CONFIG_TABS_LIST.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
                title={tab.description}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PAINEL DE CONFIGURAÇÃO ESPECÍFICO DO MÓDULO ATIVO (SEM CARD DE ALUNO) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">

        {/* 1. CONFIGURAÇÕES: ANAMNESE & PAR-Q */}
        {activeTab === 'anamnese' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Configurações de Anamnese Clínica & PAR-Q+</span>
                </h3>
                <p className="text-xs text-slate-500">Defina o modelo padrão de triagem de saúde e adicione perguntas personalizadas da academia.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Anamnese')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            {/* Configuração PAR-Q Oficial */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Questionário de Prontidão Física (PAR-Q+ 7 Perguntas)</h4>
                  <p className="text-xs text-slate-500">Padrão internacional da Sociedade Canadense de Fisiologia do Exercício & ACSM.</p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parqEnabled}
                    onChange={(e) => setParqEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                  <span>Exigir PAR-Q+ como etapa obrigatória</span>
                </label>
              </div>
            </div>

            {/* Banco de Perguntas Personalizadas */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Perguntas Personalizadas da Academia</h4>
              <div className="space-y-2">
                {customQuestions.map((q) => (
                  <div key={q.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900 block">{q.question}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">{q.category}</span>
                        <span>Tipo: {q.type}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Formulário para adicionar pergunta */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <h5 className="text-xs font-black text-blue-900">Adicionar Nova Pergunta ao Questionário Geral:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Texto da pergunta (ex: Faz uso de creatina ou suplementos?)"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={newQuestionCategory}
                      onChange={(e) => setNewQuestionCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="Histórico Esportivo">Histórico Esportivo</option>
                      <option value="Articular">Articular</option>
                      <option value="Cardiorrespiratório">Cardiorrespiratório</option>
                      <option value="Estilo de Vida">Estilo de Vida</option>
                      <option value="Nutrição">Nutrição</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3 flex gap-2">
                    <select
                      value={newQuestionType}
                      onChange={(e) => setNewQuestionType(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="Texto">Texto</option>
                      <option value="Sim / Não">Sim / Não</option>
                      <option value="Escala 0-10">Escala 0-10</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CONFIGURAÇÕES: DOBRAS CUTÂNEAS */}
        {activeTab === 'dobras_cutaneas' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>Configurações de Dobras Cutâneas (Adipometria)</span>
                </h3>
                <p className="text-xs text-slate-500">Defina o protocolo científico padrão e equações de densidade corporal para a academia.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Dobras Cutâneas')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Protocolo Padrão Prioritário:</label>
                <select
                  value={defaultProtocol}
                  onChange={(e: any) => setDefaultProtocol(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="pollock_7">Pollock 7 Dobras (Mais Completo • Recomendado)</option>
                  <option value="pollock_3">Pollock 3 Dobras (Rápido e Prático)</option>
                  <option value="petroski_4">Petroski 4 Dobras (População Brasileira)</option>
                  <option value="guedes_3">Guedes 3 Dobras (Jovens e Universitários)</option>
                  <option value="faulkner_4">Faulkner 4 Dobras (Atletas e Futebol)</option>
                </select>
                <p className="text-[11px] text-slate-400">Este protocolo será selecionado por padrão ao iniciar novas avaliações.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Equação de Conversão de Densidade para % Gordura:</label>
                <select
                  value={densityEquation}
                  onChange={(e: any) => setDensityEquation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="siri">Equação de Siri (1961) • %G = ((4.95 / D) - 4.50) * 100</option>
                  <option value="brozek">Equação de Brozek (1963) • %G = ((4.57 / D) - 4.142) * 100</option>
                </select>
                <p className="text-[11px] text-slate-400">Siri é o padrão ouro na literatura para adultos eutróficos.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Tolerância de Repetibilidade do Adipômetro:</label>
                <select
                  value={adipometerTolerance}
                  onChange={(e) => setAdipometerTolerance(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="1.0 mm (Recomendação ISAK)">± 1.0 mm (Recomendação Padrão ISAK)</option>
                  <option value="1.5 mm (Flexível)">± 1.5 mm (Flexível)</option>
                  <option value="2.0 mm (Iniciantes)">± 2.0 mm (Iniciantes)</option>
                </select>
                <p className="text-[11px] text-slate-400">Divergências acima deste limiar sugerem realização de uma terceira medida.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Estratificação Normativa de % Gordura:</label>
                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>Homens:</strong> Atleta &lt;6% | Bom 11-14% | Média 15-17% | Risco &gt;25%</p>
                  <p><strong>Mulheres:</strong> Atleta &lt;12% | Bom 17-20% | Média 21-24% | Risco &gt;32%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CONFIGURAÇÕES: BIOIMPEDÂNCIA */}
        {activeTab === 'bioimpedancia' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600" />
                  <span>Configurações de Bioimpedância Elétrica</span>
                </h3>
                <p className="text-xs text-slate-500">Configure perfis de balança, pontos de corte de gordura visceral e taxa metabólica.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Bioimpedância')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Tipo de Aparelho Ativo:</label>
                <select
                  value={bioDeviceType}
                  onChange={(e) => setBioDeviceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Tetrapolar Multifrequencial (8 Eletrodos)">Tetrapolar Octapolar (8 Eletrodos • InBody / Tanita Pro)</option>
                  <option value="Tetrapolar Pés-Mãos (4 Eletrodos)">Tetrapolar Pés-Mãos (4 Eletrodos • Omron HBF-514)</option>
                  <option value="Bipolar Pés (Balança Residencial)">Bipolar Pés (Balança Residencial / Digital)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Pontos de Corte de Gordura Visceral:</label>
                <input
                  type="text"
                  value={visceralFatThreshold}
                  onChange={(e) => setVisceralFatThreshold(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
                <p className="text-[11px] text-slate-400">Escala de 1 a 20 da balança com sinalizador de alerta cardiovascular.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Equação de Taxa Metabólica Basal (TMB):</label>
                <select
                  value={bmrEquation}
                  onChange={(e) => setBmrEquation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Harris-Benedict Revisada">Harris-Benedict (1984 Revisada • Padrão Clínico)</option>
                  <option value="Cunningham (Baseada em Massa Magra)">Cunningham (1980 • Recomendada para Atletas)</option>
                  <option value="Katch-McArdle">Katch-McArdle (Baseada em Massa Magra LBM)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 4. CONFIGURAÇÕES: PERIMETRIA */}
        {activeTab === 'perimetria' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-600" />
                  <span>Configurações de Perimetria & Circunferências</span>
                </h3>
                <p className="text-xs text-slate-500">Defina os pontos de medição corporal e limiares de Relação Cintura-Quadril (RCQ).</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Perimetria')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Pontos de Corte RCQ (Risco Alto - Homens):</label>
                <input
                  type="text"
                  value={rcqCutoffMale}
                  onChange={(e) => setRcqCutoffMale(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Pontos de Corte RCQ (Risco Alto - Mulheres):</label>
                <input
                  type="text"
                  value={rcqCutoffFemale}
                  onChange={(e) => setRcqCutoffFemale(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Alerta de Assimetria Bilateral (D vs E):</label>
                <input
                  type="text"
                  value={asymmetryThreshold}
                  onChange={(e) => setAsymmetryThreshold(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
                <p className="text-[11px] text-slate-400">Diferença em braços ou pernas que aciona aviso de assimetria nos laudos.</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONFIGURAÇÕES: FOTOS & POSTURAL */}
        {activeTab === 'fotos_postural' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  <span>Configurações de Fotos & Grade Postural Virtual</span>
                </h3>
                <p className="text-xs text-slate-500">Configure a malha de fotogrametria, linha de gravidade e privacidade das imagens.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Fotos e Postural')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Espaçamento da Quadrícula Milimetrada:</label>
                <select
                  value={gridSpacing}
                  onChange={(e) => setGridSpacing(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="1.0 cm (Alta Precisão)">1.0 cm (Alta Precisão)</option>
                  <option value="2.0 cm (Padrão)">2.0 cm (Padrão Recomendado)</option>
                  <option value="5.0 cm (Ampla)">5.0 cm (Ampla)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Cor do Fio de Prumo / Linha de Gravidade:</label>
                <select
                  value={plumbLineColor}
                  onChange={(e) => setPlumbLineColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Vermelho Vivo (#EF4444)">Vermelho Vivo (#EF4444)</option>
                  <option value="Azul Cobalto (#2563EB)">Azul Cobalto (#2563EB)</option>
                  <option value="Amarelo Fluorescente (#EAB308)">Amarelo Fluorescente (#EAB308)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWatermark}
                    onChange={(e) => setIncludeWatermark(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                  <span>Aplicar marca d'água institucional nos laudos com foto</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 6. CONFIGURAÇÕES: TESTES FUNCIONAIS */}
        {activeTab === 'testes_funcionais' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span>Configurações de Testes Funcionais & FMS</span>
                </h3>
                <p className="text-xs text-slate-500">Defina os critérios da bateria FMS e tabelas de flexibilidade do Banco de Wells.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Testes Funcionais')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Ponto de Corte para Risco de Lesão FMS:</label>
                <input
                  type="text"
                  value={fmsRiskCutoff}
                  onChange={(e) => setFmsRiskCutoff(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
                <p className="text-[11px] text-slate-400">Pontuações menores ou iguais a 14 pontos indicam risco de lesão multiplicado por 2.5x.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Tabela de Referência Banco de Wells (cm):</label>
                <select
                  value={wellsTableReference}
                  onChange={(e) => setWellsTableReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="ACSM 10ª Edição">ACSM 10ª Edição (Estratificado por Idade e Sexo)</option>
                  <option value="Pollock & Wilmore">Pollock & Wilmore (1990)</option>
                  <option value="PROESP-BR">PROESP-BR (Crianças e Adolescentes)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 7. CONFIGURAÇÕES: TESTES DE FORÇA */}
        {activeTab === 'testes_forca' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-red-600" />
                  <span>Configurações de Testes de Força & 1RM</span>
                </h3>
                <p className="text-xs text-slate-500">Configure equações preditivas de repetições máximas e parâmetros de dinamometria.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Testes de Força')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Fórmula Oficial de Predição de 1RM:</label>
                <select
                  value={default1RmFormula}
                  onChange={(e) => setDefault1RmFormula(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Brzycki (1993)">Brzycki (1993) • Carga / (1.0278 - 0.0278 * Reps) [Padrão Ouro]</option>
                  <option value="Epley (1985)">Epley (1985) • Carga * (1 + 0.0333 * Reps)</option>
                  <option value="Lombardi (1989)">Lombardi (1989) • Carga * (Reps ^ 0.10)</option>
                  <option value="O'Conner et al.">O'Conner et al. (1989)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Valores Normativos Dinamometria Jamar:</label>
                <input
                  type="text"
                  value={dynamometerCutoff}
                  onChange={(e) => setDynamometerCutoff(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* 8. CONFIGURAÇÕES: TESTES DE CAMPO */}
        {activeTab === 'testes_campo' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  <span>Configurações de Testes de Campo</span>
                </h3>
                <p className="text-xs text-slate-500">Parâmetros oficiais para Yo-Yo Test, RAST, Teste T de agilidade, Cooper e 1 Milha.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Testes de Campo')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Distância Oficial do Teste RAST:</label>
                <select
                  value={rastDistance}
                  onChange={(e: any) => setRastDistance(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="35m">35 metros (Oficial Pista de Atletismo / Campo Aberto)</option>
                  <option value="20m">20 metros (Adaptado para Futsal e Quadras Cobertas)</option>
                </select>
                <p className="text-[11px] text-slate-400">O sistema recalcula a potência biomecânica com base na distância escolhida.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Protocolo Oficial Yo-Yo Test:</label>
                <input
                  type="text"
                  value={yoyoProtocolVersion}
                  onChange={(e) => setYoyoProtocolVersion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
                <p className="text-[11px] text-slate-400">Shuttles de 40m com 10s de recuperação ativa entre estágios (Equação Bangsbo 2008).</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Dimensões do Circuito em T:</label>
                <input
                  type="text"
                  value={tTestCircuitSize}
                  onChange={(e) => setTTestCircuitSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* 9. CONFIGURAÇÕES: TESTES DE SALTO */}
        {activeTab === 'testes_salto' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-teal-600" />
                  <span>Configurações de Testes de Salto & Potência</span>
                </h3>
                <p className="text-xs text-slate-500">Ajuste parâmetros de Drop Jump, fórmula de Sayers e zonas de RSI.</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Testes de Salto')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Altura Padrão da Caixa de Drop Jump:</label>
                <select
                  value={dropBoxHeight}
                  onChange={(e) => setDropBoxHeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="20 cm">20 cm (Iniciantes)</option>
                  <option value="30 cm">30 cm (Padrão Oficial Recomendado)</option>
                  <option value="40 cm">40 cm (Atletas Avançados)</option>
                  <option value="60 cm">60 cm (Elite / Alta Potência)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Cálculo de Potência de Pico:</label>
                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>Fórmula de Sayers et al. (1999):</strong></p>
                  <p className="text-slate-500">P (Watts) = 60.7 * Altura CMJ (cm) + 45.3 * Peso (kg) - 2055</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Limiar de Risco de Assimetria Unipodal:</label>
                <input
                  type="text"
                  value={unipodalAsymmetryCutoff}
                  onChange={(e) => setUnipodalAsymmetryCutoff(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                />
                <p className="text-[11px] text-slate-400">Diferença superior a 10% entre pernas gera alerta de risco articular/ligamentar.</p>
              </div>
            </div>
          </div>
        )}

        {/* 10. CONFIGURAÇÕES: TESTES PERSONALIZADOS */}
        {activeTab === 'testes_personalizados' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-slate-700" />
                  <span>Biblioteca & Construtor de Testes Personalizados</span>
                </h3>
                <p className="text-xs text-slate-500">Gerencie modelos de testes por modalidade esportiva (Lutas, CrossFit, Natação, Futebol).</p>
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNotification('Testes Personalizados')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Catálogo</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Modelos de Testes Esportivos Cadastrados na Academia:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Lutas / BJJ</span>
                  <strong className="block text-xs text-slate-900">Suspensão de Kimono na Barra</strong>
                  <p className="text-[11px] text-slate-500">Métrica: Segundos | 3 tentativas (Melhor marca)</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">CrossFit</span>
                  <strong className="block text-xs text-slate-900">Pull-ups Unbroken</strong>
                  <p className="text-[11px] text-slate-500">Métrica: Repetições | 1 tentativa</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">Natação</span>
                  <strong className="block text-xs text-slate-900">Velocidade Crítica CSS</strong>
                  <p className="text-[11px] text-slate-500">Métrica: Segundos (400m e 50m)</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Basquete / Vôlei</span>
                  <strong className="block text-xs text-slate-900">Spike Jump Reach</strong>
                  <p className="text-[11px] text-slate-500">Métrica: Centímetros | 3 tentativas</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Corrida / Atletismo</span>
                  <strong className="block text-xs text-slate-900">Tiro de 30m Lançado</strong>
                  <p className="text-[11px] text-slate-500">Métrica: Segundos | 2 tentativas</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
