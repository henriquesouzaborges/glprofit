# Registro de Alterações — GL PRO FIT v2.6.12

**Data:** 16 de Novembro de 2026  
**Build:** `20261116.10`  
**Versão:** `v2.6.12` (anterior: `v2.6.11`)

---

## Resumo Executivo
Implementado o fluxo completo de **Envio de Link de Cadastro para Alunos** na aba **Clientes** (ao lado do botão *Cadastrar Novo Aluno*) e no módulo **Empresas Clientes**, garantindo que cada aluno cadastrado por meio do link tenha seu **e-mail** e **ID de usuário (UID)** vinculados automaticamente à empresa remetente (seja uma Empresa Cliente B2B operando em seu próprio perfil ou a unidade Matriz).

---

## Alterações Realizadas

### 1. Botão e Modal de Envio de Link de Cadastro
- **`src/components/tabs/AlunosTab.tsx`**:
  - Adicionado o botão **Enviar Link de Cadastro** ao lado do botão **Cadastrar Novo Aluno** no cabeçalho da aba Clientes e também no estado vazio da listagem.
  - Exibição de selo identificador da empresa vinculada em cada linha da tabela de alunos e filtro por empresa para a administração global.
  - Isolamento automático para operadores vinculados a uma `EmpresaCliente`, exibindo apenas os alunos vinculados à sua respectiva empresa.
- **`src/components/modals/EnviarLinkCadastroModal.tsx`**:
  - Identifica automaticamente a empresa ativa do usuário logado (`resolveActiveEmpresaForUser`), travando a seleção para usuários de empresas clientes B2B.
  - Permite opcionalmente informar nome, e-mail, telefone/WhatsApp e plano sugerido antes de gerar o link personalizado (`?view=cadastro&invite=...&empresaId=...`).
  - Oferece ações de **Copiar Link**, **Enviar no WhatsApp**, **Testar / Visualizar Tela de Cadastro** e histórico em tempo real dos convites emitidos (`Aguardando` vs `Vinculado` com exibição do UID).

### 2. Serviço de Convites e Vinculação Empresa ↔ Aluno
- **`src/services/studentInviteService.ts`**:
  - Implementadas funções de resolução de empresa ativa (`resolveActiveEmpresaForUser`, `isCompanyScopedUser`), criação/leitura de convites (`createStudentRegistrationInvite`, `fetchStudentInviteById`), geração de URL (`buildStudentRegistrationUrl`), registro de vínculo (`recordCompanyStudentLink`) e reconciliação em lote (`reconcileEmpresasWithLinks`).
  - Ao finalizar o cadastro, o vínculo grava simultaneamente `empresaId`, `empresaName`, `userId` (UID), `studentId`, `email` e `inviteId` na coleção `company_student_links`, conclui o convite em `student_invites` e atualiza `linkedStudents` e `linkedStudentIds` na empresa correspondente.

### 3. Cadastro Público com Atribuição Automática à Empresa
- **`src/components/CadastroPage.tsx`** & **`src/lib/firebase.ts`**:
  - Adicionado suporte aos parâmetros de convite na URL (`invite`, `empresaId`, `empresa`, `invitedBy`, `name`, `email`) com exibição de banner institucional da empresa remetente.
  - Criado `registerFirebaseAuthAccount` para criação real de conta no Firebase Authentication (incluindo instância secundária isolada caso haja sessão administrativa aberta no mesmo navegador).
  - Ambos os fluxos (**Sou Aluno** e **Sou o Responsável do Aluno**) gravam `consentLgpd: true`, `empresaId`, `empresaName`, `registeredUserId`, `inviteToken`, registram o vínculo na empresa e exibem o **ID do Usuário (UID)** e a **Empresa Vinculada** no cartão de confirmação.

### 4. Visibilidade no Painel B2B, Login e Permissões
- **`src/components/tabs/EmpresasClientesTab.tsx`**:
  - Adicionados contador de alunos vinculados por empresa, botão **Link de Cadastro (Aluno)** por card e modal **Ver e-mails & IDs** exibindo nome, e-mail, ID do aluno e ID do usuário (`userId`).
- **`src/components/LoginPage.tsx`**, **`src/components/modals/NovoUsuarioModal.tsx`**, **`src/components/modals/EditarUsuarioModal.tsx`**, **`src/components/tabs/ConfiguracoesTab.tsx`**, **`src/App.tsx`**:
  - Provisionamento automático de perfil gerencial vinculado ao cadastrar uma empresa cliente, suporte a vínculo de `empresaId`/`empresaName` em usuários novos e editados, rota `?view=cadastro` prioritária em `App.tsx` e assinatura em tempo real da coleção `company_student_links`.
- **`src/types.ts`**, **`firebase-blueprint.json`**, **`firestore.rules`**, **`src/services/firebaseDbService.ts`**:
  - Atualização do modelo de dados, blueprint, sincronização em lote e regras de segurança do Firestore (deploy já realizado para `student_invites`, `company_student_links`, `system_users`, `empresas_clientes` e `students`).
- **`package.json`** e **`src/version.ts`**:
  - Versão incrementada de `v2.6.11` para `v2.6.12` (`buildNumber: 20261116.10`).

---

## Validações
- Regras do Firestore (`firestore.rules`) implantadas no projeto.
- Compilação (`npm run build`) e checagem de tipos/lint (`npm run lint` / `tsc --noEmit`) a serem verificadas na etapa final.
