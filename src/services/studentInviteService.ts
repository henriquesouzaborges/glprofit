import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import {
  CompanyStudentLink,
  EmpresaCliente,
  LinkedStudentInfo,
  StudentRegistrationInvite,
  SystemUser
} from '../types';
import { auth, db, saveDocToFirestore } from './firebaseDbService';

export const MATRIX_UNIT_COMPANY_ID = 'matriz-gl-pro-fit';
const INVITES_STORAGE_KEY = 'glprofit_student_invites';
const LINKS_STORAGE_KEY = 'glprofit_company_student_links';

export function isLegacyPlaceholderCompanyName(name?: string): boolean {
  if (!name) return false;
  const normalized = name.trim().toLowerCase();
  return normalized.includes('vb sport') || normalized.includes('vbsport');
}

export function sanitizeGymSettings<
  T extends { gymName?: string; tradeName?: string; email?: string; welcomeMessage?: string }
>(raw: T): T {
  const next = { ...raw };
  if (isLegacyPlaceholderCompanyName(next.gymName)) {
    next.gymName = 'GL PRO FIT';
  }
  if (isLegacyPlaceholderCompanyName(next.tradeName)) {
    next.tradeName = 'GL PRO FIT';
  }
  if (next.email && /vbsport/i.test(next.email)) {
    next.email = 'contato@glprofit.com.br';
  }
  if (next.welcomeMessage && /vb\s*sport/i.test(next.welcomeMessage)) {
    next.welcomeMessage = 'Bem-vindo ao GL PRO FIT!';
  }
  return next;
}

export function resolveRegisteredMainCompanyName(
  settings?: { gymName?: string; tradeName?: string } | null
): string {
  if (!settings) return 'GL PRO FIT';
  const cleanTrade = isLegacyPlaceholderCompanyName(settings.tradeName)
    ? ''
    : (settings.tradeName || '').trim();
  const cleanGym = isLegacyPlaceholderCompanyName(settings.gymName)
    ? ''
    : (settings.gymName || '').trim();

  if (cleanTrade && cleanTrade !== 'GL PRO FIT Academia' && cleanTrade !== 'GL PRO FIT') {
    return cleanTrade;
  }
  if (cleanGym && cleanGym !== 'GL PRO FIT') {
    return cleanGym;
  }
  return cleanGym || cleanTrade || 'GL PRO FIT';
}

export interface ResolvedCompanyContext {
  id: string;
  name: string;
  email?: string;
  logoUrl?: string;
  isMatrix: boolean;
  empresaRecord?: EmpresaCliente;
}

const isMasterAdminUser = (user?: SystemUser | null): boolean => {
  if (!user) return false;
  return (
    user.email?.trim().toLowerCase() === 'glprofit.adm@gmail.com' ||
    user.id === 'admin-master-01'
  );
};

export function resolveActiveEmpresaForUser(
  user?: SystemUser | null,
  empresas: EmpresaCliente[] = [],
  gymName?: string
): ResolvedCompanyContext {
  if (user) {
    const userCompanyRef = user.companyId || user.empresaId;
    if (userCompanyRef && userCompanyRef !== MATRIX_UNIT_COMPANY_ID) {
      const byId = empresas.find(e => e.id === userCompanyRef);
      if (byId) {
        return {
          id: byId.id,
          name: byId.name,
          email: byId.email,
          logoUrl: byId.logoUrl,
          isMatrix: false,
          empresaRecord: byId
        };
      }
      if (user.empresaName) {
        return {
          id: userCompanyRef,
          name: user.empresaName,
          email: user.email,
          isMatrix: false
        };
      }
    }

    const cleanEmail = (user.email || '').trim().toLowerCase();
    if (cleanEmail && !isMasterAdminUser(user)) {
      const byEmail = empresas.find(
        e => (e.email || '').trim().toLowerCase() === cleanEmail
      );
      if (byEmail) {
        return {
          id: byEmail.id,
          name: byEmail.name,
          email: byEmail.email,
          logoUrl: byEmail.logoUrl,
          isMatrix: false,
          empresaRecord: byEmail
        };
      }
    }
  }

  const safeGymName =
    gymName && gymName.trim() && !isLegacyPlaceholderCompanyName(gymName)
      ? gymName.trim()
      : 'GL PRO FIT';

  return {
    id: MATRIX_UNIT_COMPANY_ID,
    name: safeGymName,
    email: user?.email,
    isMatrix: true
  };
}

export function isCompanyScopedUser(
  user?: SystemUser | null,
  empresas: EmpresaCliente[] = []
): boolean {
  if (!user || isMasterAdminUser(user)) return false;
  const resolved = resolveActiveEmpresaForUser(user, empresas);
  return !resolved.isMatrix;
}

export function getStoredStudentInvites(): StudentRegistrationInvite[] {
  try {
    const raw = localStorage.getItem(INVITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStudentInvitesToStorage(invites: StudentRegistrationInvite[]): void {
  try {
    localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(invites));
  } catch (err) {
    console.warn('Erro ao salvar convites localmente:', err);
  }
}

export function getStoredCompanyStudentLinks(): CompanyStudentLink[] {
  try {
    const raw = localStorage.getItem(LINKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCompanyStudentLinksToStorage(links: CompanyStudentLink[]): void {
  try {
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
  } catch (err) {
    console.warn('Erro ao salvar vínculos empresa-aluno localmente:', err);
  }
}

export function buildStudentRegistrationUrl(params: {
  inviteId: string;
  empresaId: string;
  empresaName: string;
  invitedByUserId?: string;
  studentName?: string;
  studentEmail?: string;
}): string {
  const origin =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : '';
  const query = new URLSearchParams();
  query.set('view', 'cadastro');
  query.set('invite', params.inviteId);
  query.set('companyId', params.empresaId);
  query.set('empresaId', params.empresaId);
  query.set('empresa', params.empresaName);
  if (params.invitedByUserId) query.set('invitedBy', params.invitedByUserId);
  if (params.studentName?.trim()) query.set('name', params.studentName.trim());
  if (params.studentEmail?.trim()) query.set('email', params.studentEmail.trim().toLowerCase());
  return `${origin}?${query.toString()}`;
}

export async function createStudentRegistrationInvite(
  invite: StudentRegistrationInvite
): Promise<StudentRegistrationInvite> {
  const enrichedInvite: StudentRegistrationInvite = {
    ...invite,
    companyId: invite.companyId || invite.empresaId
  };
  const current = getStoredStudentInvites();
  const next = [enrichedInvite, ...current.filter(i => i.id !== enrichedInvite.id)];
  saveStudentInvitesToStorage(next);

  if (auth?.currentUser) {
    try {
      await saveDocToFirestore('student_invites', enrichedInvite);
    } catch (err) {
      console.warn('Aviso ao persistir convite no Firestore:', err);
    }
  }

  return enrichedInvite;
}

export async function fetchStudentInviteById(
  inviteId: string
): Promise<StudentRegistrationInvite | null> {
  if (!inviteId) return null;
  const local = getStoredStudentInvites().find(i => i.id === inviteId);
  if (local) return local;

  try {
    const snap = await getDoc(doc(db, 'student_invites', inviteId));
    if (snap.exists()) {
      return snap.data() as StudentRegistrationInvite;
    }
  } catch (err) {
    console.warn('Erro ao buscar convite por ID no Firestore:', err);
  }
  return null;
}

export interface LinkStudentRegistrationParams {
  empresaId: string;
  empresaName: string;
  userId: string;
  studentId: string;
  email: string;
  studentName: string;
  inviteId?: string;
  invitedByUserId?: string;
  invitedByEmail?: string;
}

export async function recordCompanyStudentLink(
  params: LinkStudentRegistrationParams
): Promise<CompanyStudentLink> {
  const cleanEmail = params.email.trim().toLowerCase();
  const safeUserId = params.userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeEmpresaId = params.empresaId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const linkId = `lnk-${safeEmpresaId}-${safeUserId}`;
  const nowIso = new Date().toISOString();

  const linkRecord: CompanyStudentLink = {
    id: linkId,
    empresaId: params.empresaId,
    companyId: params.empresaId,
    empresaName: params.empresaName,
    userId: params.userId,
    studentId: params.studentId,
    email: cleanEmail,
    studentName: params.studentName,
    inviteId: params.inviteId,
    invitedByUserId: params.invitedByUserId,
    invitedByEmail: params.invitedByEmail,
    linkedAt: nowIso
  };

  // 1. Update local links list
  const existingLinks = getStoredCompanyStudentLinks();
  const updatedLinks = [linkRecord, ...existingLinks.filter(l => l.id !== linkRecord.id)];
  saveCompanyStudentLinksToStorage(updatedLinks);

  // 2. Update local invite status if inviteId was provided
  if (params.inviteId) {
    const existingInvites = getStoredStudentInvites();
    const updatedInvites = existingInvites.map(inv =>
      inv.id === params.inviteId
        ? {
            ...inv,
            status: 'concluido' as const,
            registeredUserId: params.userId,
            registeredStudentId: params.studentId,
            registeredEmail: cleanEmail,
            completedAt: nowIso
          }
        : inv
    );
    saveStudentInvitesToStorage(updatedInvites);
  }

  // 3. Update local vbsport_empresas_clientes linkedStudents & linkedStudentIds
  try {
    const rawEmpresas = localStorage.getItem('vbsport_empresas_clientes');
    if (rawEmpresas) {
      const empresas: EmpresaCliente[] = JSON.parse(rawEmpresas);
      let modified = false;
      const nextEmpresas = empresas.map(emp => {
        if (emp.id !== params.empresaId) return emp;
        modified = true;
        const prevLinked = emp.linkedStudents || [];
        const entry: LinkedStudentInfo = {
          userId: params.userId,
          studentId: params.studentId,
          email: cleanEmail,
          name: params.studentName,
          registeredAt: nowIso,
          inviteId: params.inviteId
        };
        const filtered = prevLinked.filter(
          item => item.userId !== params.userId && item.email.toLowerCase() !== cleanEmail
        );
        const nextLinked = [entry, ...filtered];
        const nextIds = Array.from(
          new Set([...(emp.linkedStudentIds || []), params.userId])
        );
        return {
          ...emp,
          linkedStudents: nextLinked,
          linkedStudentIds: nextIds
        };
      });

      if (modified) {
        localStorage.setItem('vbsport_empresas_clientes', JSON.stringify(nextEmpresas));
      }
    }
  } catch (err) {
    console.warn('Erro ao atualizar empresa local com aluno vinculado:', err);
  }

  // 4. Persist link and invite completion in Firestore if Firebase Auth session is active
  if (auth?.currentUser) {
    try {
      await setDoc(doc(db, 'company_student_links', linkRecord.id), {
        ...linkRecord,
        inviteId: linkRecord.inviteId || null,
        invitedByUserId: linkRecord.invitedByUserId || null,
        invitedByEmail: linkRecord.invitedByEmail || null
      });
    } catch (err) {
      console.warn('Erro ao gravar company_student_links no Firestore:', err);
    }

    if (params.inviteId) {
      try {
        await updateDoc(doc(db, 'student_invites', params.inviteId), {
          status: 'concluido',
          registeredUserId: params.userId,
          registeredStudentId: params.studentId,
          registeredEmail: cleanEmail,
          completedAt: nowIso
        });
      } catch (err) {
        console.warn('Aviso ao concluir convite no Firestore:', err);
      }
    }

    // Attempt updating EmpresaCliente linkedStudents directly if permitted (admin/company owner)
    if (params.empresaId && params.empresaId !== MATRIX_UNIT_COMPANY_ID) {
      try {
        const empRef = doc(db, 'empresas_clientes', params.empresaId);
        const empSnap = await getDoc(empRef);
        if (empSnap.exists()) {
          const empData = empSnap.data() as EmpresaCliente;
          const prevLinked = empData.linkedStudents || [];
          const entry: LinkedStudentInfo = {
            userId: params.userId,
            studentId: params.studentId,
            email: cleanEmail,
            name: params.studentName,
            registeredAt: nowIso,
            inviteId: params.inviteId
          };
          const filtered = prevLinked.filter(
            item => item.userId !== params.userId && item.email.toLowerCase() !== cleanEmail
          );
          const nextLinked = [entry, ...filtered];
          const nextIds = Array.from(
            new Set([...(empData.linkedStudentIds || []), params.userId])
          );
          await updateDoc(empRef, {
            linkedStudents: nextLinked,
            linkedStudentIds: nextIds
          });
        }
      } catch (err) {
        // Non-fatal: company dashboard reconciles via company_student_links subscription
        console.warn('Vínculo será reconciliado automaticamente pelo perfil da empresa:', err);
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('glprofit_company_links_updated', { detail: linkRecord })
    );
  }

  return linkRecord;
}

export function reconcileEmpresasWithLinks(
  empresas: EmpresaCliente[],
  links: CompanyStudentLink[]
): EmpresaCliente[] {
  if (!links || links.length === 0) return empresas;
  let changed = false;

  const updated = empresas.map(emp => {
    const empLinks = links.filter(l => l.empresaId === emp.id);
    if (empLinks.length === 0) return emp;

    const existingMap = new Map<string, LinkedStudentInfo>();
    (emp.linkedStudents || []).forEach(item => {
      existingMap.set(item.userId || item.email.toLowerCase(), item);
    });

    let empChanged = false;
    empLinks.forEach(link => {
      const key = link.userId || link.email.toLowerCase();
      if (!existingMap.has(key)) {
        empChanged = true;
        existingMap.set(key, {
          userId: link.userId,
          studentId: link.studentId,
          email: link.email,
          name: link.studentName,
          registeredAt: link.linkedAt,
          inviteId: link.inviteId
        });
      }
    });

    if (!empChanged) return emp;
    changed = true;
    const nextLinked = Array.from(existingMap.values()).sort((a, b) =>
      (b.registeredAt || '').localeCompare(a.registeredAt || '')
    );
    const nextIds = Array.from(new Set(nextLinked.map(i => i.userId).filter(Boolean)));
    return {
      ...emp,
      linkedStudents: nextLinked,
      linkedStudentIds: nextIds
    };
  });

  return changed ? updated : empresas;
}
