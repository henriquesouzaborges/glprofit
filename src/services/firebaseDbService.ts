import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  writeBatch,
  query,
  QueryConstraint,
  DocumentData,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
export { db, auth };

export interface DatabaseStatus {
  connected: boolean;
  syncing: boolean;
  lastSync: string | null;
  error: string | null;
  collectionsCount: Record<string, number>;
}

// Global listener for sync status
type StatusListener = (status: DatabaseStatus) => void;
const statusListeners = new Set<StatusListener>();

let currentDbStatus: DatabaseStatus = {
  connected: false,
  syncing: false,
  lastSync: null,
  error: null,
  collectionsCount: {},
};

export function subscribeDatabaseStatus(listener: StatusListener): () => void {
  statusListeners.add(listener);
  listener(currentDbStatus);
  return () => {
    statusListeners.delete(listener);
  };
}

function updateStatus(patch: Partial<DatabaseStatus>) {
  currentDbStatus = { ...currentDbStatus, ...patch };
  statusListeners.forEach(listener => listener(currentDbStatus));
}

// Remove undefined fields and forbidden plaintext credentials recursively before writing to Firestore
function sanitizeForFirestore<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => sanitizeForFirestore(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      if (v !== undefined && k !== 'password') {
        clean[k] = sanitizeForFirestore(v);
      }
    }
    return clean as T;
  }
  return value;
}

// Save or update a single document in Firestore
export async function saveDocToFirestore<T extends { id: string }>(
  collectionName: string, 
  data: T
): Promise<void> {
  if (!data || !data.id) return;
  const path = `${collectionName}/${data.id}`;
  updateStatus({ syncing: true });
  
  try {
    const docRef = doc(db, collectionName, String(data.id));
    await setDoc(docRef, sanitizeForFirestore(data), { merge: true });
    updateStatus({ 
      connected: true,
      syncing: false, 
      lastSync: new Date().toLocaleTimeString('pt-BR'),
      error: null 
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    const errMsg = error instanceof Error ? error.message : 'Erro ao sincronizar com banco em nuvem';
    updateStatus({ syncing: false, error: errMsg });
    throw error;
  }
}

// Delete a document in Firestore
export async function deleteDocFromFirestore(
  collectionName: string, 
  id: string
): Promise<void> {
  if (!id) return;
  const path = `${collectionName}/${id}`;
  updateStatus({ syncing: true });

  try {
    const docRef = doc(db, collectionName, String(id));
    await deleteDoc(docRef);
    updateStatus({ 
      connected: true,
      syncing: false, 
      lastSync: new Date().toLocaleTimeString('pt-BR'),
      error: null
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    const errMsg = error instanceof Error ? error.message : 'Erro ao excluir registro no Firestore';
    updateStatus({ syncing: false, error: errMsg });
    throw error;
  }
}

// Save or sync an entire collection to Firestore (Batch writes)
export async function syncCollectionToFirestore<T extends { id: string }>(
  collectionName: string, 
  items: T[]
): Promise<void> {
  if (!items || items.length === 0) return;
  updateStatus({ syncing: true });

  try {
    // Firestore batch limit is 500 operations
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += 400) {
      chunks.push(items.slice(i, i + 400));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const item of chunk) {
        if (item && item.id) {
          const docRef = doc(db, collectionName, String(item.id));
          batch.set(docRef, sanitizeForFirestore(item), { merge: true });
        }
      }
      await batch.commit();
    }

    updateStatus({ 
      connected: true,
      syncing: false, 
      lastSync: new Date().toLocaleTimeString('pt-BR'),
      error: null,
      collectionsCount: {
        ...currentDbStatus.collectionsCount,
        [collectionName]: items.length
      }
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
    const errMsg = error instanceof Error ? error.message : 'Falha no lote de sincronização';
    updateStatus({ syncing: false, error: errMsg });
  }
}

// Fetch all documents from a collection once
export async function fetchCollectionFromFirestore<T extends { id: string }>(
  collectionName: string
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const results: T[] = [];
    snapshot.forEach(docSnap => {
      results.push(docSnap.data() as T);
    });
    updateStatus({ 
      connected: true,
      error: null,
      collectionsCount: {
        ...currentDbStatus.collectionsCount,
        [collectionName]: results.length
      }
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionName);
    const errMsg = error instanceof Error ? error.message : 'Erro ao consultar coleção no Firestore';
    updateStatus({ connected: false, error: errMsg });
    throw error;
  }
}

// Subscribe to real-time changes on a collection (Zero-Mock: never inject fake fallback data on error)
export function subscribeToFirestoreCollection<T extends { id: string }>(
  collectionName: string,
  onData: (data: T[]) => void,
  initialSeedFallback?: T[],
  onError?: (error: Error) => void,
  constraints?: QueryConstraint[]
): Unsubscribe {
  const colRef = collection(db, collectionName);
  const targetRef = constraints && constraints.length > 0 ? query(colRef, ...constraints) : colRef;

  return onSnapshot(
    targetRef,
    (snapshot) => {
      if (snapshot.empty && initialSeedFallback && initialSeedFallback.length > 0) {
        // Explicit initial seed only when non-empty seed is explicitly provided
        syncCollectionToFirestore(collectionName, initialSeedFallback);
        onData(initialSeedFallback);
        return;
      }

      const items: T[] = [];
      snapshot.forEach((docSnap: DocumentData) => {
        items.push(docSnap.data() as T);
      });

      updateStatus({
        connected: true,
        error: null,
        lastSync: new Date().toLocaleTimeString('pt-BR'),
        collectionsCount: {
          ...currentDbStatus.collectionsCount,
          [collectionName]: items.length
        }
      });

      // Always propagate real state including empty [] so UI shows genuine Empty States
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionName);
      const errMsg = error instanceof Error ? error.message : String(error);
      updateStatus({ connected: false, error: `Falha ao sincronizar "${collectionName}": ${errMsg}` });
      onError?.(error instanceof Error ? error : new Error(errMsg));
    }
  );
}

// Boot initializer: verify connection and initialize status
export async function initializeDatabase(): Promise<boolean> {
  const isHealthy = await testConnection();
  updateStatus({
    connected: isHealthy,
    lastSync: isHealthy ? new Date().toLocaleTimeString('pt-BR') : null,
    error: isHealthy ? null : 'Falha de conexão com o banco em nuvem Firebase Firestore'
  });
  return isHealthy;
}

export function getDatabaseStatus(): DatabaseStatus {
  return currentDbStatus;
}

export interface MasterSyncResult {
  success: boolean;
  timestamp: string;
  syncedCollections: Record<string, number>;
  totalRecords: number;
  error?: string;
}

/**
 * Força a sincronização completa de todos os módulos, configurações e registros
 * do GL PRO FIT para o banco de dados Firebase Firestore
 */
export async function syncAllSystemDataToCloud(customData?: Record<string, any[]>): Promise<MasterSyncResult> {
  updateStatus({ syncing: true });
  const result: MasterSyncResult = {
    success: false,
    timestamp: new Date().toISOString(),
    syncedCollections: {},
    totalRecords: 0
  };

  try {
    // 1. Coleta dados locais ou customizados
    const collectionsToSync: Record<string, any[]> = customData || {};

    // Helper para ler LocalStorage de forma segura
    const readLocal = (key: string): any[] => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    };

    if (!collectionsToSync['system_settings']) {
      const settings = localStorage.getItem('vbsport_settings');
      if (settings) {
        collectionsToSync['system_settings'] = [{ id: 'general', ...JSON.parse(settings) }];
      }
    }

    const defaultMappings: Record<string, string> = {
      students: 'vbsport_students',
      plans: 'vbsport_plans',
      additional_services: 'glprofit_additional_services',
      exercises_catalog: 'glprofit_exercises_catalog',
      empresas_clientes: 'vbsport_empresas_clientes',
      financial_transactions: 'vbsport_transactions',
      classes: 'vbsport_classes',
      workouts: 'vbsport_workouts',
      leads: 'vbsport_leads',
      products: 'vbsport_products',
      comandas: 'vbsport_comandas',
      stock_movements: 'vbsport_stock_movements',
      suppliers: 'vbsport_suppliers',
      recurring_charges: 'vbsport_recurring',
      payment_links: 'vbsport_payment_links',
      crm_activities: 'vbsport_crm_activities',
      crm_automations: 'vbsport_crm_automations',
      satisfaction_surveys: 'vbsport_crm_surveys',
      calendar_events: 'vbsport_calendar_events',
      system_users: 'vbsport_system_users',
      team_tasks: 'glprofit_team_tasks',
      folha_teachers: 'vbsport_folha_teachers',
      folha_turmas: 'vbsport_folha_turmas',
      folha_records: 'vbsport_folha_records',
      whatsapp_chats: 'vbsport_whatsapp_chats',
      security_audit_logs: 'glprofit_security_audit_logs',
      student_invites: 'glprofit_student_invites',
      company_student_links: 'glprofit_company_student_links'
    };

    for (const [col, storageKey] of Object.entries(defaultMappings)) {
      if (!collectionsToSync[col]) {
        const data = readLocal(storageKey);
        if (data.length > 0) {
          collectionsToSync[col] = data;
        }
      }
    }

    // Salvar tab configurations
    const tabConfigs = localStorage.getItem('vbsport_tab_configurations');
    if (tabConfigs) {
      try {
        const parsed = JSON.parse(tabConfigs);
        const tabList = Object.entries(parsed).map(([key, val]: [string, any]) => ({
          id: key,
          ...val
        }));
        if (tabList.length > 0) {
          collectionsToSync['tab_settings'] = tabList;
        }
      } catch (err) {
        console.warn('Erro ao mapear tab_settings:', err);
      }
    }

    // 2. Executa a sincronização em lote para cada coleção no Firestore
    for (const [colName, items] of Object.entries(collectionsToSync)) {
      if (Array.isArray(items) && items.length > 0) {
        await syncCollectionToFirestore(colName, items);
        result.syncedCollections[colName] = items.length;
        result.totalRecords += items.length;
      }
    }

    result.success = true;
    updateStatus({
      connected: true,
      syncing: false,
      lastSync: new Date().toLocaleTimeString('pt-BR'),
      error: null
    });

    return result;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    result.error = errMsg;
    updateStatus({ syncing: false, error: 'Erro ao executar sincronização mestre' });
    return result;
  }
}
