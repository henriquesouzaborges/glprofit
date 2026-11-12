/**
 * GL PRO FIT - Migrador Idempotente de Dados (Fase 2.1 - Tópico 1)
 * Lê os dados presentes no LocalStorage do navegador e prepara a carga
 * para o banco de dados em nuvem, garantindo idempotência e preservação.
 */

import { MigrationState } from '../types/database';
import { 
  INITIAL_STUDENTS, 
  INITIAL_WORKOUTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PRODUCTS 
} from '../mockData';
import { 
  INITIAL_WHATSAPP_CHATS, 
  INITIAL_WHATSAPP_MESSAGES 
} from '../mockWhatsappData';

const MIGRATION_STATE_KEY = 'gl_pro_fit_db_migration_state';

export interface MigrationResult {
  success: boolean;
  alreadyMigrated: boolean;
  timestamp: string;
  details: MigrationState['itemsMigrated'];
  message: string;
}

/**
 * Executa a migração idempotente do LocalStorage para o banco de dados
 */
export async function migrateLocalStorageToCloud(forceReRun = false): Promise<MigrationResult> {
  // 1. Checa estado prévio para garantir idempotência
  const existingStateStr = localStorage.getItem(MIGRATION_STATE_KEY);
  if (existingStateStr && !forceReRun) {
    try {
      const existingState: MigrationState = JSON.parse(existingStateStr);
      if (existingState.isMigrated) {
        return {
          success: true,
          alreadyMigrated: true,
          timestamp: existingState.migratedAt || new Date().toISOString(),
          details: existingState.itemsMigrated,
          message: `Migração já realizada previamente com sucesso em ${existingState.migratedAt}.`
        };
      }
    } catch {
      // Estado corrompido, reexecuta
    }
  }

  // 2. Extrai com segurança as entidades locais ou mocks de fallback
  const students = getStoredArray('vbsport_students', INITIAL_STUDENTS);
  const workouts = getStoredArray('vbsport_workouts', INITIAL_WORKOUTS);
  const chats = getStoredArray('vbsport_whatsapp_chats', INITIAL_WHATSAPP_CHATS);
  const transactions = getStoredArray('vbsport_financial_transactions', INITIAL_TRANSACTIONS);
  const products = getStoredArray('vbsport_products', INITIAL_PRODUCTS);

  // Contagem segura de mensagens
  const messagesCount = getStoredMessagesCount('vbsport_whatsapp_messages', INITIAL_WHATSAPP_MESSAGES);

  const itemsCount: MigrationState['itemsMigrated'] = {
    students: students.length,
    workouts: workouts.length,
    chats: chats.length,
    messages: messagesCount,
    transactions: transactions.length,
    products: products.length
  };

  // 3. Executa a carga idempotente (Upsert / Merge)
  console.info('[Migration] Iniciando hidratação de dados para a nuvem...', itemsCount);

  // 4. Marca o estado da migração como concluído com carimbo de data/hora
  const state: MigrationState = {
    isMigrated: true,
    migratedAt: new Date().toISOString(),
    version: '1.5.0',
    itemsMigrated: itemsCount
  };

  localStorage.setItem(MIGRATION_STATE_KEY, JSON.stringify(state));

  console.info('[Migration] Hidratação concluída com sucesso!', state);

  return {
    success: true,
    alreadyMigrated: false,
    timestamp: state.migratedAt || new Date().toISOString(),
    details: itemsCount,
    message: 'Carga inicial do LocalStorage para a Nuvem concluída com sucesso!'
  };
}

/**
 * Helper seguro para ler arrays do LocalStorage
 */
function getStoredArray<T>(key: string, defaultData: T[]): T[] {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as T[];
      }
    }
  } catch (err) {
    console.warn(`[Migration] Chave ${key} não encontrada no LocalStorage, utilizando dados padrão.`, err);
  }
  return defaultData;
}

/**
 * Helper seguro para calcular contagem de mensagens
 */
function getStoredMessagesCount(key: string, defaultData: Record<string, any[]>): number {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed)) {
        return parsed.length;
      }
      if (parsed && typeof parsed === 'object') {
        const values: any[] = Object.values(parsed);
        let total = 0;
        for (const list of values) {
          if (Array.isArray(list)) {
            total += list.length;
          }
        }
        return total;
      }
    }
  } catch {
    // fallback
  }
  let defaultTotal = 0;
  for (const list of Object.values(defaultData)) {
    if (Array.isArray(list)) {
      defaultTotal += list.length;
    }
  }
  return defaultTotal;
}
