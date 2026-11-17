# Registro de Alteração do Sistema — GL PRO FIT

**Versões:** v2.4.32 e v2.4.33 (build final `20261105.10`)  
**Data:** 05 de Novembro de 2026  
**Solicitante:** Gianluca Marinho  
**Escopo:** Somente front-end (apresentação, navegação e layout). Nenhuma alteração em backend, Firebase, regras do Firestore, serviços, tipos ou dados.

---

## 1. Resumo Executivo das Alterações

| # | Versão | O que mudou | Arquivos Afetados |
| :-: | :-: | :--- | :--- |
| 1 | v2.4.32 | A **barra lateral (Sidebar) foi removida do layout**. As abas agora ficam no **topo**, em formato de pílulas horizontais roláveis sob o cabeçalho (design "Opção 3 – CLEAN"). | `src/components/TopNav.tsx` (novo), `src/App.tsx`, `src/components/Header.tsx` |
| 2 | v2.4.32 | Cada aba que possui sub-abas recebeu uma **seta (chevron) dentro da pílula** que **recolhe/expande** a linha de sub-abas dinamicamente. | `src/components/TopNav.tsx` |
| 3 | v2.4.32 | O **cabeçalho** passou a ter fundo branco e recebeu a **logomarca oficial GL PRO FIT**; o botão hambúrguer mobile foi substituído pela logo. | `src/components/Header.tsx` |
| 4 | v2.4.33 | A área central (`<main>`) e o rodapé (`<Footer>`) **ocupam 100% da largura da tela** (removidos os limites `max-w-7xl` e `mx-auto`). | `src/App.tsx`, `src/components/Footer.tsx` |
| 5 | ambas | Versão e changelog incrementados conforme a regra `REGRA[AGENTES_md]`. | `src/version.ts`, `package.json` |

---

## 2. Detalhamento Técnico das Modificações

### 2.1. Novo componente `src/components/TopNav.tsx`
- Substitui o `Sidebar` na navegação do aplicativo.
- Mantém a mesma interface de propriedades do `Sidebar` (exceto flags de mobile/colapso lateral que não se aplicam ao menu horizontal).
- **Abas Principais:** 16 abas em pílula com ícones e rótulos oficiais, filtradas por `hasTabPermission(item.id, currentUser)`.
- **Aba Catraca:** Botão "Ao vivo" destacado em verde alinhado à extrema direita.
- **Sub-abas Retráteis:**
  - Alternância suave com transição animada (`grid-rows-[1fr]`/`[0fr]` com `duration-200`).
  - Clique no rótulo da aba navega para a aba mantendo a sub-aba ativa.
  - Clique na seta (chevron) de uma aba ativa alterna entre recolher e expandir suas sub-abas.
  - Clique na seta de uma aba inativa navega para ela e garante sua expansão.
- **Indicadores Semânticos:** Selo numérico de débitos em vermelho, "Em breve" em amarelo e pontos de status em verde e azul.
- **Rolagem Horizontal:** Contêiner rolável com centralização automática da aba ativa via `scrollIntoView`.

### 2.2. `src/App.tsx`
- Substituição do import `Sidebar` por `import type { TabType } from './components/Sidebar'` e `import { TopNav } from './components/TopNav'`.
- Remoção do componente `<Sidebar />` ao lado da coluna principal.
- Inserção do `<TopNav />` imediatamente após o `<Header />`, fixo no topo e fora do contêiner rolável.
- Ajuste do `<main>` de `max-w-7xl w-full mx-auto` para `w-full min-w-0` (largura total 100%).

### 2.3. `src/components/Header.tsx`
- Fundo atualizado de `bg-[#102a43] text-white` para `bg-white text-slate-800` com borda inferior `border-slate-200`.
- Botão hambúrguer substituído pela `<GLProFitLogo size="sm" />` em contêiner de largura fixa `w-[100px] sm:w-[124px]`.
- Campo de busca estilizado em formato pílula com fundo claro `bg-slate-100/80` e foco azul.
- Botões de notificação, ajuda e perfil de usuário adaptados para tema claro.

### 2.4. `src/components/Footer.tsx`
- Ajustado o contêiner interno de `max-w-7xl mx-auto` para `w-full`, alinhando-se com a área de trabalho 100% full-width.

### 2.5. Versionamento e Governança
- `src/version.ts`: atualizado para `v2.4.33` (Build `20261105.10`) com histórico das versões v2.4.32 e v2.4.33 no `changelog`.
- `package.json`: atualizado para `"version": "2.4.33"`.
