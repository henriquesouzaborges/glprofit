# Registro de Alteração do Sistema — GL PRO FIT

**Versão da Modificação:** v2.4.29  
**Data:** 05 de Novembro de 2026  
**Autor:** Equipe de Engenharia GL PRO FIT  
**Solicitante:** Gianluca Marinho (`marinho.gianluca@gmail.com`)  
**Título:** Nova Tela Central da Ficha do Aluno 360° (Substituição de Card Sobreposto por Tela Integrada)

---

## 1. Objetivo da Alteração
Atender à solicitação para que, na aba de **Clientes**, ao clicar no botão **"Ficha"** (ou no nome do aluno), o sistema não exiba mais um card sobreposto (modal popup), e sim abra uma **nova tela central completa e imersiva**, consolidando de forma ultra-ágil todos os dados relacionados ao perfil do aluno:
1. Treinos e prescrições técnicas
2. Avaliações físicas e composição corporal
3. Questionários de bem-estar e prontidão diária
4. Financeiro, mensalidades e débitos
5. Presenças e histórico de catraca
6. Nutrição e planejamento alimentar

---

## 2. Detalhamento da Implementação

### 2.1. Novo Componente: `FichaCompletaAlunoView.tsx` (`src/components/tabs/alunos/FichaCompletaAlunoView.tsx`)
Criada uma tela central executiva de alta resolução e navegação ágil contendo:

* **Barra Superior de Navegação:**
  * Botão de retorno **"← Voltar para Lista de Alunos"** para transição imediata de volta à tabela.
  * Botões de ação rápida:
    * 💬 **WhatsApp:** Disparo direto de mensagens personalizadas ou lembretes.
    * ⚡ **Testar Catraca:** Simulação de acesso físico imediato.
    * 💳 **Quitar Débito:** Regularização instantânea de mensalidades em atraso.
    * 🖨️ **Imprimir Ficha:** Exportação e impressão do raio-X do aluno.
* **Cabeçalho Principal do Aluno:**
  * Foto ampliada com badge de status dinâmico (Ativo, Inadimplente, Trancado, Cancelado).
  * Menu suspenso rápido para alterar o status cadastral do aluno com 1 clique.
  * Código de matrícula, CPF, idade calculada a partir da data de nascimento, telefone e e-mail.
  * Card de plano contratado, valor mensal e próximo vencimento.
  * Alertas clínicos e observações médicas em destaque.
* **Navegação Rápida por 7 Sub-Abas do Perfil:**
  1. 📋 **Raio-X Geral:** Dashboard com os 4 KPIs essenciais (treinos ativos, % de gordura, prontidão hoje e acessos no mês) e visões resumidas de treino e bem-estar.
  2. 🏋️‍♂️ **Treinos:** Detalhamento completo de cada divisão periodizada (A, B, C...), grupos musculares, séries, repetições, carga (kg), tempo de descanso e envio do treino formatado via WhatsApp.
  3. 📊 **Avaliações Físicas:** Histórico de protocolos (Pollock 7 dobras / Bioimpedância), composição corporal (% de gordura, peso, massa magra, massa gorda, IMC) e tabela de dobras cutâneas (peitoral, abdominal, coxa, panturrilha, tríceps, etc.).
  4. 🩺 **Bem-Estar & Prontidão:** Histórico de questionários diários (sono, esforço PSE, dor muscular EVA, estresse, humor) e cálculo do Readiness Score com recomendações práticas para a carga da sessão.
  5. 💰 **Financeiro:** Histórico de todas as transações, parcelas e mensalidades do aluno, indicando datas de vencimento, valores, forma de pagamento e status com opção de quitação direta.
  6. 🕒 **Presenças & Acessos:** Tabela com todos os registros de passagem na catraca física/virtual (horário, tipo de passagem, catraca utilizada e status liberado/bloqueado).
  7. 🥗 **Nutrição & Dieta:** Metas calóricas (GET e TMB calculados), distribuição de macronutrientes (proteínas em 2g/kg, carboidratos e lipídios), meta diária de hidratação e cardápio diário estruturado por horários de refeição.

### 2.2. Integração na Aba de Clientes (`src/components/tabs/AlunosTab.tsx`)
* A aba agora gerencia o estado `selectedStudentForFullView: Student | null`.
* Ao clicar no botão **"Ficha"** de qualquer aluno ou no seu nome na lista, o sistema renderiza a `FichaCompletaAlunoView` ocupando 100% da área útil central.
* Ao clicar em **"Voltar para Lista de Alunos"**, o sistema retorna suavemente à visualização em tabela mantendo a paginação e busca ativas.

### 2.3. Eliminação do Modal Sobreposto Antigo (`src/App.tsx`)
* Removida a invocação do `<FichaAlunoModal ... />` em overlay sobreposto do `App.tsx`.
* Passados os conjuntos de dados completos (`transactions`, `workouts`, `accessLogs`, etc.) para a `AlunosTab`.

---

## 3. Arquivos Criados e Modificados

| Arquivo | Ação | Descrição |
| :--- | :--- | :--- |
| `src/components/tabs/alunos/FichaCompletaAlunoView.tsx` | **Criado** | Tela central completa 360° do aluno |
| `src/components/tabs/AlunosTab.tsx` | **Modificado** | Renderização da tela central ao clicar em Ficha e retorno à lista |
| `src/App.tsx` | **Modificado** | Passagem de props ricas para a AlunosTab e remoção do modal antigo sobreposto |
| `src/version.ts` | **Modificado** | Atualização para v2.4.29 e inclusão no histórico |
| `package.json` | **Modificado** | Sincronização da versão para 2.4.29 |

---

## 4. Validação Técnica
* **TypeScript Linting (`tsc --noEmit`):** Executado sem nenhum erro de tipagem.
* **Compilação Vite (`npm run build`):** Sucesso absoluto na geração dos pacotes.
* **Validação de Usabilidade:** Transição fluida entre lista de alunos e tela central do perfil sem qualquer sobreposição de modal.
