import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  writeBatch,
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
    await setDoc(docRef, data, { merge: true });
    updateStatus({ 
      connected: true,
      syncing: false, 
      lastSync: new Date().toLocaleTimeString('pt-BR'),
      error: null 
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    updateStatus({ syncing: false, error: 'Erro ao sincronizar com banco em nuvem' });
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
      lastSync: new Date().toLocaleTimeString('pt-BR') 
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    updateStatus({ syncing: false });
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
          batch.set(docRef, item, { merge: true });
        }
      }
      await batch.commit();
    }

    updateStatus({ 
      connected: true,
      syncing: false, 
      lastSync: new Date().toLocaleTimeString('pt-BR'),
      collectionsCount: {
        ...currentDbStatus.collectionsCount,
        [collectionName]: items.length
      }
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
    updateStatus({ syncing: false, error: 'Falha no lote de sincronização' });
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
      collectionsCount: {
        ...currentDbStatus.collectionsCount,
        [collectionName]: results.length
      }
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionName);
    return [];
  }
}

// Subscribe to real-time changes on a collection
export function subscribeToFirestoreCollection<T extends { id: string }>(
  collectionName: string,
  onData: (data: T[]) => void,
  initialSeedFallback?: T[]
): Unsubscribe {
  const colRef = collection(db, collectionName);

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty && initialSeedFallback && initialSeedFallback.length > 0) {
        // First boot: populate Firestore collection with initial seed
        console.log(`Inicializando coleção "${collectionName}" no Firebase Firestore...`);
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
        lastSync: new Date().toLocaleTimeString('pt-BR'),
        collectionsCount: {
          ...currentDbStatus.collectionsCount,
          [collectionName]: items.length
        }
      });

      if (items.length > 0) {
        onData(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionName);
      updateStatus({ connected: false, error: error.message });
      // If error occurs, fallback to local data
      if (initialSeedFallback) {
        onData(initialSeedFallback);
      }
    }
  );
}

// Boot initializer: verify connection and initialize status
export async function initializeDatabase(): Promise<boolean> {
  const isHealthy = await testConnection();
  updateStatus({
    connected: isHealthy,
    lastSync: isHealthy ? new Date().toLocaleTimeString('pt-BR') : null,
    error: isHealthy ? null : 'Aguardando sincronização inicial com Firebase'
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
      security_audit_logs: 'glprofit_security_audit_logs'
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
