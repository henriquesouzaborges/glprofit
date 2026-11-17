# Registro Técnico de Alterações Consolidado — Versões v2.5.0, v2.5.1 e v2.5.2 (GL PRO FIT)

**Data de Compilação:** 11 de Novembro de 2026  
**Sistema:** GL PRO FIT Enterprise Suite  
**Autor:** Engenheiro de Software Lead — AI Studio  

Este documento reúne de forma íntegra e detalhada o histórico de alterações técnicas, melhorias de infraestrutura, segurança, regras de negócio e procedimentos de expurgo de dados efetuados nas versões **v2.5.0**, **v2.5.1** e **v2.5.2**.

---

# Parte 1: Versão v2.5.0 — Backend Server-Side, Segurança Firebase Auth/Firestore, LGPD & B2B SaaS

### Informações Gerais
- **Versão:** `v2.5.0`
- **Data da Liberação:** 11/11/2026
- **Build Number:** `20261111.03`
- **Objetivo Principal:** Implementação das diretrizes do Briefing Técnico v2.4.36 / v2.5.0 cobrindo backend server-side, segurança Firebase Auth/Firestore rules, LGPD, remoção de fakes, persistência B2B de Empresas Clientes, testes unitários e documentação.

---

### Detalhamento das Alterações Realizadas na v2.5.0

#### 1. Proteção Server-Side & Middleware (`server.ts`)
- **Autenticação de Token:** Middleware `verifyAuthToken` integrando Firebase Admin SDK para verificação de tokens Bearer.
- **Rate Limiting:** Implementado limitador deslizante de **30 chamadas/hora por UID** para as rotas `/api/ai/*` e `/api/lgpd/export/*`.
- **Limites de Payload:** Restrição de tamanho de corpo HTTP a **1MB** por padrão e **10MB** para a rota `/api/migrate`.
- **Rotas LGPD REST:**
  - `GET /api/lgpd/export/:studentId`: Retorna exportação estruturada em JSON de dados pessoais, treinos, avaliações e financeiro.
  - `DELETE /api/lgpd/delete/:studentId`: Executa expurgo/anonimização de dados com registro em log de auditoria.

#### 2. Tratamento Gracioso de Cota de IA & Fakes (`server.ts`, `aiDashboardService.ts`, `GerencialDashboard.tsx`, `FinanceiroDashboard.tsx`)
- **Remoção de Dados Fakes:** Eliminados fallbacks numéricos fictícios (ex: EBITDA 35.4%, R$ 54.890,00, nota de saúde 86).
- **Resposta 503:** Na falha ou esgotamento de quota da Gemini API, o servidor responde `HTTP 503 Service Unavailable` com mensagem transparente ao usuário, sem exibir relatórios falsos.
- **Cálculos Dinâmicos:** `GerencialDashboard` e `FinanceiroDashboard` calculam receita, despesas e métricas em tempo real a partir dos arrays `transactions` e `students`.

#### 3. Autenticação Firebase Auth (`LoginPage.tsx`, `userService.ts`, `types.ts`, `scripts/create-users.ts`)
- Autenticação real com `signInWithEmailAndPassword` via SDK do Firebase.
- Remoção da propriedade `password` em texto claro do tipo `SystemUser` e das listas de dados.
- Adição da flag `mustChangePassword` para exigir redefinição de senha no primeiro login.
- Criação do script de provisionamento `scripts/create-users.ts` com atribuição de custom claims (`role`).

#### 4. Regras de Segurança do Firestore (`firestore.rules`)
- Proibição da chave `password` no documento (`!('password' in request.resource.data)`).
- Enforcement de papéis (`userRole()`) em coleções sensíveis:
  - `empresas_clientes`: Exclusivo para perfil `admin`.
  - `physical_assessments` e `wellness_checkins`: Restrito a `admin`, `gerente`, `treinador` e `financeiro`.
- Obrigatoriedade de `consentLgpd == true` na criação de novos alunos em `students`.
- Negação padrão (`allow read, write: if false;`) para coleções não explicitadas.

#### 5. Persistência B2B SaaS & Gestão de Empresas Clientes (`App.tsx`, `EmpresasClientesTab.tsx`)
- Substituição do `localStorage` isolado por escuta em tempo real (`subscribeToFirestoreCollection('empresas_clientes', ...)`).
- Operações de cadastro, alteração e exclusão vinculadas a `saveDocToFirestore` e `deleteDocFromFirestore` com mensagens de toast.
- **Bloqueio de Acesso:** Verificação automatizada no login; caso a empresa associada possua `status === 'bloqueado'`, o acesso é suspenso com notificação em tela.

#### 6. Interface & Conformidade LGPD (`FichaCompletaAlunoView.tsx`, `NovoAlunoModal.tsx`)
- Banner de aviso visual de pendência de consentimento LGPD para alunos sem `consentLgpd`.
- Botão "Registrar Consentimento LGPD" preenchendo `consentLgpdDate` e `consentLgpdVersion: "2026-11"`.
- Card de Conformidade LGPD permitindo portabilidade JSON (download de `lgpd_export_[id].json`) e duplo aceite para o Direito ao Esquecimento.

#### 7. Badges de Ambiente & Arquivos de Suporte
- Adição do badge `"Simulado — ambiente de testes"` nos cabeçalhos de `WhatsappTab.tsx` e `VbSportPayTab.tsx`.
- Criação dos manuais de produção em `/docs/`: `BACKUP.md`, `LGPD.md`, `INTEGRACOES.md` e `DEPLOY.md`.
- Criação de `Dockerfile` e `.env.example`.
- Testes unitários automatizados: `tests/calculos.test.ts` e `tests/rules.test.ts`.

---

# Parte 2: Versão v2.5.1 — Reset de Produção & Expurgo Inicial de Dados Fictícios

### Informações Gerais
- **Versão:** `v2.5.1`
- **Data da Liberação:** 11/11/2026
- **Build Number:** `20261111.04`
- **Objetivo Principal:** Expurgo completo e reinicialização de dados fictícios (mock data) de demonstração em alunos, financeiro, treinos, leads, produtos, comandas e fornecedores.

---

### Detalhamento das Alterações Realizadas na v2.5.1

#### 1. Expurgo em `src/mockData.ts`
- Preservação estrita de `INITIAL_SETTINGS` (Dados Cadastrais Oficiais do GL PRO FIT).
- Reconfiguração dos planos padrão (`INITIAL_PLANS`) com `activeStudentsCount: 0`.
- Definição dos arrays como virgens (`[]`):
  - `INITIAL_STUDENTS = []`
  - `INITIAL_TRANSACTIONS = []`
  - `INITIAL_PRODUCTS = []`
  - `INITIAL_CLASSES = []`
  - `INITIAL_WORKOUTS = []`
  - `INITIAL_LEADS = []`
  - `INITIAL_COMANDAS = []`
  - `INITIAL_STOCK_MOVEMENTS = []`
  - `INITIAL_SUPPLIERS = []`
  - `INITIAL_PAY_RECURRING = []`
  - `INITIAL_PAYMENT_LINKS = []`
  - `INITIAL_CRM_ACTIVITIES = []`
  - `INITIAL_SATISFACTION_SURVEYS = []`
  - `INITIAL_CALENDAR_EVENTS = []`

#### 2. Usuário Administrador em `src/services/userService.ts`
- Atualização da lista `INITIAL_SYSTEM_USERS` para conter **exclusivamente** o usuário administrador:
  - **Nome:** Gianluca Marinho
  - **Email:** marinho.gianluca@gmail.com
  - **Role:** `admin` (Administrador Geral)
  - **Avatar:** `''` (Foto fictícia removida)
  - **Permissões:** Acesso total a todos os módulos (`all`)

#### 3. Limpeza Inicial de Módulos Operacionais
- `INITIAL_WHATSAPP_CHATS = []`, `INITIAL_MESSAGES_MAP = {}`, `INITIAL_CAMPAIGNS = []` em `src/mockWhatsappData.ts`.
- `INITIAL_ASSESSMENTS = []` e `INITIAL_WELLNESS_CHECKINS = []` em `AvaliacoesFisicasTab.tsx` e `BemEstarTab.tsx`.

#### 4. Purge no Navegador (`App.tsx`)
- Gatilho automático `glprofit_clean_slate_v251` para limpar dados de demonstração em cache no `localStorage` do navegador.

---

# Parte 3: Versão v2.5.2 — Expurgo Completo B2B SaaS, Folha de Ponto, Conexão WhatsApp, Cargas 1RM e Avaliações Físicas

### Informações Gerais
- **Versão:** `v2.5.2`
- **Data da Liberação:** 11/11/2026
- **Build Number:** `20261111.05`
- **Objetivo Principal:** Expurgo cirúrgico e definitivo dos resíduos de dados fictícios em Empresas Clientes B2B, Folha de Ponto/Professores, Eventos de Jogos, Conexão do WhatsApp, Cargas 1RM e histórico de Avaliações Físicas.

---

### Detalhamento das Alterações Realizadas na v2.5.2

#### 1. Empresas Clientes (B2B SaaS) (`src/components/tabs/EmpresasClientesTab.tsx`)
- Remoção da empresa cliente fictícia `GL PRO FIT Matriz` (`emp-1`) do array `INITIAL_EMPRESAS_CLIENTES`.
- `export const INITIAL_EMPRESAS_CLIENTES: EmpresaCliente[] = [];`. O módulo B2B SaaS inicia totalmente virgem sem nenhuma empresa cliente cadastrada.

#### 2. Professores, Folha de Ponto & Eventos (`src/services/folhaPontoService.ts`)
- `INITIAL_TEACHERS = []`: Expurgo dos perfis simulados de professores (`prof-1`, `prof-2`, `prof-3`, `prof-4`).
- `INITIAL_TURMAS = []`: Expurgo das turmas fixas de teste (`turma-1` a `turma-6`).
- `INITIAL_EVENTOS = []`: Expurgo de eventos de jogos e aulões comemorativos.
- `INITIAL_RECORDS = []`: Expurgo dos registros históricos de aulas lecionadas na folha de ponto.

#### 3. Conexão do WhatsApp (`src/mockWhatsappData.ts`)
- Reconfiguração da constante `INITIAL_WHATSAPP_CONNECTION` com `status: 'desconectado'`, `companyId: ''`, `phone: ''`, `apiToken: ''`, `connectedAt: ''`.
- O painel de atendimento do WhatsApp inicia em estado desconectado, pronto para pareamento via QR Code / token Meta Cloud real.

#### 4. Controle de Carga 1RM & Avaliações Físicas (`exerciseDatabase.ts` & `AvaliacoesHubView.tsx`)
- `INITIAL_LOAD_LOGS = {}`: Limpeza total do mapa de logs de cargas dos alunos.
- `INITIAL_PHYSICAL_TESTS = []`: Expurgo dos testes físicos simulados (Cooper, 1RM, Wells).
- Remoção de linhas sintéticas de avaliações físicas no histórico da `AvaliacoesHubView.tsx`, exibindo mensagem padronizada de estado vazio ("Nenhuma avaliação física cadastrada no histórico").

#### 5. Purge Automático de Navegador Atualizado (`App.tsx`)
- Chave de reset atualizada para `glprofit_clean_slate_v252` incluindo `vbsport_empresas_clientes`, `vbsport_folha_teachers`, `vbsport_folha_turmas`, `vbsport_folha_eventos`, `vbsport_folha_records`, `vbsport_load_logs`, `vbsport_physical_tests` e `vbsport_whatsapp_config`.

---

## Síntese de Validação & Compilação Final

| Indicador / Teste | Resultado Versão v2.5.0 | Resultado Versão v2.5.1 | Resultado Versão v2.5.2 |
| :--- | :--- | :--- | :--- |
| **Status da Compilação (`npm run build`)** | Aprovado | Aprovado | Aprovado |
| **Checagem de Tipagem (`tsc --noEmit`)** | 0 Erros | 0 Erros | 0 Erros |
| **Sincronia em Nuvem (Firebase Firestore)** | Conectado | Conectado | Conectado |
| **Estado dos Dados** | Estruturado | Virgem | 100% Virgem |
| **Usuário Ativo** | Gianluca Marinho | Gianluca Marinho | Gianluca Marinho |

O sistema **GL PRO FIT Enterprise Suite** encontra-se na versão **v2.5.2**, perfeitamente alinhado com todas as especificações técnicas, de segurança, LGPD e governança de produção.
