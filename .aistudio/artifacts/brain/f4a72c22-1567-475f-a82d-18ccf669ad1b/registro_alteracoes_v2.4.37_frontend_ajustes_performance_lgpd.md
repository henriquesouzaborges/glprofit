# Registro Técnico de Alterações - Versão 2.4.37

**Data:** 11 de Novembro de 2026  
**Versão:** v2.4.37  
**Build:** 20261111.02  
**Autor:** Engenheiro de Software GL PRO FIT  
**Referência:** `registro_alteracoes_v2_4_36_frontend_ajustes.md`

---

## 1. Sumário Executivo

Esta versão consolida um pacote crítico de otimização de performance, segurança e conformidade regulatória para o GL PRO FIT, implementando lazy loading estruturado de módulos, remoção definitiva de componentes e estados obsoletos (legados do menu lateral), conformidade explícita com a Lei Geral de Proteção de Dados (LGPD) no fluxo de matrícula e blindagem do preenchimento de credenciais na tela de login.

---

## 2. Detalhamento das Alterações

### 2.1. Otimização de Performance e Code-Splitting (React.lazy & Suspense)
- **Arquivo Modificado:** `src/App.tsx`
- **Problema Anterior:** Todas as 19 abas do sistema eram importadas estaticamente no topo do arquivo raiz (`App.tsx`), inflando desnecessariamente o pacote de carregamento inicial (bundle) para operadores que muitas vezes utilizam apenas 1 ou 2 módulos específicos por sessão.
- **Implementação Realizada:**
  - 18 componentes de abas foram convertidos para importação dinâmica via `React.lazy()` com resolução de módulos nomeados:
    - `InicioTab`
    - `DashboardsTab`
    - `AlunosTab`
    - `ProfessoresTab`
    - `CrmTab`
    - `AgendaTab`
    - `WhatsappTab`
    - `VbSportPayTab`
    - `FinanceiroTab`
    - `EstoqueTab`
    - `ComandasTab`
    - `TreinosTab`
    - `AvaliacoesFisicasTab`
    - `NutricaoTab`
    - `BemEstarTab`
    - `RelatoriosTab`
    - `ConfiguracoesTab`
    - `VendasTab`
  - A aba `EmpresasClientesTab` foi mantida com importação estática (`import { EmpresasClientesTab, INITIAL_EMPRESAS_CLIENTES }`), uma vez que `INITIAL_EMPRESAS_CLIENTES` é requerido na inicialização síncrona do estado raiz de empresas do sistema.
  - Envolvimento do bloco de roteamento de abas dentro de `<Suspense fallback={<div className="flex items-center justify-center min-h-[300px] text-slate-500 font-medium text-xs">Carregando módulo…</div>}>`.

### 2.2. Limpeza Arquitetural e Exclusão do Sidebar Legado
- **Arquivo Excluído:** `src/components/Sidebar.tsx`
- **Motivo:** O sistema opera desde a versão v2.4.33 com navegação horizontal superior de largura total (`TopNav.tsx`). O componente `Sidebar.tsx` estava inativo e gerava acoplamento desnecessário, além de servir indevidamente como fonte de exportação do tipo `TabType`.
- **Arquivos Atualizados para Consumo Canônico de `TabType` de `src/types.ts`:**
  - `src/App.tsx`
  - `src/components/TopNav.tsx`
  - `src/components/tabs/ConfiguracoesTab.tsx`
  - `src/components/modals/TabConfigModal.tsx`
  - `src/services/tabSettingsService.ts`
- **Remoção de Código Morto em `src/App.tsx` e `src/components/Header.tsx`:**
  - Removidos estados `isMobileSidebarOpen` e `isSidebarCollapsed`.
  - Removido `useEffect` que sincronizava `vbsport_sidebar_collapsed` no `localStorage`.
  - Removidas as propriedades `onToggleMobileSidebar`, `isSidebarCollapsed` e `onToggleCollapseSidebar` de `<Header />` e sua declaração na interface `HeaderProps`.
  - Removido ícone `Menu` não utilizado em `Header.tsx`.

### 2.3. Conformidade LGPD no Cadastro de Alunos
- **Arquivo Modificado:** `src/components/modals/NovoAlunoModal.tsx`
- **Ajustes:**
  - Criado o estado `consentLgpd: boolean` (inicializado como `false`).
  - Adicionado bloco visual de consentimento com checkbox estilizado antes do botão de submissão do formulário:
    *"Declaro que o aluno autorizou o tratamento dos seus dados pessoais e de saúde para fins de matrícula e gestão de treinos, conforme as diretrizes da LGPD (Lei nº 13.709/2018)."*
  - Desativação do botão **"Concluir Matrícula"** (`disabled={!consentLgpd}`) com feedback visual (`cursor-not-allowed opacity-50`) enquanto o consentimento não for assinalado pelo operador.
  - O checkbox é redefinido para `false` no fechamento do modal e após a conclusão de nova matrícula.

### 2.4. Blindagem de Senha na Seleção Rápida de Usuários (Login)
- **Arquivo Modificado:** `src/components/LoginPage.tsx`
- **Ajustes:**
  - Na função `handleSelectQuickUser(role, email, _defaultPassword)`, o campo de senha agora é expressamente limpo (`setPassword('')`) em vez de auto-preenchido.
  - O operador deve digitar a senha manualmente para autenticar, elevando o padrão de segurança e disciplina operacional.

### 2.5. Correção Terminológica no Manual do Sistema
- **Arquivo Modificado:** `MANUAL_DO_SISTEMA.md`
- **Ajustes:**
  - A tabela de usuários e perfis de acesso teve a coluna renomeada de `Senha Padrão` para `Senha`.
  - As referências a senhas padrão estáticas foram substituídas por *"definida pelo administrador"*, alinhando o manual às boas práticas de segurança corporativa.

---

## 3. Matriz de Arquivos Afetados

| Arquivo | Ação | Descrição da Modificação |
| :--- | :--- | :--- |
| `src/components/Sidebar.tsx` | **Exclusão** | Remoção de componente obsoleto não utilizado desde a introdução do TopNav |
| `src/App.tsx` | Modificado | Lazy loading de 18 abas, Suspense fallback, remoção de estados e props do Sidebar |
| `src/components/Header.tsx` | Modificado | Remoção de handlers/props do menu lateral e ícone Menu não utilizado |
| `src/components/TopNav.tsx` | Modificado | Importação canônica de `TabType` de `../types` |
| `src/components/tabs/ConfiguracoesTab.tsx` | Modificado | Importação de `TabType` de `../../types` |
| `src/components/modals/TabConfigModal.tsx` | Modificado | Importação de `TabType` de `../../types` |
| `src/services/tabSettingsService.ts` | Modificado | Importação de `TabType` de `../types` |
| `src/components/modals/NovoAlunoModal.tsx` | Modificado | Consentimento obrigatório LGPD com bloqueio de matrícula se desmarcado |
| `src/components/LoginPage.tsx` | Modificado | Campo de senha não preenchido na seleção rápida |
| `MANUAL_DO_SISTEMA.md` | Modificado | Coluna de senha ajustada para "definida pelo administrador" |
| `src/version.ts` | Modificado | Incremento para v2.4.37, novo build e changelog detalhado |
| `package.json` | Modificado | Sincronização da versão para 2.4.37 |

---

## 4. Validação Técnica
- Validação estática de tipos com `tsc --noEmit` (`lint_applet`): 0 erros.
- Build de produção com `vite build` (`compile_applet`): Sucesso absoluto com geração de chunks dinâmicos otimizados.
