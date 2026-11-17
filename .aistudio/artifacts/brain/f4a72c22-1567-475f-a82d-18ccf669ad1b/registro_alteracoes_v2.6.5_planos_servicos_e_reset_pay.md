# Registro de Alterações - GL PRO FIT (v2.6.5)
**Data:** 16 de Novembro de 2026  
**Versão:** `v2.6.5` (Build `20261116.03`)  
**Escopo:** Sub-aba Planos e Serviços no Financeiro, Reset do GL Profit Pay, Remoção da Maquininha POS e Links Reais de Pagamento

---

## 1. Visão Geral das Alterações
1. **Sub-aba "Planos e Serviços" no Financeiro:** Criada a nova sub-aba dedicada dentro de *Financeiro* (`PlanosServicosView.tsx`), permitindo à empresa gerenciar, criar, editar e excluir planos de mensalidade e serviços adicionais (Personal, Nutrição, Locações).
2. **Reset e Saneamento do GL Profit Pay:**
   - Expurgo de dados fictícios e chaves pré-configuradas.
   - Adicionado o botão **"Vincular Chave Pix"** com modal para conectar chave PIX e instituição bancária real.
3. **Remoção da Maquininha Smart POS:** A aba e todos os componentes relacionados à Maquininha Smart POS foram removidos totalmente do sistema.
4. **Links de Pagamento Reais:** No modal de criação de links de pagamento, foi adicionado o campo obrigatório para inserir a **URL real do link gerado no banco ou gateway** (`url`), substituindo URLs simuladas geradas por código.

---

## 2. Detalhes Técnicos

### A. Módulo Financeiro & Planos e Serviços (`FinanceiroTab.tsx`, `PlanosServicosView.tsx`)
- Inserção da sub-aba `planos_servicos` com gerenciamento completo de CRUD para planos de mensalidade e pacotes de serviços.

### B. GL Profit Pay (`VbSportPayTab.tsx`)
- Limpeza de estados e adição de fluxo de vínculo de chave PIX.
- Entrada de URL real do banco ao gerar link de pagamento.

---

## 3. Validação e Qualidade
- **Compilação TypeScript:** Aprovada (`compile_applet`).
- **Verificação Linter:** Aprovada (`lint_applet`).
