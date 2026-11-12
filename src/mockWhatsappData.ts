import {
  WhatsappChat,
  WhatsappMessage,
  WhatsappCampaign,
  WhatsappQuickReply,
  WhatsappConnectionInfo,
  WhatsappChatbotFlow,
  WhatsappEtiqueta
} from './types';

export const INITIAL_WHATSAPP_CONNECTION: WhatsappConnectionInfo = {
  status: 'desconectado',
  companyName: 'GL PRO FIT',
  companyId: '',
  phone: '',
  batteryLevel: 0,
  isCharging: false,
  signalQuality: 'Sem sinal',
  webhookUrl: '',
  apiToken: '',
  provider: 'Multi-Device API (Meta Cloud Business)',
  connectedAt: ''
};

export const WHATSAPP_AGENTS = [
  { id: 'gianluca', name: 'Gianluca Marinho', role: 'Administrador & Diretoria', online: true, activeChats: 0 }
];

export const INITIAL_WHATSAPP_CHATS: WhatsappChat[] = [];

export const INITIAL_WHATSAPP_MESSAGES: Record<string, WhatsappMessage[]> = {};

export const INITIAL_WHATSAPP_CAMPAIGNS: WhatsappCampaign[] = [];

export const INITIAL_WHATSAPP_ETIQUETAS: WhatsappEtiqueta[] = [
  { id: 'eti-1', name: 'Aluno GL PRO FIT', color: 'emerald', textColor: 'text-emerald-800', bgColor: 'bg-emerald-100', description: 'Alunos matriculados na academia' },
  { id: 'eti-2', name: 'Lead CRM', color: 'blue', textColor: 'text-blue-800', bgColor: 'bg-blue-100', description: 'Oportunidades em prospecção' },
  { id: 'eti-3', name: 'Financeiro / PIX', color: 'purple', textColor: 'text-purple-800', bgColor: 'bg-purple-100', description: 'Assuntos financeiros e faturas' }
];

export const INITIAL_WHATSAPP_QUICK_REPLIES: WhatsappQuickReply[] = [
  {
    id: 'qr-1',
    shortcut: '/bemvindo',
    title: 'Boas-Vindas Padrão',
    message: 'Olá! Seja muito bem-vindo ao GL PRO FIT! Como posso te ajudar hoje?',
    category: 'Geral'
  },
  {
    id: 'qr-2',
    shortcut: '/pix',
    title: 'Chave PIX Oficial',
    message: 'Nossa chave PIX oficial (E-mail): financeiro@glprofit.com.br. Após a transferência, favor enviar o comprovante por aqui!',
    category: 'Financeiro'
  }
];

export const INITIAL_WHATSAPP_FLOWS: WhatsappChatbotFlow[] = [
  {
    id: 'flow-1',
    name: 'Atendimento Inicial & Escolha de Opções',
    active: true,
    triggerKeyword: 'Oi, Olá, Treino, Planos',
    stepsCount: 3,
    responseType: 'menu',
    description: 'Menu interativo inicial para direcionar novos contatos para recepção ou vendas'
  }
];
