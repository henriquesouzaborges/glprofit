# Registro de Alterações - GL PRO FIT (v2.6.4)
**Data:** 16 de Novembro de 2026  
**Versão:** `v2.6.4` (Build `20261116.02`)  
**Escopo:** Correção da Edição no Catálogo de Exercícios e Inclusão de Botão de Exclusão de Empresa Cliente (B2B)

---

## 1. Visão Geral das Alterações
1. **Correção do Botão "Editar Exercício" no Catálogo:** Corrigido o comportamento anterior em que clicar em editar abria um formulário genérico/aleatório de novo exercício. Agora, o modal exibe o **exercício real selecionado** com todos os seus atributos (nome, grupo muscular, equipamento, instruções e link de vídeo) prontos para configuração e salvamento imediato.
2. **Botão de Exclusão de Empresa Cliente (B2B):** Adicionado um botão minimalista de exclusão (ícone de lixeira em vermelho) nos cards de empresas clientes na aba de Empresas Clientes B2B, com confirmação prévia via diálogo.
3. **Padronização de Ações:** Garantida a consistência de botões minimalistas de edição e exclusão nas listagens principais do sistema.

---

## 2. Detalhes Técnicos

### A. Catálogo de Exercícios (`ExerciseCatalogView.tsx`)
- Implementado estado `editingExercise` e modal dedicado de configuração de exercício pré-preenchido com os dados do item clicado na tabela.
- Função de salvamento de edição atualiza o item diretamente no catálogo em memória.

### B. Gestão de Empresas Clientes (`EmpresasClientesTab.tsx`)
- Inserido botão de exclusão com chamada para `onDeleteEmpresa(emp.id)` e alerta de confirmação.

---

## 3. Validação e Qualidade
- **Compilação TypeScript:** Aprovada (`compile_applet`).
- **Verificação Linter:** Aprovada (`lint_applet`).
- **Persistência Firestore:** Sincronização mantida inalterada.
