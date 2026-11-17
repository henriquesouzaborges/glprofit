import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with explicit Database ID as required by AI Studio
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

export function mapFirebaseAuthError(error: unknown, context: 'login' | 'register' = 'login'): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code || '')
    : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
    case 'auth/invalid-email':
      return 'Formato de e-mail inválido. Informe um endereço de e-mail válido.';
    case 'auth/too-many-requests':
      return 'Acesso temporariamente bloqueado devido a múltiplas tentativas inválidas. Aguarde alguns minutos ou redefina sua senha.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada no sistema. Entre em contato com a administração.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já possui uma conta cadastrada no sistema. Faça login ou utilize "Esqueci minha senha".';
    case 'auth/weak-password':
      return 'A senha informada é muito fraca. Utilize pelo menos 6 caracteres combinando letras e números.';
    case 'auth/missing-password':
    case 'auth/missing-email':
      return 'Preencha todos os campos obrigatórios (e-mail e senha).';
    case 'auth/operation-not-allowed':
      return 'Autenticação por E-mail/Senha não habilitada no projeto Firebase Console. Contate o administrador.';
    case 'auth/network-request-failed':
      return 'Falha de conexão com o servidor de autenticação. Verifique sua internet e tente novamente.';
    default: {
      if (context === 'register') {
        return 'Não foi possível concluir seu cadastro no serviço de autenticação. Verifique os dados e tente novamente.';
      }
      return 'Não foi possível validar suas credenciais no momento. Tente novamente.';
    }
  }
}

export async function signInWithFirebaseEmail(email: string, password: string): Promise<UserCredential> {
  const cleanEmail = email.trim().toLowerCase();
  return signInWithEmailAndPassword(auth, cleanEmail, password);
}

// Creates a Firebase Auth account cleanly: if no primary user is signed in, signs in directly on primary auth;
// if an admin/company is already signed in (e.g. testing the link in the same browser), uses a secondary app instance.
export async function registerFirebaseAuthAccount(email: string, password: string): Promise<{ uid: string; usedPrimaryAuth: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!auth.currentUser) {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    return { uid: cred.user.uid, usedPrimaryAuth: true };
  }
  const secondaryApp =
    getApps().find(a => a.name === 'glprofit-student-signup') ||
    initializeApp(firebaseConfig, 'glprofit-student-signup');
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password);
    const uid = cred.user.uid;
    await signOut(secondaryAuth).catch(() => {});
    return { uid, usedPrimaryAuth: false };
  } catch (err) {
    await signOut(secondaryAuth).catch(() => {});
    throw err;
  }
}

// Error Handling according to Firebase Integration Guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Handled:', JSON.stringify(errInfo));
  return errInfo;
}

// Validate connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, fallback cache active.');
    } else {
      console.log('Firebase connection test status:', error);
    }
    return false;
  }
}
