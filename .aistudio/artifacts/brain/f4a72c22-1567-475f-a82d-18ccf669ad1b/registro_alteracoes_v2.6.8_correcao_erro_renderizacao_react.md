# Registro de Alterações — Versão v2.6.8 (Correção de Erro de Renderização React)

**Data:** 16/11/2026  
**Versão:** `v2.6.8` (`build 20261116.06`)  
**Responsável:** Engenharia GL PRO FIT Enterprise Suite  

---

## 1. Diagnóstico do Erro

O runtime do React lançou a exceção:
`Error: Objects are not valid as a React child (found: [object Error]). If you meant to render a collection of children, use an array instead.`

### Causa Raiz
Em `src/components/tabs/treino/ExerciseCatalogView.tsx`, a assinatura em tempo real `subscribeToFirestoreCollection('exercises_catalog', ...)` recebe no quarto parâmetro `onError` uma instância de `Error` (`FirestoreError`). O callback estava passando o objeto `Error` diretamente para `setCatalogSyncError(errMsg)`, que era renderizado no JSX como `{catalogSyncError}`.

---

## 2. Correções Aplicadas

- **`src/components/tabs/treino/ExerciseCatalogView.tsx`**:
  - Atualizado o callback `onError` para converter explicitamente o erro em texto (`err instanceof Error ? err.message : String(err)`).
  - Adicionada guarda na renderização de `catalogSyncError` no banner de falha de sincronização.
- **`src/services/firebaseDbService.ts`**:
  - Padronizada a conversão segura da mensagem de erro no listener `onSnapshot` de `subscribeToFirestoreCollection` antes de atualizar o status global e repassar ao callback `onError`.
- **`src/components/tabs/financeiro/PlanosServicosView.tsx`**:
  - Adicionada verificação `err instanceof Error ? err.message : String(err)` no callback de erro da coleção `additional_services`.
- **Versionamento (`RULE[AGENTS_md]`)**:
  - `package.json` atualizado para `2.6.8`.
  - `src/version.ts` atualizado para `v2.6.8` (`buildNumber: 20261116.06`).

---

## 3. Validações Executadas
- Compilação Vite (`npm run build`) e checagem TypeScript (`tsc --noEmit`) executadas após as correções.
