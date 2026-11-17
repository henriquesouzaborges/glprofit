# Registro Técnico de Alterações - Versão v2.4.31

**Data:** 05 de Novembro de 2026  
**Build:** `20261105.8`  
**Módulo:** Gestão de Clientes / Ficha do Aluno 360°, Financeiro & Lanchonete da Empresa  
**Status:** Concluído e Validado  

---

## 1. Resumo Executivo das Implementações

Atendendo às solicitações do administrador do sistema GL PRO FIT, foram introduzidas quatro novas capacidades centrais para a gestão de alunos e operações de venda da academia:

1. **Aba "Dados do Cadastro" no Perfil do Aluno com Edição Completa e Fallback de Foto:**
   - Adicionada sub-aba dedicada (`dados_cadastro`) dentro da `FichaCompletaAlunoView`.
   - Permite alteração imediata de todos os dados do aluno: Nome Completo, CPF, Data de Nascimento, Telefone/WhatsApp, E-mail, Matrícula, Plano Contratado, Valor da Mensalidade, Data de Vencimento, Situação Cadastral (Ativo, Inadimplente, Trancado, Cancelado) e Observações Clínicas/Restrições Físicas.
   - Gestão de imagem com suporte a upload de arquivo local (Base64), inserção de URL, botões de presets rápidos e remoção de foto. Caso o aluno não possua foto ou a URL seja inválida, o sistema renderiza automaticamente um avatar moderno com ícone estilizado (`User` do Lucide) sobre gradiente escuro profissional, eliminando imagens quebradas.

2. **Cards Minimizados por Padrão com Seta de Recolher/Expandir:**
   - Em todas as sub-abas do perfil do aluno (`visao_geral`, `dados_cadastro`, `treinos`, `avaliacoes`, `bem_estar`, `financeiro`, `nutricao`), os cards agora iniciam **minimizados/recolhidos por padrão** (`expandedCards: Record<string, boolean> = {}`).
   - Cada card apresenta um cabeçalho interativo contendo ícone temático, título, resumo de dados e botão com seta (`ChevronDown` quando recolhido e `ChevronUp` quando expandido).
   - Ao clicar no cabeçalho ou na seta, o conteúdo do card é exibido ou recolhido suavemente com transição animada.
   - Foram adicionadas barras de ação rápida no topo das sub-abas permitindo **"Expandir Todos"** ou **"Recolher Todos"** com um único clique.

3. **Botão de "Vender" na Aba Financeiro do Aluno:**
   - Na sub-aba `financeiro`, foi implementado o botão destacado `+ Vender (Plano, Produto ou Serviço)` que abre modal de checkout/PDV rápido vinculado diretamente ao perfil do aluno.
   - Opções de venda estruturadas:
     - **Planos da Academia:** Seleção entre Plano Anual Black VIP, Semestral Fit, Mensal Livre, Passaporte Diária, etc., com opção de atualizar imediatamente o plano vigente e regularizar eventuais inadimplências.
     - **Produtos da Loja / Lanchonete:** Seleção com seletor de quantidade (Whey Protein, Creatina, Barras Proteicas, Bebidas Isotônicas, Água, Coqueteleiras, Camisetas DryFit).
     - **Serviços Especializados:** Sessões avulsas de Personal Trainer, Pacotes de 10 sessões, Avaliação Física Pollock + Bioimpedância, Consulta Nutricional, Locação de Armário Individual e Day-Use Convidado VIP.
   - Seleção de forma de pagamento (PIX, Cartão de Crédito, Cartão de Débito, Dinheiro, Boleto) e status da cobrança (Quitado Imediatamente ou Pendente/Lançado a Prazo no débito do aluno).
   - Geração automática de `FinancialTransaction` associada ao aluno e atualização instantânea de saldo devedor e extrato.

4. **Renomeação de "Comanda" para "Lanchonete da Empresa":**
   - Atualização completa de nomenclatura no menu lateral (`Sidebar.tsx`), catálogo de permissões (`userService.ts`), central de configurações de abas (`tabSettingsService.ts`) e tela principal (`ComandasTab.tsx`).
   - Foco centrado no controle e gestão da lanchonete e bar da academia.

---

## 2. Arquivos Modificados & Criados

| Arquivo | Natureza da Modificação |
| :--- | :--- |
| `src/components/tabs/alunos/FichaCompletaAlunoView.tsx` | Adicionada sub-aba `dados_cadastro`, formulário de edição com upload/presets/fallback de ícone, comportamento de cards minimizados com `ChevronDown`/`ChevronUp`, modal de Venda Rápida de planos, produtos e serviços em financeiro, e integração com handlers globais. |
| `src/components/tabs/AlunosTab.tsx` | Repasse das novas propriedades `onUpdateStudent` e `onAddSaleTransaction` para a ficha central, além de fallback com ícone `User` na listagem de alunos quando não houver foto. |
| `src/App.tsx` | Implementadas as funções `handleUpdateStudent` e `handleAddSaleTransaction` com persistência em estado e localStorage, repassando para `AlunosTab`. |
| `src/services/tabSettingsService.ts` | Atualização do rótulo e descritivo da aba de `Comandas` para `Lanchonete da Empresa`. |
| `src/services/userService.ts` | Rótulo do módulo `comandas` atualizado para `Lanchonete`. |
| `src/components/Sidebar.tsx` | Ícone `Coffee` e rótulo `Lanchonete` vinculados à navegação. |
| `src/components/tabs/ComandasTab.tsx` | Título e textos atualizados para "Lanchonete da Empresa & Comandas". |
| `src/version.ts` | Incremento da versão para `v2.4.31`, `buildNumber: 20261105.8`, data de lançamento e inclusão no `changelog`. |
| `package.json` | Atualização do campo `"version"` para `"2.4.31"`. |
| `/.aistudio/artifacts/brain/f4a72c22-1567-475f-a82d-18ccf669ad1b/registro_alteracoes_v2.4.31_dados_cadastro_cards_minimizados_vender_lanchonete.md` | Criação do artefato de registro técnico detalhado. |

---

## 3. Detalhamento Técnico das Mudanças

### 3.1. Estado e Comportamento dos Cards Minimizados
```typescript
// Por padrão, o estado inicia vazio {}, tornando TODOS os cards minimizados
const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

const isCardExpanded = (cardId: string) => !!expandedCards[cardId];

const toggleCard = (cardId: string) => {
  setExpandedCards(prev => ({
    ...prev,
    [cardId]: !prev[cardId]
  }));
};
```
O cabeçalho do card exibe a seta correspondente e permite alternância rápida:
```tsx
<div className="flex items-center gap-1 text-xs font-semibold text-slate-500 pl-2">
  <span>{isExpanded ? 'Recolher' : 'Expandir'}</span>
  <div className="p-1 rounded-md bg-slate-100 text-slate-600">
    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
  </div>
</div>
```

### 3.2. Fallback da Foto do Aluno
Caso `currentStudent.photo` seja vazio ou ocorra erro de carregamento (`imgError`), o sistema substitui com segurança:
```tsx
{hasPhoto ? (
  <img
    src={currentStudent.photo}
    alt={currentStudent.name}
    onError={() => setImgError(true)}
    className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-2 border-slate-100 shadow-md ring-4 ring-slate-50"
  />
) : (
  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 border-slate-200/80 shadow-md ring-4 ring-slate-100 flex flex-col items-center justify-center text-slate-300">
    <User className="h-12 w-12 text-slate-200" />
    <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
      Sem Foto
    </span>
  </div>
)}
```

### 3.3. Fluxo de Venda Rápida em Financeiro
Ao acionar o modal `VendaRapidaModal`, o operador seleciona o tipo de item:
- **Plano:** `INITIAL_PLANS` com cálculo do ciclo e opção de atualizar cadastro do aluno.
- **Produto:** `INITIAL_PRODUCTS` com multiplicador de quantidade.
- **Serviço:** Catálogo `SERVICOS_ACADEMIA` com multiplicador de quantidade.
Ao confirmar, o sistema gera a transação e atualiza o estado local e global via `onAddSaleTransaction(newTransaction, updatedStudent)`.

---

## 4. Validação & Controle de Qualidade
- **TypeScript & Sintaxe:** Código validado rigorosamente com `compile_applet` e `lint_applet` (0 erros).
- **Fallback Visual:** Testado comportamento sem foto ou com URL inválida com renderização do ícone `User`.
- **Interação dos Cards:** Testada alternância individual e em massa (Expandir Todos / Recolher Todos).
- **Venda Rápida:** Validada a criação de faturas em aberto e quitadas com sincronização no saldo devedor do aluno.
