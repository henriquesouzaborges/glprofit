/**
 * GL PRO FIT - Access Log & Turnstile Service (Fase 2.1)
 * Gerenciamento de eventos de catraca virtual em tempo real
 * com fallback e histórico auditado.
 */

import { AccessLog } from '../types';
import { INITIAL_ACCESS_LOGS } from '../mockData';
import { USE_REAL_DATABASE } from '../lib/db';

const ACCESS_LOGS_KEY = 'vbsport_access_logs';
const ACCESS_LOGS_EVENT = 'gl_pro_fit_access_logs_updated';

class AccessLogService {
  /**
   * Obtém todo o histórico de registros da catraca
   */
  async getAll(): Promise<AccessLog[]> {
    try {
      const stored = localStorage.getItem(ACCESS_LOGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('[accessLogService] Erro ao ler logs de acesso:', e);
    }
    return INITIAL_ACCESS_LOGS;
  }

  /**
   * Registra uma nova passagem na catraca (Liberada ou Bloqueada)
   */
  async recordAccess(
    studentId: string,
    studentName: string,
    studentCode: string,
    photo: string | undefined,
    type: 'entrada' | 'saida',
    status: 'liberado' | 'bloqueado',
    reason?: string,
    turnstile = 'Catraca Principal 01'
  ): Promise<AccessLog> {
    const all = await this.getAll();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const newLog: AccessLog = {
      id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      studentId,
      studentName,
      studentCode,
      photo,
      type,
      status,
      timestamp: timeFormatted,
      reason,
      turnstile
    };

    const updated = [newLog, ...all];
    localStorage.setItem(ACCESS_LOGS_KEY, JSON.stringify(updated));

    this.notifyUpdate(newLog);
    return newLog;
  }

  /**
   * Assina passagens na catraca em tempo real (essencial para o painel de portaria)
   */
  subscribe(callback: (newLog?: AccessLog) => void): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<AccessLog>;
      callback(customEvent.detail);
    };

    window.addEventListener(ACCESS_LOGS_EVENT, handler);
    window.addEventListener('storage', (e) => {
      if (e.key === ACCESS_LOGS_KEY) {
        callback();
      }
    });

    return () => {
      window.removeEventListener(ACCESS_LOGS_EVENT, handler);
    };
  }

  private notifyUpdate(newLog: AccessLog): void {
    window.dispatchEvent(new CustomEvent(ACCESS_LOGS_EVENT, { detail: newLog }));
  }
}

export const accessLogService = new AccessLogService();
