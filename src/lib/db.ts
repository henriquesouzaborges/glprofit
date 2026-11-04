/**
 * GL PRO FIT - Conexão e Configuração de Banco de Dados em Nuvem (Fase 2.1)
 * Suporte a Feature Flag transparente, inicialização flexível (Firestore / Supabase)
 * e desacoplamento para preservar zero-breakage na aplicação.
 */

import appletConfig from '../../firebase-applet-config.json';

const env = (import.meta as any).env || {};

// Cloud Database is permanently activated for GL PRO FIT
export const USE_REAL_DATABASE: boolean = true;

// Provedor ativo de banco de dados
export type DatabaseProvider = 'firebase' | 'supabase' | 'localstorage';

export const CURRENT_DB_PROVIDER: DatabaseProvider = 'firebase';

// Configuração das Credenciais do Firebase a partir do arquivo provisionado
export const FIREBASE_CONFIG = {
  apiKey: appletConfig.apiKey || env.VITE_FIREBASE_API_KEY || '',
  authDomain: appletConfig.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: appletConfig.projectId || env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: appletConfig.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: appletConfig.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: appletConfig.appId || env.VITE_FIREBASE_APP_ID || '',
  firestoreDatabaseId: appletConfig.firestoreDatabaseId || ''
};

// Configuração das Credenciais do Supabase (para cenários híbridos futuros)
export const SUPABASE_CONFIG = {
  url: env.VITE_SUPABASE_URL || '',
  anonKey: env.VITE_SUPABASE_ANON_KEY || '',
};

/**
 * Validação de integridade de credenciais
 */
export function isCloudDatabaseConfigured(): boolean {
  if (!USE_REAL_DATABASE) return false;

  if (CURRENT_DB_PROVIDER === 'firebase') {
    return Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
  }

  if (CURRENT_DB_PROVIDER === 'supabase') {
    return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
  }

  return false;
}

/**
 * Log informativo da camada de dados
 */
if (typeof window !== 'undefined') {
  console.info(
    `[GL PRO FIT - Database Engine] Modo ativo: ${
      USE_REAL_DATABASE ? `Nuvem (${CURRENT_DB_PROVIDER.toUpperCase()})` : 'LocalStorage (Offline/Fallback)'
    }`
  );
}
