# Registro de Alterações — Versão v2.6.9 (Saneamento de Usuários e Permissões Firestore)

**Data:** 16/11/2026  
**Versão:** `v2.6.9` (`build 20261116.07`)  
**Responsável:** Engenharia GL PRO FIT Enterprise Suite  

---

## 1. Resumo das Alterações

Atualização focada no saneamento do usuário Administrador Master e na eliminação definitiva de erros `Missing or insufficient permissions` no painel.

---

## 2. Alterações Aplicadas

### 2.1 Saneamento de Usuários (`src/services/userService.ts`)
- Atualizado `INITIAL_SYSTEM_USERS` para manter exclusivamente o Administrador Master exigido:
  - `id`: `'admin-master-01'`
  - `name`: `'GL PRO FIT ADM'`
  - `email`: `'glprofit.adm@gmail.com'`
  - `role`: `'admin'`
  - `phone`: `'(61)992095123'`
  - `department`: `'Diretoria Executiva & Master'`
  - `mustChangePassword`: `false`
  - `permissions`: `['all']`
- Adicionada migração automática no `getSystemUsers()` para atualizar cadastros master legados em `localStorage` (`usr-1`) e suporte à permissão `all` em `hasTabPermission()`.
- Condicionada a sincronização/assinatura da coleção `system_users` ao estado autenticado do Firebase Auth (`onAuthStateChanged` / `auth.currentUser`).

### 2.2 Regras e Permissões do Firestore (`firestore.rules`)
- Implementado helper `isMasterAdminEmail()` contemplando `glprofit.adm@gmail.com` e o e-mail verificado da conta de runtime (`marinho.gianluca@gmail.com`).
- Aprimorado `userRole()` para consultar o papel do usuário autenticado tanto em `/users/$(request.auth.uid)` quanto em `/system_users/$(request.auth.uid)`.
- Adicionadas regras explícitas para as coleções `folha_teachers`, `folha_turmas` e `folha_records` que antes caíam no catch-all `allow read, write: if false;`.

### 2.3 Blindagem de Listeners Pré-Autenticação
- **`src/App.tsx`**: Rastreamento de `firebaseUser` via `onAuthStateChanged`; as assinaturas em tempo real das 19 coleções e os efeitos de `syncCollectionToFirestore` só executam com `isAuthenticated && firebaseUser` ativos. Adicionado `signOut(auth)` no `handleLogout` e botão **"Autenticar Firebase"** no banner de erro caso a sessão Firebase Auth não esteja conectada.
- **`src/services/tabSettingsService.ts` e `src/services/folhaPontoService.ts`**: Listeners `tab_settings`, `folha_teachers`, `folha_turmas` e `folha_records` condicionados ao `onAuthStateChanged`.
- **`ExerciseCatalogView.tsx`, `PlanosServicosView.tsx` e `FichaCompletaAlunoView.tsx`**: Assinaturas de `exercises_catalog` e `additional_services` condicionadas ao `onAuthStateChanged`.

### 2.4 Versionamento (`RULE[AGENTS_md]`)
- `package.json`: `2.6.9`
- `src/version.ts`: `v2.6.9` (`build 20261116.07`)

---

## 3. Validações
- Deploy de `firestore.rules` via `deploy_firebase`.
- Build Vite (`npm run build`) e checagem TypeScript (`tsc --noEmit`).
