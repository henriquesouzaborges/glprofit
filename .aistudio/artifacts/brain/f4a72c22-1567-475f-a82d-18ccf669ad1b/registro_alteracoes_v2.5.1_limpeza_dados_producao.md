# REGISTRO TÉCNICO DE ALTERAÇÕES - GL PRO FIT v2.5.1

**Data de Lançamento:** 11 de Novembro de 2026  
**Versão do Sistema:** `v2.5.1` (Build: `20261111.04`)  
**Status:** Produção Estável  

---

## 1. RESUMO EXECUTIVO
A versão **v2.5.1** do sistema **GL PRO FIT Enterprise Suite** realiza o expurgo completo e a reinicialização de todos os dados fictícios (mock data) de demonstração em todos os módulos e abas do sistema, deixando o ecossistema 100% original, virgem e preparado para as primeiras utilizações reais pelos gestores e alunos da academia.

Conforme solicitado:
1. **Dados Cadastrais da Academia Preservados:** Os dados cadastrais oficiais do GL PRO FIT presentes na aba de Configurações (`INITIAL_SETTINGS`) foram mantidos intactos.
2. **Usuário Administrador Mantido:** O perfil de `Gianluca Marinho` (`marinho.gianluca@gmail.com`) foi mantido como o único operador/administrador ativo do sistema, tendo sua foto fictícia removida (`avatar: ''`) para utilização profissional imediata.
3. **Expurgo Total de Dados Fictícios:** Foram removidos todos os alunos secundários, avaliações físicas, check-ins de bem-estar, transações financeiras, planos de treino, turmas, leads do CRM, produtos do estoque, comandas da lanchonete, movimentações de estoque, fornecedores, pesquisas de satisfação, eventos de agenda, histórico do WhatsApp e mensagens simuladas.

---

## 2. DETALHAMENTO DOS ARQUIVOS E MÓDULOS ATUALIZADOS

### 2.1 `src/mockData.ts`
- Preservação estrita de `INITIAL_SETTINGS` (Dados Cadastrais GL PRO FIT).
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

### 2.2 `src/services/userService.ts`
- Atualização da lista `INITIAL_SYSTEM_USERS` para conter **exclusivamente** o usuário administrador:
  - **Nome:** Gianluca Marinho
  - **Email:** marinho.gianluca@gmail.com
  - **Role:** `admin` (Administrador Geral)
  - **Avatar:** `''` (Foto fictícia removida)
  - **Permissões:** Acesso total a todos os módulos (`all`)

### 2.3 `src/components/tabs/EmpresasClientesTab.tsx`
- Limpeza dos contratos fakes B2B SaaS em `INITIAL_EMPRESAS_CLIENTES`.
- Preservação exclusiva do contrato matriz: `GL PRO FIT Matriz` (`emp-1`).

### 2.4 `src/mockWhatsappData.ts`
- Definição do estado virgem para o módulo do WhatsApp Chat:
  - `INITIAL_WHATSAPP_CHATS = []`
  - `INITIAL_MESSAGES_MAP = {}`
  - `INITIAL_CAMPAIGNS = []`
  - Preservação das etiquetas padrão (`FINAL_ETIQUETAS`) e respostas rápidas (`FINAL_QUICK_REPLIES`).

### 2.5 `src/components/tabs/treino/AvaliacoesFisicasTab.tsx` & `src/components/tabs/BemEstarTab.tsx`
- `INITIAL_ASSESSMENTS`: Definido como `[]`.
- `INITIAL_WELLNESS_CHECKINS`: Definido como `[]`.
- `DEFAULT_ELENCO_GROUPS`: `studentIds` limpo para `[]` em todos os grupos do elenco.

### 2.6 `src/App.tsx`
- Introdução de gatilho automático de purga de cache no navegador na inicialização: `glprofit_clean_slate_v251`.
- Caso existam dados fakes armazenados em `localStorage` de acessos passados, o aplicativo os expurga na primeira execução da v2.5.1, garantindo sincronia total com o estado de produção.

---

## 3. VALIDAÇÃO TÉCNICA E BUILD

- **TypeScript Lint (`npm run lint` / `lint_applet`):** 0 erros.
- **Compilação Vite (`npm run build` / `compile_applet`):** Sucesso absoluto (0 erros).
- **Sincronização de Versão:**
  - `src/version.ts`: `v2.5.1` (Build: `20261111.04`)
  - `package.json`: `"version": "2.5.1"`
