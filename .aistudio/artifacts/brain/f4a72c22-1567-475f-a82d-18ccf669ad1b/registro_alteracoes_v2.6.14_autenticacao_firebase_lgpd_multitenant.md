# Registro de Alterações — GL PRO FIT v2.6.14

**Data de Liberação:** 16/11/2026  
**Build:** `20261116.12`  
**Versão Anterior:** `v2.6.13` → **Versão Atual:** `v2.6.14`

---

## 1. Resumo Executivo

Implementação da camada de backend, autenticação segura, validação de campos, conformidade LGPD e isolamento multi-tenant B2B nos fluxos de **Login** e **Cadastro** do sistema **GL PRO FIT**, preservando **100% intacta** a interface gráfica (JSX, classes Tailwind, layout e elementos visuais).

---

## 2. Alterações Técnicas Detalhadas

### 2.1. Preservação Integral do Front-End
- **Arquivos preservados:** `src/components/LoginPage.tsx` e `src/components/CadastroPage.tsx`.
- Nenhuma classe Tailwind CSS, posicionamento, elemento gráfico ou estrutura JSX das telas de Login e Cadastro foi alterada.

### 2.2. Segurança, Firebase Authentication & Zero Plaintext Password
- **`src/lib/firebase.ts`:**
  - Implementação de `signInWithFirebaseEmail(email, password)` conectado diretamente a `signInWithEmailAndPassword` e `registerFirebaseAuthAccount` conectado a `createUserWithEmailAndPassword` (com app secundário isolado quando um operador autenticado realiza cadastro de aluno no mesmo navegador).
  - Implementação de `mapFirebaseAuthError(error, context)` traduzindo e tratando todos os códigos críticos do Firebase Auth (`auth/invalid-credential`, `auth/wrong-password`, `auth/user-not-found`, `auth/invalid-email`, `auth/too-many-requests`, `auth/user-disabled`, `auth/email-already-in-use`, `auth/weak-password`, `auth/missing-password`, `auth/missing-email`, `auth/operation-not-allowed`, `auth/network-request-failed`).
- **`src/components/LoginPage.tsx`:**
  - Remoção definitiva de qualquer fallback permissivo que aceitava `password.length >= 6` sem autenticação real no Firebase Auth para equipe, aluno ou empresa cliente B2B.
  - Validação rigorosa de formato de e-mail, bloqueio do legado `marinho.gianluca@gmail.com`, limitador local de tentativas (`checkLoginLockout` / `recordFailedLoginAttempt`) somado ao bloqueio nativo do Firebase (`auth/too-many-requests`), e hidratação de perfil via Firestore (`users/{uid}`, `system_users/{uid}`, `students` por `registeredUserId` e `empresas_clientes` por `email`).
  - Substituição do stub simulado de registro por criação real via `registerFirebaseAuthAccount`, exige aceite LGPD e gravação em `users` e `system_users` sem o atributo `password`.
- **`src/components/CadastroPage.tsx`:**
  - Remoção de fallbacks de criação local quando o Firebase Auth falha; qualquer erro de criação aborta com mensagem tratada por `mapFirebaseAuthError`.
  - Validação estrita de campos obrigatórios, e-mail válido, CPF de 11 dígitos (obrigatório para responsável, validado quando informado pelo aluno), confirmação de senha (`>= 6` caracteres) e bloqueio do e-mail legado.
- **`src/services/firebaseDbService.ts`:**
  - Endurecimento de `sanitizeForFirestore` para remover recursivamente qualquer propriedade `password` além de `undefined`, garantindo que nenhuma senha seja persistida no Firestore.

### 2.3. Vínculo Automático com a Empresa (B2B Multi-Tenant)
- **`src/types.ts` & `src/services/studentInviteService.ts`:**
  - Adição do campo canônico `companyId` em `Student`, `SystemUser`, `StudentRegistrationInvite` e `CompanyStudentLink`, mantendo compatibilidade retroativa com `empresaId`.
  - `buildStudentRegistrationUrl` emite explicitamente `companyId` e `empresaId` na URL de convite.
- **`src/components/CadastroPage.tsx`:**
  - Captura automática de `companyId` (`companyId`, `empresaId` ou `tenantId`) e identificador de convite (`invite`, `inviteId`, `token`) dos parâmetros da URL para ambos os fluxos: **"Sou Aluno"** e **"Sou o Responsável do Aluno"**.
  - Injeção obrigatória de `companyId`, `empresaId` e `empresaName` no payload salvo em `users`, `system_users`, `students` e `company_student_links`.
- **`src/App.tsx` & `src/components/modals/EnviarLinkCadastroModal.tsx`:**
  - `handleAddStudent` e `handleConvertLeadToStudent` injetam `companyId` e `consentLgpd: true`.
  - Assinaturas em tempo real (`onSnapshot`) aplicadas com filtros de tenant/UID (`where('companyId', '==', ...)` para empresas clientes B2B e `where('registeredUserId', '==', uid)` / `where('userId', '==', uid)` para alunos), evitando vazamento ou erros de permissão entre tenants.

### 2.4. Conformidade LGPD, Regras Firestore & Guardas de Listeners
- **`firestore.rules` & `firebase-blueprint.json`:**
  - Atualização do blueprint com `/users/{userId}`, `/empresas_clientes/{empresaId}` e campos `companyId`, `consentLgpd`, `consentLgpdDate`, `consentLgpdVersion`.
  - Regras `firestore.rules` com catch-all deny, bloqueio global `!('password' in request.resource.data)`, exigência de `consentLgpd == true` e `hasValidCompanyId(incoming())` no auto-cadastro em `users`, `system_users` e `students`, proteção contra auto-elevação de `role` ou troca de `companyId`, e isolamento multi-tenant (`matchesUserTenant`).
  - Regras publicadas na nuvem via `DeployRules`.
- **`src/services/userService.ts` & `src/services/folhaPontoService.ts`:**
  - Guardas nos listeners iniciados por `onAuthStateChanged` para que usuários com perfil `aluno` (ou sem permissão de folha/gestão de usuários) não disparem consultas amplas proibidas pelas regras de segurança.

---

## 3. Arquivos Afetados

- `src/types.ts`
- `src/lib/firebase.ts`
- `src/services/firebaseDbService.ts`
- `src/services/studentInviteService.ts`
- `src/services/userService.ts`
- `src/services/folhaPontoService.ts`
- `src/components/LoginPage.tsx`
- `src/components/CadastroPage.tsx`
- `src/components/modals/EnviarLinkCadastroModal.tsx`
- `src/App.tsx`
- `firebase-blueprint.json`
- `firestore.rules`
- `tests/rules.test.ts`
- `src/version.ts`
- `package.json`

---

## 4. Validações Executadas

- **Testes Automatizados (`npm test`):** 12/12 aprovados (`tests/rules.test.ts`: 7 testes; `tests/calculos.test.ts`: 5 testes).
- **Deploy de Regras Firestore (`DeployRules`):** Concluído com sucesso.
- **Compilação & Lint (`compile_applet` + `lint_applet`):** Executados e validados para a versão `v2.6.14`.
