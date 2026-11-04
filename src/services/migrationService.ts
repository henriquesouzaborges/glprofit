import { Student, FinancialTransaction, WorkoutPlan } from '../types';
import { logSecurityEvent } from './securityService';
import { saveDocToFirestore } from './firebaseDbService';

export type MigrationCategory = 
  | 'clientes' 
  | 'avaliacao_fisica' 
  | 'plano_alimentar' 
  | 'treinos' 
  | 'financeiro';

export interface MigrationCategoryMeta {
  id: MigrationCategory;
  title: string;
  shortLabel: string;
  description: string;
  supportedFormats: string[];
  sampleDescription: string;
  badge: string;
  accentColor: string;
}

export const MIGRATION_CATEGORIES: MigrationCategoryMeta[] = [
  {
    id: 'clientes',
    title: 'Cadastro de Clientes',
    shortLabel: 'Clientes / Alunos',
    description: 'Importe cadastros completos de alunos a partir de planilhas de outros sistemas, fichas de matrícula digitalizadas, listas de contatos ou contratos em PDF.',
    supportedFormats: ['.xlsx', '.xls', '.csv', '.pdf', '.jpg', '.png', '.webp'],
    sampleDescription: 'Planilhas Excel/CSV com nomes, CPFs, telefones, e-mails, planos e vencimentos, ou fotos de fichas cadastrais físicas.',
    badge: 'Alunos & Matrículas',
    accentColor: 'blue'
  },
  {
    id: 'avaliacao_fisica',
    title: 'Avaliação Física',
    shortLabel: 'Avaliação Física',
    description: 'Digitalize laudos de bioimpedância (InBody, Tanita), fichas de dobras cutâneas (Pollock 3/7), circunferências ou fotos posturais e vincule ao histórico do aluno.',
    supportedFormats: ['.pdf', '.jpg', '.png', '.jpeg', '.xlsx', '.csv'],
    sampleDescription: 'Fotos de laudos impressos de bioimpedância, relatórios em PDF de avaliadores ou planilhas de perimetria e composição corporal.',
    badge: 'Composição & Saúde',
    accentColor: 'emerald'
  },
  {
    id: 'plano_alimentar',
    title: 'Plano Alimentar',
    shortLabel: 'Plano Alimentar / Dieta',
    description: 'Importe dietas, cálculos de calorias e macros, horários de refeições e prescrições nutricionais a partir de PDFs ou fotos de receituários.',
    supportedFormats: ['.pdf', '.jpg', '.png', '.jpeg', '.docx', '.txt'],
    sampleDescription: 'PDFs de dietas de nutricionistas, fotos de prescrições nutricionais em papel ou fichas de divisão de macros.',
    badge: 'Nutrição & Refeições',
    accentColor: 'amber'
  },
  {
    id: 'treinos',
    title: 'Treinos',
    shortLabel: 'Fichas de Treino',
    description: 'Converta fichas de treino antigas de papel (fotos), planilhas de musculação ou rotinas esportivas em treinos estruturados vinculados ao aluno.',
    supportedFormats: ['.jpg', '.png', '.jpeg', '.pdf', '.xlsx', '.csv'],
    sampleDescription: 'Fotos nítidas de fichas de musculação em papel (Divisões A, B, C), planilhas de exercícios, séries, repetições e cargas.',
    badge: 'Prescrição & Séries',
    accentColor: 'purple'
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    shortLabel: 'Financeiro & Lançamentos',
    description: 'Migre extratos bancários, relatórios de mensalidades, contas a pagar/receber e histórico financeiro de outros softwares.',
    supportedFormats: ['.ofx', '.csv', '.xlsx', '.xls', '.pdf', '.jpg', '.png'],
    sampleDescription: 'Extratos em PDF ou CSV, planilhas de receitas/despesas, relatórios de cobrança ou fotos de recibos e notas fiscais.',
    badge: 'Receitas & Despesas',
    accentColor: 'rose'
  }
];

export interface ExtractedClientItem {
  name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  status?: 'ativo' | 'inadimplente' | 'trancado' | 'cancelado';
  planName?: string;
  planPrice?: number;
  dueDate?: string;
  startDate?: string;
  pendingAmount?: number;
  notes?: string;
  matchedStudentId?: string;
  matchedStudentName?: string;
  selected?: boolean;
}

export interface ExtractedEvaluationItem {
  studentName?: string;
  studentCpf?: string;
  evaluatorName?: string;
  date?: string;
  weightKg?: number;
  heightCm?: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
  fatMassKg?: number;
  visceralFat?: number;
  basalMetabolicRate?: number;
  bloodPressure?: string;
  heartRateBpm?: number;
  protocol?: string;
  skinfolds?: Record<string, number>;
  circumferences?: Record<string, number>;
  observations?: string;
  matchedStudentId?: string;
  matchedStudentName?: string;
  selected?: boolean;
}

export interface ExtractedDietItem {
  studentName?: string;
  studentCpf?: string;
  nutritionist?: string;
  title: string;
  goal?: string;
  dailyCalories?: number;
  proteinGrams?: number;
  carbGrams?: number;
  fatGrams?: number;
  waterIntakeMl?: number;
  startDate?: string;
  meals?: {
    name: string;
    time?: string;
    calories?: number;
    items?: { food: string; portion?: string }[];
    notes?: string;
  }[];
  supplements?: { name: string; dosage?: string; timing?: string }[];
  guidelines?: string;
  matchedStudentId?: string;
  matchedStudentName?: string;
  selected?: boolean;
}

export interface ExtractedWorkoutItem {
  studentName?: string;
  studentCpf?: string;
  instructor?: string;
  title: string;
  goal?: string;
  level?: string;
  frequency?: string;
  validUntil?: string;
  divisions?: {
    letter: string;
    name: string;
    targetMuscles?: string[];
    exercises?: {
      name: string;
      muscleGroup: string;
      sets: number;
      reps: string;
      weightKg?: number;
      restSec?: number;
      equipment?: string;
      method?: string;
      notes?: string;
    }[];
  }[];
  generalNotes?: string;
  matchedStudentId?: string;
  matchedStudentName?: string;
  selected?: boolean;
}

export interface ExtractedFinancialItem {
  description: string;
  type: 'receita' | 'despesa';
  category?: string;
  amount: number;
  paymentMethod?: string;
  date?: string;
  dueDate?: string;
  status?: 'pago' | 'pendente' | 'vencido';
  studentName?: string;
  studentCpf?: string;
  notes?: string;
  matchedStudentId?: string;
  matchedStudentName?: string;
  selected?: boolean;
}

/**
 * Normaliza string para comparação fonética/textual (sem acentos, minúsculo)
 */
export function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Localiza automaticamente se o registro já pertence a algum aluno cadastrado
 */
export function findMatchingStudent(
  students: Student[],
  name?: string,
  cpf?: string,
  email?: string
): Student | null {
  if (!students || students.length === 0) return null;

  // 1. Prioridade: CPF limpo
  if (cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length >= 7) {
      const matchByCpf = students.find(s => (s.cpf || '').replace(/\D/g, '') === cleanCpf);
      if (matchByCpf) return matchByCpf;
    }
  }

  // 2. Prioridade: E-mail exato
  if (email && email.includes('@')) {
    const cleanEmail = email.toLowerCase().trim();
    const matchByEmail = students.find(s => (s.email || '').toLowerCase().trim() === cleanEmail);
    if (matchByEmail) return matchByEmail;
  }

  // 3. Prioridade: Nome completo ou primeiro + último nome
  if (name && name.trim().length >= 3) {
    const normName = normalizeString(name);
    // Busca exata normalizada
    const matchExact = students.find(s => normalizeString(s.name) === normName);
    if (matchExact) return matchExact;

    // Busca por inclusão se o nome tiver ao menos 2 palavras
    const parts = normName.split(/\s+/).filter(p => p.length > 2);
    if (parts.length >= 2) {
      const matchPartial = students.find(s => {
        const sNorm = normalizeString(s.name);
        return parts.every(part => sNorm.includes(part));
      });
      if (matchPartial) return matchPartial;
    }
  }

  return null;
}

/**
 * Converte arquivo para Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove header data URL (data:image/png;base64,...)
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Lê arquivo como texto puro (para CSV/TXT/JSON)
 */
export function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

/**
 * Envia arquivo ao endpoint de IA com Gemini 3.5/3.8 Flash
 */
export async function processFileWithGemini(params: {
  file: File;
  migrationType: MigrationCategory;
  students: Student[];
}): Promise<{
  success: boolean;
  model: string;
  items: any[];
  raw?: any;
}> {
  const { file, migrationType, students } = params;

  let fileBase64 = '';
  let textContent = '';
  const isTextLike = file.type.includes('text') || 
                     file.name.endsWith('.csv') || 
                     file.name.endsWith('.json') || 
                     file.name.endsWith('.txt');

  if (isTextLike) {
    try {
      textContent = await fileToText(file);
    } catch (e) {
      console.warn('Erro ao ler como texto, tentando base64:', e);
    }
  }

  try {
    fileBase64 = await fileToBase64(file);
  } catch (e) {
    console.warn('Erro ao converter arquivo para base64:', e);
  }

  const payload = {
    migrationType,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    fileBase64: fileBase64 || undefined,
    textContent: textContent || undefined
  };

  try {
    const res = await fetch('/api/migrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ${res.status}: Não foi possível processar o arquivo.`);
    }

    const data = await res.json();
    const rawItems: any[] = data.data?.itens || data.data?.items || [];

    // Vincula automaticamente aos alunos existentes no sistema
    const enrichedItems = rawItems.map((item, index) => {
      const targetName = item.name || item.studentName || '';
      const targetCpf = item.cpf || item.studentCpf || '';
      const targetEmail = item.email || '';

      const matched = findMatchingStudent(students, targetName, targetCpf, targetEmail);

      return {
        ...item,
        id: item.id || `mig-${Date.now()}-${index}`,
        matchedStudentId: matched ? matched.id : undefined,
        matchedStudentName: matched ? matched.name : undefined,
        selected: true
      };
    });

    return {
      success: true,
      model: data.model || 'Gemini 3.5 Flash',
      items: enrichedItems,
      raw: data.data
    };
  } catch (apiError: any) {
    console.error('API /api/migrate call failed:', apiError);

    // Fallback: Se for arquivo CSV ou JSON simples, efetua o parsing local sem travar o usuário
    if (textContent && isTextLike) {
      console.info('Tentando fallback local para arquivo de texto/CSV...');
      const localItems = parseLocalTextData(textContent, migrationType, file.name, students);
      if (localItems.length > 0) {
        return {
          success: true,
          model: 'Parser Local Estruturado (Fallback)',
          items: localItems
        };
      }
    }

    throw apiError;
  }
}

/**
 * Parser de contingência para CSV / JSON simples
 */
function parseLocalTextData(
  text: string, 
  type: MigrationCategory, 
  fileName: string, 
  students: Student[]
): any[] {
  try {
    if (fileName.endsWith('.json')) {
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : (parsed.itens || parsed.items || [parsed]);
      return arr.map((item: any, idx: number) => {
        const matched = findMatchingStudent(students, item.name || item.studentName, item.cpf || item.studentCpf, item.email);
        return {
          ...item,
          id: `local-json-${idx}`,
          matchedStudentId: matched?.id,
          matchedStudentName: matched?.name,
          selected: true
        };
      });
    }

    // Linhas de CSV
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];

    const separator = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0].split(separator).map(h => normalizeString(h.replace(/["']/g, '')));
    const dataLines = lines.slice(1);

    const items: any[] = [];
    dataLines.forEach((line, idx) => {
      const cols = line.split(separator).map(c => c.replace(/["']/g, '').trim());
      if (cols.length < 2) return;

      const obj: Record<string, any> = {};
      headers.forEach((h, hIdx) => {
        obj[h] = cols[hIdx] || '';
      });

      if (type === 'clientes') {
        const name = obj['nome'] || obj['name'] || obj['aluno'] || cols[0];
        const cpf = obj['cpf'] || cols[1] || '';
        const phone = obj['telefone'] || obj['celular'] || obj['whatsapp'] || '';
        const email = obj['email'] || obj['e-mail'] || '';
        const matched = findMatchingStudent(students, name, cpf, email);

        items.push({
          id: `local-csv-${idx}`,
          name,
          cpf,
          phone,
          email,
          status: 'ativo',
          planName: obj['plano'] || 'Plano Mensal',
          planPrice: parseFloat((obj['valor'] || obj['preco'] || '120').replace(/[^\d.,]/g, '').replace(',', '.')) || 120,
          matchedStudentId: matched?.id,
          matchedStudentName: matched?.name,
          selected: true
        });
      } else if (type === 'financeiro') {
        const desc = obj['descricao'] || obj['historico'] || obj['detalhes'] || cols[0];
        const amount = parseFloat((obj['valor'] || cols[1] || '0').replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const studentName = obj['aluno'] || obj['cliente'] || '';
        const matched = findMatchingStudent(students, studentName);

        items.push({
          id: `local-fin-${idx}`,
          description: desc,
          type: (obj['tipo'] || '').toLowerCase().includes('desp') ? 'despesa' : 'receita',
          category: obj['categoria'] || 'Mensalidade',
          amount,
          paymentMethod: 'pix',
          date: new Date().toISOString().slice(0, 10),
          status: 'pago',
          studentName,
          matchedStudentId: matched?.id,
          matchedStudentName: matched?.name,
          selected: true
        });
      }
    });

    return items;
  } catch (e) {
    console.error('Local text parsing error:', e);
    return [];
  }
}

/**
 * Persiste avaliação física importada no armazenamento local e Firestore
 */
export function saveImportedEvaluation(studentId: string, evaluation: ExtractedEvaluationItem): void {
  try {
    const key = `glprofit_student_evaluations_${studentId}`;
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    
    const record = {
      ...evaluation,
      id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      studentId,
      importedAt: new Date().toISOString(),
      source: 'migracao_ia'
    };

    list.unshift(record);
    localStorage.setItem(key, JSON.stringify(list));

    saveDocToFirestore('student_evaluations', record).catch(err => {
      console.warn('Sync evaluation to Firestore skipped:', err);
    });
  } catch (e) {
    console.error('Erro ao salvar avaliação física importada:', e);
  }
}

/**
 * Persiste plano alimentar importado no armazenamento local e Firestore
 */
export function saveImportedDietPlan(studentId: string, dietPlan: ExtractedDietItem): void {
  try {
    const key = `glprofit_student_diet_plans_${studentId}`;
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];

    const record = {
      ...dietPlan,
      id: `diet-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      studentId,
      importedAt: new Date().toISOString(),
      source: 'migracao_ia'
    };

    list.unshift(record);
    localStorage.setItem(key, JSON.stringify(list));

    saveDocToFirestore('student_diet_plans', record).catch(err => {
      console.warn('Sync diet plan to Firestore skipped:', err);
    });
  } catch (e) {
    console.error('Erro ao salvar plano alimentar importado:', e);
  }
}
