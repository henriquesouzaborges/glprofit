import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft,
  User, 
  MessageSquare, 
  UserCheck, 
  CreditCard, 
  Dumbbell, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Phone,
  Mail,
  FileText,
  Activity,
  Heart,
  Zap,
  TrendingUp,
  Scale,
  Salad,
  Flame,
  Droplets,
  Share2,
  Printer,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  AlertTriangle,
  Send,
  Plus,
  ExternalLink,
  Percent,
  Layers,
  Sparkles,
  Save,
  Camera,
  Image as ImageIcon,
  Trash2,
  ShoppingCart,
  Package,
  DollarSign,
  Tag,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  Student, 
  StudentStatus, 
  FinancialTransaction, 
  WorkoutPlan, 
  WellnessCheckin,
  PhysicalAssessmentData,
  PaymentMethod
} from '../../../types';
import { formatCurrency, formatDate, sendWhatsAppMessage } from '../../../utils';
import { INITIAL_ASSESSMENTS } from '../treino/AvaliacoesFisicasTab';
import { INITIAL_WELLNESS_CHECKINS } from '../BemEstarTab';
import { INITIAL_PLANS, INITIAL_PRODUCTS } from '../../../mockData';

export type FichaSubTab = 
  | 'visao_geral' 
  | 'dados_cadastro'
  | 'treinos' 
  | 'avaliacoes' 
  | 'bem_estar' 
  | 'financeiro' 
  | 'nutricao';

interface FichaCompletaAlunoViewProps {
  student: Student;
  onBack: () => void;
  transactions: FinancialTransaction[];
  workouts: WorkoutPlan[];
  checkins?: WellnessCheckin[];
  assessments?: PhysicalAssessmentData[];
  onUpdateStudentStatus: (studentId: string, status: StudentStatus) => void;
  onSettleStudentPayment: (studentId: string) => void;
  onNavigateToTab?: (tab: string) => void;
  onUpdateStudent?: (student: Student) => void;
  onAddSaleTransaction?: (transaction: FinancialTransaction, updatedStudent?: Student) => void;
}

// Serviços da academia disponíveis para venda rápida
const SERVICOS_ACADEMIA = [
  { id: 'srv-1', name: 'Sessão Avulsa de Personal Trainer', category: 'Personal Trainer', price: 120.00, description: '1 hora com treinador dedicado e planilha individualizada' },
  { id: 'srv-2', name: 'Pacote 10 Sessões de Personal Trainer', category: 'Personal Trainer', price: 990.00, description: '10 sessões agendáveis com instrutor master' },
  { id: 'srv-3', name: 'Avaliação Física Completa (Pollock + Bioimpedância)', category: 'Avaliação Física', price: 90.00, description: 'Protocolo de 7 dobras, perímetros e composição corporal' },
  { id: 'srv-4', name: 'Consulta Nutricional Esportiva com Bioimpedância', category: 'Nutrição', price: 150.00, description: 'Dieta sob medida, macronutrientes e suplementação' },
  { id: 'srv-5', name: 'Locação Mensal de Armário Individual', category: 'Conveniência', price: 35.00, description: 'Locker com chave privativa no vestiário' },
  { id: 'srv-6', name: 'Day-Use / Passaporte Convidado VIP', category: 'Acesso', price: 40.00, description: 'Diária completa para 1 convidado treinar junto' }
];

// Presets de fotos de avatar
const AVATAR_PRESETS = [
  { label: 'Homem Esportivo 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { label: 'Mulher Fitness 1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { label: 'Homem Esportivo 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Mulher Fitness 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { label: 'Homem Fitness 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
];

export const FichaCompletaAlunoView: React.FC<FichaCompletaAlunoViewProps> = ({
  student,
  onBack,
  transactions,
  workouts,
  checkins = INITIAL_WELLNESS_CHECKINS,
  assessments = INITIAL_ASSESSMENTS,
  onUpdateStudentStatus,
  onSettleStudentPayment,
  onNavigateToTab,
  onUpdateStudent,
  onAddSaleTransaction
}) => {
  // Estado local do aluno (para refletir edições imediatamente)
  const [currentStudent, setCurrentStudent] = useState<Student>(student);
  const [activeTab, setActiveTab] = useState<FichaSubTab>('visao_geral');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Controle de cards minimizados: por padrão todos começam MINIMIZADOS ({})
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Modal de Venda Rápida em Financeiro
  const [showVenderModal, setShowVenderModal] = useState(false);
  const [vendaTipo, setVendaTipo] = useState<'plano' | 'produto' | 'servico'>('plano');
  const [vendaSelectedId, setVendaSelectedId] = useState<string>('');
  const [vendaQuantity, setVendaQuantity] = useState<number>(1);
  const [vendaPaymentMethod, setVendaPaymentMethod] = useState<PaymentMethod>('pix');
  const [vendaStatus, setVendaStatus] = useState<'pago' | 'pendente'>('pago');
  const [vendaAtualizarPlano, setVendaAtualizarPlano] = useState<boolean>(true);
  const [vendaNotes, setVendaNotes] = useState<string>('');

  // Formulário de Edição do Cadastro
  const [formData, setFormData] = useState({
    name: student.name,
    code: student.code,
    cpf: student.cpf,
    birthDate: student.birthDate || '2000-01-01',
    phone: student.phone,
    email: student.email,
    photo: student.photo || '',
    planId: student.planId || 'plan-1',
    planName: student.planName,
    planPrice: student.planPrice,
    dueDate: student.dueDate,
    status: student.status,
    notes: student.notes || ''
  });

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Funções de recolher/expandir cards
  const isCardExpanded = (cardId: string) => !!expandedCards[cardId];
  
  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const expandAllInTab = (cardIds: string[]) => {
    setExpandedCards(prev => {
      const next = { ...prev };
      cardIds.forEach(id => { next[id] = true; });
      return next;
    });
  };

  const collapseAllInTab = (cardIds: string[]) => {
    setExpandedCards(prev => {
      const next = { ...prev };
      cardIds.forEach(id => { next[id] = false; });
      return next;
    });
  };

  // Sincronizar dados quando a prop mudar
  useMemo(() => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      code: student.code,
      cpf: student.cpf,
      birthDate: student.birthDate || '2000-01-01',
      phone: student.phone,
      email: student.email,
      photo: student.photo || '',
      planId: student.planId || 'plan-1',
      planName: student.planName,
      planPrice: student.planPrice,
      dueDate: student.dueDate,
      status: student.status,
      notes: student.notes || ''
    });
  }, [student]);

  // 1. Dados Relacionados ao Aluno
  const studentTransactions = useMemo(() => {
    return transactions.filter(t => t.studentId === currentStudent.id || t.studentName === currentStudent.name);
  }, [transactions, currentStudent]);

  const studentWorkouts = useMemo(() => {
    return workouts.filter(w => w.studentId === currentStudent.id || w.studentName === currentStudent.name);
  }, [workouts, currentStudent]);


  const studentCheckins = useMemo(() => {
    const list = checkins.filter(c => c.studentId === currentStudent.id || c.studentName?.toLowerCase() === currentStudent.name.toLowerCase());
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [checkins, currentStudent]);

  const studentAssessments = useMemo(() => {
    const list = assessments.filter(a => a.studentId === currentStudent.id || a.studentName?.toLowerCase() === currentStudent.name.toLowerCase());
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [assessments, currentStudent]);

  // Cálculos de Idade
  const studentAge = useMemo(() => {
    if (!currentStudent.birthDate) return 26;
    const birth = new Date(currentStudent.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age > 0 ? age : 26;
  }, [currentStudent.birthDate]);

  // Últimos dados
  const latestCheckin = studentCheckins[0] || null;
  const latestAssessment = studentAssessments[0] || null;

  // Nutrição Personalizada
  const nutritionPlan = useMemo(() => {
    const weight = latestAssessment?.weightKg || 74;
    const height = latestAssessment?.heightCm || 176;
    const tmb = Math.round(10 * weight + 6.25 * height - 5 * studentAge + 5);
    const get = Math.round(tmb * 1.55);
    const proteinGrams = Math.round(weight * 2.0);
    const fatGrams = Math.round(weight * 0.9);
    const carbGrams = Math.round((get - (proteinGrams * 4 + fatGrams * 9)) / 4);
    const waterLiters = (weight * 0.04).toFixed(1);

    return {
      tmb,
      get,
      proteinGrams,
      fatGrams,
      carbGrams,
      waterLiters,
      meals: [
        { time: '07:30', name: 'Café da Manhã', items: 'Ovos mexidos (3 un), Pão integral (2 fatias), Queijo branco (30g), Café sem açúcar' },
        { time: '10:30', name: 'Lanche Matutino', items: 'Fruta da estação (banana/maçã), Whey Protein concentrado (30g) com água' },
        { time: '13:00', name: 'Almoço Completo', items: 'Arroz integral (150g), Feijão (1 concha), Peito de frango grelhado (180g), Salada verde variada à vontade com azeite extravirgem' },
        { time: '16:30', name: 'Pré-Treino', items: 'Iogurte natural desnatado, Aveia em flocos (30g), Mel (1 colher de chá)' },
        { time: '20:00', name: 'Jantar', items: 'Batata doce ou mandioca (140g), Filé de peixe ou carne magra grelhada (160g), Legumes cozidos no vapor' }
      ]
    };
  }, [latestAssessment, studentAge]);

  // WhatsApp Handler
  const handleSendWhatsApp = (customMsg?: string) => {
    const defaultMsg = currentStudent.status === 'inadimplente'
      ? `Olá ${currentStudent.name}, tudo bem? Passando para lembrar da sua mensalidade pendente na GL PRO FIT. Chave PIX: financeiro@glprofit.com.br. Podemos te ajudar?`
      : `Olá ${currentStudent.name}! Como estão os seus treinos na GL PRO FIT? Nossa equipe de treinadores está à sua disposição!`;
    const message = customMsg || defaultMsg;
    sendWhatsAppMessage(currentStudent.phone, message, currentStudent.name, currentStudent.id);
    showToast(`WhatsApp aberto para ${currentStudent.name}`);
  };

  // Salvar Alterações de Cadastro
  const handleSaveCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Student = {
      ...currentStudent,
      name: formData.name,
      code: formData.code,
      cpf: formData.cpf,
      birthDate: formData.birthDate,
      phone: formData.phone,
      email: formData.email,
      photo: formData.photo.trim(),
      planId: formData.planId,
      planName: formData.planName,
      planPrice: Number(formData.planPrice) || 0,
      dueDate: formData.dueDate,
      status: formData.status as StudentStatus,
      notes: formData.notes
    };

    setCurrentStudent(updated);
    setImgError(false);
    if (onUpdateStudent) {
      onUpdateStudent(updated);
    }
    showToast('Dados cadastrais do aluno atualizados com sucesso!');
  };

  // Upload de Imagem local (Base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, photo: base64 }));
        setImgError(false);
        showToast('Foto carregada do dispositivo com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Concluir Venda Rápida (Plano, Produto ou Serviço)
  const handleConcluirVenda = (e: React.FormEvent) => {
    e.preventDefault();

    let itemName = '';
    let itemPrice = 0;
    let category = '';

    if (vendaTipo === 'plano') {
      const plan = INITIAL_PLANS.find(p => p.id === vendaSelectedId) || INITIAL_PLANS[0];
      itemName = `Plano: ${plan.name}`;
      itemPrice = plan.price;
      category = 'Mensalidade';
    } else if (vendaTipo === 'produto') {
      const prod = INITIAL_PRODUCTS.find(p => p.id === vendaSelectedId) || INITIAL_PRODUCTS[0];
      itemName = `Produto: ${prod.name} (${vendaQuantity}x)`;
      itemPrice = prod.price * vendaQuantity;
      category = 'Venda PDV / Lanchonete';
    } else {
      const srv = SERVICOS_ACADEMIA.find(s => s.id === vendaSelectedId) || SERVICOS_ACADEMIA[0];
      itemName = `Serviço: ${srv.name} (${vendaQuantity}x)`;
      itemPrice = srv.price * vendaQuantity;
      category = srv.category;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const newTransaction: FinancialTransaction = {
      id: `tx-sale-${Date.now()}`,
      type: 'receita',
      category,
      description: `${itemName} - Aluno: ${currentStudent.name}${vendaNotes ? ` (${vendaNotes})` : ''}`,
      amount: itemPrice,
      paymentMethod: vendaPaymentMethod,
      date: todayStr,
      dueDate: todayStr,
      status: vendaStatus === 'pago' ? 'pago' : 'pendente',
      studentId: currentStudent.id,
      studentName: currentStudent.name
    };

    let updatedStudent: Student = { ...currentStudent };

    // Se vendeu plano e marcou para atualizar plano do aluno
    if (vendaTipo === 'plano' && vendaAtualizarPlano) {
      const plan = INITIAL_PLANS.find(p => p.id === vendaSelectedId) || INITIAL_PLANS[0];
      updatedStudent.planId = plan.id;
      updatedStudent.planName = plan.name;
      updatedStudent.planPrice = plan.price;
      if (vendaStatus === 'pago' && updatedStudent.status === 'inadimplente') {
        updatedStudent.status = 'ativo';
        updatedStudent.pendingAmount = 0;
      }
    }

    // Se status for pendente, adiciona ao débito em aberto
    if (vendaStatus === 'pendente') {
      updatedStudent.pendingAmount = (updatedStudent.pendingAmount || 0) + itemPrice;
      if (updatedStudent.status === 'ativo') {
        // Alerta que possui débito
      }
    }

    setCurrentStudent(updatedStudent);

    if (onAddSaleTransaction) {
      onAddSaleTransaction(newTransaction, updatedStudent);
    } else if (onUpdateStudent) {
      onUpdateStudent(updatedStudent);
    }

    setShowVenderModal(false);
    setVendaNotes('');
    setVendaQuantity(1);
    showToast(`Venda de ${itemName} registrada (${vendaStatus.toUpperCase()})!`);
  };

  // Helper para verificar se a foto é válida
  const hasPhoto = !!currentStudent.photo && currentStudent.photo.trim() !== '' && !imgError;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Toast Notificação */}
      {feedbackToast && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* BANNER LGPD: Se não possuir consentimento registrado */}
      {!currentStudent.consentLgpd && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="text-xs font-bold block">Consentimento LGPD Não Registrado (Lei nº 13.709/2018)</strong>
              <p className="text-[11px] text-amber-700">Este titular de dados ainda não possui registro formal de consentimento para tratamento de dados de saúde e biometria.</p>
            </div>
          </div>
          <button
            onClick={() => {
              const updated = {
                ...currentStudent,
                consentLgpd: true,
                consentLgpdDate: new Date().toISOString(),
                consentLgpdVersion: "2026-11"
              };
              setCurrentStudent(updated);
              if (onUpdateStudent) onUpdateStudent(updated);
              showToast("Consentimento LGPD registrado com sucesso.");
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
          >
            Registrar Consentimento LGPD
          </button>
        </div>
      )}

      {/* BARRA SUPERIOR DE RETORNO & AÇÕES GERAIS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 border border-slate-200 shadow-xs transition-all active:scale-[0.98] w-fit cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Lista de Alunos</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSendWhatsApp()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp</span>
          </button>



          {currentStudent.status === 'inadimplente' && (
            <button
              onClick={() => {
                onSettleStudentPayment(currentStudent.id);
                setCurrentStudent(prev => ({ ...prev, status: 'ativo', pendingAmount: 0 }));
                showToast('Mensalidade quitada com sucesso!');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <CreditCard className="h-4 w-4" />
              <span>Quitar Débito ({formatCurrency(currentStudent.pendingAmount)})</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {/* CARD PRINCIPAL DO CABEÇALHO DO PERFIL */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar e Identificação com Fallback para Ícone */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              {hasPhoto ? (
                <img
                  src={currentStudent.photo}
                  alt={currentStudent.name}
                  onError={() => setImgError(true)}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-2 border-slate-100 shadow-md ring-4 ring-slate-50"
                />
              ) : (
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 border-slate-200/80 shadow-md ring-4 ring-slate-100 flex flex-col items-center justify-center text-slate-300">
                  <User className="h-12 w-12 text-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                    Sem Foto
                  </span>
                </div>
              )}

              <span className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                currentStudent.status === 'ativo'
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : currentStudent.status === 'inadimplente'
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-amber-500 text-white border-amber-400'
              }`}>
                {currentStudent.status}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {currentStudent.name}
                </h1>
                
                {/* Seletor Rápido de Status */}
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                    title="Alterar Situação do Aluno"
                  >
                    <span>Mudar Status</span>
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute left-0 mt-2 z-30 w-36 rounded-xl bg-white border border-slate-200 shadow-xl py-1 animate-in fade-in zoom-in-95">
                      {(['ativo', 'inadimplente', 'trancado', 'cancelado'] as StudentStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            onUpdateStudentStatus(currentStudent.id, st);
                            setCurrentStudent(prev => ({ ...prev, status: st }));
                            setStatusDropdownOpen(false);
                            showToast(`Status alterado para ${st.toUpperCase()}`);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between ${
                            currentStudent.status === st ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span className="capitalize">{st}</span>
                          {currentStudent.status === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Atalho para Editar Cadastro */}
                <button
                  onClick={() => setActiveTab('dados_cadastro')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>Editar Cadastro</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-bold">
                  Matrícula: {currentStudent.code}
                </span>
                <span>CPF: <strong className="text-slate-700">{currentStudent.cpf}</strong></span>
                <span>Idade: <strong className="text-slate-700">{studentAge} anos</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentStudent.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentStudent.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Plano & Contrato */}
          <div className="flex flex-wrap lg:flex-col lg:items-end justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Plano Contratado
              </span>
              <div className="text-base font-black text-slate-900">
                {currentStudent.planName}
              </div>
              <div className="text-xs font-semibold text-blue-700">
                {formatCurrency(currentStudent.planPrice)} / mês
              </div>
            </div>

            <div className="text-left lg:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Próximo Vencimento
              </span>
              <div className="text-xs font-bold text-slate-800">
                {formatDate(currentStudent.dueDate)}
              </div>
              {currentStudent.pendingAmount > 0 ? (
                <span className="text-xs font-black text-rose-600">
                  Débito: {formatCurrency(currentStudent.pendingAmount)}
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 flex items-center lg:justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Em dia
                </span>
              )}
            </div>
          </div>
        </div>

        {/* NOTAS E OBSERVAÇÕES MÉDICAS */}
        {currentStudent.notes && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border-amber-200/60">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-bold">Observações Clínicas & Objetivos: </strong>
              <span>{currentStudent.notes}</span>
            </div>
          </div>
        )}
      </div>

      {/* BARRA DE NAVEGAÇÃO DE SUB-ABAS DO PERFIL */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {[
          { id: 'visao_geral', label: 'Raio-X Geral', icon: Sparkles, count: null },
          { id: 'dados_cadastro', label: 'Dados do Cadastro', icon: UserCheck, count: null },
          { id: 'treinos', label: 'Treinos', icon: Dumbbell, count: studentWorkouts.length },
          { id: 'avaliacoes', label: 'Avaliações Físicas', icon: Scale, count: studentAssessments.length },
          { id: 'bem_estar', label: 'Bem-Estar & Prontidão', icon: Activity, count: studentCheckins.length },
          { id: 'financeiro', label: 'Financeiro', icon: CreditCard, count: studentTransactions.length },
          { id: 'nutricao', label: 'Nutrição & Dieta', icon: Salad, count: null },
        ].map(({ id, label, icon: Icon, count }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id as FichaSubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO DINÂMICO DAS SUB-ABAS */}

      {/* 1. RAIO-X GERAL / VISÃO 360° */}
      {activeTab === 'visao_geral' && (
        <div className="space-y-6">
          {/* Barra de Ação Rápida de Recolher / Expandir Cards */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Cards do Raio-X Geral (Minimizados por padrão)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => expandAllInTab(['vg-kpis', 'vg-treino', 'vg-bemestar'])}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 cursor-pointer flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Expandir Todos
              </button>
              <button
                onClick={() => collapseAllInTab(['vg-kpis', 'vg-treino', 'vg-bemestar'])}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-200/60 cursor-pointer flex items-center gap-1"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Recolher Todos
              </button>
            </div>
          </div>

          {/* Card Minimizável 1: Métricas de Alto Nível (KPIs) */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-all">
            <div 
              onClick={() => toggleCard('vg-kpis')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Métricas & Indicadores Chave</h3>
                  <p className="text-xs text-slate-500">Resumo de treinos, composição corporal, prontidão e frequência</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('vg-kpis') ? 'Recolher' : 'Expandir'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('vg-kpis') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('vg-kpis') && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/30 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Treinos Prescritos */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Treinos Ativos</span>
                      <Dumbbell className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {studentWorkouts.length} planos
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {studentWorkouts[0]?.title || 'Nenhum treino prescrito'}
                    </p>
                  </div>

                  {/* Card 2: Composição Corporal */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">% Gordura</span>
                      <Scale className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {latestAssessment?.bodyComp?.bodyFatPercent ? `${latestAssessment.bodyComp.bodyFatPercent}%` : '14.2%'}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold truncate">
                      {latestAssessment?.weightKg ? `${latestAssessment.weightKg} kg de peso` : 'Peso controlado'}
                    </p>
                  </div>

                  {/* Card 3: Prontidão Hoje */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-bold uppercase tracking-wider">Prontidão</span>
                      <Activity className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {latestCheckin ? `${latestCheckin.readinessScore}%` : '85%'}
                    </div>
                    <p className="text-[11px] text-purple-600 font-semibold truncate">
                      {latestCheckin?.readinessStatus === 'alerta' ? 'Alerta de sobrecarga' : 'Apto para treinar'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Destaques Divididos em Colunas Minimizáveis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card Minimizável: Treino em Destaque */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div 
                onClick={() => toggleCard('vg-treino')}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Plano de Treino em Andamento</h3>
                    <p className="text-xs text-slate-500">Exercícios e séries prescritas</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('treinos');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 mr-2"
                  >
                    Ver aba →
                  </button>
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                    {isCardExpanded('vg-treino') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {isCardExpanded('vg-treino') && (
                <div className="p-5 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                  {studentWorkouts.length > 0 ? (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{studentWorkouts[0].title}</h4>
                          <span className="text-[11px] text-slate-500">
                            {studentWorkouts[0].objective || (studentWorkouts[0] as any).goal || 'Treino Personalizado'} • Nível: {studentWorkouts[0].level}
                          </span>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                          Frequência: {studentWorkouts[0].frequency || 'Semanal'}
                        </span>
                      </div>

                      {(studentWorkouts[0].splits || (studentWorkouts[0] as any).divisions || []).slice(0, 2).map((split: any, i: number) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="text-xs font-bold text-slate-800">
                            {split.name || `Divisão ${split.letter || i + 1}`}
                          </div>
                          <div className="space-y-1">
                            {(split.exercises || []).slice(0, 3).map((ex: any, eIdx: number) => (
                              <div key={eIdx} className="flex items-center justify-between text-xs text-slate-600">
                                <span>• {ex.name}</span>
                                <span className="font-mono text-slate-500 text-[11px]">{ex.sets}x{ex.reps} {ex.weightKg ? `(${ex.weightKg}kg)` : ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Nenhum treino específico cadastrado para este perfil.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Minimizável: Monitoramento Fisiológico / Bem-Estar */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div 
                onClick={() => toggleCard('vg-bemestar')}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Monitoramento Fisiológico</h3>
                    <p className="text-xs text-slate-500">Check-in de bem-estar mais recente</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('bem_estar');
                    }}
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 mr-2"
                  >
                    Ver aba →
                  </button>
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                    {isCardExpanded('vg-bemestar') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {isCardExpanded('vg-bemestar') && (
                <div className="p-5 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                  {latestCheckin ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Sono</span>
                          <div className="text-lg font-black text-slate-800">{latestCheckin.sleepQuality}/5</div>
                          <span className="text-[10px] text-slate-500">{latestCheckin.sleepHours}h dormidas</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Fadiga (PSE)</span>
                          <div className="text-lg font-black text-slate-800">{latestCheckin.pse}/10</div>
                          <span className="text-[10px] text-slate-500">Esforço relatado</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Dor (EVA)</span>
                          <div className="text-lg font-black text-slate-800">{latestCheckin.eva}/10</div>
                          <span className="text-[10px] text-slate-500">Dor muscular</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-purple-900">Índice de Prontidão (Readiness)</span>
                          <p className="text-xs text-purple-700">
                            {latestCheckin.readinessScore >= 80 
                              ? 'Excelente recuperação. Carga liberada para intensidade máxima.' 
                              : 'Carga moderada recomendada.'}
                          </p>
                        </div>
                        <span className="text-base font-black text-purple-700">
                          {latestCheckin.readinessScore}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Nenhum questionário de bem-estar preenchido recentemente.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. SUB-ABA: DADOS DO CADASTRO (NOVA ABA DE EDIÇÃO COMPLETA) */}
      {activeTab === 'dados_cadastro' && (
        <form onSubmit={handleSaveCadastro} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Dados do Cadastro & Foto do Perfil
              </h2>
              <p className="text-xs text-slate-500">
                Altere informações pessoais, foto oficial, plano ativo, datas de vencimento e histórico médico
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>

          {/* Card Minimizável 1: Gestão da Foto do Aluno */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleCard('cad-foto')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Foto do Aluno & Identificação Visual</h3>
                  <p className="text-xs text-slate-500">Upload de imagem, foto por link ou uso de ícone padrão</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('cad-foto') ? 'Recolher' : 'Expandir (Configurar Foto)'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('cad-foto') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('cad-foto') && (
              <div className="p-6 border-t border-slate-100 space-y-6 bg-slate-50/30 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Pré-visualização da Foto */}
                  <div className="relative group shrink-0">
                    {formData.photo && formData.photo.trim() !== '' ? (
                      <img
                        src={formData.photo}
                        alt="Preview"
                        className="h-28 w-28 rounded-2xl object-cover border-2 border-slate-200 shadow-md ring-4 ring-slate-100"
                      />
                    ) : (
                      <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 border-slate-200 shadow-md ring-4 ring-slate-100 flex flex-col items-center justify-center text-slate-300">
                        <User className="h-12 w-12 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Ícone Padrão</span>
                      </div>
                    )}
                  </div>

                  {/* Controles de Foto */}
                  <div className="space-y-3 flex-1 w-full">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL da Imagem / Foto do Aluno
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={formData.photo}
                          onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                          placeholder="https://exemplo.com/foto-do-aluno.jpg"
                          className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {formData.photo && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, photo: '' }));
                              showToast('Foto removida. O aluno usará o ícone padrão.');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 cursor-pointer"
                            title="Remover foto e usar ícone padrão"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remover</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Upload de arquivo direto */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer shadow-xs">
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        <span>Carregar Foto do Computador/Celular</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, photo: '' }));
                          showToast('Foto desativada. Ícone de perfil configurado.');
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Usar ícone de perfil no lugar de foto
                      </button>
                    </div>

                    {/* Presets Rápidos */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                        Ou selecione um avatar rápido:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_PRESETS.map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, photo: preset.url }));
                              showToast(`Foto alterada para "${preset.label}"`);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium hover:bg-slate-100 cursor-pointer"
                          >
                            <img src={preset.url} alt={preset.label} className="w-4 h-4 rounded-full object-cover" />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Minimizável 2: Informações Pessoais */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleCard('cad-pessoal')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Informações Pessoais & Contato</h3>
                  <p className="text-xs text-slate-500">Nome, CPF, data de nascimento, telefone e e-mail</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('cad-pessoal') ? 'Recolher' : 'Expandir (Editar)'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('cad-pessoal') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('cad-pessoal') && (
              <div className="p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Matrícula / Código</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Cadastral *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card Minimizável 3: Plano & Situação Financeira */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleCard('cad-plano')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Plano, Valores & Vencimento</h3>
                  <p className="text-xs text-slate-500">Contrato, mensalidade, data de vencimento e situação cadastral</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('cad-plano') ? 'Recolher' : 'Expandir (Editar)'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('cad-plano') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('cad-plano') && (
              <div className="p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plano da Academia</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => {
                      const selected = INITIAL_PLANS.find(p => p.id === e.target.value);
                      if (selected) {
                        setFormData(prev => ({
                          ...prev,
                          planId: selected.id,
                          planName: selected.name,
                          planPrice: selected.price
                        }));
                      }
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {INITIAL_PLANS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {formatCurrency(p.price)} ({p.billingCycle})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome Personalizado do Plano</label>
                  <input
                    type="text"
                    value={formData.planName}
                    onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valor da Mensalidade (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.planPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, planPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data do Próximo Vencimento</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Situação Cadastral</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as StudentStatus }))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none capitalize"
                  >
                    <option value="ativo">Ativo (Acesso Liberado)</option>
                    <option value="inadimplente">Inadimplente (Débito em Aberto)</option>
                    <option value="trancado">Trancado (Matrícula Pausada)</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Card Minimizável 4: Observações Clínicas & Histórico Médico */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleCard('cad-obs')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Observações Clínicas & Histórico Médico</h3>
                  <p className="text-xs text-slate-500">Lesões prévias, restrições ortopédicas e metas do aluno</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('cad-obs') ? 'Recolher' : 'Expandir (Editar)'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('cad-obs') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('cad-obs') && (
              <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/30 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notas Médicas, Restrições & Orientações aos Treinadores
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Ex: Hérnia de disco L4-L5, evitar agachamento livre pesado. Objetivo: hipertrofia de membros superiores e condicionamento aeróbico."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card Minimizável 5: Conformidade LGPD & Direitos do Titular */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleCard('cad-lgpd')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Conformidade LGPD & Proteção de Dados (Lei nº 13.709/2018)</h3>
                  <p className="text-xs text-slate-500">Termo de consentimento, exportação de dados (Portabilidade) e eliminação definitiva</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('cad-lgpd') ? 'Recolher' : 'Expandir (LGPD)'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('cad-lgpd') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('cad-lgpd') && (
              <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/30 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Status de Consentimento</span>
                    <strong className={currentStudent.consentLgpd ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                      {currentStudent.consentLgpd ? "✓ Consentimento Ativo" : "⚠ Pendente de Assinatura"}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Data de Registro</span>
                    <strong className="text-slate-800">{currentStudent.consentLgpdDate ? formatDate(currentStudent.consentLgpdDate) : "N/A"}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Versão do Termo</span>
                    <strong className="text-slate-800">{currentStudent.consentLgpdVersion || "2026-11"}</strong>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/lgpd/export/${currentStudent.id}`);
                        const data = await res.json();
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `lgpd_export_${currentStudent.id}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        showToast("Exportação LGPD baixada com sucesso!");
                      } catch (err) {
                        showToast("Erro ao exportar relatório LGPD.");
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Exportar Relatório Completo (Portabilidade LGPD JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`ATENÇÃO LGPD: Confirma a eliminação e anonimização permanente de todos os dados do aluno ${currentStudent.name}? Esta ação é irreversível.`)) {
                        if (confirm(`SEGUNDA CONFIRMAÇÃO: Confirma o expurgo dos dados pessoais de ${currentStudent.name}?`)) {
                          try {
                            const res = await fetch(`/api/lgpd/delete/${currentStudent.id}`, { method: 'DELETE' });
                            const data = await res.json();
                            showToast(data.message || "Dados expurgados com sucesso.");
                            onBack();
                          } catch (err) {
                            showToast("Erro ao expurgar dados LGPD.");
                          }
                        }
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Direito ao Esquecimento (Expurgar Dados LGPD)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Envio Inferior */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações do Aluno</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. SUB-ABA: TREINOS */}
      {activeTab === 'treinos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Prescrição de Treinos do Aluno</h2>
              <p className="text-xs text-slate-500">Planos, divisões periodizadas, cargas e exercícios</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const cardIds = studentWorkouts.map(w => `tr-${w.id}`);
                  expandAllInTab(cardIds);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 cursor-pointer flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Expandir Todos
              </button>
              <button
                onClick={() => {
                  const cardIds = studentWorkouts.map(w => `tr-${w.id}`);
                  collapseAllInTab(cardIds);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer flex items-center gap-1"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Recolher Todos
              </button>
              <button
                onClick={() => onNavigateToTab?.('treino')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer ml-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Prescrever Novo Treino</span>
              </button>
            </div>
          </div>

          {studentWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {studentWorkouts.map((workout) => {
                const cardId = `tr-${workout.id}`;
                const isExpanded = isCardExpanded(cardId);
                return (
                  <div key={workout.id} className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-all">
                    <div 
                      onClick={() => toggleCard(cardId)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                          <Dumbbell className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{workout.title}</h3>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                              {workout.frequency || 'Semanal'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Objetivo: <strong>{workout.objective || (workout as any).goal || 'Hipertrofia e Condicionamento'}</strong> • Nível: {workout.level}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const summary = `🏋️ *Treino GL PRO FIT:* ${workout.title}\nObjetivo: ${workout.objective || (workout as any).goal || 'Geral'}\nFrequência: ${workout.frequency || 'Semanal'}\nBons treinos, ${currentStudent.name}!`;
                            handleSendWhatsApp(summary);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 pl-2">
                          <span>{isExpanded ? 'Recolher' : 'Expandir'}</span>
                          <div className="p-1 rounded-md bg-slate-100 text-slate-600">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-slate-100 bg-slate-50/30 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(workout.splits || (workout as any).divisions || []).map((split: any, dIdx: number) => (
                            <div key={dIdx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-xs font-black text-slate-900">
                                  {split.name || `Divisão ${split.letter || dIdx + 1}`}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">
                                  {(split.exercises || []).length} exercícios
                                </span>
                              </div>

                              <div className="space-y-2">
                                {(split.exercises || []).map((ex: any, eIdx: number) => (
                                  <div key={eIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                                    <div>
                                      <span className="font-bold text-slate-800">{ex.name}</span>
                                      <span className="text-[10px] text-slate-400 block">{ex.muscleGroup}</span>
                                    </div>
                                    <div className="text-right font-mono">
                                      <span className="font-bold text-blue-700">{ex.sets}x{ex.reps}</span>
                                      {ex.weightKg && <span className="text-[11px] text-slate-500 ml-1.5">({ex.weightKg} kg)</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 space-y-3">
              <Dumbbell className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Nenhum treino específico vinculado a este aluno.</p>
              <button
                onClick={() => onNavigateToTab?.('treino')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Abrir Módulo de Treinos
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. SUB-ABA: AVALIAÇÕES FÍSICAS */}
      {activeTab === 'avaliacoes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Avaliações Físicas & Composição Corporal</h2>
              <p className="text-xs text-slate-500">Protocolos Pollock, bioimpedância, perímetros e dobras cutâneas</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const cardIds = studentAssessments.map(a => `av-${a.id}`);
                  expandAllInTab(cardIds);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 cursor-pointer flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Expandir Todos
              </button>
              <button
                onClick={() => {
                  const cardIds = studentAssessments.map(a => `av-${a.id}`);
                  collapseAllInTab(cardIds);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer flex items-center gap-1"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Recolher Todos
              </button>
              <button
                onClick={() => onNavigateToTab?.('avaliacoes')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer ml-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Avaliação</span>
              </button>
            </div>
          </div>

          {studentAssessments.length > 0 ? (
            <div className="space-y-4">
              {studentAssessments.map((av) => {
                const cardId = `av-${av.id}`;
                const isExpanded = isCardExpanded(cardId);
                return (
                  <div key={av.id} className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-all">
                    <div 
                      onClick={() => toggleCard(cardId)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                          <Scale className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{av.protocolName}</h3>
                            <span className="text-xs font-bold text-slate-500">Data: {formatDate(av.date)}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Avaliador: {av.evaluator} • Objetivo: <strong>{av.objective}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {av.bodyComp?.bodyFatPercent ? `${av.bodyComp.bodyFatPercent}% Gordura` : 'Normal'}
                        </span>

                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 pl-2">
                          <span>{isExpanded ? 'Recolher' : 'Expandir'}</span>
                          <div className="p-1 rounded-md bg-slate-100 text-slate-600">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-slate-100 space-y-4 bg-slate-50/30 animate-in fade-in duration-200">
                        {/* Métricas Principais */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 rounded-2xl bg-white text-center border border-slate-200/80 shadow-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Peso Total</span>
                            <div className="text-lg font-black text-slate-800">{av.weightKg} kg</div>
                          </div>
                          <div className="p-3 rounded-2xl bg-white text-center border border-slate-200/80 shadow-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Massa Magra</span>
                            <div className="text-lg font-black text-emerald-600">{av.bodyComp?.leanMassKg || 62} kg</div>
                          </div>
                          <div className="p-3 rounded-2xl bg-white text-center border border-slate-200/80 shadow-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Massa Gorda</span>
                            <div className="text-lg font-black text-rose-600">{av.bodyComp?.fatMassKg || 12} kg</div>
                          </div>
                          <div className="p-3 rounded-2xl bg-white text-center border border-slate-200/80 shadow-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">IMC</span>
                            <div className="text-lg font-black text-blue-600">{av.bmi} kg/m²</div>
                          </div>
                        </div>

                        {/* Dobras Cutâneas se disponíveis */}
                        {av.skinfolds && (
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                            <span className="text-xs font-bold text-slate-800 block">
                              Dobras Cutâneas (mm) • Soma Total: {av.skinfolds.total} mm
                            </span>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                              {Object.entries(av.skinfolds).filter(([k]) => k !== 'total').map(([key, val]) => (
                                <div key={key} className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                                  <span className="text-[10px] text-slate-400 capitalize block">{key}</span>
                                  <span className="font-mono font-bold text-slate-800">{val} mm</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 space-y-3">
              <Scale className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Nenhuma avaliação física cadastrada no histórico.</p>
              <button
                onClick={() => onNavigateToTab?.('avaliacoes')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Cadastrar Avaliação
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. SUB-ABA: BEM-ESTAR & PRONTIDÃO */}
      {activeTab === 'bem_estar' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Questionários Diários de Recuperação (Wellness)</h2>
              <p className="text-xs text-slate-500">Controle de sono, estresse, dor muscular (DOMS) e prontidão</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const cardIds = studentCheckins.map(c => `chk-${c.id}`);
                  expandAllInTab(cardIds);
                }}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 cursor-pointer flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Expandir Todos
              </button>
              <button
                onClick={() => {
                  const cardIds = studentCheckins.map(c => `chk-${c.id}`);
                  collapseAllInTab(cardIds);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer flex items-center gap-1"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Recolher Todos
              </button>
              <button
                onClick={() => onNavigateToTab?.('bem_estar')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs cursor-pointer ml-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Check-in</span>
              </button>
            </div>
          </div>

          {studentCheckins.length > 0 ? (
            <div className="space-y-4">
              {studentCheckins.map((chk) => {
                const cardId = `chk-${chk.id}`;
                const isExpanded = isCardExpanded(cardId);
                return (
                  <div key={chk.id} className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-all">
                    <div 
                      onClick={() => toggleCard(cardId)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">Data: {formatDate(chk.date)}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                              {chk.period}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Sono: {chk.sleepHours}h ({chk.sleepQuality}/5) • Esforço PSE: {chk.pse}/10
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          chk.readinessScore >= 80 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : chk.readinessScore >= 60 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          Prontidão: {chk.readinessScore}%
                        </span>

                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 pl-2">
                          <span>{isExpanded ? 'Recolher' : 'Expandir'}</span>
                          <div className="p-1 rounded-md bg-slate-100 text-slate-600">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-slate-100 space-y-3 bg-slate-50/30 animate-in fade-in duration-200">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Sono</span>
                            <div className="font-bold text-slate-800">{chk.sleepQuality}/5 ({chk.sleepHours}h)</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Esforço (PSE)</span>
                            <div className="font-bold text-slate-800">{chk.pse}/10</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Dor (EVA)</span>
                            <div className="font-bold text-slate-800">{chk.eva}/10</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Estresse</span>
                            <div className="font-bold text-slate-800">{chk.stressLevel}/10</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Humor</span>
                            <div className="font-bold text-slate-800">{chk.moodState}/10</div>
                          </div>
                        </div>

                        {chk.notes && (
                          <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 italic">
                            "{chk.notes}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-400">
              Nenhum registro de check-in encontrado para este perfil.
            </div>
          )}
        </div>
      )}

      {/* 6. SUB-ABA: FINANCEIRO COM BOTÃO DE VENDER */}
      {activeTab === 'financeiro' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Histórico Financeiro & Lançamentos</h2>
              <p className="text-xs text-slate-500">Faturas, mensalidades, quitações e vendas registradas para este aluno</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* BOTÃO DE VENDER PLANO, PRODUTO OU SERVIÇO */}
              <button
                onClick={() => {
                  setVendaSelectedId(INITIAL_PLANS[0]?.id || '');
                  setVendaTipo('plano');
                  setShowVenderModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>+ Vender (Plano, Produto ou Serviço)</span>
              </button>

              {currentStudent.status === 'inadimplente' && (
                <button
                  onClick={() => {
                    onSettleStudentPayment(currentStudent.id);
                    setCurrentStudent(prev => ({ ...prev, status: 'ativo', pendingAmount: 0 }));
                    showToast('Pagamento regularizado!');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Quitar Débito
                </button>
              )}
            </div>
          </div>

          {/* Card Minimizável: Resumo de Faturamento */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleCard('fin-resumo')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Resumo de Cobrança do Aluno</h3>
                  <p className="text-xs text-slate-500">
                    Plano ativo: {currentStudent.planName} • Mensalidade: {formatCurrency(currentStudent.planPrice)} • Vencimento: dia {currentStudent.dueDate?.slice(-2) || '10'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('fin-resumo') ? 'Recolher' : 'Expandir'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('fin-resumo') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('fin-resumo') && (
              <div className="p-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/30 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Pago</span>
                  <div className="text-lg font-black text-emerald-600">
                    {formatCurrency(studentTransactions.filter(t => t.status === 'pago').reduce((acc, t) => acc + t.amount, 0))}
                  </div>
                  <span className="text-[11px] text-slate-500">Faturas quitadas</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pendente / Em Aberto</span>
                  <div className={`text-lg font-black ${currentStudent.pendingAmount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {formatCurrency(currentStudent.pendingAmount)}
                  </div>
                  <span className="text-[11px] text-slate-500">Débito total</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mensalidade Vigente</span>
                  <div className="text-lg font-black text-blue-700">
                    {formatCurrency(currentStudent.planPrice)}
                  </div>
                  <span className="text-[11px] text-slate-500">{currentStudent.planName}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total de Lançamentos</span>
                  <div className="text-lg font-black text-slate-800">
                    {studentTransactions.length} transações
                  </div>
                  <span className="text-[11px] text-slate-500">Histórico completo</span>
                </div>
              </div>
            )}
          </div>

          {/* Tabela de Transações */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Extrato de Lançamentos ({studentTransactions.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Descrição</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Vencimento</th>
                    <th className="py-3 px-4">Forma</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {studentTransactions.length > 0 ? (
                    studentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {tx.description}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {tx.category}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono">
                          {formatDate(tx.dueDate || tx.date)}
                        </td>
                        <td className="py-3 px-4 text-slate-600 uppercase font-semibold">
                          {tx.paymentMethod}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tx.status === 'pago'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : tx.status === 'vencido'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Nenhuma transação financeira registrada para este aluno.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* 8. SUB-ABA: NUTRIÇÃO & DIETA */}
      {activeTab === 'nutricao' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Plano Nutricional & Metas Calóricas</h2>
              <p className="text-xs text-slate-500">Distribuição de macronutrientes, hidratação e refeições diárias</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  expandAllInTab(['nut-metas', 'nut-refeicoes']);
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 cursor-pointer flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Expandir Todos
              </button>
              <button
                onClick={() => {
                  collapseAllInTab(['nut-metas', 'nut-refeicoes']);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer flex items-center gap-1"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Recolher Todos
              </button>
              <button
                onClick={() => onNavigateToTab?.('nutricao')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer ml-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajustar Dieta</span>
              </button>
            </div>
          </div>

          {/* Card Minimizável 1: Metas de Macronutrientes */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleCard('nut-metas')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Metas Calóricas & Macronutrientes</h3>
                  <p className="text-xs text-slate-500">
                    GET Estimado: {nutritionPlan.get} kcal • Água: {nutritionPlan.waterLiters}L • Proteína: {nutritionPlan.proteinGrams}g
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('nut-metas') ? 'Recolher' : 'Expandir'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('nut-metas') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('nut-metas') && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/30 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gasto Diário (GET)</span>
                    <div className="text-xl font-black text-slate-900">{nutritionPlan.get} kcal</div>
                    <span className="text-[11px] text-slate-500">TMB: {nutritionPlan.tmb} kcal</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proteínas (2g/kg)</span>
                    <div className="text-xl font-black text-blue-700">{nutritionPlan.proteinGrams} g</div>
                    <span className="text-[11px] text-slate-500">Reparação muscular</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Carboidratos</span>
                    <div className="text-xl font-black text-amber-700">{nutritionPlan.carbGrams} g</div>
                    <span className="text-[11px] text-slate-500">Energia para o treino</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hidratação Mínima</span>
                    <div className="text-xl font-black text-cyan-600">{nutritionPlan.waterLiters} L</div>
                    <span className="text-[11px] text-slate-500">Água diária recomendada</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Minimizável 2: Cardápio Programado */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleCard('nut-refeicoes')}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Salad className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Cardápio & Refeições Diárias</h3>
                  <p className="text-xs text-slate-500">{nutritionPlan.meals.length} refeições estruturadas ao longo do dia</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isCardExpanded('nut-refeicoes') ? 'Recolher' : 'Expandir'}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                  {isCardExpanded('nut-refeicoes') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {isCardExpanded('nut-refeicoes') && (
              <div className="p-5 border-t border-slate-100 space-y-3 bg-slate-50/30 animate-in fade-in duration-200">
                {nutritionPlan.meals.map((meal, mIdx) => (
                  <div key={mIdx} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                        {meal.time}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{meal.name}</span>
                    </div>
                    <div className="text-xs text-slate-600 max-w-xl">
                      {meal.items}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE VENDA RÁPIDA (PLANO, PRODUTO OU SERVIÇO) */}
      {showVenderModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Vender para {currentStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Venda rápida de plano de academia, produtos da loja/lanchonete ou serviços
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowVenderModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulário de Venda */}
            <form onSubmit={handleConcluirVenda} className="p-6 space-y-5">
              
              {/* Seleção do Tipo de Venda: Plano, Produto ou Serviço */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  1. O que você deseja vender?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'plano', label: 'Plano Academia', icon: Dumbbell },
                    { id: 'produto', label: 'Produto / Lanchonete', icon: Package },
                    { id: 'servico', label: 'Serviço Especial', icon: Award }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setVendaTipo(id as any);
                        if (id === 'plano') setVendaSelectedId(INITIAL_PLANS[0]?.id || '');
                        if (id === 'produto') setVendaSelectedId(INITIAL_PRODUCTS[0]?.id || '');
                        if (id === 'servico') setVendaSelectedId(SERVICOS_ACADEMIA[0]?.id || '');
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        vendaTipo === id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1 text-emerald-600" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seção 2: Escolha do Item */}
              {vendaTipo === 'plano' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800">
                    Selecione o Plano Desejado
                  </label>
                  <select
                    value={vendaSelectedId}
                    onChange={(e) => setVendaSelectedId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {INITIAL_PLANS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatCurrency(p.price)} / {p.billingCycle}
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={vendaAtualizarPlano}
                      onChange={(e) => setVendaAtualizarPlano(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Atualizar o plano contratado do aluno imediatamente no cadastro</span>
                  </label>
                </div>
              )}

              {vendaTipo === 'produto' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Selecione o Produto (Loja / Lanchonete)
                      </label>
                      <select
                        value={vendaSelectedId}
                        onChange={(e) => setVendaSelectedId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {INITIAL_PRODUCTS.map(prod => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} ({formatCurrency(prod.price)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={vendaQuantity}
                        onChange={(e) => setVendaQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-center text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {vendaTipo === 'servico' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Selecione o Serviço Especial
                      </label>
                      <select
                        value={vendaSelectedId}
                        onChange={(e) => setVendaSelectedId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {SERVICOS_ACADEMIA.map(srv => (
                          <option key={srv.id} value={srv.id}>
                            {srv.name} — {formatCurrency(srv.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={vendaQuantity}
                        onChange={(e) => setVendaQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-center text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Seção 3: Forma de Pagamento & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={vendaPaymentMethod}
                    onChange={(e) => setVendaPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="pix">PIX (Chave Instantânea)</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="dinheiro">Dinheiro em Espécie</option>
                    <option value="boleto">Boleto Bancário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status da Cobrança
                  </label>
                  <select
                    value={vendaStatus}
                    onChange={(e) => setVendaStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="pago">Pago / Quitado Imediatamente</option>
                    <option value="pendente">Pendente (Lançar Débito a Prazo)</option>
                  </select>
                </div>
              </div>

              {/* Observações adicionais */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observações da Venda (Opcional)
                </label>
                <input
                  type="text"
                  value={vendaNotes}
                  onChange={(e) => setVendaNotes(e.target.value)}
                  placeholder="Ex: Desconto de boas-vindas / Cortesia primeiro mês"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Resumo do Total & Botão de Conclusão */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Valor Total da Venda
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {formatCurrency(
                      vendaTipo === 'plano'
                        ? (INITIAL_PLANS.find(p => p.id === vendaSelectedId)?.price || 0)
                        : vendaTipo === 'produto'
                          ? (INITIAL_PRODUCTS.find(p => p.id === vendaSelectedId)?.price || 0) * vendaQuantity
                          : (SERVICOS_ACADEMIA.find(s => s.id === vendaSelectedId)?.price || 0) * vendaQuantity
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVenderModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Venda</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
