# Registro de Alterações - GL PRO FIT (v2.6.3)
**Data:** 16 de Novembro de 2026  
**Versão:** `v2.6.3` (Build `20261116.01`)  
**Escopo:** Atualização de E-mail Master, Formatadores Padronizados, Envio de Acesso B2B e Menu de Perfil no Cabeçalho

---

## 1. Visão Geral das Alterações
Nesta versão, foram implementadas as novas solicitações operacionais e de interface:
1. **Atualização do E-mail Master:** Migração completa do e-mail do administrador master para `glprofit.adm@gmail.com` em todo o ecossistema (serviços, regras de segurança do Firestore, seed scripts e documentação).
2. **Formatadores Padronizados:** Criação de funções utilitárias canônicas para normalização e formatação de Telefones, CPFs e CNPJs em todas as entradas de dados e cadastros.
3. **Envio de Acesso por E-mail (B2B):** Inclusão do botão *"Enviar Acesso por E-mail"* nos cards de empresas clientes na aba de Empresas Clientes B2B, permitindo disparar as credenciais de primeiro acesso.
4. **Menu Dropdown de Perfil no Cabeçalho:** Adicionada seta de expansão (`ChevronDown`) ao lado do perfil do usuário no cabeçalho superior, abrindo um menu com as opções **"Editar Cadastro"** e **"Sair (Logout)"**.

---

## 2. Detalhes Técnicos e Funcionais

### A. E-mail do Administrador Master
- Atualizado em `userService.ts`, `partnerSchoolLicenseService.ts`, `InicioTab.tsx`, `PartnerSchoolLicenseModal.tsx`, `scripts/create-users.ts`, `firestore.rules` e `MANUAL_DO_SISTEMA.md` para `glprofit.adm@gmail.com`.

### B. Formatadores Padrão (`src/utils.ts`)
- `formatPhone(val)`: Formata números para o padrão `(00) 00000-0000` / `(00) 0000-0000`.
- `formatCpf(val)`: Formata CPFs para o padrão `000.000.000-00`.
- `formatCnpj(val)`: Formata CNPJs para o padrão `00.000.000/0001-00`.

### C. Botão "Enviar Acesso por E-mail" (`EmpresasClientesTab.tsx`)
- Posicionado ao lado de *"Configurar Módulos & Funcionalidades"* nos cards de empresas clientes, disparando alerta com feedback visual de envio para o e-mail cadastrado da empresa parceira.

### D. Menu Dropdown de Perfil (`Header.tsx`)
- Implementado componente interativo com indicador de seta para recolher/expandir o perfil logado, contendo links diretos para editar o cadastro e encerrar a sessão com logout.

---

## 3. Validação e Qualidade
- **Compilação TypeScript:** Aprovada sem erros (`compile_applet`).
- **Verificação Linter:** Aprovada sem falhas (`lint_applet`).
- **Persistência Firestore:** Sincronização em tempo real mantida íntegra.
