# Registro Consolidado de Alterações — GL PRO FIT (`v2.6.3` até `v2.6.14`)

**Data de Consolidação:** 16 de Novembro de 2026  
**Faixa de Versões Coberta:** `v2.6.3` (Build `20261116.01`) → `v2.6.14` (Build `20261116.12`)  
**Plataforma:** GL PRO FIT Enterprise Suite  

---

## Sumário das Versões

| Versão | Build | Foco Principal |
| :--- | :--- | :--- |
| **v2.6.3** | `20261116.01` | E-mail Master (`glprofit.adm@gmail.com`), formatadores padrão (CPF/CNPJ/Telefone), envio de acesso B2B e menu dropdown de perfil no cabeçalho |
| **v2.6.4** | `20261116.02` | Correção da edição no Catálogo de Exercícios e inclusão de botão de exclusão de Empresa Cliente B2B |
| **v2.6.5** | `20261116.03` | Sub-aba *Planos e Serviços* no Financeiro, reset do GL Profit Pay (chave PIX), remoção da Maquininha POS e URL real em links de pagamento |
| **v2.6.6** | `20261116.04` | Centralização integral das sub-abas do módulo Financeiro (incluindo *Planos e Serviços*) no TopNav global |
| **v2.6.7** | `20261116.05` | Blindagem definitiva contra dados fictícios (*Zero-Mock Policy*), sincronização em tempo real no Firestore, Empty States e UX sem diálogos nativos |
| **v2.6.8** | `20261116.06` | Correção do erro de renderização React (`Objects are not valid as a React child`) no tratamento de erros do Firestore |
| **v2.6.9** | `20261116.07` | Saneamento do usuário Master, regras de permissões Firestore (`folha_*`, `users`, `system_users`) e listeners condicionados ao Firebase Auth |
| **v2.6.10** | `20261116.08` | Expurgo de usuários fictícios em Usuários & Permissões (mantendo apenas `GL PRO FIT ADM`) e correção funcional do botão Excluir |
| **v2.6.11** | `20261116.09` | Exclusividade do Administrador Master via `glprofit.adm@gmail.com`, migração automática da sessão do cabeçalho e bloqueio de `marinho.gianluca@gmail.com` |
| **v2.6.12** | `20261116.10` | Botão e modal de envio de Link de Cadastro para Aluno com vínculo automático (UID + e-mail + aluno ↔ empresa emissora) |
| **v2.6.13** | `20261116.11` | Remoção de nomes legados fictícios (`VB SPORT`) no vínculo de empresa, usando exclusivamente a empresa cadastrada no sistema |
| **v2.6.14** | `20261116.12` | Backend completo de Login e Cadastro via Firebase Auth, criptografia de senhas (zero texto plano), vínculo obrigatório de `companyId`, aceite LGPD e isolamento multi-tenant |

---

## v2.6.3 — E-mail Master, Formatadores Padronizados, Envio de Acesso B2B e Menu de Perfil

**Data:** 16/11/2026 · **Build:** `20261116.01`

### 1. Visão Geral das Alterações
1. **Atualização do E-mail Master:** Migração completa do e-mail do administrador master para `glprofit.adm@gmail.com` em todo o ecossistema (serviços, regras de segurança do Firestore, seed scripts e documentação).
2. **Formatadores Padronizados:** Criação de funções utilitárias canônicas para normalização e formatação de Telefones, CPFs e CNPJs em todas as entradas de dados e cadastros.
3. **Envio de Acesso por E-mail (B2B):** Inclusão do botão *"Enviar Acesso por E-mail"* nos cards de empresas clientes na aba de Empresas Clientes B2B, permitindo disparar as credenciais de primeiro acesso.
4. **Menu Dropdown de Perfil no Cabeçalho:** Adicionada seta de expansão (`ChevronDown`) ao lado do perfil do usuário no cabeçalho superior, abrindo um menu com as opções **"Editar Cadastro"** e **"Sair (Logout)"**.

### 2. Detalhes Técnicos e Funcionais
- **E-mail do Administrador Master:** Atualizado em `userService.ts`, `partnerSchoolLicenseService.ts`, `InicioTab.tsx`, `PartnerSchoolLicenseModal.tsx`, `scripts/create-users.ts`, `firestore.rules` e `MANUAL_DO_SISTEMA.md` para `glprofit.adm@gmail.com`.
- **Formatadores Padrão (`src/utils.ts`):**
  - `formatPhone(val)`: Formata números para `(00) 00000-0000` / `(00) 0000-0000`.
  - `formatCpf(val)`: Formata CPFs para `000.000.000-00`.
  - `formatCnpj(val)`: Formata CNPJs para `00.000.000/0001-00`.
- **Botão "Enviar Acesso por E-mail" (`EmpresasClientesTab.tsx`):** Posicionado ao lado de *"Configurar Módulos & Funcionalidades"* nos cards de empresas clientes, disparando retorno visual de envio para o e-mail cadastrado da empresa parceira.
- **Menu Dropdown de Perfil (`Header.tsx`):** Componente interativo com seta de expandir/recolher no perfil logado com links diretos para editar o cadastro e encerrar a sessão.

---

## v2.6.4 — Correção da Edição no Catálogo de Exercícios e Exclusão de Empresa Cliente B2B

**Data:** 16/11/2026 · **Build:** `20261116.02`

### 1. Visão Geral das Alterações
1. **Correção do Botão "Editar Exercício" no Catálogo:** Corrigido o comportamento anterior em que clicar em editar abria um formulário genérico/aleatório de novo exercício. O modal passou a exibir o **exercício real selecionado** com todos os seus atributos (nome, grupo muscular, equipamento, instruções e link de vídeo) prontos para configuração e salvamento.
2. **Botão de Exclusão de Empresa Cliente (B2B):** Adicionado botão minimalista de exclusão (ícone de lixeira em vermelho) nos cards de empresas clientes na aba B2B, com confirmação de segurança.
3. **Padronização de Ações:** Consistência de botões minimalistas de edição e exclusão nas listagens principais do sistema.

### 2. Detalhes Técnicos
- **Catálogo de Exercícios (`ExerciseCatalogView.tsx`):** Estado `editingExercise` e modal dedicado de configuração pré-preenchido com os dados do item clicado na tabela, atualizando diretamente o item no catálogo.
- **Gestão de Empresas Clientes (`EmpresasClientesTab.tsx`):** Botão de exclusão conectado a `onDeleteEmpresa(emp.id)` com fluxo de confirmação.

---

## v2.6.5 — Sub-aba Planos e Serviços no Financeiro, Reset do GL Profit Pay e Remoção da Maquininha POS

**Data:** 16/11/2026 · **Build:** `20261116.03`

### 1. Visão Geral das Alterações
1. **Sub-aba "Planos e Serviços" no Financeiro:** Criada sub-aba dedicada dentro de *Financeiro* (`PlanosServicosView.tsx`) para criar, editar e excluir planos de mensalidade e serviços adicionais (Personal, Nutrição, Locações).
2. **Reset e Saneamento do GL Profit Pay:**
   - Expurgo de dados fictícios e chaves pré-configuradas.
   - Inclusão do botão **"Vincular Chave Pix"** com modal para conectar chave PIX e instituição bancária real.
3. **Remoção da Maquininha Smart POS:** A aba e todos os componentes relacionados à Maquininha Smart POS foram removidos totalmente do sistema.
4. **Links de Pagamento Reais:** No modal de criação de links de pagamento, foi adicionado o campo obrigatório para inserir a **URL real do link gerado no banco ou gateway** (`url`), substituindo URLs simuladas geradas por código.

### 2. Detalhes Técnicos
- **Módulo Financeiro & Planos e Serviços (`FinanceiroTab.tsx`, `PlanosServicosView.tsx`):** Inserção da sub-aba `planos_servicos` com CRUD completo para planos e pacotes de serviços.
- **GL Profit Pay (`VbSportPayTab.tsx`):** Limpeza de estados, adição do fluxo de vínculo de chave PIX e entrada de URL real do banco nos links de pagamento.

---

## v2.6.6 — Centralização das Sub-abas Financeiras no TopNav Global

**Data:** 16/11/2026 · **Build:** `20261116.04`

### 1. Resumo das Alterações
- **Centralização no `TopNav` (`src/components/TopNav.tsx`):**
  - Inclusão da sub-aba **`Planos e Serviços`** (`id: 'planos_servicos'`, ícone `Layers`, badge `'Novo'`) diretamente em `financeiroSubTabs`.
  - Mapeamento de fallback para a rota `'pay'` em `groups` apontando para `financeiroSubTabs` com `gl_profit_pay` ativo.
- **Remoção das Sub-abas Internas (`src/components/tabs/FinanceiroTab.tsx`):**
  - Remoção de `subTabButtons`, da barra seletora interna e do estado `internalSubTab`, passando o componente a consumir exclusivamente `activeSubTab` da navegação global (`App.tsx` + `TopNav`).
  - Inclusão de cabeçalho contextual limpo (título da sub-aba ativa + botão `Nova Movimentação`) em `receber`, `pagar`, `dre` e `extrato`.
- **Sincronização Global de Estado e CRUD de Planos (`src/App.tsx`, `src/services/tabSettingsService.ts`, `src/components/tabs/financeiro/PlanosServicosView.tsx`):**
  - Normalização da rota `'pay'` em `handleNavigateTab` para `currentTab = 'financeiro'` e `financeiroSubTab = 'gl_profit_pay'`.
  - Repasse de `plans`, `onAddPlan`, `onUpdatePlan` e `onDeletePlan` de `App.tsx` para `FinanceiroTab` com persistência global, `localStorage` e Firestore (`plans`).
  - Registro de `financeiro_planos_servicos` em `DEFAULT_TAB_CONFIGURATIONS` e `planos_servicos: 'Planos e Serviços'` em `SUBTAB_DISPLAY_NAMES` (`tabSettingsService.ts`).
  - Refatoração de `PlanosServicosView.tsx` para seções integradas e confirmação inline (sem `window.confirm()`).

---

## v2.6.7 — Blindagem Zero-Mock Policy & Sincronização Integral no Firestore

**Data:** 16/11/2026 · **Build:** `20261116.05`

### 1. Resumo Executivo
Implementação integral das diretrizes contra dados fictícios (**Zero-Mock Policy**) e consolidação da persistência em tempo real com o **Firebase Firestore** em todos os módulos críticos, assegurando que a interface reflita fielmente o estado real do banco de dados.

### 2. Eliminação Definitiva de Mock Data & Tratamento de Erros
- **Camada de Serviços e Regras Firebase:**
  - `src/services/firebaseDbService.ts`: Adicionado helper `sanitizeForFirestore` para remoção segura de `undefined`; removida a injeção de `initialSeedFallback` quando ocorria erro de leitura ou snapshot vazio; snapshots vazios (`[]`) propagam fielmente; erros em `saveDocToFirestore`, `deleteDocFromFirestore` e `fetchCollectionFromFirestore` são relançados para tratamento real na UI; adicionadas `additional_services`, `exercises_catalog` e `empresas_clientes` em `syncAllSystemDataToCloud`.
  - `firestore.rules` & `firebase-blueprint.json`: Adicionada entidade `AdditionalService` e regras para `/additional_services/{serviceId}`; escrita em `/plans/{planId}` e `/system_settings/pay_pix_config` liberada para `admin`, `gerente` e `financeiro`.
  - `src/App.tsx` & `src/components/DatabaseStatusBadge.tsx`: Removidos fallbacks `INITIAL_*` das assinaturas do Firestore; integrada `subscribeDatabaseStatus` com banner global de erro de conexão e botão **"Tentar Reconectar"**; limpeza de placeholder avatar/CPF/valor em `handleConvertLeadToStudent`.

### 3. Mudanças por Módulo
- **Ficha 360° do Aluno & Avaliações (`AlunosTab.tsx`, `FichaCompletaAlunoView.tsx`, `AvaliacoesHubView.tsx`, `AvaliacoesFisicasTab.tsx`, `BemEstarTab.tsx`, `TreinosTab.tsx`):**
  - Remoção de `INITIAL_PLANS`, `INITIAL_PRODUCTS`, `SERVICOS_ACADEMIA`, `AVATAR_PRESETS`, percentuais e medidas corporais fictícias, `DEFAULT_STUDENT_FALLBACK` e do gerador sintético de 3 avaliações em `getAssessmentsForStudent`.
  - Consumo real de `plans`, `products` e `additional_services` via Firestore, cálculo nutricional baseado na avaliação física real mais recente, Empty States explícitos e confirmação inline LGPD em duas etapas (`confirmLgpdDeleteStep`).
- **Módulo B2B / Empresas Clientes (`EmpresasClientesTab.tsx`):**
  - Sincronização com a coleção `empresas_clientes` no Firestore, remoção de valores default fictícios (`'Plano Pro Box'`, `890.00`, `25`), Empty States e confirmação inline de exclusão.
- **Financeiro, Planos e Serviços & GL Profit Pay (`FinanceiroTab.tsx`, `VbSportPayTab.tsx`, `PlanosServicosView.tsx`, `PlanosView.tsx`):**
  - Cálculo de DRE apenas sobre transações reais pagas; taxa de aprovação dinâmica em `VbSportPayTab` (`'—'` quando vazio); persistência da chave Pix em `system_settings/pay_pix_config`; planos e serviços reais no Firestore.
- **Catálogo Biomecânico de Treinos (`ExerciseCatalogView.tsx`):**
  - Assinatura em tempo real de `exercises_catalog` no Firestore com criação, edição de exercícios reais e exclusão (remoção direta para customizados e tombstone `isDeleted: true` para catálogo base), além de banner de erro (`catalogSyncError`) e toast.
- **UX Sem Diálogos Nativos:** Substituição de `window.alert` / `window.confirm` por popovers, toasts React e confirmações inline em todo o sistema.

---

## v2.6.8 — Correção de Erro de Renderização React no Catálogo de Exercícios

**Data:** 16/11/2026 · **Build:** `20261116.06`

### 1. Diagnóstico
O runtime do React lançava `Error: Objects are not valid as a React child (found: [object Error])` porque o callback `onError` de `subscribeToFirestoreCollection('exercises_catalog', ...)` em `ExerciseCatalogView.tsx` armazenava a instância `Error` diretamente em `catalogSyncError` e a renderizava no JSX.

### 2. Correções Aplicadas
- **`src/components/tabs/treino/ExerciseCatalogView.tsx`:** Conversão explícita para texto (`err instanceof Error ? err.message : String(err)`) no callback `onError` e guarda na renderização de `catalogSyncError`.
- **`src/services/firebaseDbService.ts`:** Padronização da conversão segura da mensagem de erro no listener `onSnapshot` de `subscribeToFirestoreCollection`.
- **`src/components/tabs/financeiro/PlanosServicosView.tsx`:** Verificação segura de erro em string no callback de erro da coleção `additional_services`.

---

## v2.6.9 — Saneamento de Usuários e Permissões Firestore

**Data:** 16/11/2026 · **Build:** `20261116.07`

### 1. Alterações Aplicadas
- **Saneamento de Usuários (`src/services/userService.ts`):**
  - `INITIAL_SYSTEM_USERS` consolidado para manter exclusivamente `GL PRO FIT ADM` (`id: 'admin-master-01'`, `email: 'glprofit.adm@gmail.com'`, `role: 'admin'`, `phone: '(61)992095123'`, `department: 'Diretoria Executiva & Master'`, `permissions: ['all']`).
  - Migração automática de cadastros legados (`usr-1`) em `getSystemUsers()` e suporte à permissão `'all'` em `hasTabPermission()`.
  - Sincronização de `system_users` condicionada à sessão autenticada no Firebase Auth.
- **Regras e Permissões do Firestore (`firestore.rules`):**
  - `userRole()` aprimorado para consultar `/users/$(request.auth.uid)` e `/system_users/$(request.auth.uid)`.
  - Inclusão de regras explícitas para `folha_teachers`, `folha_turmas` e `folha_records` (antes bloqueadas pelo catch-all).
- **Blindagem de Listeners Pré-Autenticação:**
  - `src/App.tsx`: Rastreamento de `firebaseUser` via `onAuthStateChanged`; assinaturas e sincronizações só executam com `isAuthenticated && firebaseUser` ativos; `signOut(auth)` integrado ao `handleLogout` e botão **"Autenticar Firebase"** no banner de erro.
  - `tabSettingsService.ts`, `folhaPontoService.ts`, `ExerciseCatalogView.tsx`, `PlanosServicosView.tsx` e `FichaCompletaAlunoView.tsx`: Listeners condicionados a `onAuthStateChanged`.

---

## v2.6.10 — Limpeza de Usuários Fictícios e Exclusão Funcional

**Data:** 16/11/2026 · **Build:** `20261116.08`

### 1. Alterações Aplicadas
- **Remoção Definitiva de Usuários Fictícios (`src/services/userService.ts`):**
  - Flag `glprofit_users_clean_v2610` redefinindo a lista inicial do `localStorage` para manter apenas `GL PRO FIT ADM` (`admin-master-01` / `glprofit.adm@gmail.com`).
  - Filtro `isLegacyFictitiousUser` na leitura local e na sincronização com `system_users` no Firestore, expurgando registros fictícios legados (`usr-1` a `usr-6` e e-mails de demonstração) inclusive na nuvem.
  - Nova função `deleteSystemUser(userId)` removendo o usuário localmente, disparando evento de atualização reativa e excluindo o documento no Firestore (`deleteDocFromFirestore('system_users', userId)`).
- **Correção do Botão de Excluir Usuário (`src/components/tabs/ConfiguracoesTab.tsx`):**
  - Substituição do `confirm()` nativo por botões inline **Confirmar / Cancelar** (`confirmDeleteUserId`) executando `deleteSystemUser(userId)`.
  - Bloqueio de exclusão do Administrador Master (`GL PRO FIT ADM`) e da sessão atual, e exibição de **"Acesso Total (Todos os módulos)"** quando `permissions` inclui `'all'`.

---

## v2.6.11 — Exclusividade do Administrador Master (`glprofit.adm@gmail.com`)

**Data:** 16/11/2026 · **Build:** `20261116.09`

### 1. Migração e Higienização da Sessão Ativa (`userService.ts`, `App.tsx`, `Header.tsx`, `InicioTab.tsx`)
- **Causa raiz corrigida:** Sessões anteriores persistidas em `localStorage` (`vbsport_active_user`) com `Gianluca Marinho` (`marinho.gianluca@gmail.com`) faziam o cabeçalho superior direito exibir o e-mail legado enquanto *Configurações → Usuários & Permissões* já mostrava `GL PRO FIT ADM`.
- Implementada `isLegacyMasterOrOldAdmin()` e flag `glprofit_master_session_v2611` em `userService.ts`.
- `getActiveSessionUser()` executa `getSystemUsers()` previamente e migra sessões antigas para `admin-master-01` (`GL PRO FIT ADM` / `glprofit.adm@gmail.com`).
- `setActiveSessionUser()` emite evento `glprofit_active_user_updated` escutado por `App.tsx` para atualizar reativamente o `<Header />`.
- `saveSystemUsers()` remove qualquer propriedade `password` antes de salvar ou sincronizar no Firestore.
- Fallback de nome no `<Header />` atualizado para `"GL PRO FIT ADM"` e saudação padrão em `InicioTab.tsx` ajustada para `'Administrador'`.

### 2. Bloqueio de `marinho.gianluca@gmail.com` e Autenticação Master
- `App.tsx`: `onAuthStateChanged` encerra automaticamente sessões residuais com `marinho.gianluca@gmail.com` e `handleLoginSuccess` rejeita logins com esse e-mail.
- `LoginPage.tsx`: Rejeita login por e-mail/senha ou Google com `marinho.gianluca@gmail.com`.
- `partnerSchoolLicenseService.ts`: `isMasterAdministrator()` valida exclusivamente `glprofit.adm@gmail.com` e `admin-master-01`.
- `EsqueciSenhaModal.tsx`: Integrado com `sendPasswordResetEmail(auth, cleanEmail)` para `glprofit.adm@gmail.com` com tela de confirmação (`email_sent`).
- `firestore.rules` e `scripts/create-users.ts`: Removida a exceção de `marinho.gianluca@gmail.com` em `isMasterAdminEmail()`, mantendo apenas `glprofit.adm@gmail.com`, com conta provisionada no Firebase Auth (`displayName: "GL PRO FIT ADM"`).

---

## v2.6.12 — Envio de Link de Cadastro para Aluno com Vínculo Automático por Empresa

**Data:** 16/11/2026 · **Build:** `20261116.10`

### 1. Resumo Executivo
Implementação do fluxo completo de **Envio de Link de Cadastro para Alunos** na aba **Clientes** (ao lado de *Cadastrar Novo Aluno*) e no módulo **Empresas Clientes**, vinculando automaticamente o **e-mail** e **ID de usuário (UID)** do aluno à empresa remetente (Empresa Cliente B2B ou Matriz).

### 2. Alterações Realizadas
- **Botão e Modal de Envio (`AlunosTab.tsx`, `EnviarLinkCadastroModal.tsx`):**
  - Botão **Enviar Link de Cadastro** posicionado ao lado de **Cadastrar Novo Aluno** e no estado vazio da listagem.
  - Exibição de selo da empresa vinculada em cada linha da tabela, filtro por empresa para administração global e isolamento automático para operadores vinculados a uma `EmpresaCliente`.
  - Modal identifica automaticamente a empresa ativa do usuário logado (`resolveActiveEmpresaForUser`), trava seleção para usuários B2B, permite pré-preenchimento opcional (nome, e-mail, WhatsApp, plano) e gera URL personalizada (`?view=cadastro&invite=...&empresaId=...`) com ações de **Copiar Link**, **Enviar no WhatsApp**, **Testar / Visualizar** e histórico de status (`Aguardando` / `Vinculado`).
- **Serviço de Convites e Vinculação (`src/services/studentInviteService.ts`):**
  - Funções `resolveActiveEmpresaForUser`, `isCompanyScopedUser`, `createStudentRegistrationInvite`, `fetchStudentInviteById`, `buildStudentRegistrationUrl`, `recordCompanyStudentLink` e `reconcileEmpresasWithLinks`.
  - Grava simultaneamente `empresaId`, `empresaName`, `userId` (UID), `studentId`, `email` e `inviteId` em `company_student_links`, conclui `student_invites` e atualiza `linkedStudents` e `linkedStudentIds` na empresa.
- **Cadastro Público & Visibilidade B2B (`CadastroPage.tsx`, `firebase.ts`, `EmpresasClientesTab.tsx`, `NovoUsuarioModal.tsx`, `EditarUsuarioModal.tsx`, `ConfiguracoesTab.tsx`, `App.tsx`, `firestore.rules`):**
  - Fluxos **Sou Aluno** e **Sou o Responsável do Aluno** com criação real via `registerFirebaseAuthAccount` (instância secundária isolada quando há sessão administrativa ativa no mesmo navegador) e exibição do UID e Empresa Vinculada.
  - Painel B2B com contador de alunos vinculados, botão **Link de Cadastro (Aluno)** e modal **Ver e-mails & IDs**; provisionamento de perfil gerencial vinculado ao criar empresa cliente; novas regras em `firestore.rules` para `student_invites` e `company_student_links`.

---

## v2.6.13 — Remoção de Nome Fictício no Vínculo de Empresa

**Data:** 16/11/2026 · **Build:** `20261116.11`

### 1. Problema Resolvido
No modal **"Enviar Link de Cadastro para o Aluno"**, o card **Empresa Responsável pelo Vínculo** exibia o nome legado `"VB SPORT ACADEMIA E CENTRO FITNESS LTDA"`, oriundo de dados antigos armazenados em `system_settings/general` e `vbsport_settings`.

### 2. Alterações Realizadas
- **Sanitização e Resolução Fiel (`src/services/studentInviteService.ts`):**
  - Criados os utilitários `isLegacyPlaceholderCompanyName`, `sanitizeGymSettings` e `resolveRegisteredMainCompanyName`.
  - Qualquer resquício legado de `"VB SPORT"` em `gymName`, `tradeName`, `email` ou `welcomeMessage` é substituído automaticamente por `GL PRO FIT`, preservando fielmente nomes reais cadastrados pelo administrador em **Configurações → Geral** ou pelas **Empresas Clientes**.
  - `resolveActiveEmpresaForUser` passa a bloquear nomes legados residuais e priorizar o nome cadastrado da empresa ativa.
- **Sincronização & Limpeza de Rótulos (`App.tsx`, `EnviarLinkCadastroModal.tsx`, `ConfiguracoesTab.tsx`, `DashboardsTab.tsx`, `VendasTab.tsx`, `tabSettingsService.ts`, `partnerSchoolLicenseService.ts`):**
  - `App.tsx` aplica `sanitizeGymSettings` na leitura inicial e no listener `system_settings` (documento `id === 'general'`) e repassa `mainCompanyDisplayName` para `CadastroPage` e `AlunosTab`.
  - Limpeza dos rótulos residuais `"VB SPORT ADM"` / `"VB SPORT"` em modais, dashboards e configurações.

---

## v2.6.14 — Backend de Login e Cadastro: Firebase Auth, Zero Texto Plano, Multi-Tenant e LGPD

**Data:** 16/11/2026 · **Build:** `20261116.12`

### 1. Resumo Executivo
Implementação completa da lógica de backend, autenticação segura, validação de dados, vínculo multi-tenant B2B e conformidade LGPD nos fluxos de **Login** e **Cadastro**, preservando **100% intacto** todo o front-end (JSX, classes Tailwind, posicionamento e layout).

### 2. Preservação Integral do Front-End
- `src/components/LoginPage.tsx` e `src/components/CadastroPage.tsx` tiveram apenas a lógica de negócio/autenticação atualizada; nenhuma estrutura visual, classe Tailwind ou layout foi alterado.

### 3. Segurança, Firebase Authentication & Zero Plaintext Password
- **`src/lib/firebase.ts`:**
  - Implementação de `signInWithFirebaseEmail(email, password)` (`signInWithEmailAndPassword`) e `registerFirebaseAuthAccount` (`createUserWithEmailAndPassword` com app secundário isolado para evitar troca de sessão quando um operador cria cadastro no mesmo navegador).
  - Implementação de `mapFirebaseAuthError(error, context)` tratando todos os erros críticos do Firebase Auth em português (`auth/invalid-credential`, `auth/wrong-password`, `auth/user-not-found`, `auth/invalid-email`, `auth/too-many-requests`, `auth/user-disabled`, `auth/email-already-in-use`, `auth/weak-password`, `auth/missing-password`, `auth/missing-email`, `auth/operation-not-allowed`, `auth/network-request-failed`).
- **`src/components/LoginPage.tsx`:**
  - Remoção definitiva de qualquer bypass permissivo por comprimento de senha (`password.length >= 6`) para equipe, aluno ou empresa cliente B2B.
  - Validação rigorosa de e-mail, bloqueio do legado `marinho.gianluca@gmail.com`, limitador local de tentativas consecutivas (`checkLoginLockout` / `recordFailedLoginAttempt`) integrado ao bloqueio do Firebase (`auth/too-many-requests`), e hidratação de perfil diretamente do Firestore (`users/{uid}`, `system_users/{uid}`, `students` por `registeredUserId` e `empresas_clientes` por `email`).
  - Substituição do antigo stub simulado de registro em `handleRegister` por criação real no Firebase Auth (`registerFirebaseAuthAccount`), aceite LGPD obrigatório e gravação em `users` e `system_users` sem campo `password`.
- **`src/components/CadastroPage.tsx`:**
  - Remoção de fallbacks locais caso o Firebase Auth falhe; erros abortam com mensagem mapeada por `mapFirebaseAuthError`.
  - Validação estrita de campos obrigatórios, formato de e-mail, CPF de 11 dígitos (obrigatório para responsável, validado quando informado pelo aluno), confirmação de senha (`>= 6` caracteres) e bloqueio do e-mail legado.
- **`src/services/firebaseDbService.ts`:**
  - `sanitizeForFirestore` remove recursivamente qualquer propriedade `password` além de `undefined`, e `subscribeToFirestoreCollection` passa a suportar `constraints?: QueryConstraint[]`.

### 4. Vínculo Automático com a Empresa (B2B Multi-Tenant)
- **`src/types.ts` & `src/services/studentInviteService.ts`:**
  - Adicionado o campo canônico `companyId` em `Student`, `SystemUser`, `StudentRegistrationInvite` e `CompanyStudentLink` (mantendo retrocompatibilidade com `empresaId`), e emissão de `companyId` + `empresaId` em `buildStudentRegistrationUrl`.
- **`src/components/CadastroPage.tsx`:**
  - Captura automática de `companyId` (`companyId`, `empresaId` ou `tenantId`) e convite (`invite`, `inviteId`, `token`) dos parâmetros da URL para os fluxos **"Sou Aluno"** e **"Sou o Responsável do Aluno"**.
  - Injeção obrigatória de `companyId`, `empresaId` e `empresaName` no payload salvo em `users`, `system_users`, `students` e `company_student_links`.
- **`src/App.tsx` & `src/components/modals/EnviarLinkCadastroModal.tsx`:**
  - `handleAddStudent` e `handleConvertLeadToStudent` injetam `companyId` e `consentLgpd: true`.
  - Listeners em tempo real (`onSnapshot`) aplicados com filtros por `companyId` (para empresas B2B em `students`, `company_student_links`, `empresas_clientes`, `student_invites`) e por `UID` (para alunos em `students` e `company_student_links`), além de guardas de escrita por papel.

### 5. Conformidade LGPD, Regras Firestore & Guardas de Listeners
- **`firestore.rules` & `firebase-blueprint.json`:**
  - Blueprint atualizado com `/users/{userId}`, `/empresas_clientes/{empresaId}` e campos `companyId`, `consentLgpd`, `consentLgpdDate`, `consentLgpdVersion`.
  - Regras `firestore.rules` com catch-all deny, bloqueio `!('password' in request.resource.data)`, exigência de `consentLgpd == true` e `hasValidCompanyId(incoming())` no auto-cadastro em `users`, `system_users` e `students`, proteção contra auto-elevação de `role` ou alteração de `companyId` e isolamento multi-tenant (`matchesUserTenant`).
  - Regras publicadas na nuvem via `DeployRules`.
- **`src/services/userService.ts` & `src/services/folhaPontoService.ts`:**
  - Guardas nos listeners de `onAuthStateChanged` impedindo que perfis `aluno` ou não autorizados executem leituras em `system_users` ou `folha_*`.

### 6. Validações Consolidadas (`v2.6.14`)
- **Testes Automatizados (`vitest run`):** 12/12 aprovados (`tests/rules.test.ts` e `tests/calculos.test.ts`).
- **Compilação (`vite build`) & TypeScript (`tsc --noEmit`):** Aprovados com 0 erros.
- **Deploy Firestore Rules:** Regras em nuvem atualizadas e ativas.
