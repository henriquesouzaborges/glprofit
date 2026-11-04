import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Heart, 
  Zap, 
  Activity, 
  Award, 
  User, 
  Check, 
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Student } from '../../../types';
import { INITIAL_PHYSICAL_TESTS } from './exerciseDatabase';

interface TestesFisicosTabProps {
  students: Student[];
}

export const TestesFisicosTab: React.FC<TestesFisicosTabProps> = ({ students }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-1');
  const [tests, setTests] = useState<any[]>(INITIAL_PHYSICAL_TESTS);

  // New Test Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [testCategory, setTestCategory] = useState<'cardiorrespiratorio' | 'neuromuscular' | 'flexibilidade'>('cardiorrespiratorio');
  const [testProtocol, setTestProtocol] = useState('Teste de Cooper (12 Minutos)');
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0, 10));
  const [evaluator, setEvaluator] = useState('Prof. Gianluca Marinho');
  const [cooperDistance, setCooperDistance] = useState<number>(2600); // meters
  const [repsDone, setRepsDone] = useState<number>(40);
  const [wellsDistance, setWellsDistance] = useState<number>(34); // cm
  const [notes, setNotes] = useState('');

  const studentTests = tests.filter(t => t.studentId === selectedStudentId);
  const currentStudent = students.find(s => s.id === selectedStudentId);

  // VO2 Max calculation by Cooper formula: (dist - 504.9) / 44.73
  const calculateCooperVO2 = (distance: number) => {
    const vo2 = (distance - 504.9) / 44.73;
    return Math.max(10, Math.round(vo2 * 10) / 10);
  };

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();

    let raw = '';
    let metric = '';
    let classification: 'Excelente' | 'Bom' | 'Médio' | 'Fraco' = 'Bom';

    if (testCategory === 'cardiorrespiratorio') {
      const vo2 = calculateCooperVO2(cooperDistance);
      raw = `${cooperDistance} metros`;
      metric = `VO2 Máx: ${vo2} ml/kg/min`;
      classification = vo2 > 48 ? 'Excelente' : vo2 > 40 ? 'Bom' : vo2 > 32 ? 'Médio' : 'Fraco';
    } else if (testCategory === 'flexibilidade') {
      raw = `${wellsDistance} cm`;
      metric = `Percentil: ${wellsDistance >= 35 ? 'P85 (Excelente)' : wellsDistance >= 28 ? 'P60 (Bom)' : 'P40 (Médio)'}`;
      classification = wellsDistance >= 35 ? 'Excelente' : wellsDistance >= 28 ? 'Bom' : 'Médio';
    } else {
      raw = `${repsDone} repetições`;
      metric = `Percentil: ${repsDone >= 38 ? 'P90 (Excelente)' : repsDone >= 28 ? 'P65 (Bom)' : 'P40 (Médio)'}`;
      classification = repsDone >= 38 ? 'Excelente' : repsDone >= 28 ? 'Bom' : 'Médio';
    }

    const newTest = {
      id: `pt-${Date.now()}`,
      studentId: selectedStudentId,
      studentName: currentStudent?.name || 'Aluno',
      date: testDate,
      evaluator,
      type: testCategory,
      testName: testProtocol,
      rawResult: raw,
      calculatedMetric: metric,
      classification,
      notes
    };

    setTests([newTest, ...tests]);
    setShowAddModal(false);
    setNotes('');
  };

  const handleDeleteTest = (id: string) => {
    if (confirm('Deseja excluir este registro de teste físico?')) {
      setTests(tests.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Testes Físicos & Capacidade Funcional
            </h3>
            <p className="text-xs text-slate-500">
              Neuromusculares, cardiorrespiratórios (VO2 Máx) e flexibilidade (Banco de Wells)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-hidden"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Aplicar Teste</span>
          </button>
        </div>
      </div>

      {/* Overview Cards by Category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            Cardiorrespiratório (VO2)
          </div>
          <div className="text-lg font-bold text-slate-900">
            {studentTests.find(t => t.type === 'cardiorrespiratorio')?.calculatedMetric || 'Não realizado'}
          </div>
          <p className="text-[11px] text-slate-500">
            Teste de Cooper (12 min) / Rockport
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            Neuromuscular & Força
          </div>
          <div className="text-lg font-bold text-slate-900">
            {studentTests.find(t => t.type === 'neuromuscular')?.calculatedMetric || 'Não realizado'}
          </div>
          <p className="text-[11px] text-slate-500">
            Resistência Abdominal / 1RM
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            Flexibilidade
          </div>
          <div className="text-lg font-bold text-slate-900">
            {studentTests.find(t => t.type === 'flexibilidade')?.rawResult || 'Não realizado'}
          </div>
          <p className="text-[11px] text-slate-500">
            Banco de Wells (Sentar e Alcançar)
          </p>
        </div>

      </div>

      {/* Tests Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800">
            Histórico de Avaliações Físicas de {currentStudent?.name}
          </h4>
          <span className="text-xs text-slate-500">
            {studentTests.length} avaliações registradas
          </span>
        </div>

        {studentTests.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <ClipboardCheck className="w-8 h-8 mx-auto text-slate-300" />
            <p>Nenhum teste físico registrado para este aluno ainda.</p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-indigo-600 font-bold hover:underline"
            >
              + Aplicar Primeiro Teste
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Data</th>
                  <th className="p-3">Teste / Protocolo</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Resultado Bruto</th>
                  <th className="p-3">Métrica Calculada</th>
                  <th className="p-3 text-center">Classificação</th>
                  <th className="p-3">Avaliador</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {studentTests.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-700">{t.date}</td>
                    <td className="p-3 font-bold text-slate-900">{t.testName}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{t.rawResult}</td>
                    <td className="p-3 font-bold text-indigo-700">{t.calculatedMetric}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.classification === 'Excelente' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : t.classification === 'Bom' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.classification}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{t.evaluator}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteTest(t.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Test Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                Registrar Novo Teste Físico
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria do Teste</label>
                  <select
                    value={testCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setTestCategory(cat);
                      if (cat === 'cardiorrespiratorio') setTestProtocol('Teste de Cooper (12 Minutos)');
                      else if (cat === 'flexibilidade') setTestProtocol('Banco de Wells (Sentar e Alcançar)');
                      else setTestProtocol('Teste de Resistência Abdominal (1 Minuto)');
                    }}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden"
                  >
                    <option value="cardiorrespiratorio">Cardiorrespiratório (VO2)</option>
                    <option value="neuromuscular">Neuromuscular / Resistência</option>
                    <option value="flexibilidade">Flexibilidade</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Protocolo Específico</label>
                  <input
                    type="text"
                    value={testProtocol}
                    onChange={(e) => setTestProtocol(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Dynamic inputs per category */}
              {testCategory === 'cardiorrespiratorio' && (
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
                  <label className="block font-bold text-blue-900">
                    Distância Percorrida em 12 Minutos (Metros)
                  </label>
                  <input
                    type="number"
                    min={500}
                    max={5000}
                    step={10}
                    value={cooperDistance}
                    onChange={(e) => setCooperDistance(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-blue-300 bg-white p-2 text-xs font-bold text-blue-900 focus:border-indigo-600 focus:outline-hidden"
                  />
                  <div className="text-[11px] text-blue-700 font-semibold flex items-center justify-between">
                    <span>VO2 Máx Calculado:</span>
                    <span className="text-sm font-extrabold">{calculateCooperVO2(cooperDistance)} ml/kg/min</span>
                  </div>
                </div>
              )}

              {testCategory === 'flexibilidade' && (
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                  <label className="block font-bold text-emerald-900">
                    Alcance no Banco de Wells (Centímetros)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    step={0.5}
                    value={wellsDistance}
                    onChange={(e) => setWellsDistance(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-emerald-300 bg-white p-2 text-xs font-bold text-emerald-900 focus:border-indigo-600 focus:outline-hidden"
                  />
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    Alcance acima de 30 cm indica boa mobilidade isquiotibial e lombar.
                  </div>
                </div>
              )}

              {testCategory === 'neuromuscular' && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
                  <label className="block font-bold text-amber-900">
                    Repetições Realizadas em 1 Minuto
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={repsDone}
                    onChange={(e) => setRepsDone(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-amber-300 bg-white p-2 text-xs font-bold text-amber-900 focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data da Aplicação</label>
                  <input
                    type="date"
                    required
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Avaliador Responsável</label>
                  <input
                    type="text"
                    required
                    value={evaluator}
                    onChange={(e) => setEvaluator(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observações Técnicas</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Comportamento da frequência cardíaca, compensações posturais..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs"
                >
                  Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
