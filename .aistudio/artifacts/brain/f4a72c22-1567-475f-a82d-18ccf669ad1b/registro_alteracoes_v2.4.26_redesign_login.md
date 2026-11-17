# Registro de Alteração do Sistema — GL PRO FIT

**Versão da Modificação:** v2.4.26  
**Data:** 05 de Novembro de 2026  
**Autor:** Equipe de Engenharia GL PRO FIT  
**Solicitante:** Gianluca Marinho (`marinho.gianluca@gmail.com`)  
**Título:** Redesign Completo da Tela de Login e Logomarca Oficial Transparente  

---

## 1. Objetivo da Alteração
Aplicar as melhorias visuais e estruturais fornecidas via pacote `.zip` para a tela de autenticação do sistema GL PRO FIT, elevando o padrão estético, destacando a abrangência multiesportiva da plataforma e garantindo o uso da logomarca oficial limpa e sem placas de fundo.

---

## 2. Detalhamento das Modificações Realizadas

### 2.1. Logomarca Oficial Transparente (`src/components/GLProFitLogo.tsx`)
* **Problema anterior:** A logomarca utilizava renderização vetorial ou imagens com bordas/placas brancas que não se integravam harmoniosamente a fundos escuros ou fotográficos.
* **Solução implementada:**
  * Adicionado o arquivo de imagem oficial em alta definição com transparência total: `src/assets/images/gl-pro-fit-logo-oficial.png`.
  * Atualizado o componente `GLProFitLogo.tsx` para adotar `variant="official"` como padrão.
  * Renderização direta da logomarca oficial preservando proporções, sem recompressão e sem placas de fundo.

### 2.2. Novo Layout Hero Split-Screen da Tela de Login (`src/components/LoginPage.tsx`)
* **Fotografia de Fundo Esportiva:**
  * Adicionada imagem em alta resolução `src/assets/images/login-bg.jpg`.
  * Aplicação de dupla camada de degradê (`from-[#040a1c]/95 via-[#07122e]/80 to-[#0b1f52]/55`) garantindo alto contraste e leitura confortável.
* **Painel Hero Institucional (Lado Esquerdo):**
  * Badge superior: *"Plataforma de gestão esportiva"*.
  * Tipografia display em caixa alta: **PERFORMANCE / ANÁLISE / & CONTROLE**.
  * Subtítulo explicativo: *"Alunos, treinos, avaliações, financeiro e acessos da sua academia em um único painel"*.
  * Pílulas com ícones identificando os segmentos atendidos:
    * 🏆 **ESCOLAS DE FUTEBOL**
    * 🏋️ **ACADEMIA**
    * 👤 **PERSONAL**
    * ⚡ **QUALQUER SEGMENTO ESPORTIVO/FITNESS**
* **Card de Autenticação (Lado Direito):**
  * Container totalmente branco (`bg-white`) com cantos arredondados (`rounded-[28px]`) e sombra profunda (`shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]`).
  * Posicionamento da logomarca oficial no topo do formulário.
  * Preservação de todos os fluxos de segurança: alternância de cargos, seletor de acesso rápido para testes, login biométrico WebAuthn (Touch ID / Face ID), modal de recuperação de senha e link para cadastro.

### 2.3. Tipografia e Identidade Visual (`index.html` e `src/index.css`)
* **Fontes do Google Fonts:**
  * Inclusão das famílias `Barlow` (pesos 400, 500, 600, 700) e `Barlow Condensed` (pesos 600, 700, 800) no `<head>` do `index.html`.
* **Configuração de Tema Tailwind:**
  * Definição de `--font-display: "Barlow Condensed"` e `--font-body: "Barlow"` no bloco `@theme` de `src/index.css`.

---

## 3. Arquivos Criados ou Modificados

| Arquivo | Tipo de Ação | Descrição |
| :--- | :--- | :--- |
| `src/assets/images/gl-pro-fit-logo-oficial.png` | **Criado** | Imagem oficial da logo com fundo transparente |
| `src/assets/images/login-bg.jpg` | **Criado** | Foto esportiva de alta resolução para o fundo |
| `src/components/GLProFitLogo.tsx` | **Modificado** | Suporte e padrão para `variant="official"` |
| `src/components/LoginPage.tsx` | **Modificado** | Novo layout hero split-screen e card branco elevado |
| `index.html` | **Modificado** | Inclusão dos links das fontes Barlow e Barlow Condensed |
| `src/index.css` | **Modificado** | Variáveis `@theme` para `--font-display` e `--font-body` |
| `src/version.ts` | **Modificado** | Registro da versão v2.4.26 e histórico no changelog |
| `package.json` | **Modificado** | Sincronização da versão para `2.4.26` |

---

## 4. Validação Técnica
* **Linting TypeScript (`tsc --noEmit`):** Executado sem erros (0 advertências/erros).
* **Compilação Vite (`npm run build`):** Sucesso absoluto na geração do bundle.
* **Compatibilidade do Servidor (`server.ts`):** Servidor operacional no ambiente Node.js 22 com Express e suporte completo a produção e desenvolvimento.
