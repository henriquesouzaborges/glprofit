# Registro Técnico de Alterações — Versão v2.5.3

**Data de Lançamento:** 12 de Novembro de 2026  
**Versão do Sistema:** `v2.5.3` (Build: `20261112.01`)  
**Status:** Produção Estável  
**Sistema:** GL PRO FIT Enterprise Suite  

---

## 1. Resumo Executivo
A versão **v2.5.3** atende integralmente ao briefing de saneamento e refinamento final da plataforma, eliminando todos os vestígios de dados simulados (mock data) remanescentes em módulos operacionais, CRM, agendamentos, avaliações, lanchonete, relatórios e painéis gerenciais. Adicionalmente, foram introduzidos o botão minimalista de edição no catálogo biomecânico de treinos, a dinamização de métricas e contadores, a remoção do cabeçalho redundante na aba Financeiro, e travas rigorosas no backend para impedir que a Inteligência Artificial alucine dados em bases vazias.

---

## 2. Detalhes das Atualizações por Módulo

### 2.1 Notificações Operacionais & Painel do Administrador Master
- **Arquivo Afetado:** `src/components/tabs/InicioTab.tsx` & `src/services/partnerSchoolLicenseService.ts`
- **Ação:** `INITIAL_PARTNER_LICENSES` ajustado para `[]`. O painel do administrador master reflete corretamente `0 escolas parceiras terceirizadas`, removendo alertas e notificações baseadas em contratos simulados.
- **Armazenamento:** Inclusão de `vbsport_partner_school_licenses` no script de purge de cache do navegador (`glprofit_clean_slate_v253`).

### 2.2 CRM, Automações & Pesquisa de Satisfação
- **Arquivos Afetados:** `src/components/TopNav.tsx` & `src/App.tsx`
- **Ação:** O selo (badge) de leads no menu superior (`TopNav`) tornou-se dinâmico (`leadsCount > 0 ? `${leadsCount} leads` : null`), deixando de exibir fixo "5 leads" quando não há prospecções cadastradas. As sub-abas de automações e pesquisas de satisfação operam com coleções estritamente vazias.

### 2.3 Agenda, Grade de Turmas & Eventos
- **Arquivos Afetados:** `src/services/folhaPontoService.ts` & componentes de agenda
- **Ação:** Confirmação do expurgo de turmas fictícias, valores de premiações/troféus em torneios e simplificação de eventos diversos, exibindo apenas registros reais criados pelo gestor.

### 2.4 Treinos & Catálogo Biomecânico
- **Arquivo Afetado:** `src/components/tabs/treino/ExerciseCatalogView.tsx`
- **Ação:** Adicionado botão minimalista de "Editar" (`Edit3` icon) em cada exercício do catálogo biomecânico, permitindo ajustes imediatos nas instruções e parâmetros técnicos.

### 2.5 Avaliações Físicas & Lanchonete da Empresa
- **Arquivos Afetados:** `src/components/tabs/avaliacoes/AvaliacoesHubView.tsx` & `src/components/tabs/ComandasTab.tsx`
- **Ação:** Limpeza dos alertas fictícios em avaliações a vencer e gráficos mensais; no painel da lanchonete, o card de itens mais consumidos agora exibe dinamicamente `"Nenhum consumo registrado"` quando a base está virgem.

### 2.6 Relatórios, DRE Gerencial & Dashboard de Operação
- **Arquivos Afetados:** `src/components/tabs/RelatoriosTab.tsx`, `src/components/tabs/EmpresasClientesTab.tsx` & `src/components/tabs/FinanceiroTab.tsx`
- **Ação:**
  - Remoção de offsets financeiros fixos (`+ 48200` e `+ 16400`) no relatório geral.
  - Taxa de renovação no dashboard B2B calculada dinamicamente com base nas empresas ativas cadastradas.
  - Remoção do cabeçalho redundante dentro da tela central da aba Financeiro, centralizando a navegação exclusivamente pelas sub-abas superiores.

### 2.7 Travas Anti-Alucinação em IA (`server.ts`)
- **Arquivo Afetado:** `server.ts`
- **Ação:** Inclusão de instrução mandatória nos system prompts das rotas `/api/ai/dashboard-report` e `/api/ai/analise-report`: *"AVISO CRÍTICO DE INTEGRIDADE DE DADOS: Se os dados e métricas fornecidos estiverem zerados ou vazios, NÃO invente valores ou estatísticas fictícias. Retorne um relatório indicando explicitamente que o sistema está em modo virgem sem dados suficientes cadastrados para análise."*

---

## 3. Validação & Controle Contínuo de Versão
- `src/version.ts`: Atualizado para `v2.5.3` (build `20261112.01`).
- `package.json`: Sincronizado para `"version": "2.5.3"`.
- Compilação (`compile_applet`) e tipagem TypeScript (`lint_applet`) validadas sem erros.
