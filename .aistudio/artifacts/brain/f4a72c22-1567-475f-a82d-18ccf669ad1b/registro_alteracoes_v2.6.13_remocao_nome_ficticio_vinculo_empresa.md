# Registro de Alterações — GL PRO FIT v2.6.13

**Data:** 16 de Novembro de 2026  
**Build:** `20261116.11`  
**Versão:** `v2.6.13` (anterior: `v2.6.12`)

---

## Problema Identificado
No modal **"Enviar Link de Cadastro para o Aluno"**, o card **Empresa Responsável pelo Vínculo** exibia `"VB SPORT ACADEMIA E CENTRO FITNESS LTDA"`, oriundo de dados legados persistidos anteriormente na coleção `system_settings` (`general`) do Firestore / cache local (`vbsport_settings`) antes da padronização da marca para **GL PRO FIT**.

---

## Alterações Realizadas

### 1. Sanitização e Resolução Fiel do Nome Cadastrado da Empresa
- **`src/services/studentInviteService.ts`**:
  - Criados os utilitários `isLegacyPlaceholderCompanyName`, `sanitizeGymSettings` e `resolveRegisteredMainCompanyName`.
  - Qualquer ocorrência legada de `"VB SPORT"` em `gymName`, `tradeName`, `email` ou `welcomeMessage` é limpa automaticamente para `GL PRO FIT`, preservando integralmente nomes reais cadastrados pelo administrador em **Configurações → Geral** ou pelas **Empresas Clientes**.
  - Atualizada a função `resolveActiveEmpresaForUser` para bloquear nomes legados residuais e priorizar sempre o nome cadastrado da empresa ativa.

### 2. Integração na Inicialização e Sincronização com Firestore
- **`src/App.tsx`**:
  - Aplicado `sanitizeGymSettings` tanto ao carregar o estado inicial de `settings` quanto no listener em tempo real da coleção `system_settings` (focando estritamente no documento `id === 'general'`, evitando colisão com outros documentos de configuração como `pay_pix_config`).
  - Passado `mainCompanyDisplayName` (calculado via `resolveRegisteredMainCompanyName(settings)`) para `CadastroPage`, `AlunosTab` e atribuição padrão de matrícula.

### 3. Modal de Envio de Link e Limpeza de Rótulos Residuais
- **`src/components/modals/EnviarLinkCadastroModal.tsx`**:
  - Garantido que `activeCompany.name` utilize exclusivamente a empresa B2B cadastrada (quando vinculada/selecionada) ou o nome real configurado em **Configurações → Geral**, com texto explicativo sobre a origem do vínculo.
- **`src/components/tabs/ConfiguracoesTab.tsx`**, **`src/components/tabs/DashboardsTab.tsx`**, **`src/components/tabs/VendasTab.tsx`**, **`src/services/tabSettingsService.ts`**, **`src/services/partnerSchoolLicenseService.ts`**:
  - Substituídos rótulos e mensagens residuais de `"VB SPORT ADM"` / `"VB SPORT"` por `"GL PRO FIT"` ou pelo nome dinâmico cadastrado da academia.

### 4. Versionamento
- **`package.json`** e **`src/version.ts`**: Versão incrementada de `v2.6.12` para `v2.6.13` (`buildNumber: 20261116.11`).

---

## Validações
- Compilação (`npm run build`) e checagem de tipos (`tsc --noEmit`) executadas e aprovadas sem erros.
