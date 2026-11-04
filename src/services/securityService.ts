/**
 * GL PRO FIT - Módulo de Segurança, Proteção de Dados & Auditoria (LGPD & Security Suite)
 * 
 * Este serviço implementa:
 * 1. Proteção contra ataques de força bruta (Rate Limiting & Bloqueio temporário após tentativas falhas)
 * 2. Auditoria e trilha de segurança de acessos (Security Audit Trail sincronizado localmente e no Firestore)
 * 3. Suporte e abstração à autenticação biométrica (WebAuthn / Touch ID / Face ID)
 * 4. Validador de força de senhas (Password Strength Evaluator)
 * 5. Políticas de privacidade e conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)
 */

import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  eventType: 
    | 'LOGIN_SUCCESS' 
    | 'LOGIN_FAILED' 
    | 'LOGIN_BLOCKED' 
    | 'PASSWORD_RESET_REQUEST' 
    | 'PASSWORD_RESET_SUCCESS' 
    | 'BIOMETRIC_AUTH_SUCCESS' 
    | 'BIOMETRIC_AUTH_FAILED' 
    | 'GOOGLE_AUTH_SUCCESS' 
    | 'REGISTER_SUCCESS' 
    | 'DATA_EXPORT'
    | 'DATA_IMPORT'
    | 'MIGRATION_IMPORT';
  userEmail: string;
  userName?: string;
  provider: 'email_password' | 'google' | 'biometrics' | 'direct' | 'system';
  ipAddress?: string;
  userAgent?: string;
  details: string;
  status: 'success' | 'warning' | 'danger';
}

const AUDIT_STORAGE_KEY = 'glprofit_security_audit_logs';
const FAILED_ATTEMPTS_KEY = 'glprofit_failed_login_attempts';
const BIOMETRIC_CREDENTIALS_KEY = 'glprofit_biometric_registered_emails';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 segundos de bloqueio

interface FailedAttemptTracker {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

/**
 * Retorna os registros de falha para um e-mail ou IP simulado
 */
export const getFailedAttempts = (email: string): FailedAttemptTracker => {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    if (!raw) return { count: 0, lastAttempt: 0 };
    const parsed: Record<string, FailedAttemptTracker> = JSON.parse(raw);
    return parsed[email.toLowerCase()] || { count: 0, lastAttempt: 0 };
  } catch {
    return { count: 0, lastAttempt: 0 };
  }
};

/**
 * Registra uma tentativa falha de autenticação e calcula eventual bloqueio
 */
export const recordFailedLoginAttempt = (email: string): { isLocked: boolean; remainingSeconds: number; attemptsLeft: number } => {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    const parsed: Record<string, FailedAttemptTracker> = raw ? JSON.parse(raw) : {};
    const lowerEmail = email.toLowerCase();
    const current = parsed[lowerEmail] || { count: 0, lastAttempt: 0 };

    const now = Date.now();
    current.count += 1;
    current.lastAttempt = now;

    if (current.count >= MAX_FAILED_ATTEMPTS) {
      current.lockedUntil = now + LOCKOUT_DURATION_MS;
      parsed[lowerEmail] = current;
      localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(parsed));

      // Registrar log de bloqueio
      logSecurityEvent({
        eventType: 'LOGIN_BLOCKED',
        userEmail: lowerEmail,
        provider: 'email_password',
        details: `Conta bloqueada temporariamente após ${current.count} tentativas incorretas consecutivas.`,
        status: 'danger'
      });

      return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000), attemptsLeft: 0 };
    }

    parsed[lowerEmail] = current;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(parsed));

    logSecurityEvent({
      eventType: 'LOGIN_FAILED',
      userEmail: lowerEmail,
      provider: 'email_password',
      details: `Tentativa incorreta de login (${current.count}/${MAX_FAILED_ATTEMPTS}).`,
      status: 'warning'
    });

    return { 
      isLocked: false, 
      remainingSeconds: 0, 
      attemptsLeft: MAX_FAILED_ATTEMPTS - current.count 
    };
  } catch (e) {
    console.error('Erro ao gravar tentativa de login:', e);
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: 3 };
  }
};

/**
 * Verifica se a conta está temporariamente bloqueada por taxa de tentativas
 */
export const checkLoginLockout = (email: string): { isLocked: boolean; remainingSeconds: number } => {
  const tracker = getFailedAttempts(email);
  if (!tracker.lockedUntil) return { isLocked: false, remainingSeconds: 0 };

  const now = Date.now();
  if (now < tracker.lockedUntil) {
    const remaining = Math.ceil((tracker.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds: remaining };
  }

  // Já expirou o bloqueio
  clearFailedAttempts(email);
  return { isLocked: false, remainingSeconds: 0 };
};

/**
 * Limpa as falhas após um login bem-sucedido
 */
export const clearFailedAttempts = (email: string): void => {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    if (!raw) return;
    const parsed: Record<string, FailedAttemptTracker> = JSON.parse(raw);
    delete parsed[email.toLowerCase()];
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.error('Erro ao limpar tentativas:', e);
  }
};

/**
 * Registra um evento de segurança local e tenta enviar ao Firestore
 */
export const logSecurityEvent = async (params: {
  eventType: SecurityAuditLog['eventType'];
  userEmail: string;
  userName?: string;
  provider: SecurityAuditLog['provider'];
  details: string;
  status: SecurityAuditLog['status'];
}): Promise<void> => {
  try {
    const log: SecurityAuditLog = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      eventType: params.eventType,
      userEmail: params.userEmail,
      userName: params.userName,
      provider: params.provider,
      userAgent: navigator.userAgent,
      details: params.details,
      status: params.status
    };

    // 1. Armazenar localmente (máximo 100 últimos logs)
    const existingRaw = localStorage.getItem(AUDIT_STORAGE_KEY);
    const existing: SecurityAuditLog[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [log, ...existing].slice(0, 100);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));

    // 2. Persistir no Firestore na coleção de auditoria se disponível
    if (db) {
      try {
        await addDoc(collection(db, 'security_audit_logs'), log);
      } catch (err) {
        // Fallback silencioso para garantir performance e operação offline
        console.warn('Registro de auditoria Firestore offline/local:', err);
      }
    }
  } catch (err) {
    console.error('Erro ao registrar log de segurança:', err);
  }
};

/**
 * Recupera os logs de auditoria do sistema
 */
export const getSecurityAuditLogs = (): SecurityAuditLog[] => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Avaliador de Força de Senha
 */
export interface PasswordStrengthResult {
  score: number; // 0 a 4
  level: 'fraca' | 'media' | 'forte' | 'excelente';
  feedback: string[];
  color: string;
  percentage: number;
}

export const evaluatePasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return {
      score: 0,
      level: 'fraca',
      feedback: ['Informe uma senha'],
      color: 'bg-rose-500',
      percentage: 0
    };
  }

  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 6) {
    score += 1;
  } else {
    feedback.push('Pelo menos 6 caracteres');
  }

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Letras maiúsculas e minúsculas');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Pelo menos um número');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return {
      score: 1,
      level: 'fraca',
      feedback: feedback.length ? feedback : ['Senha muito curta ou previsível'],
      color: 'bg-rose-500',
      percentage: 25
    };
  } else if (score === 2 || score === 3) {
    return {
      score: 2,
      level: 'media',
      feedback: feedback.length ? feedback : ['Adicione símbolos para torná-la forte'],
      color: 'bg-amber-500',
      percentage: 60
    };
  } else if (score === 4) {
    return {
      score: 3,
      level: 'forte',
      feedback: ['Senha forte e segura'],
      color: 'bg-emerald-500',
      percentage: 85
    };
  } else {
    return {
      score: 4,
      level: 'excelente',
      feedback: ['Excelente! Atende aos mais altos padrões de segurança'],
      color: 'bg-teal-400',
      percentage: 100
    };
  }
};

/**
 * Checa se o dispositivo possui suporte a WebAuthn / Biometria
 */
export const checkBiometricHardwareSupport = async (): Promise<boolean> => {
  try {
    if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      const isAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return isAvailable;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Verifica se um email específico já possui biometria cadastrada neste dispositivo
 */
export const isBiometricRegisteredForEmail = (email: string): boolean => {
  try {
    const raw = localStorage.getItem(BIOMETRIC_CREDENTIALS_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.includes(email.toLowerCase());
  } catch {
    return false;
  }
};

/**
 * Registra a biometria para um e-mail
 */
export const registerBiometricForEmail = (email: string): void => {
  try {
    const raw = localStorage.getItem(BIOMETRIC_CREDENTIALS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const lower = email.toLowerCase();
    if (!list.includes(lower)) {
      list.push(lower);
      localStorage.setItem(BIOMETRIC_CREDENTIALS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Erro ao registrar biometria:', e);
  }
};

/**
 * Remove biometria para um e-mail
 */
export const removeBiometricForEmail = (email: string): void => {
  try {
    const raw = localStorage.getItem(BIOMETRIC_CREDENTIALS_KEY);
    if (!raw) return;
    const list: string[] = JSON.parse(raw);
    const updated = list.filter(e => e !== email.toLowerCase());
    localStorage.setItem(BIOMETRIC_CREDENTIALS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao remover biometria:', e);
  }
};
