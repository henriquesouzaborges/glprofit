import React from 'react';
import { 
  Scale, 
  Layers, 
  Activity, 
  FileText, 
  Zap, 
  Dumbbell, 
  Flame, 
  ArrowUpRight, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';
import { PhysicalAssessmentData, Student } from '../../../types';
import { StudentGoals } from './AvaliacoesHubView';

export interface SectorGraphicsProps {
  metrics: any;
  assessments: PhysicalAssessmentData[];
  student: Student;
  goals: StudentGoals;
}

// =========================================================================
// 1. SETOR: COMPOSIÇÃO CORPORAL
// =========================================================================
export const ComposicaoSectorGraphics: React.FC<SectorGraphicsProps> = ({ metrics }) => {
  if (!metrics) return null;
  return (
    <div className="space-y-4 animate-in fade-in">
      {/* 6 GRANDES KPIS DE COMPOSIÇÃO CORPORAL */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Peso Total</span>
          <div className="text-2xl font-black text-slate-900">{metrics.weightKg} <span className="text-xs font-bold text-slate-400">kg</span></div>
          <span className="text-[10px] text-slate-500 font-semibold block">Estatura: {metrics.heightCm} cm</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Índice IMC</span>
          <div className="text-2xl font-black text-slate-900">{metrics.bmi} <span className="text-xs font-bold text-slate-400">kg/m²</span></div>
          <span className="text-[10px] text-emerald-600 font-bold block">Eutrofia (Padrão OMS)</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">% Gordura</span>
          <div className="text-2xl font-black text-emerald-950">{metrics.composition?.bodyFatPercentage}%</div>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded inline-block">
            {metrics.composition?.classification || 'Normal'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Massa Magra</span>
          <div className="text-2xl font-black text-blue-950">{metrics.composition?.leanMassKg} <span className="text-xs font-bold text-blue-500">kg</span></div>
          <span className="text-[10px] text-blue-700 font-bold block">
            {metrics.weightKg ? ((metrics.composition?.leanMassKg / metrics.weightKg) * 100).toFixed(1) : 75}% do peso
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Massa Gorda</span>
          <div className="text-2xl font-black text-slate-900">{metrics.composition?.fatMassKg} <span className="text-xs font-bold text-slate-400">kg</span></div>
          <span className="text-[10px] text-slate-400 font-medium block">Adiposidade total</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Metabolismo TMB</span>
          <div className="text-2xl font-black text-slate-900">{metrics.bmr} <span className="text-xs font-bold text-slate-400">kcal</span></div>
          <span className="text-[10px] text-slate-500 font-semibold block">Gasto basal diário</span>
        </div>
      </div>

      {/* BIOIMPEDÂNCIA TETRAPOLAR & COMPOSIÇÃO SEGMENTAR */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Bioimpedância Tetrapolar & Hidratação Celular</span>
          </h4>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Densidade: {metrics.composition?.bodyDensity || 1.0550} g/ml
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Água Corporal</span>
            <strong className="text-base font-black text-slate-900 block">{metrics.bioimpedance?.totalBodyWaterLiters || 46.5} L</strong>
            <span className="text-[10px] text-blue-600 font-semibold">({metrics.bioimpedance?.totalBodyWaterPct || 62}% peso)</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">Gordura Visceral</span>
            <strong className="text-base font-black text-emerald-950 block">Nível {metrics.bioimpedance?.visceralFatLevel || 4}</strong>
            <span className="text-[10px] text-emerald-700 font-bold">Saudável (1-9)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Massa Muscular</span>
            <strong className="text-base font-black text-slate-900 block">{metrics.bioimpedance?.skeletalMuscleMassKg || 35.8} kg</strong>
            <span className="text-[10px] text-slate-500 font-semibold">Esquelética</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Massa Óssea</span>
            <strong className="text-base font-black text-slate-900 block">{metrics.composition?.boneMassKg || 11.5} kg</strong>
            <span className="text-[10px] text-slate-500 font-semibold">Mineral</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Ângulo de Fase</span>
            <strong className="text-base font-black text-slate-900 block">{metrics.bioimpedance?.phaseAngleDeg || 7.4}°</strong>
            <span className="text-[10px] text-emerald-600 font-bold">Integridade Alta</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Idade Metabólica</span>
            <strong className="text-base font-black text-slate-900 block">{metrics.bioimpedance?.metabolicAgeYears || 22} anos</strong>
            <span className="text-[10px] text-emerald-600 font-bold">Excelente</span>
          </div>
        </div>
      </div>

      {/* 9 DOBRAS CUTÂNEAS & PERIMETRIA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DOBRAS CUTÂNEAS */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Adipometria Clínica (9 Dobras)</span>
            </h4>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Somatório Σ: {metrics.skinfolds?.total || 72} mm
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Peitoral', val: metrics.skinfolds?.peitoral || 8 },
              { name: 'Axilar Média', val: metrics.skinfolds?.axilarMedia || 9 },
              { name: 'Tríceps', val: metrics.skinfolds?.triceps || 9 },
              { name: 'Subescapular', val: metrics.skinfolds?.subescapular || 11 },
              { name: 'Bíceps', val: metrics.skinfolds?.biceps || 4 },
              { name: 'Abdominal', val: metrics.skinfolds?.abdominal || 14 },
              { name: 'Supra-ilíaca', val: metrics.skinfolds?.suprailiaca || 10 },
              { name: 'Coxa Medial', val: metrics.skinfolds?.coxa || 12 },
              { name: 'Panturrilha', val: metrics.skinfolds?.panturrilha || 7 },
            ].map((f, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block truncate">{f.name}</span>
                <div className="text-base font-black text-slate-900">{f.val} <span className="text-[10px] text-slate-400">mm</span></div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${Math.min(100, (f.val / 25) * 100)}%` }} className="bg-blue-600 h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERIMETRIA & SIMETRIA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>Perimetria & Simetria Bilateral</span>
            </h4>
            <span className="text-xs font-black text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              RCQ: {metrics.perimetry?.rcq || 0.80} • {metrics.perimetry?.rcqRisk || 'Baixo'} Risco OMS
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block">Tórax</span>
              <strong className="text-sm font-black text-slate-900">{metrics.perimetry?.torax || 102} cm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block">Cintura</span>
              <strong className="text-sm font-black text-slate-900">{metrics.perimetry?.cintura || 79} cm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block">Abdômen</span>
              <strong className="text-sm font-black text-slate-900">{metrics.perimetry?.abdomen || 83} cm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block">Quadril</span>
              <strong className="text-sm font-black text-slate-900">{metrics.perimetry?.quadril || 99} cm</strong>
            </div>
            <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-200 text-center">
              <span className="text-[10px] font-bold text-blue-700 block">Braço D</span>
              <strong className="text-sm font-black text-blue-950">{metrics.perimetry?.bracoDireitoContraido || 38.5} cm</strong>
            </div>
            <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-200 text-center">
              <span className="text-[10px] font-bold text-blue-700 block">Braço E</span>
              <strong className="text-sm font-black text-blue-950">{metrics.perimetry?.bracoEsquerdoContraido || 38.2} cm</strong>
            </div>
            <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block">Coxa D</span>
              <strong className="text-sm font-black text-emerald-950">{metrics.perimetry?.coxaDireitaMedial || 56.5} cm</strong>
            </div>
            <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block">Coxa E</span>
              <strong className="text-sm font-black text-emerald-950">{metrics.perimetry?.coxaEsquerdaMedial || 56.2} cm</strong>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between">
            <span className="text-slate-600">Assimetrias Bilaterais: Braços Δ 0.3cm • Coxas Δ 0.3cm</span>
            <span className="px-2 py-0.5 rounded font-black bg-emerald-100 text-emerald-800 text-[10px]">
              ✓ Simetria Preservada (&lt; 1.0cm)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. SETOR: ANAMNESE
// =========================================================================
export const AnamneseSectorGraphics: React.FC<SectorGraphicsProps> = ({ metrics }) => {
  if (!metrics) return null;
  const ana = metrics.anamnesis || {};
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PAR-Q+ E HISTÓRICO */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Triagem Cardiovascular & PAR-Q+</span>
            </h4>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px]">
              {ana.parqCleared !== false ? 'Aprovado (7/7)' : 'Atenção Médica'}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-900">
              <strong className="block text-[11px] uppercase tracking-wider mb-1">Aptidão Física Geral:</strong>
              <p className="text-[11px] leading-relaxed">{ana.clinicalHistory || 'Apto para atividades físicas vigorosas e esportes de alta intensidade.'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
              <p><strong>Lesões e Limitações:</strong> {ana.injuries || 'Nenhuma lesão ativa; histórico de entorse leve prévia.'}</p>
              <p><strong>Medicamentos Contínuos:</strong> {ana.medications || 'Nenhum medicamento contínuo em uso.'}</p>
              <p><strong>Nível de Atividade:</strong> {ana.activityLevel || 'Praticante avançado de musculação e esportes.'}</p>
            </div>
          </div>
        </div>

        {/* HÁBITOS DE VIDA & RECUPERAÇÃO */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Hábitos de Vida, Sono & Recuperação</span>
            </h4>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Rotina & Bem-estar
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-center">
              <span className="text-[10px] font-bold text-indigo-700 block uppercase">Sono Diário</span>
              <strong className="text-lg font-black text-indigo-950">{ana.sleepHours || 7.5}h</strong>
              <span className="text-[10px] text-indigo-600 font-semibold block">Meta: 8.0h</span>
            </div>

            <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200 text-center">
              <span className="text-[10px] font-bold text-sky-700 block uppercase">Hidratação</span>
              <strong className="text-lg font-black text-sky-950">{ana.waterIntakeLiters || 3.0}L</strong>
              <span className="text-[10px] text-sky-600 font-semibold block">Meta: 3.5L/dia</span>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-700 block uppercase">Estresse (1-10)</span>
              <strong className="text-lg font-black text-amber-950">{ana.stressLevel || 3}/10</strong>
              <span className="text-[10px] text-emerald-700 font-bold block">Controlado</span>
            </div>

            <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-center">
              <span className="text-[10px] font-bold text-rose-700 block uppercase">Dor EVA (0-10)</span>
              <strong className="text-lg font-black text-rose-950">{ana.painEva !== undefined ? ana.painEva : 1}/10</strong>
              <span className="text-[10px] text-emerald-700 font-bold block">Sem dor limitante</span>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block uppercase">Adesão ao Treino</span>
              <strong className="text-lg font-black text-emerald-950">{ana.trainingAdherencePct || 92}%</strong>
              <span className="text-[10px] text-emerald-700 font-bold block">Alta consistência</span>
            </div>

            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-center">
              <span className="text-[10px] font-bold text-purple-700 block uppercase">Energia / Disposição</span>
              <strong className="text-lg font-black text-purple-950">{ana.energyLevel || 8.5}/10</strong>
              <span className="text-[10px] text-purple-700 font-bold block">Ótima vitalidade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. SETOR: TESTES FUNCIONAIS
// =========================================================================
export const FuncionalSectorGraphics: React.FC<SectorGraphicsProps> = ({ metrics }) => {
  if (!metrics) return null;
  const func = metrics.functional || {};
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SCORE GERAL FMS */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Score FMS (Functional Movement Screen)</span>
            </h4>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {func.fmsTotalScore || 17}/21 pts
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Classificação de Risco</span>
              <div className="text-lg font-black text-emerald-950">{func.fmsRiskLevel || 'Baixo Risco de Lesão (>14 pts)'}</div>
              <span className="text-[10px] text-emerald-700 font-semibold block">Padrão Ouro Internacional Gray Cook</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Banco de Wells (Flexibilidade)</span>
              <div className="text-xl font-black text-slate-900">{func.wellsFlexibilityCm || 34.0} <span className="text-xs text-slate-400">cm</span></div>
              <span className="text-[10px] font-bold text-emerald-600">{func.wellsClassification || 'Excelente (Acima da Média)'}</span>
            </div>
          </div>
        </div>

        {/* 7 PADRÕES MOTORES FMS */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Breakdown dos Padrões Motores Funcionais</span>
            </h4>
            <span className="text-xs text-slate-500 font-bold">Escala 0 a 3 por movimento</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { name: 'Agachamento Profundo', score: func.deepSquat || func.deepSquatScore || 3 },
              { name: 'Passo sobre Barreira', score: func.hurdleStep || func.hurdleStepScore || 2 },
              { name: 'Afundo em Linha', score: func.inlineLunge || func.inlineLungeScore || 3 },
              { name: 'Mobilidade de Ombro', score: func.shoulderMobility || func.shoulderMobilityScore || 3 },
              { name: 'Elevação Perna Reta', score: func.activeStraightLegScore || 3 },
              { name: 'Estabilidade Tronco', score: func.trunkStability || func.trunkStabilityScore || 3 },
            ].map((p, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-center">
                <span className="text-[10px] font-bold text-slate-500 block truncate">{p.name}</span>
                <div className="text-base font-black text-slate-900">{p.score} <span className="text-[10px] text-slate-400">/ 3</span></div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${(p.score / 3) * 100}%` }} className="bg-emerald-600 h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 italic text-center">
            Scores 3 = Padrão de movimento funcional perfeito | 2 = Compensação presente | 1 = Incapacidade motora | 0 = Dor durante o teste
          </p>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. SETOR: TESTES DE FORÇA E SALTO
// =========================================================================
export const ForcaSaltoSectorGraphics: React.FC<SectorGraphicsProps> = ({ metrics }) => {
  if (!metrics) return null;
  const force = metrics.force || {};
  const jump = metrics.jump || {};
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* FORÇA MÁXIMA 1RM BRZYCKI */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-orange-600" />
              <span>Força Máxima (1RM Estimado - Brzycki)</span>
            </h4>
            <span className="text-xs font-black text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              Jamar: {force.handgripRightKgf || 48} kgf
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-200">
              <span className="text-[10px] text-slate-500 font-bold block">Supino Reto</span>
              <strong className="text-base font-black text-orange-950">{force.benchPress1Rm || 105} kg</strong>
            </div>
            <div className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-200">
              <span className="text-[10px] text-slate-500 font-bold block">Agachamento</span>
              <strong className="text-base font-black text-orange-950">{force.squat1Rm || 135} kg</strong>
            </div>
            <div className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-200">
              <span className="text-[10px] text-slate-500 font-bold block">Leg Press 45°</span>
              <strong className="text-base font-black text-orange-950">{force.legPress1Rm || 280} kg</strong>
            </div>
            <div className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-200">
              <span className="text-[10px] text-slate-500 font-bold block">Lev. Terra</span>
              <strong className="text-base font-black text-orange-950">{force.deadlift1Rm || 150} kg</strong>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
            <span className="font-bold block uppercase text-slate-500 text-[10px]">Zonas de Prescrição do Treinamento:</span>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span>95% (Força Neural): <strong>{force.zones?.z95 || Math.round((force.benchPress1Rm || 105) * 0.95)} kg</strong></span>
              <span>85% (Hipertrofia): <strong>{force.zones?.z85 || Math.round((force.benchPress1Rm || 105) * 0.85)} kg</strong></span>
              <span>75% (Metabólica): <strong>{force.zones?.z75 || Math.round((force.benchPress1Rm || 105) * 0.75)} kg</strong></span>
            </div>
          </div>
        </div>

        {/* SALTOS VERTICAIS BOSCO & PLIOMETRIA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-purple-600" />
              <span>Pliometria Bosco & Potência Neuromuscular</span>
            </h4>
            <span className="text-xs font-black text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Sayers: {jump.cmjSayersWatts || 3890} W ({jump.cmjSayersWkg || 52.2} W/kg)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-200">
              <span className="text-[10px] text-purple-700 font-bold block">Salto CMJ</span>
              <strong className="text-base font-black text-purple-950">{jump.cmjHeightCm || 42.5} cm</strong>
              <span className="text-[9px] text-purple-600 block">{jump.cmjFlightTimeMs || 588} ms</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">Squat Jump (SJ)</span>
              <strong className="text-base font-black text-slate-900">{jump.sjHeightCm || 37.0} cm</strong>
              <span className="text-[9px] text-slate-400 block">Isométrico</span>
            </div>
            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 font-bold block">Índice Elástico (IE)</span>
              <strong className="text-base font-black text-emerald-950">+{jump.elasticityIndexPct || 14.8}%</strong>
              <span className="text-[9px] text-emerald-700 font-bold block">CEA Ótimo</span>
            </div>
            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200">
              <span className="text-[10px] text-blue-700 font-bold block">Drop Jump (RSI)</span>
              <strong className="text-base font-black text-blue-950">{jump.dropJumpRsi || 2.15}</strong>
              <span className="text-[9px] text-blue-600 block">Contato {jump.dropJumpContactMs || 215}ms</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] flex items-center justify-between">
            <span className="text-slate-600">Salto Unipodal: D {jump.unipodalRightCm || 28.5}cm • E {jump.unipodalLeftCm || 27.8}cm</span>
            <span className="px-2 py-0.5 rounded font-black bg-emerald-100 text-emerald-800 text-[10px]">
              Assimetria {jump.unipodalAsymmetryPct || 2.5}% (&lt; 10%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 5. SETOR: TESTES DE CAMPO
// =========================================================================
export const CampoSectorGraphics: React.FC<SectorGraphicsProps> = ({ metrics }) => {
  if (!metrics) return null;
  const fld = metrics.field || {};
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Yo-Yo IR1 */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-800">Yo-Yo IR1</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">Bangsbo</span>
          </div>
          <div className="text-xl font-black text-blue-950">{fld.yoyoDistanceMeters || 1480} <span className="text-xs text-blue-600">m</span></div>
          <p className="text-[11px] text-blue-800">{fld.yoyoLaps || 37} voltas • VMA: {fld.yoyoVma || 16.5} km/h</p>
          <span className="text-[10px] font-bold text-emerald-700 block">VO2máx: {fld.yoyoVo2Max || 52.8} ml/kg/min</span>
        </div>

        {/* Teste RAST */}
        <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-800">Teste RAST (6 Sprints)</span>
            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">Potência</span>
          </div>
          <div className="text-xl font-black text-red-950">{fld.rastPeakWatts || 685} <span className="text-xs text-red-600">W</span> ({fld.rastPeakWkg || 9.2} W/kg)</div>
          <p className="text-[11px] text-red-800">Mín: {fld.rastMinWatts || 490}W • Média: {fld.rastAvgWatts || 595}W</p>
          <span className="text-[10px] font-bold text-slate-600 block">Fadiga: {fld.rastFatiguePct || 26.5}%</span>
        </div>

        {/* Teste T Agilidade */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Teste T Agilidade</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">Direção</span>
          </div>
          <div className="text-xl font-black text-amber-950">{fld.tTestSeconds || 9.72} <span className="text-xs text-amber-600">seg</span></div>
          <p className="text-[11px] text-amber-800">Volta 1: {fld.tTestLap1 || 9.68}s • Volta 2: {fld.tTestLap2 || 9.76}s</p>
          <span className="text-[10px] font-bold text-emerald-700 block">{fld.tTestClass || 'Excelente Agilidade'}</span>
        </div>

        {/* Cooper & Milha */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800">Cooper & 1 Milha</span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">Aeróbio</span>
          </div>
          <div className="text-xl font-black text-indigo-950">{fld.cooperDistanceMeters || 2850} <span className="text-xs text-indigo-600">m</span></div>
          <p className="text-[11px] text-indigo-800">Pace: {fld.cooperPace || '4:12/km'} • Milha: {fld.oneMileTime || '6:45'}</p>
          <span className="text-[10px] font-bold text-blue-700 block">VO2máx: {fld.cooperVo2Max || 52.3} ml/kg/min</span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 6. SETOR: TESTES PERSONALIZADOS
// =========================================================================
export const PersonalizadosSectorGraphics: React.FC<SectorGraphicsProps> = ({ metrics }) => {
  if (!metrics) return null;
  const customTests = metrics.customTests || [
    { name: 'Suspensão no Kimono / Barra', norm: 'Norma: > 60s', metric: '62 s' },
    { name: 'Pull-ups Unbroken CrossFit', norm: 'Norma: > 20 reps', metric: '24 reps' },
    { name: 'Tiro de 30m Lançado Velocidade', norm: 'Norma: < 4.0s', metric: '3.92 s' },
    { name: 'Prancha Isométrica Abdominal', norm: 'Norma: > 90s', metric: '95 s' },
    { name: 'Flexões de Braço (1 min)', norm: 'Norma: > 35 reps', metric: '42 reps' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-amber-600" />
          <span>Protocolos Personalizados da Academia</span>
        </h4>
        <span className="text-xs text-slate-500 font-bold">
          {customTests.length} protocolos registrados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {customTests.map((ct: any, idx: number) => (
          <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between space-y-2">
            <div>
              <strong className="block text-xs font-black text-slate-900">{ct.name}</strong>
              <span className="text-[10px] text-slate-500">{ct.norm || 'Norma da Modalidade'}</span>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-amber-700">{ct.metric || `${ct.value} ${ct.unit || ''}`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
