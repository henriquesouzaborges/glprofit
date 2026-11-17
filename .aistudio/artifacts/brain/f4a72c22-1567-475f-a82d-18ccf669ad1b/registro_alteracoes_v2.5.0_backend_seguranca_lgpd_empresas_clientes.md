# Registro Técnico de Alterações — Versão v2.5.0 (GL PRO FIT)

## Informações Gerais
- **Versão:** `v2.5.0`
- **Data da Liberação:** 11/11/2026
- **Build Number:** `20261111.03`
- **Objetivo Principal:** Implementação das diretrizes do Briefing Técnico v2.4.36 / v2.5.0 cobrindo backend server-side, segurança Firebase Auth/Firestore rules, LGPD, remoção de fakes, persistência B2B de Empresas Clientes, testes unitários e documentação.

---

## Detalhamento das Alterações Realizadas

### 1. Proteção Server-Side & Middleware (`server.ts`)
- **Autenticação de Token:** Middleware `verifyAuthToken` integrando Firebase Admin SDK para verificação de tokens Bearer.
- **Rate Limiting:** Implementado limitador deslizante de **30 chamadas/hora por UID** para as rotas `/api/ai/*` e `/api/lgpd/export/*`.
- **Limites de Payload:** Restrição de tamanho de corpo HTTP a **1MB** por padrão e **10MB** para a rota `/api/migrate`.
- **Rotas LGPD REST:**
  - `GET /api/lgpd/export/:studentId`: Retorna exportação estruturada em JSON de dados pessoais, treinos, avaliações e financeiro.
  - `DELETE /api/lgpd/delete/:studentId`: Executa expurgo/anonimização de dados com registro em log de auditoria.

### 2. Tratamento Gracioso de Cota de IA & Fakes (`server.ts`, `aiDashboardService.ts`, `GerencialDashboard.tsx`, `FinanceiroDashboard.tsx`)
- **Remoção de Dados Fakes:** Eliminados fallbacks numéricos fictícios (ex: EBITDA 35.4%, R$ 54.890,00, nota de saúde 86).
- **Resposta 503:** Na falha ou esgotamento de quota da Gemini API, o servidor responde `HTTP 503 Service Unavailable` com mensagem transparente ao usuário, sem exibir relatórios falsos.
- **Cálculos Dinâmicos:** `GerencialDashboard` e `FinanceiroDashboard` calculam receita, despesas e métricas em tempo real a partir dos arrays `transactions` e `students`.

### 3. Autenticação Firebase Auth (`LoginPage.tsx`, `userService.ts`, `types.ts`, `scripts/create-users.ts`)
- Autenticação real com `signInWithEmailAndPassword` via SDK do Firebase.
- Remoção da propriedade `password` em texto claro do tipo `SystemUser` e das listas de dados.
- Adição da flag `mustChangePassword` para exigir redefinição de senha no primeiro login.
- Criação do script de provisionamento `scripts/create-users.ts` com atribuição de custom claims (`role`).

### 4. Regras de Segurança do Firestore (`firestore.rules`)
- Proibição da chave `password` no documento (`!('password' in request.resource.data)`).
- Enforcement de papéis (`userRole()`) em coleções sensíveis:
  - `empresas_clientes`: Exclusivo para perfil `admin`.
  - `physical_assessments` e `wellness_checkins`: Restrito a `admin`, `gerente`, `treinador` e `financeiro`.
- Obrigatoriedade de `consentLgpd == true` na criação de novos alunos em `students`.
- Negação padrão (`allow read, write: if false;`) para coleções não explicitadas.

### 5. Persistência B2B SaaS & Gestão de Empresas Clientes (`App.tsx`, `EmpresasClientesTab.tsx`)
- Substituição do `localStorage` isolado por escuta em tempo real (`subscribeToFirestoreCollection('empresas_clientes', ...)`).
- Operações de cadastro, alteração e exclusão vinculadas a `saveDocToFirestore` e `deleteDocFromFirestore` com mensagens de toast.
- **Bloqueio de Acesso:** Verificação automatizada no login; caso a empresa associada possua `status === 'bloqueado'`, o acesso é suspenso com notificação em tela.

### 6. Interface & Conformidade LGPD (`FichaCompletaAlunoView.tsx`, `NovoAlunoModal.tsx`)
- Banner de aviso visual de pendência de consentimento LGPD para alunos sem `consentLgpd`.
- Botão "Registrar Consentimento LGPD" preenchendo `consentLgpdDate` e `consentLgpdVersion: "2026-11"`.
- Card de Conformidade LGPD permitindo portabilidade JSON (download de `lgpd_export_[id].json`) e duplo aceite para o Direito ao Esquecimento.

### 7. Badges de Ambiente & Arquivos de Suporte
- Adição do badge `"Simulado — ambiente de testes"` nos cabeçalhos de `WhatsappTab.tsx` e `VbSportPayTab.tsx`.
- Criação dos manuais de produção em `/docs/`:
  - `docs/BACKUP.md`
  - `docs/LGPD.md`
  - `docs/INTEGRACOES.md`
  - `docs/DEPLOY.md`
- Criação de `Dockerfile` e `.env.example`.
- Testes unitários automatizados:
  - `tests/calculos.test.ts` (Pollock 3/7, Mifflin-St Jeor, Harris-Benedict, Readiness Score).
  - `tests/rules.test.ts` (Estrutura e segurança de `firestore.rules`).

---

## Arquivos Modificados / Criados
- `src/version.ts` (Atualizado para v2.5.0)
- `package.json` (Atualizado para v2.5.0 + script `"test"`)
- `src/App.tsx`
- `src/types.ts`
- `src/services/userService.ts`
- `src/components/LoginPage.tsx`
- `src/components/tabs/EmpresasClientesTab.tsx`
- `src/components/tabs/alunos/FichaCompletaAlunoView.tsx`
- `src/components/tabs/whatsapp/WhatsappTab.tsx`
- `src/components/tabs/VbSportPayTab.tsx`
- `server.ts`
- `firestore.rules`
- `firebase-blueprint.json`
- `Dockerfile`
- `.env.example`
- `docs/BACKUP.md`
- `docs/LGPD.md`
- `docs/INTEGRACOES.md`
- `docs/DEPLOY.md`
- `tests/calculos.test.ts`
- `tests/rules.test.ts`
