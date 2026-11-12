# Documentação de Integrações Externa & Simulações — GL PRO FIT

## 1. Visão Geral
Este documento descreve as integrações de terceiros e barramentos simulados da plataforma **GL PRO FIT v2.5.0**.

## 2. Integrações Ativas & Badges de Simulação

### 2.1. WhatsApp Multi-Atendimento
- **Status:** Interface completa com disparos, chatbot e kanban de atendimento.
- **Identificador de Simulação:** Badge `"Simulado — ambiente de testes"` visível no cabeçalho do módulo.
- **Comportamento:** Permite o envio de mensagens pré-formatadas diretamente para a API Web (`https://wa.me/...`) ou simula diálogos automáticos no ambiente de testes.

### 2.2. GL Profit Pay (Recorrência & Pagamentos)
- **Status:** Módulo financeiro de cobrança recorrente, PIX dinâmico e links de pagamento.
- **Identificador de Simulação:** Badge `"Simulado — ambiente de testes"` no cabeçalho do gateway.
- **Comportamento:** Registra transações no extrato financeiro e gera links no formato `https://pay.glprofit.com.br/...`.

### 2.3. Google Gemini AI API (`@google/genai`)
- **Status:** Integração de IA server-side em `/api/ai/dashboard-report` e `/api/ai/analise-report`.
- **Modelo Principal:** `gemini-2.5-flash`.
- **Segurança & Proteção de Quota:**
  - Middleware de autenticação por token Firebase (`verifyAuthToken`).
  - Rate limiting deslizante: **30 chamadas por hora por UID**.
  - **Tratamento de Quota Excedida (HTTP 429 / 503):** Retorna código HTTP `503 Service Unavailable` com mensagem clara indicando esgotamento temporário da cota gratuita do Gemini, sem emitir relatórios ou números fakes.

## 3. Segurança dos Endpoints REST

| Endpoint | Método | Proteção | Limite de Tamanho | Rate Limit |
|---|---|---|---|---|
| `/api/health` | GET | Público | N/A | Sem limite |
| `/api/ai/dashboard-report` | POST | Firebase Auth Token + Role Check | 1 MB | 30 calls/hr/UID |
| `/api/ai/analise-report` | POST | Firebase Auth Token + Role Check | 1 MB | 30 calls/hr/UID |
| `/api/migrate` | POST | Firebase Auth Token (`admin` only) | 10 MB | 10 calls/hr/UID |
| `/api/lgpd/export/:studentId` | GET | Firebase Auth Token | N/A | 30 calls/hr/UID |
| `/api/lgpd/delete/:studentId` | DELETE | Firebase Auth Token (`admin`/`gerente`) | N/A | 10 calls/hr/UID |
