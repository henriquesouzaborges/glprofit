# Dossiê de Contexto Geral — Sistema GL PRO FIT

> **Instrução para IA / Gemini:** Utilize este documento como fonte única de contexto técnico, arquitetural e funcional sobre o sistema **GL PRO FIT**. Todas as respostas, análises, evoluções de código ou suporte operacional devem respeitar fielmente a arquitetura, nomenclatura de módulos, regras de negócio e padrões visuais descritos abaixo.

---

## 1. Identidade e Visão Geral do Sistema
- **Nome Oficial:** GL PRO FIT (`GL PRO FIT Enterprise Suite`)
- **Slogan / Descrição Institucional:** *Sistema de Gestão Profissional para Performance, Análise e Controle*
- **Versão Ativa:** `v2.6.6` (Build `20261116.04` — Novembro/2026)
- **Administrador Master Padrão:** Gianluca Marinho (`glprofit.adm@gmail.com`)
- **Objetivo do Produto:** Plataforma SaaS B2B/B2C completa para gestão de academias, estúdios, boxes, escolinhas esportivas e centros de treinamento de alta performance — integrando operação administrativa, financeiro, cobrança recorrente, prescrição de treinos, avaliações físicas, monitoramento de bem-estar, CRM comercial, estoque/PDV e gestão multiempresa (licenciamento B2B).

---

## 2. Stack Tecnológica e Arquitetura

### 2.1 Front-End
- **Framework:** React 19 + TypeScript (`~5.8.2`) + Vite (`^6.2.3`)
- **Estilização:** Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss";`)
- **Ícones:** `lucide-react`
- **Animações:** `motion` e transições CSS utilitárias
- **Carregamento Otimizado:** Lazy loading (`React.lazy` + `Suspense`) para todos os módulos principais em `src/App.tsx`.

### 2.2 Back-End & IA
- **Servidor:** Node.js + Express (`server.ts`, executado com `tsx` em dev e `node server.ts` em produção na porta `3000`, servindo `vite.middlewares` em modo SPA).
- **Inteligência Artificial (`@google/genai`):** Rota server-side `POST /api/ai/dashboard-report` utilizando Gemini (`gemini-3.8-flash`) com fallback determinístico caso não haja cota/chave disponível, além de serviços analíticos e de migração assistida (`analiseAiService.ts`, `aiDashboardService.ts`, `migrationService.ts`).

### 2.3 Banco de Dados e Persistência
- **Nuvem (Principal):** Firebase Firestore (`ai-studio-vbsportadm-f4a72c22-1567-475f-a82d-18ccf669ad1b`) via `src/lib/firebase.ts` e `src/services/firebaseDbService.ts`.
- **Sincronização Híbrida em Tempo Real:** `subscribeToFirestoreCollection` + `syncCollectionToFirestore` + `saveDocToFirestore` + `deleteDocFromFirestore`, com cache local em `localStorage` para resposta instantânea na interface.
- **Estado de Dados Limpo (Produção):** Dados de demonstração/fictícios foram expurgados (marcos v2.5.3 / v2.6.0 / v2.6.5); métricas de BI, DRE, relatórios e gateway operam exclusivamente sobre registros reais.

---

## 3. Layout, Identidade Visual e Navegação Global

### 3.1 Cabeçalho Superior (`src/components/Header.tsx`)
- **Fundo Branco (`bg-white`):** Destaca a logomarca oficial **GL PRO FIT** (`GLProFitLogo`).
- **Espaço White-Label para Cliente B2B:** Ao lado da logomarca oficial existe o espaço reservado `"logomarca do cliente aqui"` (preparado para exibir a `logoUrl` da empresa cliente logada).
- **Slogan:** `| Sistema de Gestão Profissional para Performance, Análise e Controle`.
- **Sem badge de versão no topo:** A exibição da versão do sistema fica exclusivamente no rodapé (`src/components/Footer.tsx`).
- **Menu Dropdown do Usuário Logado (Canto Superior Direito):** Exibe nome, função (ex.: *Administrador Master*), avatar inicial e seta de expansão (`ChevronDown`) com as opções:
  - **Editar Cadastro** (direciona para `configuracoes`)
  - **Sair (Logout)** (encerra sessão e retorna para `LoginPage`)

### 3.2 Barra de Navegação Principal e Sub-abas (`src/components/TopNav.tsx`)
- **Regra Arquitetural Rígida:** **Todas** as abas principais e sub-abas são gerenciadas centralmente pelo `TopNav` em duas linhas superiores sticky (Linha 1: pílulas das abas principais; Linha 2: faixa retrátil de sub-abas da aba ativa).
- **Zero sub-abas duplicadas dentro da tela central:** Componentes de módulo (como `FinanceiroTab`, `DashboardsTab`, `CrmTab`, `AgendaTab`, etc.) não renderizam barras de sub-abas internas no corpo central — consomem o estado global controlado por `App.tsx` e `TopNav`.
- **Rodapé (`src/components/Footer.tsx`):** Barra escura fixa ao final da página com status de sincronização e versão ativa (`Versão v2.6.6 (Build 20261116.04)`).

---

## 4. Segurança, Autenticação e Controle de Acesso (RBAC)

- **Login & Cadastro (`LoginPage.tsx`, `CadastroPage.tsx`):** Fluxo de entrada com autenticação, suporte a WebAuthn (`webAuthnService.ts`) e auditoria de segurança (`securityService.ts`).
- **Perfis de Acesso (`SystemUserRole` em `src/types.ts` e `src/services/userService.ts`):**
  - `admin` (Administrador Master — acesso irrestrito a todos os módulos)
  - `gerente`
  - `treinador`
  - `recepcao`
  - `financeiro`
  - `aluno`
- **Autorização Granular:** `hasTabPermission(tabId, currentUser)` filtra as abas visíveis no `TopNav` e bloqueia renderização direta com tela de "Acesso Restrito" caso não autorizado.
- **LGPD:** Campos de consentimento (`consentLgpd`, `consentLgpdDate`, `consentLgpdVersion`), logs de auditoria (`security_audit_logs`) e regras de segurança no Firestore (`firestore.rules`).

---

## 5. Catálogo Completo de Módulos e Sub-abas

| Aba Principal (`TabType`) | Sub-abas Gerenciadas pelo `TopNav` | Descrição Funcional |
| :--- | :--- | :--- |
| **`inicio`** (Início) | — | Painel inicial padronizado com cards clean (clientes ativos, base de clientes, faturamento e visão geral operacional). |
| **`dashboards`** (Dashboards) | `crm` (CRM & Funil), `gerencial` (Gerencial DRE), `clientes` (Clientes & Retenção), `financeiro` (Financeiro), `agenda` (Agenda & Aulas), `treino` (Treino & Prescrição), `whatsapp` (WhatsApp Robô) | Painéis analíticos de Business Intelligence (BI) segmentados por área + card de relatório executivo com IA. |
| **`clientes`** (Clientes) | — | Gestão completa de alunos/clientes (`AlunosTab` + `FichaCompletaAlunoView` 360°): cadastro, matrícula, status (`ativo`, `inadimplente`, `trancado`, `cancelado`), histórico financeiro, vendas vinculadas e dados LGPD. |
| **`professores`** (Professores) | `folha_ponto` (Folha de Ponto), `tarefas` (Tarefas), `agenda` (Agenda) | Gestão da equipe técnica: espelho de ponto e aulas ministradas, tarefas colaborativas estilo Google Tasks e agenda individual. |
| **`crm`** (CRM) | `leads` (Leads), `kambam` (Kambam), `atividades` (Atividades), `automacoes` (Automações), `pesquisas` (Pesquisas de Satisfação) | Funil comercial completo, quadro Kanban de oportunidades, tarefas de follow-up, gatilhos de automação e NPS/pesquisas de satisfação. |
| **`agenda`** (Agenda) | `calendario` (Calendário), `grade` (Grade de Turmas), `locacoes` (Locações), `jogos` (Eventos de Jogos), `eventos` (Eventos Diversos) | Calendário geral, grade de aulas coletivas com chamada do professor (modo dedão ou tradicional), locação de espaços/quadras e eventos. |
| **`whatsapp`** (WhatsApp) | `atendimento` (Atendimento), `kanban` (Kanban), `disparos` (Disparos), `chatbot` (Chatbot), `contatos` (Contatos), `respostas_rapidas` (Respostas Rápidas), `etiquetas` (Etiquetas), `conexoes` (Conexão) | Central de multi-atendimento WhatsApp *(marcada como "Em breve" para Fase 2)* com integração de eventos internos (`gl_pro_fit_open_whatsapp`). |
| **`financeiro`** (Financeiro) | `receber` (Contas a Receber e Inadimplência), `pagar` (Contas a Pagar), `planos_servicos` (Planos e Serviços), `dre` (DRE Gerencial), `extrato` (Extrato Completo), `gl_profit_pay` (GL Profit Pay - Recorrência) | Fluxo de caixa, baixa de pagamentos, cobrança via WhatsApp, **Planos de Mensalidade & Serviços Adicionais** (CRUD sincronizado com Firestore e confirmação inline de exclusão), DRE, extrato completo e gateway **GL Profit Pay** (com botão *Vincular Chave Pix*, recorrência no cartão e links de pagamento com URL real do banco; Maquininha Smart POS removida definitivamente). |
| **`treino`** (Treino) | `plano_treino` (Plano de Treino), `prescricao` (Prescrição de Treinos), `catalogo_exercicios` (Catálogo +1.400 Exercícios), `modelos_templates` (Modelos & Templates), `treino_do_dia` (Treino do Dia - Modo Aluno), `controle_carga` (Controle de Carga & 1RM) | Prescrição completa de treinos e periodização. O catálogo permite editar diretamente cada exercício real selecionado (`editingExercise`), exportar relatórios em PDF e controlar progressão de carga/1RM. |
| **`bem_estar`** (Bem-Estar) | `checkin` (Check-in), `analise` (Análise), `elenco_hooper` (Matriz do Elenco), `ciclo_menstrual` (Ciclo Menstrual) | Monitoramento de prontidão e bem-estar diário: qualidade do sono, fadiga, estresse, dor muscular (Escala EVA), Índice Hooper e acompanhamento do ciclo menstrual. |
| **`avaliacoes`** (Avaliações Físicas) | `avaliacoes` (Avaliações), `configuracoes` (Configurações) *(+ visões especializadas: Anamnese, Dobras Cutâneas Pollock/Guedes, Bioimpedância, Perimetria, Fotos/Postural, Testes Funcionais/Força/Campo/Salto)* | Central de avaliações físicas, antropometria, composição corporal, testes de performance e relatórios comparativos. |
| **`estoque`** (Estoque) | — | Controle de inventário de produtos, estoque mínimo, entradas/saídas e cadastro de fornecedores. |
| **`comandas`** (Lanchonete) | — | Gestão de lanchonete e balcão: abertura de comandas por aluno/visitante, adição de itens e fechamento de conta. |
| **`vendas`** (Vendas / PDV) | — | Ponto de venda rápido para contratação de planos e venda direta de produtos. |
| **`nutricao`** (Nutrição) | `planos_alimentares`, `anamnese_nutricional`, `composicao_corporal`, `suplementacao`, `metas_hidratacao`, `tabela_alimentos` | Módulo de nutrição esportiva *(marcada como "Em breve")* estruturado em 6 frentes de atendimento. |
| **`relatorios`** (Relatórios) | — | Consolidação de relatórios gerenciais, financeiros e operacionais com suporte à exportação. |
| **`empresas_clientes`** (Empresas Clientes B2B) | `dashboard` (Dashboard de Operação), `licencas` (Licenças, Acessos & Módulos) | Gestão multiempresa SaaS: cadastro e edição de empresas parceiras com campo de logomarca (`logoUrl`), controle de módulos liberados, limite de usuários, botão *"Enviar Acesso por E-mail"* e botão de exclusão. |
| **`configuracoes`** (Configurações) | *(seções internas de configuração)* | Parâmetros institucionais, gestão de usuários/permissões, configurações por aba (`tabSettingsService.ts`), backup/exportação JSON, migração inteligente de planilhas/PDFs e auditoria de segurança. |

*(Observação: A rota legada `'pay'` é normalizada globalmente em `App.tsx` e `TopNav.tsx` para abrir `currentTab = 'financeiro'` na sub-aba `gl_profit_pay`.)*

---

## 6. Padrões Utilitários, Coleções Firestore e Regras do Projeto

### 6.1 Formatadores e Utilitários (`src/utils.ts`)
- **Moeda:** `formatCurrency(value)` (`BRL` / `pt-BR`).
- **Datas:** `formatDate(dateString)` (`DD/MM/AAAA`).
- **Máscaras Padronizadas (Obrigatórias em cadastros):**
  - `formatPhone(value)` -> `(00) 00000-0000`
  - `formatCpf(value)` -> `000.000.000-00`
  - `formatCnpj(value)` -> `00.000.000/0001-00`
- **Disparo de Mensagem Interna:** `sendWhatsAppMessage(phone, text, contactName, studentId)` emite o evento customizado `gl_pro_fit_open_whatsapp`.

### 6.2 Principais Coleções no Firestore (`firebase-blueprint.json`)
`system_users`, `students`, `empresas_clientes`, `plans`, `financial_transactions`, `classes`, `workouts`, `products`, `comandas`, `stock_movements`, `suppliers`, `recurring_charges`, `payment_links`, `crm_activities`, `calendar_events`, `team_tasks`, `folha_ponto`, `folha_teachers`, `folha_turmas`, `folha_records`, `notifications`, `system_settings`, `leads`, `crm_automations`, `satisfaction_surveys`, `tab_settings`, `whatsapp_chats`, `whatsapp_messages`, `exercises_catalog`, `exercise_load_history`, `security_audit_logs`.

### 6.3 Regras de Desenvolvimento e Governança (`AGENTS.md`)
1. **Controle Contínuo de Versão (Obrigatório a cada alteração):**
   - Incrementar `SYSTEM_VERSION_INFO.version`, `buildNumber`, `releaseDate` e adicionar entrada no array `changelog` em `src/version.ts`.
   - Sincronizar o campo `"version"` em `package.json`.
2. **Registro de Alterações em Artefatos (`.md`):**
   - Toda alteração no sistema deve gerar/atualizar um documento `.md` dentro do diretório de artefatos descrevendo alterações, arquivos afetados e validações.
3. **Qualidade & UX:**
   - Evitar `window.alert`, `window.confirm` ou `window.open` (usar modais/confirmações inline em React compatíveis com iframe).
   - Manter tipagem TypeScript estrita (`tsc --noEmit`) e build Vite (`npm run build`) limpos.
   - Não reintroduzir dados fictícios em relatórios, gateways ou dashboards.
