# Registro de Alterações — GL PRO FIT v2.6.11

**Data:** 16/11/2026  
**Build:** `20261116.09`  
**Escopo:** Migração exclusiva do Administrador Master para `glprofit.adm@gmail.com` (`GL PRO FIT ADM`), correção da sessão exibida no menu superior direito e remoção definitiva do acesso via `marinho.gianluca@gmail.com`.

---

## 1. Alterações Técnicas Implementadas

### 1.1. Migração e Higienização da Sessão Ativa (`src/services/userService.ts`, `src/App.tsx`, `src/components/Header.tsx`)
- **Causa raiz identificada:** Sessões anteriores persistidas em `localStorage` (`vbsport_active_user`) com o antigo perfil `Gianluca Marinho` (`marinho.gianluca@gmail.com`) não eram substituídas quando `getActiveSessionUser()` executava antes da limpeza ou quando `findUserByEmail()` não localizava o e-mail antigo, fazendo o cabeçalho superior direito exibir o nome/e-mail legado enquanto *Configurações → Usuários & Permissões* já mostrava `GL PRO FIT ADM`.
- **Correções aplicadas:**
  - Adicionada a função `isLegacyMasterOrOldAdmin()` e a flag de migração `glprofit_master_session_v2611` em `src/services/userService.ts`.
  - `getActiveSessionUser()` agora executa `getSystemUsers()` previamente e substitui automaticamente qualquer sessão legada (`marinho.gianluca@gmail.com`, `usr-1`) pelo perfil `admin-master-01` (`GL PRO FIT ADM` / `glprofit.adm@gmail.com`).
  - `setActiveSessionUser()` dispara o evento `glprofit_active_user_updated`, escutado pelo `App.tsx` para atualizar imediatamente o estado `currentUser` enviado ao `<Header />`.
  - `saveSystemUsers()` agora remove qualquer propriedade `password` antes de salvar localmente ou sincronizar com `system_users` no Firestore, atendendo à restrição `!('password' in incoming())` das regras de segurança.
  - Fallback de nome no `<Header />` atualizado de `"Gianluca Marinho"` para `"GL PRO FIT ADM"` e saudação padrão em `InicioTab.tsx` ajustada para `'Administrador'`.

### 1.2. Bloqueio de `marinho.gianluca@gmail.com` e Autenticação Master (`src/App.tsx`, `src/components/LoginPage.tsx`, `src/services/partnerSchoolLicenseService.ts`, `src/components/modals/EsqueciSenhaModal.tsx`)
- `App.tsx`: O listener `onAuthStateChanged` agora encerra automaticamente qualquer sessão residual do Firebase Auth autenticada com `marinho.gianluca@gmail.com`, e `handleLoginSuccess` rejeita logins com esse e-mail.
- `LoginPage.tsx`: Rejeita explicitamente tentativas de login por e-mail/senha ou Google com `marinho.gianluca@gmail.com` e exige validação real no Firebase Auth (`signInWithEmailAndPassword`) para `glprofit.adm@gmail.com` (sem fallback local por comprimento de senha).
- `partnerSchoolLicenseService.ts`: `isMasterAdministrator()` passa a validar apenas `glprofit.adm@gmail.com` e `admin-master-01`, negando privilégio master a `marinho.gianluca@gmail.com` e `usr-1`.
- `EsqueciSenhaModal.tsx`: Integrado com `sendPasswordResetEmail(auth, cleanEmail)` para o e-mail `glprofit.adm@gmail.com` com tela dedicada de confirmação de envio (`email_sent`).

### 1.3. Regras de Segurança Firestore e Script de Seed (`firestore.rules`, `scripts/create-users.ts`)
- `firestore.rules`: Removida a exceção de `marinho.gianluca@gmail.com` da função `isMasterAdminEmail()`, mantendo apenas `request.auth.token.email == 'glprofit.adm@gmail.com'`.
- `scripts/create-users.ts`: `SEED_USERS` saneado para conter exclusivamente `GL PRO FIT ADM` (`glprofit.adm@gmail.com`).
- Conta oficial `glprofit.adm@gmail.com` provisionada e verificada no Firebase Authentication do projeto com `displayName: "GL PRO FIT ADM"`.

---

## 2. Arquivos Modificados
- `src/services/userService.ts`
- `src/components/Header.tsx`
- `src/components/tabs/InicioTab.tsx`
- `src/services/partnerSchoolLicenseService.ts`
- `src/App.tsx`
- `src/components/LoginPage.tsx`
- `src/components/modals/EsqueciSenhaModal.tsx`
- `firestore.rules`
- `scripts/create-users.ts`
- `src/version.ts`
- `package.json`

---

## 3. Validações
- Regras do Firestore (`firestore.rules`) reimplantadas via `deploy_firebase`.
- Compilação TypeScript/Vite (`compile_applet`) e análise estática (`lint_applet`) executadas sem erros.
- Login via `signInWithPassword` para `glprofit.adm@gmail.com` validado diretamente contra a API do Firebase Authentication.
