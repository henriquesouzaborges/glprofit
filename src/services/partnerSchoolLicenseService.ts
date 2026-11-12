// Serviço de Gestão de Licenças e Contratos de Escolas Parceiras Terceirizadas
// Permite ao Administrador (Gianluca Marinho) gerenciar datas de vencimento, 
// avisos de renovação e ativar/desativar o banner de contrato para escolas parceiras.

import { SystemUser } from '../types';

export interface PartnerSchoolLicense {
  id: string;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  loginUsername: string;
  planName: string;
  planPrice: number;
  expirationDate: string; // YYYY-MM-DD
  isWarningBannerActive: boolean;
  customWarningMessage?: string;
  status: 'ativa' | 'vencendo' | 'expirada' | 'bloqueada';
  pixKey?: string;
  notes?: string;
  createdAt: string;
  lastNotifiedAt?: string;
}

const STORAGE_KEY = 'vbsport_partner_school_licenses';

export const INITIAL_PARTNER_LICENSES: PartnerSchoolLicense[] = [];

/**
 * Verifica se o usuário atual é o Administrador Master / Proprietário do Sistema (Gianluca Marinho)
 */
export const isMasterAdministrator = (user?: SystemUser | null): boolean => {
  if (!user) return true; // Default seguro para evitar exibição indevida
  const email = user.email?.trim().toLowerCase();
  return (
    email === 'marinho.gianluca@gmail.com' ||
    user.id === 'usr-1' ||
    (user.role === 'admin' && user.name.toLowerCase().includes('gianluca'))
  );
};

/**
 * Obtém todas as licenças de escolas parceiras cadastradas
 */
export const getPartnerSchoolLicenses = (): PartnerSchoolLicense[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Erro ao ler licenças de escolas parceiras:', err);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARTNER_LICENSES));
  return INITIAL_PARTNER_LICENSES;
};

/**
 * Salva as licenças com sincronização no Firestore
 */
export const savePartnerSchoolLicenses = (licenses: PartnerSchoolLicense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(licenses));
    // Sincronizar em nuvem se o serviço estiver disponível
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('partner_school_licenses', licenses);
    }).catch(() => {});
  } catch (err) {
    console.error('Erro ao salvar licenças de escolas parceiras:', err);
  }
};

/**
 * Calcula a contagem regressiva precisa de dias, horas e minutos para o vencimento
 */
export const calculateContractCountdown = (expirationDateStr: string) => {
  try {
    const [year, month, day] = expirationDateStr.split('-').map(Number);
    const expDate = new Date(year, month - 1, day, 23, 59, 59);
    const now = new Date();
    
    const diffMs = expDate.getTime() - now.getTime();
    if (diffMs <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        isExpired: true,
        isUrgent: true,
        formattedDays: '00',
        formattedHours: '00',
        formattedMinutes: '00'
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return {
      days,
      hours,
      minutes,
      isExpired: false,
      isUrgent: days <= 5,
      formattedDays: String(days).padStart(2, '0'),
      formattedHours: String(hours).padStart(2, '0'),
      formattedMinutes: String(minutes).padStart(2, '0')
    };
  } catch {
    return {
      days: 2,
      hours: 15,
      minutes: 13,
      isExpired: false,
      isUrgent: true,
      formattedDays: '02',
      formattedHours: '15',
      formattedMinutes: '13'
    };
  }
};

/**
 * Obtém a licença correspondente a um usuário parceiro (ou a primeira escola parceira caso simule)
 */
export const getLicenseForUser = (user?: SystemUser | null): PartnerSchoolLicense | null => {
  if (!user || isMasterAdministrator(user)) {
    return null; // O administrador master NUNCA tem card de contrato próprio
  }
  const licenses = getPartnerSchoolLicenses();
  const userEmail = user.email?.trim().toLowerCase();
  
  // Encontrar por email ou username
  const matched = licenses.find(l => 
    l.email.toLowerCase() === userEmail || 
    l.loginUsername.toLowerCase() === userEmail
  );
  
  if (matched) return matched;

  // Se o usuário é um perfil de parceiro mas ainda não tem licença específica, retorna a primeira com aviso ativo
  return licenses.find(l => l.isWarningBannerActive) || null;
};

/**
 * Gera mensagem formatada para WhatsApp de cobrança / aviso de renovação para a escola
 */
export const buildRenewalWhatsAppUrl = (license: PartnerSchoolLicense, adminName: string = 'Gianluca Marinho'): string => {
  const countdown = calculateContractCountdown(license.expirationDate);
  const expFormatted = new Date(`${license.expirationDate}T12:00:00`).toLocaleDateString('pt-BR');
  
  const text = `*COMUNICADO DE RENOVAÇÃO • GL PRO FIT / VB SPORT* 📋💼%0A%0A` +
    `Olá, *${license.contactName}*! Tudo bem?%0A%0A` +
    `Informamos que a licença de uso do sistema da *${license.schoolName}* está prevista para vencimento em *${expFormatted}* (${countdown.days} dia(s) restante(s)).%0A%0A` +
    `• *Plano:* ${license.planName}%0A` +
    `• *Valor da Renovação:* R$ ${license.planPrice.toFixed(2).replace('.', ',')}%0A` +
    `• *Chave PIX:* ${license.pixKey || 'marinho.gianluca@gmail.com'}%0A%0A` +
    `Para garantir a continuidade dos acessos ao sistema, app do aluno e financeiro sem interrupções, por favor envie o comprovante por aqui.%0A%0A` +
    `Atenciosamente,%0A*${adminName}* • GL PRO FIT Enterprise`;

  const cleanPhone = license.phone.replace(/\D/g, '');
  return `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${text}`;
};
