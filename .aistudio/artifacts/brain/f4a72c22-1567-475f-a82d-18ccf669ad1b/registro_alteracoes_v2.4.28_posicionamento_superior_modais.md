# Registro de Alteração do Sistema — GL PRO FIT

**Versão da Modificação:** v2.4.28  
**Data:** 05 de Novembro de 2026  
**Autor:** Equipe de Engenharia GL PRO FIT  
**Solicitante:** Gianluca Marinho (`marinho.gianluca@gmail.com`)  
**Título:** Posicionamento Superior Central de Cards Sobrepostos (Modais e Popups)

---

## 1. Objetivo da Alteração
Atender à solicitação de usabilidade para que, ao acionar qualquer botão que abra um card sobreposto (modais de cadastro, ficha de aluno, licenças de parceiros, alertas de sobrecarga crítica, configurações e confirmações), o card apareça imediatamente na **parte superior central da tela**, e não no meio vertical da página, eliminando a necessidade de rolar ou arrastar a tela para localizar o conteúdo do card.

---

## 2. Detalhamento Técnico das Mudificações

### 2.1. Regras Globais no CSS (`src/index.css`)
* Adicionada regra CSS global com seletores de atributo para qualquer container de overlay fixo (`div[class*="fixed"][class*="inset-0"][class*="z-50"]`, `div[class*="fixed"][class*="inset-0"][class*="z-60"]` e `.modal-overlay-top`).
* Substituído o alinhamento `items-center` por `align-items: flex-start !important` com centralização horizontal `justify-content: center !important`.
* Aplicado espaçamento superior calibrado:
  * Mobile: `padding-top: 1.25rem`
  * Tablet (`sm`): `padding-top: 2rem`
  * Desktop (`md`/`lg`): `padding-top: 2.75rem`
* Habilitado `overflow-y: auto !important` com `scroll-behavior: smooth` para que cards extensos possam ser navegados com fluidez sem cortar o cabeçalho.
* Neutralização de `margin-top` automática nos cards internos (`margin-top: 0 !important; margin-left: auto !important; margin-right: auto !important;`), impedindo que classes herdadas empurrem o card para o meio da tela.

### 2.2. Atualização Cirúrgica nos Componentes de Modais
Os componentes de modais foram padronizados com as classes `items-start justify-center pt-6 sm:pt-10 md:pt-12 pb-8 overflow-y-auto`:
* `src/components/modals/NovoAlunoModal.tsx`: Cadastro de novos alunos.
* `src/components/modals/FichaAlunoModal.tsx`: Visualização e edição da ficha do aluno.
* `src/components/modals/PartnerSchoolLicenseModal.tsx`: Gestão de licenças de escolas parceiras pelo Administrador Master.
* `src/components/modals/NovoUsuarioModal.tsx` & `EditarUsuarioModal.tsx`: Gestão de equipe e permissões RBAC.
* `src/components/modals/BiometricAuthModal.tsx`: Autenticação e cadastro biométrico WebAuthn.
* `src/components/modals/GoogleAuthModal.tsx`: Conexão com Google.
* `src/components/modals/SegurancaDadosModal.tsx`: Termos de segurança e auditoria.
* `src/components/modals/EsqueciSenhaModal.tsx`: Recuperação e redefinição de credenciais.
* `src/components/modals/TabConfigModal.tsx`: Configuração de abas e visões.
* `src/components/Footer.tsx`: Modal de notas de versão e changelog.
* `src/components/tabs/InicioTab.tsx`: Modal de renovação de licença parceira.
* `src/components/tabs/bem_estar/AnaliseView.tsx`: 
  * Modal do botão "Ver Alunos" (Alerta Crítico de Sobrecarga).
  * Modal de Configuração de Níveis Críticos (Thresholds).
  * Modal de Disparo de Análise via WhatsApp.

---

## 3. Arquivos Afetados

| Arquivo | Tipo de Ação | Resumo do Impacto |
| :--- | :--- | :--- |
| `src/index.css` | **Modificado** | Inclusão de regras globais de alinhamento superior central para overlays `z-50` e `z-60` |
| `src/components/modals/NovoAlunoModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/FichaAlunoModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/PartnerSchoolLicenseModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/NovoUsuarioModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/EditarUsuarioModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/BiometricAuthModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/GoogleAuthModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/SegurancaDadosModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/EsqueciSenhaModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/modals/TabConfigModal.tsx` | **Modificado** | Alinhamento superior central |
| `src/components/Footer.tsx` | **Modificado** | Alinhamento superior central do changelog |
| `src/components/tabs/InicioTab.tsx` | **Modificado** | Alinhamento superior central do modal de licença |
| `src/components/tabs/bem_estar/AnaliseView.tsx` | **Modificado** | Alinhamento superior central dos 3 modais (sobrecarga, WhatsApp e limiares) |
| `src/version.ts` | **Modificado** | Atualização para v2.4.28 e inclusão no histórico |
| `package.json` | **Modificado** | Sincronização da versão para 2.4.28 |

---

## 4. Validação e Qualidade
* **Compilação (`compile_applet`):** Aprovada com êxito sem nenhum erro de build.
* **Checagem de Tipos (`lint_applet`):** 0 erros no TypeScript (`tsc --noEmit`).
* **Comportamento em Tela:** Os cards abrem no topo da área visível com folga proporcional, permitindo interação imediata sem rolagem inicial.
