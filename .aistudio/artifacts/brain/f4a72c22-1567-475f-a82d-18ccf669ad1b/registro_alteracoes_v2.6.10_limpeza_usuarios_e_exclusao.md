# Registro de Alterações — Versão v2.6.10 (Limpeza de Usuários e Exclusão Funcional)

**Data:** 16/11/2026  
**Versão:** `v2.6.10` (`build 20261116.08`)  
**Responsável:** Engenharia GL PRO FIT Enterprise Suite  

---

## 1. Alterações Aplicadas

### 1.1 Remoção Definitiva de Usuários Fictícios (`src/services/userService.ts`)
- Implementado saneamento inicial (`glprofit_users_clean_v2610`) que redefine a lista inicial armazenada em `localStorage` exclusivamente para **`GL PRO FIT ADM`** (`admin-master-01` / `glprofit.adm@gmail.com`).
- Adicionado filtro `isLegacyFictitiousUser` na leitura local e na sincronização com o Firestore (`system_users`), removendo registros fictícios legados (`usr-1` a `usr-6` e contas de demonstração antigas) inclusive no banco em nuvem quando autenticado.
- Criada a função `deleteSystemUser(userId)` para remover o usuário do `localStorage`, notificar a interface em tempo real e excluir o documento correspondente no Firestore (`deleteDocFromFirestore('system_users', userId)`).

### 1.2 Correção do Botão de Excluir Usuário (`src/components/tabs/ConfiguracoesTab.tsx`)
- Substituído o diálogo nativo `confirm()` (bloqueado em ambiente iframe) por botões inline de **Confirmar / Cancelar** (`confirmDeleteUserId`).
- Ao confirmar, `handleDeleteUser` executa `deleteSystemUser(userId)` garantindo exclusão imediata na tela, no cache local e no Firestore.
- Proteção garantida para não excluir o Administrador Master (`GL PRO FIT ADM`) nem a sessão atual.
- Exibição ajustada para mostrar **"Acesso Total (Todos os módulos)"** quando `permissions` inclui `'all'`.

### 1.3 Versionamento (`RULE[AGENTS_md]`)
- `package.json` atualizado para `2.6.10`.
- `src/version.ts` atualizado para `v2.6.10` (`build 20261116.08`).

---

## 2. Validação
- Compilação (`npm run build`) e checagem de tipos (`tsc --noEmit`) concluídas sem erros.
