# Registro de Alterações - GL PRO FIT (v2.6.2)
**Data:** 13 de Novembro de 2026  
**Versão:** `v2.6.2` (Build `20261113.03`)  
**Escopo:** Correção e Inclusão do Campo de Logomarca no Modal de Empresas Clientes

---

## 1. Visão Geral das Alterações
Atendendo à solicitação do usuário, o modal de cadastro e edição de "Nova Empresa Cliente" na aba **Empresas Clientes (B2B SaaS)** foi atualizado para incluir explicitamente o campo de inserção da logomarca do cliente (`logoUrl`).

---

## 2. Detalhes Técnicos

### A. Modal de Nova / Editar Empresa Cliente (`EmpresasClientesTab.tsx`)
- **Novo Campo Adicionado:** Inserido o campo de formulário *"URL da Logomarca do Cliente"* (`logoUrl`) logo após os dados cadastrais básicos.
- **Sincronização de Estado:** Vinculado aos estados de formulário `formData`, garantindo que o valor inserido seja persistido no objeto `EmpresaCliente` ao cadastrar ou atualizar contratos.

---

## 3. Validação e Qualidade
- **Compilação e Tipagem:** Validadas com sucesso via `compile_applet` e `lint_applet` sem erros.
