# Dossiê Consolidado de Alterações - GL PRO FIT (v2.6.3 a v2.6.6)
**Data de Emissão:** 16 de Novembro de 2026  
**Faixa de Versões:** `v2.6.3` até `v2.6.6` (Builds `20261116.01` a `20261116.04`)  
**Escopo:** E-mail Master & Formatadores, Menu de Perfil, Catálogo de Exercícios, Exclusão B2B, Planos e Serviços no TopNav, Reset do GL Profit Pay e Remoção da Maquininha POS

---

## 1. Sumário Executivo
Este documento consolida todos os registros de alterações realizados no sistema **GL PRO FIT** no dia **16 de Novembro de 2026** (versões `v2.6.3`, `v2.6.4`, `v2.6.5` e `v2.6.6`). As atualizações abrangeram credenciais administrativas, padronização de máscaras de dados, ações rápidas no cabeçalho, correções de edição no catálogo de exercícios, saneamento do gateway GL Profit Pay e centralização global das sub-abas financeiras no `TopNav`.

---

## 2. Detalhamento por Versão

### A. Versão v2.6.3 (Build `20261116.01`) — E-mail Master, Formatadores Padronizados, Acesso B2B e Menu de Perfil
- **E-mail do Administrador Master:** Migração completa do e-mail do administrador master para `glprofit.adm@gmail.com` em todo o ecossistema (`userService.ts`, `partnerSchoolLicenseService.ts`, `InicioTab.tsx`, `PartnerSchoolLicenseModal.tsx`, `scripts/create-users.ts`, `firestore.rules` e `MANUAL_DO_SISTEMA.md`).
- **Formatadores Padrão (`src/utils.ts`):** Implementação das funções utilitárias canônicas para normalização e formatação em todas as áreas de cadastro:
  - `formatPhone(val)`: `(00) 00000-0000` / `(00) 0000-0000`
  - `formatCpf(val)`: `000.000.000-00`
  - `formatCnpj(val)`: `00.000.000/0001-00`
- **Envio de Acesso por E-mail (B2B — `EmpresasClientesTab.tsx`):** Inclusão do botão *"Enviar Acesso por E-mail"* ao lado de *"Configurar Módulos & Funcionalidades"* nos cards de empresas clientes, permitindo disparar credenciais de primeiro acesso.
- **Menu Dropdown de Perfil no Cabeçalho (`Header.tsx`):** Adição de seta de expansão (`ChevronDown`) ao lado do usuário logado com acesso direto às opções **"Editar Cadastro"** e **"Sair (Logout)"**.

---

### B. Versão v2.6.4 (Build `20261116.02`) — Correção da Edição no Catálogo de Exercícios e Exclusão B2B
- **Edição Direta no Catálogo de Exercícios (`ExerciseCatalogView.tsx`):** Corrigido o comportamento do botão *"Editar Exercício"*, que antes abria um formulário genérico/aleatório. Passou a carregar via estado `editingExercise` os dados reais do exercício selecionado (nome, grupo muscular, equipamento, instruções e link de vídeo) para configuração e salvamento direto.
- **Botão de Exclusão de Empresa Cliente (`EmpresasClientesTab.tsx`):** Adição de botão minimalista de exclusão (ícone de lixeira) nos cards de empresas clientes com fluxo de confirmação ligado a `onDeleteEmpresa(emp.id)`.
- **Padronização de Ações:** Revisão e uniformização de botões minimalistas de editar e excluir em listagens do sistema.

---

### C. Versão v2.6.5 (Build `20261116.03`) — Planos e Serviços, Reset do GL Profit Pay e Remoção da Maquininha POS
- **Módulo de Planos e Serviços (`PlanosServicosView.tsx`):** Criação da visualização dedicada para criação, edição e exclusão de planos de mensalidade recorrentes e pacotes de serviços adicionais (Personal Trainer, Nutrição, Locações).
- **Reset e Saneamento do GL Profit Pay (`VbSportPayTab.tsx`):**
  - Expurgo de dados fictícios e chaves pré-configuradas.
  - Inclusão do botão **"Vincular Chave Pix"** com modal dedicado para vincular chave PIX e instituição bancária real.
  - Adição do campo obrigatório para inserir a **URL real do link de pagamento gerado no banco ou gateway** ao criar links de pagamento.
- **Remoção Definitiva da Maquininha Smart POS:** A aba e todos os componentes associados à Maquininha Smart POS foram removidos integralmente do sistema.

---

### D. Versão v2.6.6 (Build `20261116.04`) — Centralização de Sub-abas Financeiras no TopNav e Sincronização Global
- **TopNav Financeiro (`src/components/TopNav.tsx`):**
  - Inclusão da sub-aba **`Planos e Serviços`** (`id: 'planos_servicos'`, ícone `Layers`, badge `'Novo'`) diretamente na barra superior global `financeiroSubTabs` gerenciada pelo `TopNav`.
  - Mapeamento de fallback da rota `'pay'` para `financeiroSubTabs` com `gl_profit_pay` ativo.
- **Remoção de Sub-abas Internas (`src/components/tabs/FinanceiroTab.tsx`):**
  - Remoção do array `subTabButtons`, da barra seletora de sub-abas interna e do estado local `internalSubTab`.
  - Navegação controlada exclusivamente via `activeSubTab` global, com cabeçalho contextual limpo e botão `Nova Movimentação` nas visões financeiras (`receber`, `pagar`, `dre`, `extrato`).
- **Sincronização Global e CRUD Confiável (`src/App.tsx`, `src/services/tabSettingsService.ts`, `PlanosServicosView.tsx`):**
  - Normalização da navegação para `'pay'` em `handleNavigateTab` apontando para `currentTab = 'financeiro'` com `financeiroSubTab = 'gl_profit_pay'`.
  - Conexão completa das props `plans`, `onAddPlan`, `onUpdatePlan` e `onDeletePlan` de `App.tsx` ao `FinanceiroTab` com persistência em `localStorage` e Firestore.
  - Registro de `financeiro_planos_servicos` em `DEFAULT_TAB_CONFIGURATIONS` e `planos_servicos` em `SUBTAB_DISPLAY_NAMES` (`tabSettingsService.ts`).
  - Exibição integrada de Planos e Serviços em seções únicas (sem sub-abas internas) e substituição de `window.confirm()` por confirmação inline na interface para exclusão confiável.

---

## 3. Principais Arquivos Impactados no Dia (16/11/2026)
- `src/App.tsx`
- `src/components/Header.tsx`
- `src/components/TopNav.tsx`
- `src/components/tabs/FinanceiroTab.tsx`
- `src/components/tabs/financeiro/PlanosServicosView.tsx`
- `src/components/tabs/VbSportPayTab.tsx`
- `src/components/tabs/EmpresasClientesTab.tsx`
- `src/components/tabs/treino/ExerciseCatalogView.tsx`
- `src/components/tabs/InicioTab.tsx`
- `src/services/tabSettingsService.ts`
- `src/services/userService.ts`
- `src/services/partnerSchoolLicenseService.ts`
- `src/utils.ts`
- `src/version.ts` & `package.json` (`v2.6.6`)

---

## 4. Validação Técnica e Qualidade
- **Compilação Vite / Bundle (`compile_applet`):** Aprovada sem erros até a versão `v2.6.6`.
- **Verificação TypeScript (`tsc --noEmit` / `lint_applet`):** Aprovada sem falhas ou alertas de tipagem.
- **Persistência em Nuvem:** Sincronização bidirecional com o Firebase Firestore e `localStorage` mantida íntegra.
