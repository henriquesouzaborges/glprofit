# Registro de Alterações - Versão v2.4.34
**Data:** 10 de Novembro de 2026  
**Módulo Principal:** Gestão de Empresas Clientes (B2B SaaS)  

---

## 📋 Resumo das Alterações
Nesta versão, implementamos o módulo **Empresas Clientes** posicionado estrategicamente à esquerda da aba de **Configurações** no menu superior (`TopNav`). Este módulo foi desenvolvido para permitir o gerenciamento completo de contratos, licenciamento B2B, ativação/bloqueio de acesso corporativo e liberação granular de funcionalidades do sistema para cada empresa parceira que utiliza o GL PRO FIT.

---

## 🚀 Principais Funcionalidades Implementadas

1. **Nova Aba Principal "Empresas Clientes":**
   - Inserida na barra de navegação superior (`TopNav`), logo antes de Configurações, com ícone corporativo (`Building2`).
   - Gerenciamento unificado de todas as academias, estúdios e centros esportivos que contratam a plataforma SaaS.

2. **Sub-aba "Dashboard de Operação B2B":**
   - **KPIs em Tempo Real:** Total de empresas cadastradas, empresas ativas vs. bloqueadas, Receita Recorrente Mensal (MRR B2B), licenças totais contratadas e taxa de renovação.
   - **Tabela Executiva de Contratos:** Visão consolidada de CNPJ, responsável, plano SaaS contratado, valor mensal, número de licenças e módulos ativados.

3. **Sub-aba "Licenças, Acessos & Módulos":**
   - **Cartões de Gestão por Empresa:** Exibição detalhada de cada cliente empresarial.
   - **Bloqueio e Ativação Instantânea:** Botão dedicado para alternar o status contratual entre Ativo e Bloqueado.
   - **Gestão Granular de Funcionalidades:** Modal interativo de configuração modular que permite habilitar ou desabilitar individualmente cada um dos 18 módulos e abas do ecossistema GL PRO FIT por empresa cliente (ex: habilitar apenas Início, Clientes, Agenda e Treino para um box de CrossFit, ou todos os módulos para a matriz).
   - **Cadastro e Edição de Contratos:** Formulário completo para inserir novas empresas clientes com CNPJ, valor mensal, limite de usuários, vencimento e observações.

4. **Trilha de Governança & Versionamento:**
   - Atualização do arquivo `src/version.ts` para a versão `v2.4.34`.
   - Sincronização do campo `version` em `package.json`.
   - Emissão deste documento de registro histórico de alterações nos artefatos do sistema.

---

## 🛠️ Arquivos Modificados / Criados
- `src/types.ts`: Adicionados os tipos `EmpresaCliente` e `EmpresasClientesSubTab`, além de `'empresas_clientes'` no `TabType`.
- `src/components/tabs/EmpresasClientesTab.tsx`: Criação do componente completo com Dashboard, listagem de contratos, modais de cadastro e matriz granular de permissões de módulos.
- `src/components/TopNav.tsx`: Integração da aba principal "Empresas Clientes" com suas respectivas sub-abas.
- `src/App.tsx`: Gerenciamento de estado, persistência local e roteamento da nova aba.
- `src/version.ts` & `package.json`: Atualização de versão e changelog.
