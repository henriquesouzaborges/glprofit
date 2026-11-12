import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

if (!getApps().length) {
  initializeApp();
}

const auth = getAuth();
const db = getFirestore();

interface SeedUserSpec {
  name: string;
  email: string;
  role: 'admin' | 'gerente' | 'recepcao' | 'treinador' | 'financeiro';
  department: string;
  phone?: string;
}

const SEED_USERS: SeedUserSpec[] = [
  {
    name: 'Gianluca Marinho',
    email: 'marinho.gianluca@gmail.com',
    role: 'admin',
    department: 'Diretoria Executiva',
    phone: '(11) 98765-4321'
  },
  {
    name: 'Recepção Matriz',
    email: 'recepcao@vbsport.com.br',
    role: 'recepcao',
    department: 'Atendimento & PDV',
    phone: '(11) 97123-4567'
  },
  {
    name: 'Prof. Rodrigo Tavares',
    email: 'rodrigo.tavares@vbsport.com.br',
    role: 'treinador',
    department: 'Musculação & Avaliações',
    phone: '(11) 98222-1144'
  },
  {
    name: 'Amanda Souza',
    email: 'financeiro@vbsport.com.br',
    role: 'financeiro',
    department: 'Controladoria & Contas',
    phone: '(11) 99333-8822'
  }
];

function generateSecureRandomPassword(length = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  return password;
}

async function runCreateUsers() {
  console.log('===============================================================');
  console.log('  GL PRO FIT - INICIALIZAÇÃO DE USUÁRIOS NO FIREBASE AUTH & FIRESTORE');
  console.log('===============================================================');

  for (const userSpec of SEED_USERS) {
    let uid: string;
    const tempPassword = generateSecureRandomPassword(16);

    try {
      const existingUser = await auth.getUserByEmail(userSpec.email);
      uid = existingUser.uid;
      console.log(`[AUTH] Usuário existente encontrado: ${userSpec.email} (UID: ${uid})`);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        const userRecord = await auth.createUser({
          email: userSpec.email,
          displayName: userSpec.name,
          password: tempPassword,
          emailVerified: true
        });
        uid = userRecord.uid;
        console.log(`[AUTH] Novo usuário criado: ${userSpec.email} (UID: ${uid})`);
        console.log(`[AUTH TEMPORARY PASSWORD] Email: ${userSpec.email} -> Senha: ${tempPassword}`);
      } else {
        console.error(`Erro ao verificar e-mail ${userSpec.email}:`, err);
        continue;
      }
    }

    // Set Custom Claims (role)
    await auth.setCustomUserClaims(uid, { role: userSpec.role });
    console.log(`[CLAIMS] Custom claim 'role: ${userSpec.role}' atribuído a ${userSpec.email}`);

    // Create user profile in Firestore (WITHOUT PASSWORD FIELD)
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.set({
      id: uid,
      name: userSpec.name,
      email: userSpec.email,
      role: userSpec.role,
      department: userSpec.department,
      phone: userSpec.phone || '',
      active: true,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log(`[FIRESTORE] Perfil gravado sem campo de senha em users/${uid}\n`);
  }

  console.log('===============================================================');
  console.log('  MIGRAÇÃO DE USUÁRIOS CONCLUÍDA COM SUCESSO!');
  console.log('===============================================================');
}

runCreateUsers().catch(err => {
  console.error('Falha fatal na criação de usuários:', err);
  process.exit(1);
});
