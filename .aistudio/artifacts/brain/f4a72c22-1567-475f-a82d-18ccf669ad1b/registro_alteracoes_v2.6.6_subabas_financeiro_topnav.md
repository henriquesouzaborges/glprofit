# Registro de Alterações Técnicas — GL PRO FIT (v2.6.6)

**Data:** 16 de Novembro de 2026  
**Versão:** v2.6.6 (Build `20261116.04`)  
**Escopo:** Navegação Global de Sub-abas Financeiras (`TopNav`, `FinanceiroTab`, `PlanosServicosView`, `App`, `tabSettingsService`)

---

## 1. Resumo das Alterações

- **Centralização no `TopNav` (`src/components/TopNav.tsx`)**:
  - Inclusão da sub-aba **`Planos e Serviços`** (`id: 'planos_servicos'`, ícone `Layers`, badge `'Novo'`) diretamente na lista `financeiroSubTabs` gerenciada pela barra superior de navegação (`TopNav`).
  - Adição do mapeamento de fallback para a rota `'pay'` em `groups` apontando para `financeiroSubTabs` com `gl_profit_pay` ativo.

- **Remoção das Sub-abas Internas (`src/components/tabs/FinanceiroTab.tsx`)**:
  - Remoção completa do array `subTabButtons` e da barra seletora de sub-abas interna de `FinanceiroTab`.
  - Remoção do estado local `internalSubTab`, passando o componente a consumir exclusivamente `activeSubTab` vindo da navegação global (`App.tsx` + `TopNav`).
  - Inclusão de cabeçalho contextual limpo (título da sub-aba ativa + botão `Nova Movimentação`) nas visualizações financeiras padrão (`receber`, `pagar`, `dre`, `extrato`).

- **Sincronização Global de Estado e CRUD de Planos (`src/App.tsx`, `src/services/tabSettingsService.ts`, `src/components/tabs/financeiro/PlanosServicosView.tsx`)**:
  - Atualização de `handleNavigateTab` em `App.tsx` para normalizar acessos à rota `'pay'` diretamente para `currentTab = 'financeiro'` com `financeiroSubTab = 'gl_profit_pay'`.
  - Passagem das props `plans`, `onAddPlan`, `onUpdatePlan` e `onDeletePlan` de `App.tsx` para `FinanceiroTab`, garantindo persistência em estado global, `localStorage` e Firestore (`plans`).
  - Registro de `financeiro_planos_servicos` em `DEFAULT_TAB_CONFIGURATIONS` e `planos_servicos: 'Planos e Serviços'` em `SUBTAB_DISPLAY_NAMES` no serviço `tabSettingsService.ts`.
  - Refatoração de `PlanosServicosView.tsx` para exibir *Planos de Mensalidade* e *Serviços Adicionais* em seções integradas (sem sub-abas internas) e substituição de `window.confirm()` por confirmação inline na interface para exclusão confiável.

- **Controle de Versão (`src/version.ts`, `package.json`)**:
  - Atualização da versão corrente para **v2.6.6** (`2.6.6`).

---

## 2. Arquivos Modificados

- `src/components/TopNav.tsx`
- `src/components/tabs/FinanceiroTab.tsx`
- `src/components/tabs/financeiro/PlanosServicosView.tsx`
- `src/services/tabSettingsService.ts`
- `src/App.tsx`
- `src/version.ts`
- `package.json`

---

## 3. Validações

- Compilação do projeto via Vite (`npm run build` / `compile_applet`).
- Verificação de tipagem estrita TypeScript (`tsc --noEmit` / `lint_applet`).
