# Registro de Alteração do Sistema — GL PRO FIT

**Versão:** v2.4.35  
**Data:** 10 de Novembro de 2026  
**Solicitante:** Gianluca Marinho  
**Título:** Remoção Total do Módulo de Catraca de Acesso e Preservação de Biometria de Login  

---

## 1. Objetivo da Alteração

Eliminar completamente o módulo de catraca física e virtual de controle de portaria de todo o ecossistema do **GL PRO FIT**, simplificando a interface, removendo simulações de hardware desnecessárias, retirando a coleção de logs de passagem (`access_logs`) das regras de segurança e banco de dados, e preservando integralmente o recurso de login biométrico para operadores e administradores (WebAuthn / Passkeys / Touch ID / Face ID).

---

## 2. Escopo Realizado

### 2.1. Arquivos Deletados
1. `/src/components/tabs/CatracaTab.tsx` — View principal da catraca virtual e simulação.
2. `/src/components/tabs/DashboardTab.tsx` — Arquivo obsoleto de dashboard legado.
3. `/src/components/tabs/dashboards/OperacionalDashboard.tsx` — Sub-aba focada exclusivamente em fluxo e bloqueios de catraca.
4. `/src/components/modals/FichaAlunoModal.tsx` — Modal legado de ficha substituído pela tela central FichaCompletaAlunoView.
5. `/src/services/accessLogService.ts` — Serviço de geração e consulta de logs de acesso.

### 2.2. Segurança e Banco de Dados (Firestore)
- **`firestore.rules`:** Removido o bloco `match /access_logs/{logId}`. Regras compiladas e publicadas com sucesso na nuvem via RPC `fax.DeployRules`.
- **`firebase-blueprint.json`:** Removida a entidade `AccessLog` e a definição de caminho de coleção `/access_logs/{logId}`.
- **`src/types/database.ts` & `src/utils/migrateLocalStorage.ts`:** Removidas referências e contadores de migração de `accessLogs`.

### 2.3. Modelos e Tipagem (`src/types.ts` & `src/types/database.ts`)
- Removido `AccessLog` de `src/types.ts`.
- Removido `'catraca'` da união `TabType`.
- Removido `'catraca'` de `checkInSource?: 'manual' | 'professor'`.
- Removido `'operacional'` de `DashboardSubTab` em `DashboardsTab.tsx`.

### 2.4. Navegação Superior e Lateral
- **`src/components/TopNav.tsx`:** Removido o botão especial "Catraca Ao vivo" da extremidade direita da barra superior. Removida a sub-aba "Operacional" da lista de dashboards.
- **`src/components/Header.tsx`:** Removido o botão e atalho "Abrir Catraca" do menu de usuário.
- **`src/components/Sidebar.tsx`:** Removido o atalho de acesso rápido de catraca e da lista de abas permitidas.

### 2.5. Dashboards e Business Intelligence
- **`src/components/tabs/DashboardsTab.tsx`:** Removida a sub-aba "Operacional", mantendo ativas: CRM, Gerencial, Clientes, Financeiro, Agenda, Treino e WhatsApp.
- **`src/components/tabs/dashboards/aiDashboardService.ts`:** Removidas metas e geração de relatórios de IA da sub-aba "Operacional" e parâmetros `accessLogs`.
- **`src/components/tabs/dashboards/DashboardAiReportCard.tsx`:** Removida a prop `accessLogs`.
- **`src/components/tabs/dashboards/ClientesDashboard.tsx`:** Substituída a menção de bloqueio na catraca por "Em régua de cobrança ativa".
- **`src/components/tabs/dashboards/WhatsappDashboard.tsx`:** Substituída a menção de catraca por "7 dias consecutivos sem registrar presença".

### 2.6. Ficha do Aluno e Cadastro
- **`src/components/tabs/alunos/FichaCompletaAlunoView.tsx`:**
  - Removido o botão de ação rápida "Testar Catraca".
  - Removida a sub-aba "Presenças & Acessos".
  - Removido o card "Presenças" do Raio-X Geral de Métricas, redistribuindo em 3 colunas harmoniosas (Treinos Ativos, % Gordura e Prontidão).
- **`src/components/tabs/AlunosTab.tsx`:**
  - Removido o botão de "Testar Passagem na Catraca" da listagem de alunos.
  - Removidas as props e imports relacionados a `onTestTurnstile` e `accessLogs`.

### 2.7. Configurações e Notificações
- **`src/components/tabs/ConfiguracoesTab.tsx`:**
  - Removido o módulo "Catraca & Acesso" da grade de configurações.
  - Removido o preview dinâmico de presença automática por catraca.
  - Preservado o campo "Tolerância Financeira", contextualizado para carência de cobrança e inadimplência.
- **`src/components/tabs/configuracoes/NotificacoesConfigView.tsx`:** Removida a categoria "Catraca Virtual & Acessos" (`catraca_liberada`, `catraca_bloqueada`).
- **`src/components/tabs/configuracoes/BackupManualConfigView.tsx`:** Removida a exportação de registros de acessos de catraca no snapshot JSON.

### 2.8. Preservação Estrita da Biometria de Login
- A autenticação biométrica do usuário (Touch ID, Face ID, Windows Hello / WebAuthn) no componente `LoginPage.tsx` foi **integralmente preservada**, garantindo que o acesso de operadores ao sistema continue ágil e seguro.

---

## 3. Validação Técnica
- **Compilação (`compile_applet`):** Sucesso (`Build succeeded - the applet is compiled`).
- **Linters e Tipagem (`lint_applet`):** Sucesso sem qualquer erro (`tsc --noEmit` exit code 0).
- **Deploy de Regras Firestore:** Sucesso via RPC `fax.DeployRules`.
- **Verificação Global:** 0 ocorrências de termos ligados à catraca no código-fonte operacional.
- **Versão Atual:** `v2.4.35` sincronizada em `src/version.ts` e `package.json`.
