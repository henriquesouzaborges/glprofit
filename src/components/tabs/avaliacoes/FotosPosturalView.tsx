import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Grid, 
  Save, 
  Share2, 
  Printer, 
  CheckCircle2, 
  Eye, 
  Upload, 
  RotateCcw, 
  User, 
  Calendar,
  AlertTriangle,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Student } from '../../../types';

interface FotosPosturalViewProps {
  student: Student;
  onSave?: (data: any) => void;
}

interface PhotoItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  showGrid: boolean;
}

export const FotosPosturalView: React.FC<FotosPosturalViewProps> = ({ student, onSave }) => {
  const STORAGE_KEY = `glprofit_postural_${student?.id || 'default'}`;

  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluator, setEvaluator] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [globalGrid, setGlobalGrid] = useState(true);

  // 4 Fotos Fotogramétricas Padronizadas
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: 'frente',
      title: 'Vista Anterior (Frente)',
      subtitle: 'Alinhamento bipupilar, nivelamento de ombros e patelas',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      showGrid: true
    },
    {
      id: 'costas',
      title: 'Vista Posterior (Costas)',
      subtitle: 'Simetria escapular, linha da coluna e pregas glúteas',
      url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
      showGrid: true
    },
    {
      id: 'lateral_d',
      title: 'Vista Lateral Direita (Perfil D)',
      subtitle: 'Curvaturas fisiológicas (lordose e cifose), prumo de orelha a maléolo',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
      showGrid: true
    },
    {
      id: 'lateral_e',
      title: 'Vista Lateral Esquerda (Perfil E)',
      subtitle: 'Projeção pélvica, posicionamento de cabeça e hiperextensão de joelho',
      url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
      showGrid: true
    }
  ]);

  // Checklist Anatômico Postural
  const [postureChecklist, setPostureChecklist] = useState({
    cabeca: 'Neutra (Alinhada)',
    ombros: 'Ombro D ligeiramente mais alto (0.5cm)',
    escapulas: 'Neutras e aduzidas',
    coluna_cervical: 'Alinhamento fisiológico preservado',
    coluna_toracica: 'Leve hipercifose torácica postural',
    coluna_lombar: 'Lordose fisiológica preservada',
    escoliose: 'Sem desvio em escoliose evidente',
    pelve: 'Neutra com leve anteversão',
    joelhos_frontal: 'Neutros (Sem geno valgo ou varo)',
    joelhos_sagital: 'Neutros (Sem recurvatum)',
    pes: 'Leve pronação bilateral'
  });

  const [correctiveActions, setCorrectiveActions] = useState(
    '1. Fortalecimento de romboides e trapézio médio (remadas abertas).\n2. Alongamento de peitoral menor e rotação interna de ombros.\n3. Fortalecimento de glúteo médio e estabilização de core/abdômen para controle pélvico.'
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
        if (parsed.photos) setPhotos(parsed.photos);
        if (parsed.postureChecklist) setPostureChecklist(parsed.postureChecklist);
        if (parsed.correctiveActions) setCorrectiveActions(parsed.correctiveActions);
      }
    } catch {
      // Ignora erro
    }
  }, [STORAGE_KEY]);

  const handleToggleSingleGrid = (index: number) => {
    setPhotos(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], showGrid: !copy[index].showGrid };
      return copy;
    });
  };

  const handleToggleGlobalGrid = () => {
    const next = !globalGrid;
    setGlobalGrid(next);
    setPhotos(prev => prev.map(p => ({ ...p, showGrid: next })));
  };

  const handlePhotoUrlChange = (index: number, newUrl: string) => {
    setPhotos(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], url: newUrl };
      return copy;
    });
  };

  const handleChecklistChange = (key: string, val: string) => {
    setPostureChecklist(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSavePostural = () => {
    const payload = {
      studentId: student.id,
      studentName: student.name,
      evaluationDate,
      evaluator,
      photos,
      postureChecklist,
      correctiveActions,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (onSave) onSave(payload);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const formattedDate = evaluationDate.split('-').reverse().join('/');
    let msg = `📸 *GL PRO FIT • AVALIAÇÃO POSTURAL & FOTOGRAMETRIA*\n`;
    msg += `👤 *Aluno:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Avaliador:* ${evaluator}\n\n`;
    msg += `🩺 *Achados Posturais Principais:*\n`;
    msg += `• Cabeça: ${postureChecklist.cabeca}\n`;
    msg += `• Ombros: ${postureChecklist.ombros}\n`;
    msg += `• Coluna Torácica: ${postureChecklist.coluna_toracica}\n`;
    msg += `• Pelve: ${postureChecklist.pelve}\n`;
    msg += `• Joelhos: ${postureChecklist.joelhos_frontal}\n`;
    msg += `• Pés: ${postureChecklist.pes}\n\n`;
    msg += `🎯 *Conduta Recomendada:*\n${correctiveActions}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Fotogrametria Biomecânica
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Grade de Simetrógrafo & Checklist
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Fotos & Avaliação Postural
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeamento estático nos planos frontal e sagital de <strong>{student.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleToggleGlobalGrid}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              globalGrid 
                ? 'bg-blue-50 border-blue-300 text-blue-800' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-blue-600" />
            <span>{globalGrid ? 'Grade Ativa (Ligada)' : 'Ligar Grade de Simetria'}</span>
          </button>

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
            onClick={handleSavePostural}
            className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Postural</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Avaliação postural e fotos de {student.name} salvas com sucesso!</span>
        </div>
      )}

      {/* METADADOS BÁSICOS */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Data da Avaliação Fotográfica
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
            Avaliador Técnico (CREF)
          </label>
          <input
            type="text"
            value={evaluator}
            onChange={(e) => setEvaluator(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* AS 4 FOTOS FOTOGRAMÉTRICAS COM OVERLAY DE GRADE QUADRICULADA */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              1. Painel Fotogramétrico (4 Vistas Clínicas com Fio de Prumo)
            </h3>
            <p className="text-[11px] text-slate-500">
              Clique em "Grade" para ativar a malha quadriculada de alinhamento postural
            </p>
          </div>

          <div className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg">
            Padronização 4 Ângulos
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {photos.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-300 bg-slate-50 overflow-hidden flex flex-col justify-between shadow-2xs group"
            >
              {/* Título da Foto */}
              <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">
                    {item.subtitle}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSingleGrid(index)}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    item.showGrid
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Alternar grade simetrófica nesta foto"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Imagem com Overlay de Grade Quadriculada */}
              <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* Grade de Simetrógrafo / Fio de Prumo Overlay */}
                {item.showGrid && (
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-6 grid-rows-8">
                    {/* Linha Central Vertical do Fio de Prumo */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-red-500/80 shadow-xs z-10" />
                    {/* Linha Central Horizontal */}
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-red-500/80 shadow-xs z-10" />

                    {/* Malha Quadriculada Fina */}
                    {Array.from({ length: 48 }).map((_, gIdx) => (
                      <div
                        key={gIdx}
                        className="border border-white/20"
                      />
                    ))}
                  </div>
                )}

                {/* Badge de Ângulo */}
                <span className="absolute bottom-2 left-2 z-20 text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs border border-white/20">
                  {item.id.toUpperCase()}
                </span>
              </div>

              {/* Rodapé do Card com URL / Upload */}
              <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>URL da Imagem:</span>
                </div>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => handlePhotoUrlChange(index, e.target.value)}
                  placeholder="Cole o link da foto ou upload..."
                  className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white text-[11px] text-slate-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHECKLIST ANATÔMICO POSTURAL */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            2. Checklist Anatômico por Segmentos Corporais
          </h3>
          <p className="text-[11px] text-slate-500">
            Selecione as alterações posturais identificadas na inspeção estática
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Cabeça */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Cabeça & Cervical
            </label>
            <select
              value={postureChecklist.cabeca}
              onChange={(e) => handleChecklistChange('cabeca', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Neutra (Alinhada)">Neutra (Alinhada)</option>
              <option value="Anteriorizada (Projetada à frente)">Anteriorizada (Projetada à frente)</option>
              <option value="Inclinação Lateral Direita">Inclinação Lateral Direita</option>
              <option value="Inclinação Lateral Esquerda">Inclinação Lateral Esquerda</option>
              <option value="Rotação Lateral">Rotação Lateral</option>
            </select>
          </div>

          {/* Ombros */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Nivelamento de Ombros
            </label>
            <select
              value={postureChecklist.ombros}
              onChange={(e) => handleChecklistChange('ombros', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Nivelados e Neutros">Nivelados e Neutros</option>
              <option value="Ombro D ligeiramente mais alto (0.5cm)">Ombro D mais alto (0.5 a 1cm)</option>
              <option value="Ombro E mais alto">Ombro E mais alto</option>
              <option value="Protração Bilateral (Ombros caídos à frente)">Protração Bilateral (Caídos à frente)</option>
            </select>
          </div>

          {/* Escápulas */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Escápulas
            </label>
            <select
              value={postureChecklist.escapulas}
              onChange={(e) => handleChecklistChange('escapulas', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Neutras e aduzidas">Neutras e aduzidas</option>
              <option value="Escápula Alada (Bilateral)">Escápula Alada (Bilateral)</option>
              <option value="Escápula Alada Unilateral D">Escápula Alada Unilateral D</option>
              <option value="Escápula Alada Unilateral E">Escápula Alada Unilateral E</option>
              <option value="Abduzidas / Protraídas">Abduzidas / Protraídas</option>
            </select>
          </div>

          {/* Coluna Torácica */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Coluna Torácica
            </label>
            <select
              value={postureChecklist.coluna_toracica}
              onChange={(e) => handleChecklistChange('coluna_toracica', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Cifose fisiológica normal">Cifose fisiológica normal</option>
              <option value="Leve hipercifose torácica postural">Leve hipercifose torácica postural</option>
              <option value="Hipercifose torácica acentuada">Hipercifose torácica acentuada</option>
              <option value="Retificação torácica (Dorso plano)">Retificação torácica (Dorso plano)</option>
            </select>
          </div>

          {/* Coluna Lombar */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Coluna Lombar
            </label>
            <select
              value={postureChecklist.coluna_lombar}
              onChange={(e) => handleChecklistChange('coluna_lombar', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Lordose fisiológica preservada">Lordose fisiológica preservada</option>
              <option value="Hiperlordose lombar postural">Hiperlordose lombar postural</option>
              <option value="Retificação lombar">Retificação lombar</option>
            </select>
          </div>

          {/* Escoliose */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Escoliose / Triângulo de Tales
            </label>
            <select
              value={postureChecklist.escoliose}
              onChange={(e) => handleChecklistChange('escoliose', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Sem desvio em escoliose evidente">Sem desvio em escoliose evidente</option>
              <option value="Leve desvio escoliótico em C à Direita">Leve desvio escoliótico em C à Direita</option>
              <option value="Leve desvio escoliótico em C à Esquerda">Leve desvio escoliótico em C à Esquerda</option>
              <option value="Desvio escoliótico em S (Dupla curva)">Desvio escoliótico em S (Dupla curva)</option>
            </select>
          </div>

          {/* Pelve */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Pelve & Cristas Ilíacas
            </label>
            <select
              value={postureChecklist.pelve}
              onChange={(e) => handleChecklistChange('pelve', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Neutra e nivelada">Neutra e nivelada</option>
              <option value="Neutra com leve anteversão">Neutra com leve anteversão</option>
              <option value="Anteversão acentuada (Bumbum empinado)">Anteversão acentuada (Bumbum empinado)</option>
              <option value="Retroversão pélvica (Pelve encaixada)">Retroversão pélvica (Pelve encaixada)</option>
              <option value="Báscula lateral (Crista ilíaca desnivelada)">Báscula lateral (Desnivelada)</option>
            </select>
          </div>

          {/* Joelhos */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Joelhos (Plano Frontal)
            </label>
            <select
              value={postureChecklist.joelhos_frontal}
              onChange={(e) => handleChecklistChange('joelhos_frontal', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Neutros (Sem geno valgo ou varo)">Neutros (Alinhamento normal)</option>
              <option value="Geno Valgo (Joelhos aproximados em X)">Geno Valgo (Aproximados em X)</option>
              <option value="Geno Varo (Pernas afastadas em alicate)">Geno Varo (Pernas afastadas em alicate)</option>
            </select>
          </div>

          {/* Pés */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Pés & Arcos Plantares
            </label>
            <select
              value={postureChecklist.pes}
              onChange={(e) => handleChecklistChange('pes', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Neutros">Neutros</option>
              <option value="Leve pronação bilateral">Leve pronação bilateral</option>
              <option value="Pronação acentuada (Pé chato / plano)">Pronação acentuada (Pé chato / plano)</option>
              <option value="Supinação (Pé cavo)">Supinação (Pé cavo)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CONDUTA E RECOMENDAÇÕES EXERCÍCIOS CORRETIVOS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          3. Prescrição Corretiva, Alongamentos & Recomendações Posturais
        </label>
        <textarea
          rows={3}
          value={correctiveActions}
          onChange={(e) => setCorrectiveActions(e.target.value)}
          placeholder="Descreva os exercícios de ativação, alongamentos específicos de mobilidade e adaptações para as fichas de treino..."
          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>
  );
};
