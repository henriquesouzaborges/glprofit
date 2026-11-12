import { TabType } from '../types';

export type PushNotificationType = 'info' | 'success' | 'warning' | 'error' | 'alert';

export type PushNotificationModule = 
  | 'financeiro' 
  | 'professores' 
  | 'tarefas' 
  | 'agenda'
  | 'alunos' 
  | 'vendas' 
  | 'crm' 
  | 'whatsapp' 
  | 'treino'
  | 'sistema';

export type NotificationEventType =
  | 'novo_aluno'
  | 'fatura_vencida'
  | 'pagamento_recebido'
  | 'venda_pdv'
  | 'folha_ponto_presenca'
  | 'folha_ponto_lembrete'
  | 'tarefa_delegada'
  | 'tarefa_concluida'
  | 'agenda_compromisso'
  | 'crm_novo_lead';

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: PushNotificationType;
  module: PushNotificationModule;
  eventType?: NotificationEventType;
  timestamp: string; // ISO string
  read: boolean;
  linkTab?: TabType;
  actionLabel?: string;
  entityId?: string;
  entityName?: string;
  autoDismissMs?: number; // default 5000ms
}

export interface PushNotificationPreferences {
  masterPushEnabled: boolean;
  soundEnabled: boolean;
  browserPushEnabled: boolean;
  novo_aluno: boolean;
  fatura_vencida: boolean;
  pagamento_recebido: boolean;
  venda_pdv: boolean;
  folha_ponto_presenca: boolean;
  folha_ponto_lembrete: boolean;
  tarefa_delegada: boolean;
  tarefa_concluida: boolean;
  agenda_compromisso: boolean;
  crm_novo_lead: boolean;
}

export const DEFAULT_PUSH_PREFERENCES: PushNotificationPreferences = {
  masterPushEnabled: true,
  soundEnabled: true,
  browserPushEnabled: false,
  novo_aluno: true,
  fatura_vencida: true,
  pagamento_recebido: true,
  venda_pdv: true,
  folha_ponto_presenca: true,
  folha_ponto_lembrete: true,
  tarefa_delegada: true,
  tarefa_concluida: true,
  agenda_compromisso: true,
  crm_novo_lead: true,
};

const STORAGE_KEY = 'vbsport_notifications_list';
const PREFERENCES_STORAGE_KEY = 'vbsport_push_notification_preferences';

export function getPushNotificationPreferences(): PushNotificationPreferences {
  try {
    const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return saved ? { ...DEFAULT_PUSH_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PUSH_PREFERENCES;
  } catch {
    return DEFAULT_PUSH_PREFERENCES;
  }
}

export function savePushNotificationPreferences(prefs: PushNotificationPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('vbsport_push_preferences_updated', { detail: prefs }));
  } catch (e) {
    console.error('Error saving push notification preferences:', e);
  }
}

export const INITIAL_NOTIFICATIONS: PushNotification[] = [];

export function getStoredNotifications(): PushNotification[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(list: PushNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('notifications', list);
    }).catch(err => {
      console.warn('Sync notifications to firestore skipped:', err);
    });
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
}

export function isPushSoundEnabled(): boolean {
  const prefs = getPushNotificationPreferences();
  return prefs.soundEnabled;
}

export function setPushSoundEnabled(enabled: boolean): void {
  const prefs = getPushNotificationPreferences();
  savePushNotificationPreferences({ ...prefs, soundEnabled: enabled });
}

/**
 * Synthesizes a crisp, pleasant notification chime using Web Audio API
 */
export function playNotificationChime(): void {
  if (!isPushSoundEnabled()) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First gentle tone (E5 ~ 659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second bright chime tone (A5 ~ 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.08);
    gain2.gain.setValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  } catch (e) {
    // AudioContext might be blocked before first user interaction
  }
}

/**
 * Request native browser notification permission if available
 */
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') {
    const prefs = getPushNotificationPreferences();
    savePushNotificationPreferences({ ...prefs, browserPushEnabled: true });
    return true;
  }
  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    const granted = perm === 'granted';
    const prefs = getPushNotificationPreferences();
    savePushNotificationPreferences({ ...prefs, browserPushEnabled: granted });
    return granted;
  }
  return false;
}

export interface DispatchNotificationOptions {
  title: string;
  message: string;
  type?: PushNotificationType;
  module?: PushNotificationModule;
  eventType?: NotificationEventType;
  linkTab?: TabType;
  actionLabel?: string;
  entityId?: string;
  entityName?: string;
  autoDismissMs?: number;
}

/**
 * Dispatches a real-time push alert across the whole system.
 * Honors user preferences set in Configurações > Notificações.
 */
export function dispatchPushNotification(options: DispatchNotificationOptions): PushNotification | null {
  const prefs = getPushNotificationPreferences();

  // If specific event type is disabled in Configurações > Notificações, skip!
  if (options.eventType && prefs[options.eventType] === false) {
    return null;
  }

  // If master visual push toggle is disabled, skip visual alert (but save in history)
  const shouldShowVisualPush = prefs.masterPushEnabled;

  const newNotif: PushNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: options.title,
    message: options.message,
    type: options.type || 'info',
    module: options.module || 'sistema',
    eventType: options.eventType,
    timestamp: new Date().toISOString(),
    read: false,
    linkTab: options.linkTab,
    actionLabel: options.actionLabel || (options.linkTab ? 'Visualizar' : undefined),
    entityId: options.entityId,
    entityName: options.entityName,
    autoDismissMs: options.autoDismissMs !== undefined ? options.autoDismissMs : 5000
  };

  // 1. Save in persistent history list
  const currentList = getStoredNotifications();
  const nextList = [newNotif, ...currentList.slice(0, 49)]; // keep latest 50
  saveStoredNotifications(nextList);

  // 2. Play chime if sound enabled
  if (prefs.soundEnabled) {
    playNotificationChime();
  }

  // 3. Dispatch visual push event to UI container (if master toggle is on)
  if (typeof window !== 'undefined') {
    if (shouldShowVisualPush) {
      window.dispatchEvent(
        new CustomEvent<PushNotification>('vbsport_push_notification_event', {
          detail: newNotif
        })
      );
    }

    // Always update notification counter in Header
    window.dispatchEvent(
      new CustomEvent<number>('vbsport_notifications_updated', {
        detail: nextList.filter(n => !n.read).length
      })
    );

    // 4. Browser native push notification (if permitted)
    try {
      if (prefs.browserPushEnabled && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: '/favicon.ico'
        });
      }
    } catch {
      // ignore
    }
  }

  return newNotif;
}

export function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Agora mesmo';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Há ${diffMin} min`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `Há ${diffHour}h`;
    const diffDays = Math.floor(diffHour / 24);
    return `Há ${diffDays}d`;
  } catch {
    return 'Recente';
  }
}
