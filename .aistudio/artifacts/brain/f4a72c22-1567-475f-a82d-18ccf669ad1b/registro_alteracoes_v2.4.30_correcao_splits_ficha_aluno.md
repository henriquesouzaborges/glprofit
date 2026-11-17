# Registro de Alteração do Sistema — GL PRO FIT

**Versão da Modificação:** v2.4.30  
**Data:** 05 de Novembro de 2026  
**Autor:** Equipe de Engenharia GL PRO FIT  
**Solicitante:** Gianluca Marinho (`marinho.gianluca@gmail.com`)  
**Título:** Correção de Erro de Renderização de Treinos na Ficha Completa do Aluno (TypeError slice)

---

## 1. Causa Raiz do Erro
Ao abrir a tela central da Ficha Completa do Aluno (`FichaCompletaAlunoView.tsx`), foi disparado o erro:
```
TypeError: Cannot read properties of undefined (reading 'slice')
    at FichaCompletaAlunoView (src/components/tabs/alunos/FichaCompletaAlunoView.tsx)
```
A causa identificada foi a referência à propriedade inexistente `divisions` no objeto de modelo de treinos (`WorkoutPlan`). Na tipagem oficial do sistema (`src/types.ts`), as divisões de treino são modeladas na propriedade **`splits: WorkoutSplit[]`** e os objetivos em **`objective`**. Ao tentar executar `.slice(0, 2)` sobre `divisions` (que era `undefined`), ocorria a exceção de runtime.

---

## 2. Solução Implementada
1. **Resolução de Propriedades em `FichaCompletaAlunoView.tsx`:**
   * Substituído o acesso `workout.divisions` por `(workout.splits || (workout as any).divisions || [])` com verificação defensiva de nulidade.
   * Substituído `div.exercises.slice` por `(split.exercises || []).slice(0, 3)` com encadeamento seguro.
   * Mapeamento compatível do objetivo do treino: `workout.objective || (workout as any).goal || 'Treino Personalizado'`.
   * Mapeamento seguro da frequência semanal: `workout.frequency || 'Semanal'`.
2. **Prevenção Geral:**
   * Aplicada a mesma proteção tanto no card de resumo da aba "Raio-X Geral" quanto na aba dedicada "Treinos".

---

## 3. Arquivos Afetados

| Arquivo | Ação | Descrição |
| :--- | :--- | :--- |
| `src/components/tabs/alunos/FichaCompletaAlunoView.tsx` | **Modificado** | Tratamento seguro de `workout.splits` e eliminação do erro de `slice` |
| `src/version.ts` | **Modificado** | Incremento para v2.4.30 e histórico no changelog |
| `package.json` | **Modificado** | Sincronização da versão para 2.4.30 |

---

## 4. Validação Técnica
* **Linting TypeScript (`tsc --noEmit`):** 0 erros.
* **Compilação Vite (`compile_applet`):** Sucesso absoluto na compilação.
* **Execução da Tela:** A Ficha do Aluno abre instantaneamente sem interrupção para qualquer perfil de aluno selecionado.
