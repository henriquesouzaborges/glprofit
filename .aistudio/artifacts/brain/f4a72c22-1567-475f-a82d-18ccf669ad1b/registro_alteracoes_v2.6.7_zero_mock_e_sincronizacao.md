# Registro de Alterações — Versão v2.6.7 (Zero-Mock Policy & Sincronização Firestore)

**Data:** 16/11/2026  
**Versão:** `v2.6.7` (`build 20261116.05`)  
**Responsável:** Engenharia GL PRO FIT Enterprise Suite  

---

## 1. Resumo Executivo

A atualização **v2.6.7** implementa integralmente as diretrizes de blindagem contra dados fictícios (**Zero-Mock Policy**) e consolida a persistência em tempo real com o **Firebase Firestore** em todos os módulos críticos do sistema, assegurando que a interface reflita fielmente o estado real do banco de dados.

---

## 2. Versionamento e Governança (`RULE[AGENTS_md]`)

- **`package.json`**: Versão atualizada de `2.6.6` para `2.6.7`.
- **`src/version.ts`**:
  - Adicionadas as constantes exportadas `APP_VERSION = 'v2.6.7'` e `BUILD_DATE = '2026-11-16'`.
  - Atualizado `SYSTEM_VERSION_INFO` (`version: 'v2.6.7'`, `releaseDate: '16 de Novembro de 2026'`, `buildNumber: '20261116.05'`).
  - Adicionado item detalhado da `v2.6.7` no topo do array `changelog`.

---

## 3. Eliminação Definitiva de Mock Data (Zero-Mock Policy) & Tratamento de Erros

### 3.1 Camada de Serviços e Regras Firebase
- **`src/services/firebaseDbService.ts`**:
  - Adicionado helper `sanitizeForFirestore` para remoção segura de valores `undefined` antes da gravação.
  - Removida a injeção de `initialSeedFallback` quando ocorria erro de leitura ou snapshot vazio no Firestore.
  - Snapshots vazios (`[]`) agora propagam fielmente para a interface.
  - Erros em `saveDocToFirestore`, `deleteDocFromFirestore` e `fetchCollectionFromFirestore` passaram a ser relançados para tratamento real na UI.
  - Adicionadas `additional_services`, `exercises_catalog` e `empresas_clientes` ao mapeamento de sincronização em nuvem (`syncAllSystemDataToCloud`).
- **`firestore.rules` & `firebase-blueprint.json`**:
  - Adicionada entidade `AdditionalService` e regras de acesso para `/additional_services/{serviceId}`.
  - Atualizadas permissões de escrita em `/plans/{planId}` para `admin`, `gerente` e `financeiro`.
  - Liberada escrita controlada em `/system_settings/pay_pix_config` para `admin`, `gerente` e `financeiro`.
- **`src/App.tsx` & `src/components/DatabaseStatusBadge.tsx`**:
  - Removidos todos os fallbacks `INITIAL_*` das assinaturas do Firestore.
  - Integrada assinatura `subscribeDatabaseStatus` com banner global de erro de conexão e botão **"Tentar Reconectar"**.
  - Limpeza de `handleConvertLeadToStudent` (remoção de avatar Unsplash placeholder, CPF fictício e valor fixo de plano).

---

## 4. Validação por Módulo (Checklist v2.6.7)

### 4.1 Ficha 360° do Aluno & Avaliações
- **`src/components/tabs/AlunosTab.tsx`**: Recebe e repassa `plans` e `products` reais do Firestore; exibe Empty State com CTA **"Cadastrar Primeiro Aluno"** quando `students` está vazio.
- **`src/components/tabs/alunos/FichaCompletaAlunoView.tsx`**:
  - Removidos `INITIAL_PLANS`, `INITIAL_PRODUCTS`, `SERVICOS_ACADEMIA`, `AVATAR_PRESETS`, percentuais fictícios (`14.2%`, `85%`) e medidas corporais/dietas de exemplo (`74kg`/`176cm`).
  - Passou a consumir `plans` e `products` reais via props e `additional_services` via assinatura em tempo real do Firestore.
  - Plano nutricional calculado exclusivamente a partir da avaliação física real mais recente (exibe Empty State caso não haja avaliação).
  - Substituída confirmação nativa LGPD por confirmação inline em duas etapas (`confirmLgpdDeleteStep`).
- **`src/components/tabs/avaliacoes/AvaliacoesHubView.tsx` & `AvaliacoesFisicasTab.tsx`**:
  - Removido `DEFAULT_STUDENT_FALLBACK` na entrada de avaliações e substituído por Empty State quando não há alunos.
  - Removido o gerador sintético de 3 avaliações fictícias em `getAssessmentsForStudent` (agora retorna `[]` caso não existam avaliações reais registradas) e removidos fallbacks numéricos no compartilhamento WhatsApp.
- **`src/components/tabs/BemEstarTab.tsx` & `src/components/tabs/TreinosTab.tsx`**:
  - `activeStudent` tratado como `Student | null`, sem dados fictícios de aluno ou valores de fallback.

### 4.2 Módulo B2B / Empresas Clientes
- **`src/components/tabs/EmpresasClientesTab.tsx`**:
  - Persistência integrada com a collection `empresas_clientes` do Firestore (`App.tsx` e `EmpresasClientesTab.tsx`).
  - Limpeza de valores default fictícios de criação (`'Plano Pro Box'`, `890.00`, `25`).
  - Adicionados Empty States no painel de empresas e na grade de licenças.
  - Substituição de `confirm()` nativo por botões inline de **Confirmar / Cancelar** exclusão.

### 4.3 Módulo Financeiro, Planos e Serviços & GL Profit Pay
- **`src/components/tabs/FinanceiroTab.tsx`**:
  - Cálculo de DRE realizado exclusivamente sobre `transactions` reais pagas, com Empty State quando não há movimentações.
- **`src/components/tabs/VbSportPayTab.tsx`**:
  - Removida taxa de aprovação hardcoded (`99.1%`), calculada dinamicamente a partir das cobranças reais (`'—'` quando vazio).
  - Persistência da chave Pix e dados bancários no Firestore (`system_settings/pay_pix_config`) com sincronização em `localStorage`.
  - Uso de `plans` reais no seletor de links e remoção de `alert()` nativo (substituído por `linkError` inline).
- **`src/components/tabs/financeiro/PlanosServicosView.tsx` & `PlanosView.tsx`**:
  - Persistência real em `plans` e `additional_services` no Firestore.
  - Empty States quando sem planos/serviços e confirmação inline para exclusão.

### 4.4 Catálogo Biomecânico de Treinos
- **`src/components/tabs/treino/ExerciseCatalogView.tsx`**:
  - Assinatura em tempo real da collection `exercises_catalog` no Firestore com suporte completo a criação, edição de exercícios reais e exclusão (remoção direta para customizados e tombstone `isDeleted: true` para catálogo base).
  - Banner de erro de sincronização (`catalogSyncError`), toast de feedback e confirmação inline de exclusão.

---

## 5. UX Sem Diálogos Nativos (`window.alert` / `window.confirm`)

- Removidos diálogos nativos de alerta/confirmação em `Header.tsx`, `InicioTab.tsx`, `RelatoriosTab.tsx`, `PartnerSchoolLicenseModal.tsx`, `EmpresasClientesTab.tsx`, `PlanosServicosView.tsx`, `PlanosView.tsx`, `ExerciseCatalogView.tsx`, `VbSportPayTab.tsx` e `FichaCompletaAlunoView.tsx`, substituindo por popovers, toasts React e confirmações inline.
