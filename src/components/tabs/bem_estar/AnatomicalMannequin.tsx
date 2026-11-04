import React, { useState } from 'react';
import { Flame, ShieldCheck, Plus, X } from 'lucide-react';
import { PainPoint } from '../../../types';

export interface AnatomyDivision {
  id: string;
  label: string;
  category: 'musculo' | 'articulacao';
  system: 'superior' | 'tronco' | 'inferior';
  bodySide: 'anterior' | 'posterior';
  top: string;
  left: string;
  description: string;
}

export const ANATOMICAL_DIVISIONS_ANTERIOR: AnatomyDivision[] = [
  // Cabeça e Pescoço
  { id: 'ant_cranio', label: 'Cabeça & Mandíbula', category: 'articulacao', system: 'superior', bodySide: 'anterior', top: '7%', left: '50%', description: 'Crânio, ATM e face' },
  { id: 'ant_cervical', label: 'Pescoço / Cervical Anterior', category: 'musculo', system: 'superior', bodySide: 'anterior', top: '12%', left: '50%', description: 'Esternocleidomastoideo e escalenos' },

  // Membros Superiores & Cintura Escapular
  { id: 'ant_ombro_d', label: 'Articulação Ombro D (Glenoumeral)', category: 'articulacao', system: 'superior', bodySide: 'anterior', top: '17%', left: '33%', description: 'Cápsula e ligamentos glenoumerais' },
  { id: 'ant_deltoide_ant_d', label: 'Deltoide Anterior D', category: 'musculo', system: 'superior', bodySide: 'anterior', top: '21%', left: '27%', description: 'Porção clavicular do deltoide' },
  { id: 'ant_ombro_e', label: 'Articulação Ombro E (Glenoumeral)', category: 'articulacao', system: 'superior', bodySide: 'anterior', top: '17%', left: '67%', description: 'Cápsula e ligamentos glenoumerais' },
  { id: 'ant_deltoide_ant_e', label: 'Deltoide Anterior E', category: 'musculo', system: 'superior', bodySide: 'anterior', top: '21%', left: '73%', description: 'Porção clavicular do deltoide' },
  { id: 'ant_biceps_d', label: 'Bíceps Braquial D', category: 'musculo', system: 'superior', bodySide: 'anterior', top: '27%', left: '23%', description: 'Cabeça longa e curta do bíceps' },
  { id: 'ant_biceps_e', label: 'Bíceps Braquial E', category: 'musculo', system: 'superior', bodySide: 'anterior', top: '27%', left: '77%', description: 'Cabeça longa e curta do bíceps' },
  { id: 'ant_cotovelo_d', label: 'Articulação Cotovelo D', category: 'articulacao', system: 'superior', bodySide: 'anterior', top: '34%', left: '20%', description: 'Complexo articular umeroulnar e rádio' },
  { id: 'ant_cotovelo_e', label: 'Articulação Cotovelo E', category: 'articulacao', system: 'superior', bodySide: 'anterior', top: '34%', left: '80%', description: 'Complexo articular umeroulnar e rádio' },
  { id: 'ant_antebraco_d', label: 'Antebraço / Flexores D', category: 'musculo', system: 'superior', bodySide: 'anterior', top: '40%', left: '17%', description: 'Grupo pronador e flexores de punho' },
  { id: 'ant_antebraco_e', label: 'Antebraço / Flexores E', category: 'musculo', system: 'superior', bodySide: 'anterior', top: '40%', left: '83%', description: 'Grupo pronador e flexores de punho' },
  { id: 'ant_punho_d', label: 'Punho & Mão D', category: 'articulacao', system: 'superior', bodySide: 'anterior', top: '47%', left: '14%', description: 'Rádio-cárpica e intercarpianas' },
  { id: 'ant_punho_e', label: 'Punho & Mão E', category: 'articulacao', system: 'superior', bodySide: 'anterior', top: '47%', left: '86%', description: 'Rádio-cárpica e intercarpianas' },

  // Tronco
  { id: 'ant_peitoral_d', label: 'Peitoral Maior D', category: 'musculo', system: 'tronco', bodySide: 'anterior', top: '22%', left: '42%', description: 'Fibras claviculares e esternocostais' },
  { id: 'ant_peitoral_e', label: 'Peitoral Maior E', category: 'musculo', system: 'tronco', bodySide: 'anterior', top: '22%', left: '58%', description: 'Fibras claviculares e esternocostais' },
  { id: 'ant_abdomen_sup', label: 'Reto Abdominal Superior', category: 'musculo', system: 'tronco', bodySide: 'anterior', top: '29%', left: '50%', description: 'Feixes epigástricos do reto abdominal' },
  { id: 'ant_obliquo_d', label: 'Oblíquo Externo D', category: 'musculo', system: 'tronco', bodySide: 'anterior', top: '34%', left: '38%', description: 'Parede anterolateral do abdômen' },
  { id: 'ant_obliquo_e', label: 'Oblíquo Externo E', category: 'musculo', system: 'tronco', bodySide: 'anterior', top: '34%', left: '62%', description: 'Parede anterolateral do abdômen' },
  { id: 'ant_abdomen_inf', label: 'Reto Abdominal Inferior', category: 'musculo', system: 'tronco', bodySide: 'anterior', top: '38%', left: '50%', description: 'Região infraumbilical / Linha alba' },

  // Quadril e Coxa
  { id: 'ant_quadril_d', label: 'Articulação Quadril D (Coxofemoral)', category: 'articulacao', system: 'inferior', bodySide: 'anterior', top: '46%', left: '37%', description: 'Acetábulo e colo do fêmur' },
  { id: 'ant_quadril_e', label: 'Articulação Quadril E (Coxofemoral)', category: 'articulacao', system: 'inferior', bodySide: 'anterior', top: '46%', left: '63%', description: 'Acetábulo e colo do fêmur' },
  { id: 'ant_adutores_virilha', label: 'Virilha & Adutores (Púbis)', category: 'musculo', system: 'inferior', bodySide: 'anterior', top: '48%', left: '50%', description: 'Adutor longo, magno e grácil' },
  { id: 'ant_quadriceps_d', label: 'Quadríceps D (Reto Femoral)', category: 'musculo', system: 'inferior', bodySide: 'anterior', top: '56%', left: '38%', description: 'Reto femoral, vasto lateral e medial' },
  { id: 'ant_quadriceps_e', label: 'Quadríceps E (Reto Femoral)', category: 'musculo', system: 'inferior', bodySide: 'anterior', top: '56%', left: '62%', description: 'Reto femoral, vasto lateral e medial' },

  // Joelho e Perna
  { id: 'ant_joelho_d', label: 'Articulação Joelho D & Patela', category: 'articulacao', system: 'inferior', bodySide: 'anterior', top: '68%', left: '38%', description: 'Patela, meniscos e ligamentos cruzados' },
  { id: 'ant_joelho_e', label: 'Articulação Joelho E & Patela', category: 'articulacao', system: 'inferior', bodySide: 'anterior', top: '68%', left: '62%', description: 'Patela, meniscos e ligamentos cruzados' },
  { id: 'ant_tibial_d', label: 'Tibial Anterior D / Canela', category: 'musculo', system: 'inferior', bodySide: 'anterior', top: '78%', left: '38%', description: 'Dorsiflexores do tornozelo' },
  { id: 'ant_tibial_e', label: 'Tibial Anterior E / Canela', category: 'musculo', system: 'inferior', bodySide: 'anterior', top: '78%', left: '62%', description: 'Dorsiflexores do tornozelo' },
  { id: 'ant_tornozelo_d', label: 'Articulação Tornozelo D & Pé', category: 'articulacao', system: 'inferior', bodySide: 'anterior', top: '90%', left: '37%', description: 'Articulação talocrural e dedos' },
  { id: 'ant_tornozelo_e', label: 'Articulação Tornozelo E & Pé', category: 'articulacao', system: 'inferior', bodySide: 'anterior', top: '90%', left: '63%', description: 'Articulação talocrural e dedos' }
];

export const ANATOMICAL_DIVISIONS_POSTERIOR: AnatomyDivision[] = [
  // Cabeça e Nuca
  { id: 'post_nuca', label: 'Nuca & Suboccipital', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '8%', left: '50%', description: 'Músculos da base do crânio' },
  { id: 'post_trapezio_sup_d', label: 'Trapézio Superior D', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '15%', left: '36%', description: 'Fibras descendentes do trapézio' },
  { id: 'post_trapezio_sup_e', label: 'Trapézio Superior E', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '15%', left: '64%', description: 'Fibras descendentes do trapézio' },

  // Cintura Escapular e Braços
  { id: 'post_deltoide_post_d', label: 'Deltoide Posterior D', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '21%', left: '26%', description: 'Fibras espinhais do deltoide' },
  { id: 'post_deltoide_post_e', label: 'Deltoide Posterior E', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '21%', left: '74%', description: 'Fibras espinhais do deltoide' },
  { id: 'post_manguito_d', label: 'Manguito Rotador D (Infraespinhal)', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '22%', left: '35%', description: 'Infraespinhal e redondo menor' },
  { id: 'post_manguito_e', label: 'Manguito Rotador E (Infraespinhal)', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '22%', left: '65%', description: 'Infraespinhal e redondo menor' },
  { id: 'post_triceps_d', label: 'Tríceps Braquial D', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '28%', left: '23%', description: 'Cabeça longa, medial e lateral' },
  { id: 'post_triceps_e', label: 'Tríceps Braquial E', category: 'musculo', system: 'superior', bodySide: 'posterior', top: '28%', left: '77%', description: 'Cabeça longa, medial e lateral' },
  { id: 'post_cotovelo_d', label: 'Cotovelo D (Olécrano)', category: 'articulacao', system: 'superior', bodySide: 'posterior', top: '34%', left: '20%', description: 'Região posterior do cúbito' },
  { id: 'post_cotovelo_e', label: 'Cotovelo E (Olécrano)', category: 'articulacao', system: 'superior', bodySide: 'posterior', top: '34%', left: '80%', description: 'Região posterior do cúbito' },

  // Costas e Coluna
  { id: 'post_dorsal_romboides', label: 'Dorsal Médio & Romboides', category: 'musculo', system: 'tronco', bodySide: 'posterior', top: '28%', left: '50%', description: 'Trapézio médio e romboides maior/menor' },
  { id: 'post_latissimo_d', label: 'Grande Dorsal D', category: 'musculo', system: 'tronco', bodySide: 'posterior', top: '34%', left: '36%', description: 'Latissimus dorsi direito' },
  { id: 'post_latissimo_e', label: 'Grande Dorsal E', category: 'musculo', system: 'tronco', bodySide: 'posterior', top: '34%', left: '64%', description: 'Latissimus dorsi esquerdo' },
  { id: 'post_lombar', label: 'Coluna Lombar / Paravertebrais', category: 'musculo', system: 'tronco', bodySide: 'posterior', top: '40%', left: '50%', description: 'Eretores da espinha e quadrado lombar' },
  { id: 'post_sacroiliaca', label: 'Articulação Sacroilíaca', category: 'articulacao', system: 'tronco', bodySide: 'posterior', top: '45%', left: '50%', description: 'Junção sacral e ilíaca' },

  // Glúteos e Membros Inferiores
  { id: 'post_gluteo_d', label: 'Glúteo Máximo & Médio D', category: 'musculo', system: 'inferior', bodySide: 'posterior', top: '50%', left: '40%', description: 'Glúteo máximo, médio e piriforme' },
  { id: 'post_gluteo_e', label: 'Glúteo Máximo & Médio E', category: 'musculo', system: 'inferior', bodySide: 'posterior', top: '50%', left: '60%', description: 'Glúteo máximo, médio e piriforme' },
  { id: 'post_isquiotibiais_d', label: 'Posterior Coxa D (Isquiotibiais)', category: 'musculo', system: 'inferior', bodySide: 'posterior', top: '60%', left: '39%', description: 'Bíceps femoral, semitendíneo e semimembranoso' },
  { id: 'post_isquiotibiais_e', label: 'Posterior Coxa E (Isquiotibiais)', category: 'musculo', system: 'inferior', bodySide: 'posterior', top: '60%', left: '61%', description: 'Bíceps femoral, semitendíneo e semimembranoso' },
  { id: 'post_poplitea_d', label: 'Joelho Posterior D (Fossa Poplítea)', category: 'articulacao', system: 'inferior', bodySide: 'posterior', top: '70%', left: '38%', description: 'Tendões posteriores e cápsula posterior' },
  { id: 'post_poplitea_e', label: 'Joelho Posterior E (Fossa Poplítea)', category: 'articulacao', system: 'inferior', bodySide: 'posterior', top: '70%', left: '62%', description: 'Tendões posteriores e cápsula posterior' },
  { id: 'post_panturrilha_d', label: 'Panturrilha D (Gastrocnêmio & Sóleo)', category: 'musculo', system: 'inferior', bodySide: 'posterior', top: '78%', left: '38%', description: 'Tríceps sural' },
  { id: 'post_panturrilha_e', label: 'Panturrilha E (Gastrocnêmio & Sóleo)', category: 'musculo', system: 'inferior', bodySide: 'posterior', top: '78%', left: '62%', description: 'Tríceps sural' },
  { id: 'post_aquiles_d', label: 'Tendão de Aquiles D & Tornozelo', category: 'articulacao', system: 'inferior', bodySide: 'posterior', top: '88%', left: '37%', description: 'Tendão calcâneo e tuberosidade posterior' },
  { id: 'post_aquiles_e', label: 'Tendão de Aquiles E & Tornozelo', category: 'articulacao', system: 'inferior', bodySide: 'posterior', top: '88%', left: '63%', description: 'Tendão calcâneo e tuberosidade posterior' }
];

interface AnatomicalMannequinProps {
  bodySide: 'anterior' | 'posterior';
  onBodySideChange: (side: 'anterior' | 'posterior') => void;
  registeredPainPoints: PainPoint[];
  onSelectDivision: (division: AnatomyDivision) => void;
  onRemovePainPoint?: (id: string) => void;
}

export const AnatomicalMannequin: React.FC<AnatomicalMannequinProps> = ({
  bodySide,
  onBodySideChange,
  registeredPainPoints,
  onSelectDivision,
  onRemovePainPoint
}) => {
  const [filterType, setFilterType] = useState<'todos' | 'musculo' | 'articulacao'>('todos');
  const [hoveredDivision, setHoveredDivision] = useState<AnatomyDivision | null>(null);

  const currentDivisions = bodySide === 'anterior' 
    ? ANATOMICAL_DIVISIONS_ANTERIOR 
    : ANATOMICAL_DIVISIONS_POSTERIOR;

  const filteredDivisions = currentDivisions.filter(d => {
    if (filterType === 'todos') return true;
    return d.category === filterType;
  });

  return (
    <div className="space-y-4">
      {/* View Switcher and Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
        
        {/* Face Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-2xs border border-slate-200">
          <button
            type="button"
            onClick={() => onBodySideChange('anterior')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              bodySide === 'anterior'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vista Anterior (Frente)
          </button>
          <button
            type="button"
            onClick={() => onBodySideChange('posterior')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              bodySide === 'posterior'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vista Posterior (Costas)
          </button>
        </div>

        {/* Músculo vs Articulação Filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Exibir:</span>
          {(['todos', 'musculo', 'articulacao'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer text-[11px] ${
                filterType === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {type === 'todos' ? 'Todos' : type === 'musculo' ? 'Músculos' : 'Articulações'}
            </button>
          ))}
        </div>

      </div>

      {/* Main Mannequin Container and Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Mannequin Graphic Board */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 relative flex flex-col items-center justify-center border border-slate-800 shadow-xl overflow-hidden min-h-[520px]">
          
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              {bodySide === 'anterior' ? 'Frente (Anterior)' : 'Costas (Posterior)'}
            </span>
            <span className="text-[10px] text-slate-400">
              {filteredDivisions.length} pontos mapeados
            </span>
          </div>

          {/* Mannequin Silhouette SVG Frame */}
          <div className="relative w-72 h-[480px] flex items-center justify-center select-none">
            
            {/* Detailed Anatomical Silhouette SVG */}
            <svg 
              className="w-full h-full text-slate-800 stroke-slate-700 stroke-1" 
              viewBox="0 0 200 360" 
              fill="currentColor"
            >
              {/* Head */}
              <circle cx="100" cy="28" r="16" className="fill-slate-800 hover:fill-slate-750 transition-colors" />
              {/* Neck */}
              <rect x="94" y="44" width="12" height="10" rx="3" />
              
              {/* Shoulder joints & Deltoids */}
              <circle cx="62" cy="62" r="12" />
              <circle cx="138" cy="62" r="12" />

              {/* Chest / Torso / Back */}
              <path d="M 68 56 L 132 56 L 126 130 L 74 130 Z" />
              {/* Abdomen / Lumbar */}
              <path d="M 74 130 L 126 130 L 122 170 L 78 170 Z" />
              {/* Pelvis / Gluteals */}
              <path d="M 78 170 L 122 170 L 118 190 L 82 190 Z" />

              {/* Arms */}
              <path d="M 52 64 L 40 130 L 48 130 L 60 70 Z" />
              <circle cx="39" cy="135" r="7" />
              <path d="M 39 140 L 32 195 L 40 195 L 45 140 Z" />
              <ellipse cx="33" cy="202" rx="6" ry="8" />

              <path d="M 148 64 L 160 130 L 152 130 L 140 70 Z" />
              <circle cx="161" cy="135" r="7" />
              <path d="M 161 140 L 168 195 L 160 195 L 155 140 Z" />
              <ellipse cx="167" cy="202" rx="6" ry="8" />

              {/* Legs */}
              {/* Left thigh */}
              <path d="M 82 190 L 75 255 L 89 255 L 98 190 Z" />
              <circle cx="82" cy="262" r="8" />
              <path d="M 78 268 L 74 330 L 84 330 L 88 268 Z" />
              <ellipse cx="79" cy="336" rx="6" ry="7" />

              {/* Right thigh */}
              <path d="M 118 190 L 125 255 L 111 255 L 102 190 Z" />
              <circle cx="118" cy="262" r="8" />
              <path d="M 122 268 L 126 330 L 116 330 L 112 268 Z" />
              <ellipse cx="121" cy="336" rx="6" ry="7" />
            </svg>

            {/* Clickable anatomical points */}
            {filteredDivisions.map(div => {
              const pain = registeredPainPoints.find(
                p => p.region.toLowerCase().trim() === div.label.toLowerCase().trim() ||
                     div.label.toLowerCase().includes(p.region.toLowerCase())
              );

              const isHovered = hoveredDivision?.id === div.id;

              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => onSelectDivision(div)}
                  onMouseEnter={() => setHoveredDivision(div)}
                  onMouseLeave={() => setHoveredDivision(null)}
                  style={{ top: div.top, left: div.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer focus:outline-hidden"
                  title={`${div.label} (${div.category === 'musculo' ? 'Músculo' : 'Articulação'})`}
                >
                  <span className={`flex items-center justify-center rounded-full transition-all duration-150 ${
                    pain
                      ? pain.painScale >= 7
                        ? 'w-6 h-6 bg-rose-600 text-white font-black text-xs shadow-lg shadow-rose-600/50 animate-pulse border-2 border-white'
                        : pain.painScale >= 4
                        ? 'w-5 h-5 bg-amber-500 text-white font-black text-[11px] shadow-md border border-white'
                        : 'w-4 h-4 bg-emerald-500 text-white font-black text-[10px] border border-white'
                      : div.category === 'articulacao'
                      ? 'w-3.5 h-3.5 bg-sky-400 hover:bg-sky-300 border border-slate-900 shadow-xs'
                      : 'w-3 h-3 bg-indigo-300 hover:bg-white border border-slate-900 shadow-xs'
                  } ${isHovered ? 'scale-135 ring-3 ring-cyan-400' : ''}`}>
                    {pain ? pain.painScale : ''}
                  </span>
                </button>
              );
            })}

          </div>

          {/* Quick legend footer */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400 mt-2 z-20">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-300"></span> Músculo</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Articulação</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Dor Moderada (1-6)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Dor Aguda (7-10)</span>
          </div>

        </div>

        {/* Right Detail Panel: Hover Details & Registered Points */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Hover / Selection Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Região Anatômica Selecionada
            </div>
            {hoveredDivision ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">{hoveredDivision.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    hoveredDivision.category === 'musculo' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {hoveredDivision.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{hoveredDivision.description}</p>
                <button
                  type="button"
                  onClick={() => onSelectDivision(hoveredDivision)}
                  className="mt-2 w-full py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Dor nesta Região (EVA 0-10)</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-1">
                Passe o cursor sobre os pontos do boneco ou clique em uma região para adicionar/consultar o nível de dor.
              </div>
            )}
          </div>

          {/* Registered Pain Points List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                Pontos de Dor Cadastrados ({registeredPainPoints.length})
              </h4>
            </div>

            {registeredPainPoints.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-1">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Sem queixas álgicas registradas</p>
                <p className="text-[11px] text-slate-500">Atleta liberado sem pontos de dor musculoesquelética.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                {registeredPainPoints.map(pain => (
                  <div key={pain.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Flame className={`w-3.5 h-3.5 ${pain.painScale >= 7 ? 'text-rose-600' : 'text-amber-500'}`} />
                        <span className="text-xs font-bold text-slate-900">{pain.region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          pain.painScale >= 7 ? 'bg-rose-100 text-rose-800' :
                          pain.painScale >= 4 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          EVA {pain.painScale}/10
                        </span>
                        {onRemovePainPoint && (
                          <button
                            type="button"
                            onClick={() => onRemovePainPoint(pain.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                            title="Remover ponto de dor"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="capitalize">Tipo: <strong>{pain.painType}</strong></span>
                      <span>• Face: <strong>{pain.bodySide === 'anterior' ? 'Frente' : 'Costas'}</strong></span>
                    </div>
                    {pain.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded italic">
                        "{pain.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
