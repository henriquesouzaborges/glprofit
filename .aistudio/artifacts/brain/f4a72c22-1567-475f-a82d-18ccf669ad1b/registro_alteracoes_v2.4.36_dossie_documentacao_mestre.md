# Registro de Alteração do Sistema — GL PRO FIT

**Versão:** v2.4.36  
**Data:** 11 de Novembro de 2026  
**Solicitante:** Gianluca Marinho  
**Título:** Dossiê Técnico Consolidado e Documentação Mestre do Sistema  

---

## 1. Motivação e Objetivo

Compilar em um único arquivo de referência definitivo (`DOCUMENTACAO_COMPLETA_SISTEMA_GL_PRO_FIT.md`) a especificação integral de todos os 16 módulos operacionais, arquitetura em nuvem, regras de banco de dados Firestore, fluxos de inteligência artificial Gemini, sistema B2B SaaS de Empresas Clientes e estruturas de dados, permitindo que qualquer nova conversa ou sessão técnica seja iniciada com alinhamento total e sem qualquer perda de contexto ou histórico de desenvolvimento.

---

## 2. Conteúdo Consolidado

1. **Visão Geral e Arquitetura:**
   - Frontend React 19 SPA com TypeScript e Tailwind CSS.
   - Layout 100% Full-Width sem restrições de largura.
   - Menu superior TopNav com pílulas e sub-abas dinâmicas retráteis por setas.
   - Backend Express em `server.ts` integrado à API do Google Gemini.
   - Sincronização em tempo real com o Google Cloud Firestore (`ai-studio-vbsportadm-f4a72c22-1567-475f-a82d-18ccf669ad1b`) com 16 coleções ativas.

2. **16 Módulos Documentados com Todas as Suas Sub-abas:**
   - Início, Dashboards (com diagnósticos de IA Gemini e metas personalizáveis), Clientes (com a nova Ficha Central 360° e cards minimizáveis), Professores (Folha de ponto e tarefas), CRM (Kanban), Agenda (Turmas e locações), WhatsApp (Atendimento e chatbot), Financeiro (DRE e GL Profit Pay recorrente), Treinos (Catálogo de +1.400 exercícios), Bem-Estar (Escala Hooper e ACWR), Avaliações Físicas (Pollock 7 dobras), Estoque, Lanchonete da Empresa, Nutrição, Relatórios, Empresas Clientes (B2B SaaS de licenças e controle de módulos) e Configurações (Tolerância financeira, usuários RBAC, IA de migração e backup JSON).

3. **Segurança e Biometria:**
   - Preservação estrita da biometria de login WebAuthn/FIDO2 no `LoginPage.tsx`.
   - Remoção definitiva da antiga coleção de catraca física (`access_logs`) da base e das regras de segurança.

4. **Regras Operacionais e Controle de Versão:**
   - Atualização contínua de versão em `src/version.ts` e `package.json`.
   - Geração de artefato `.md` em cada ciclo de trabalho.

---

## 3. Validação

- Compilação do Vite validada (`npm run build`).
- Verificação de tipos TypeScript validada (`tsc --noEmit`).
- Arquivo mestre disponível na raiz do repositório: `/DOCUMENTACAO_COMPLETA_SISTEMA_GL_PRO_FIT.md`.
