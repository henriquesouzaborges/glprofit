# Registro Técnico de Alterações — Versão v2.5.2

**Data:** 11 de Novembro de 2026  
**Versão:** v2.5.2  
**Build:** 20261111.05  
**Sistema:** GL PRO FIT Enterprise Suite  
**Autor:** Engenheiro de Software Lead — AI Studio  

---

## 1. Resumo Executivo
Atendendo às diretrizes do gestor para o lançamento em ambiente real e sem dados simulados, a versão **v2.5.2** efetuou o expurgo cirúrgico e definitivo dos resíduos de dados fictícios em módulos remanescentes, mantendo o sistema 100% virgem, íntegro e pronto para as primeiras operações reais de produção.

---

## 2. Detalhes das Atualizações por Módulo

### 2.1 Empresas Clientes (B2B SaaS)
- **Arquivo Afetado:** `src/components/tabs/EmpresasClientesTab.tsx`
- **Ação:** Remoção da empresa cliente fictícia `GL PRO FIT Matriz` (`emp-1`) do array `INITIAL_EMPRESAS_CLIENTES`.
- **Resultado:** `export const INITIAL_EMPRESAS_CLIENTES: EmpresaCliente[] = [];`. O módulo B2B SaaS inicia totalmente zerado sem nenhuma empresa cliente cadastrada.

### 2.2 Professores & Folha de Ponto / Eventos
- **Arquivo Afetado:** `src/services/folhaPontoService.ts`
- **Ações:**
  - `INITIAL_TEACHERS = []`: Expurgo dos perfis simulados de professores (`prof-1`, `prof-2`, `prof-3`, `prof-4`).
  - `INITIAL_TURMAS = []`: Expurgo das turmas fixas de teste (`turma-1` a `turma-6`).
  - `INITIAL_EVENTOS = []`: Expurgo de eventos de jogos e aulões comemorativos.
  - `INITIAL_RECORDS = []`: Expurgo dos registros históricos de aulas lecionadas na folha de ponto.

### 2.3 Conexão do WhatsApp
- **Arquivo Afetado:** `src/mockWhatsappData.ts`
- **Ação:** Atualização da constante `INITIAL_WHATSAPP_CONNECTION` com `status: 'desconectado'`, `companyId: ''`, `phone: ''`, `apiToken: ''`, `connectedAt: ''`.
- **Resultado:** O painel de atendimento e integração do WhatsApp inicia em estado desconectado, aguardando a escaneamento real do QR Code / token Meta Cloud do cliente.

### 2.4 Controle de Carga, 1RM & Avaliações Físicas
- **Arquivos Afetados:** `src/components/tabs/treino/exerciseDatabase.ts` e `src/components/tabs/avaliacoes/AvaliacoesHubView.tsx`
- **Ações:**
  - `INITIAL_LOAD_LOGS = {}`: Limpeza total do mapa de logs de cargas dos alunos.
  - `INITIAL_PHYSICAL_TESTS = []`: Expurgo dos testes físicos simulados (Cooper, 1RM, Wells).
  - Remoção das linhas sintéticas de avaliações físicas no histórico da `AvaliacoesHubView.tsx`, exibindo a mensagem padronizada de estado vazio ("Nenhuma avaliação física cadastrada no histórico").

### 2.5 Mecanismo de Purge Automático no Navegador
- **Arquivo Afetado:** `src/App.tsx`
- **Ação:** Atualização da chave de boot para `glprofit_clean_slate_v252` e inclusão das chaves `vbsport_empresas_clientes`, `vbsport_folha_teachers`, `vbsport_folha_turmas`, `vbsport_folha_eventos`, `vbsport_folha_records`, `vbsport_load_logs`, `vbsport_physical_tests` e `vbsport_whatsapp_config` na lista de expurgo do LocalStorage.

---

## 3. Preservação de Dados de Produção
- **Dados Cadastrais Mantidos:** `INITIAL_SETTINGS` na aba de dados cadastrais permanece com a razão social, CNPJ `42.890.123/0001-95`, telefone e endereço oficiais do **GL PRO FIT**.
- **Administrador Ativo:** Gianluca Marinho (`marinho.gianluca@gmail.com`) mantido como único usuário administrador do sistema, sem foto fictícia.

---

## 4. Validação & Controle Contínuo de Versão
- `src/version.ts`: Incrementado para `v2.5.2` (build `20261111.05`) com adição do item de changelog.
- `package.json`: Sincronizado para `"version": "2.5.2"`.
- Compilação e tipagem TypeScript testadas e validadas sem erros.
