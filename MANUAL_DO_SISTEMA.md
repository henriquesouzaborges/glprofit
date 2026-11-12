# GL PRO FIT — Manual Completo do Sistema e Documentação Técnica

**Versão da Documentação:** v2.4.25  
**Data:** 05 de Novembro de 2026  
**Sistema:** GL PRO FIT Enterprise Suite (VB SPORT ADM)  
**Ambiente:** Web Full-Stack (Node.js 22 + React 19 + TypeScript + Firebase Firestore + Google Gemini AI)

---

## Sumário Executivo

O **GL PRO FIT** é uma plataforma corporativa completa desenvolvida para a gestão integrada de academias, centros de treinamento, boxes esportivos e franquias fitness. Ele unifica em um único ecossistema:

1. **Gestão Operacional e Alunos:** Fichas cadastrais completas, controle de matrículas e régua de cobrança automática por inadimplência.
2. **Prescrição Técnica e Fisiológica:** Montagem de treinos periodizados, avaliações físicas com bioimpedância e dobras cutâneas (Pollock), planejamento nutricional e monitoramento de bem-estar/prontidão.
3. **Inteligência Artificial (Gemini):** Análise preditiva e parecer fisiológico avançado (modelos Foster, Gabbett e Banister) sobrecarga de treino, além de motor de migração inteligente de planilhas e fotos de fichas físicas.
4. **Financeiro e Pagamentos:** PDV balcão, comandas de consumo, controle de estoque, DRE gerencial, emissão de cobranças Pix dinâmicas e gestão de recorrência (GL PRO FIT Pay).
5. **Relacionamento e Vendas (CRM):** Pipeline de leads estilo Kanban, automações de follow-up e integração direta com WhatsApp.
6. **Multi-Tenant e Licenciamento:** Módulo exclusivo para o Administrador Master gerenciar licenças e vencimentos de contratos de academias e escolas terceirizadas parceiras.

---

## 1. Arquitetura e Tecnologias Utilizadas

* **Frontend:** React 19 (SPA) com TypeScript, Vite 6 e Tailwind CSS.
* **Ícones e Animações:** Lucide React e Motion (Framer Motion).
* **Backend:** Node.js v22 com servidor Express (`server.ts`) operando como proxy seguro para a API do Google Gemini e servidor de arquivos estáticos em produção.
* **Inteligência Artificial:** Google GenAI SDK (`@google/genai`) integrado ao modelo **Gemini 3.8 Flash** para análises de sobrecarga de treino, pareceres clínicos e extração OCR/multimodal de cadastros.
* **Banco de Dados & Autenticação:**
  * **Google Cloud Firestore (Firebase):** Banco NoSQL com sincronização bidirecional em tempo real e regras de segurança reforçadas (`firestore.rules`).
  * **Database ID:** `ai-studio-vbsportadm-f4a72c22-1567-475f-a82d-18ccf669ad1b`
  * **Projeto Firebase:** `articulate-balm-vn2tx`
  * **Autenticação:** Suporte a e-mail/senha, credenciais de sistema com RBAC (Role-Based Access Control), autenticação biométrica via WebAuthn (Touch ID, Face ID e Windows Hello) e OAuth Google.

---

## 2. Perfis de Usuários e Permissões (RBAC)

O sistema possui controle rígido de acesso baseado em níveis operacionais:

| Usuário | E-mail | Senha | Cargo / Nível | Escopo de Acesso |
| :--- | :--- | :--- | :--- | :--- |
| **Gianluca Marinho** | `marinho.gianluca@gmail.com` | *Definida pelo administrador* | **Administrador Master (Diretoria)** | Acesso irrestrito a todas as abas, gestão de licenças parceiras, auditoria, configurações e backup. |
| **Recepção Matriz** | `recepcao@vbsport.com.br` | *Definida pelo administrador* | **Recepção / Atendimento** | Alunos, Agenda, Vendas Balcão, Lanchonete, WhatsApp e Início. |
| **Prof. Rodrigo Tavares** | `rodrigo.tavares@vbsport.com.br` | *Definida pelo administrador* | **Treinador / Instrutor** | Alunos, Treinos, Avaliações Físicas, Nutrição, Bem-Estar e Agenda. |
| **Amanda Souza** | `financeiro@vbsport.com.br` | *Definida pelo administrador* | **Controladoria / Financeiro** | Financeiro, DRE, GL PRO FIT Pay, Vendas, Lanchonete, Estoque e Relatórios. |

---

## 3. Guia Detalhado dos Módulos e Abas

### 3.1. Início (Dashboard Executivo)
* **Visão Panorâmica:** Indicadores chave de desempenho (KPIs) com dados 100% reais:
  * **Clientes Ativos:** Contagem dinâmica baseada nos alunos com status `ativo` (sem valores fictícios).
  * **Novos Clientes:** Total de novos alunos matriculados no período.
  * **Acessos na Catraca:** Frequência acumulada do dia.
* **Gestão de Escolas Parceiras (Exclusivo Administrador):**
  * Botão especial no topo da tela para gerenciar escolas parceiras que utilizam o sistema terceirizado.
  * Permite definir datas de vencimento de contrato, ativar/desativar aviso de renovação para cada escola, disparar cobranças no WhatsApp e alternar modo preview de simulação.
  * O aviso de contrato **nunca** é exibido para o Administrador Master (`Gianluca Marinho`).
* **Gráficos Financeiros e Fluxo:** Comparativo de receita x despesa e curva de frequência por turno (Manhã, Tarde, Noite).
* **Tarefas Operacionais e Notificações:** Alertas de mensalidades vencidas de alunos, avisos de contratos e aniversariantes do dia.

---

### 3.2. Dashboards e Análise Científica
Possui 5 sub-visões especializadas:
1. **Gerencial:** Visão global de faturamento, ticket médio, taxa de ocupação e metas mensais.
2. **Análise (Científica e Carga de Treinamento):**
   * **Seletor Sob Demanda:** Toolbar minimalista com apenas **"Todos os Gráficos"** e **"Filtrar Gráficos"** (dropdown com caixas de seleção).
   * **Recomendações Clínicas em Hover:** Balão flutuante discreto com ícone de comentário ao lado do título de cada indicador (Prontidão, Sono, PSE, Dor Muscular, Estresse, Monotonia e Strain).
   * **Botão de Ampliação Minimalista:** Apenas o ícone das duas setas em diagonal (`Maximize2`/`Minimize2`), expandindo o gráfico em alta definição sem poluição visual.
   * **Alerta Crítico de Sobrecarga:** Card interativo com animação de placa pulando, contagem precisa de alunos em risco e botão **"Ver Alunos"** que abre modal detalhado.
   * **Relatório da IA Executivo ao Final da Página:** Localizado logo após o último gráfico, o motor de IA Gemini processa os dados **estritamente dos gráficos selecionados** pelo usuário, fornecendo laudo de sobrecarga, diagnóstico de tendência, condutas práticas e plano de ação imediato com opção de compartilhamento no WhatsApp.
3. **Financeiro:** Projeção de fluxo de caixa, inadimplência e métodos de pagamento mais utilizados.
4. **Retenção & Churn:** Taxa de renovação de planos, tempo médio de permanência e motivos de cancelamento.
5. **Frequência:** Mapa de calor de horários de pico e dias de maior movimento na academia.

---

### 3.3. Alunos / Clientes
* **Listagem Inteligente:** Busca rápida por nome, CPF, código de matrícula ou status (Ativo, Inadimplente, Trancado, Cancelado).
* **Ficha Completa do Aluno:** Foto, dados médicos, plano contratado, vencimento, histórico de pagamentos, acessos registrados e treinos vinculados.
* **Importação Inteligente com IA:** Botão de migração que permite subir planilhas Excel/CSV ou fotos de fichas de papel antigas; a IA extrai automaticamente os dados e cadastra os alunos.
* **Ações Rápidas:** Disparo de mensagens no WhatsApp, emissão de cobrança avulsa, trancamento e renovação de matrícula.

---

### 3.4. Professores e Instrutores
* **Cadastro da Equipe:** Especialidades (Musculação, Lutas, Natação, Pilates, Funcional, Spinning).
* **Folha de Ponto Digital:** Registro de entrada, saída, intervalo e horas extras trabalhadas.
* **Comissionamento:** Regras de remuneração por aluno atendido, hora-aula ou vendas de planos.

---

### 3.5. CRM & Vendas (Funil de Leads)
* **Pipeline Kanban:** Estágios estruturados:
  1. *Contato Inicial*
  2. *Visita Agendada*
  3. *Aula Experimental*
  4. *Negociação*
  5. *Matriculado (Ganho)*
  6. *Perdido*
* **Automações de Follow-up:** Lembretes automáticos para contato com leads que não compareceram à aula experimental.
* **Pesquisas de Satisfação (NPS):** Histórico de avaliações dos alunos sobre a estrutura, professores e limpeza.

---

### 3.6. Agenda & Grade de Horários
* **Grade Semanal e Diária:** Visualização das aulas coletivas com indicação de professor e sala.
* **Capacidade e Vagas:** Controle de lotação máxima, lista de espera e check-in antecipado do aluno.
* **Agendamento de Avaliações:** Reserva de horários para avaliação física e bioimpedância.

---

### 3.7. WhatsApp Integrado
* **Automações de Cobrança:** Envio de lembretes amigáveis antes do vencimento e aviso de pendência financeira.
* **Mensagens Transacionais:** Boas-vindas ao novo aluno, treino do dia prescrito e parabéns pelo aniversário.
* **Central de Disparo em Massa:** Campanhas segmentadas (ex: alunos inativos há mais de 30 dias).

---

### 3.8. GL PRO FIT Pay
* **Recorrência Inteligente:** Cobrança mensal automática no cartão de crédito do aluno sem bloquear o limite total da anuidade.
* **Links de Pagamento:** Geração de links personalizados para envio por e-mail ou WhatsApp.
* **Pix Instantâneo:** Geração de QR Code dinâmico com conciliação bancária imediata no sistema.

---

### 3.9. Financeiro
* **Contas a Receber:** Visão clara de mensalidades pendentes, pagas e vencidas com filtros por data.
* **Contas a Pagar:** Gestão de despesas fixas (aluguel, água, luz) e variáveis (manutenção de equipamentos, comissões).
* **DRE Gerencial:** Demonstrativo do Resultado do Exercício com cálculo automático do lucro líquido e margem operacional.
* **Extrato e Fluxo de Caixa:** Conciliação bancária por método de pagamento (Pix, Dinheiro, Débito, Crédito, Boleto).

---

### 3.10. Vendas Balcão & PDV
* **Terminal Ponto de Venda:** Venda ágil de produtos (água, suplementos, barras de proteína, vestuário).
* **Leitor de Código de Barras:** Suporte a leitor óptico ou busca direta por código.
* **Multi-Formas de Pagamento:** Divisão de pagamento entre Pix e dinheiro em uma mesma transação.

---

### 3.11. Estoque
* **Controle de Produtos:** Registro de custo, preço de venda e margem de lucro.
* **Alertas de Reposição:** Notificação visual para produtos com estoque abaixo da quantidade mínima recomendada.
* **Histórico de Movimentações:** Rastreabilidade de entradas e saídas por operador.

---

### 3.12. Comandas Eletrônicas
* **Consumo no Bar/Lanchonete:** Abertura de comanda vinculada ao nome do aluno ou comanda avulsa com cartão físico.
* **Flexibilidade no Fechamento:** Pagamento imediato no balcão ou lançamento do débito para ser pago junto com a próxima mensalidade.

---

### 3.13. Treinos & Periodização
* **Montagem de Divisões:** Treinos A, B, C, D, Push/Pull/Legs ou Treinos Funcionais.
* **Biblioteca Completa de Exercícios:** Músculo alvo, equipamento, séries, repetições, carga (kg) e tempo de intervalo.
* **Exportação & WhatsApp:** Envio da ficha em PDF ou texto formatado diretamente para o WhatsApp do aluno.

---

### 3.14. Avaliações Físicas
* **Composição Corporal:**
  * Protocolo de 3 e 7 Dobras Cutâneas (Jackson & Pollock).
  * Bioimpedância com cálculo de % de Gordura, Massa Magra, Massa Gorda e Água Corporal.
* **Perimetria:** Registro de circunferências (braço, tórax, cintura, quadril, coxa, panturrilha).
* **Comparativo Fotográfico:** Registro de fotos frente, costas e perfil para comparação temporal de evolução.

---

### 3.15. Nutrição
* **Cálculo Metabólico:** Cálculo de Taxa Metabólica Basal (Harris-Benedict / Mifflin-St Jeor) e Gasto Energético Total (GET).
* **Cardápio Periodizado:** Montagem de refeições com macronutrientes (proteínas, carboidratos, lipídios) e micronutrientes.
* **Exportação do Plano:** Geração de cardápio alimentar detalhado em PDF para o paciente/aluno.

---

### 3.16. Bem-Estar & Prontidão
* **Questionário Diário de Recuperação:**
  * Qualidade do Sono (escala 1 a 5).
  * Nível de Estresse e Humor.
  * Dor Muscular Tardia (DOMS) e fadiga acumulada.
* **Índice de Prontidão (Readiness Score):** Sinaliza ao treinador se o atleta está apto para treino pesado ou se necessita de recuperação ativa/regenerativa.

---

### 3.17. Relatórios & Auditoria
* **Exportações:** Relatórios detalhados de faturamento, evasão de alunos (churn rate), inadimplência e assiduidade.
* **Formatos Suportados:** Planilhas CSV estruturadas e documentos para impressão/PDF.

---


### 3.19. Configurações do Sistema
* **Identidade da Unidade:** Razão social, nome fantasia (VB SPORT ADM), CNPJ, endereço, telefone e chave Pix oficial.
* **Políticas Operacionais:** Dias de tolerância para atraso antes do bloqueio e mensagens automáticas.
* **Gestão de Usuários:** Adição, edição de permissões e redefinição de senhas da equipe.
* **Sincronização Firebase:** Monitor em tempo real da conexão com o Google Cloud Firestore e status dos documentos.

---

## 4. Política de Governança e Versionamento

O projeto adota a regra obrigatória `RULE[AGENTS_md]`:
* **Versionamento Contínuo:** A cada comando ou solicitação de alteração no sistema, a versão corrente é obrigatoriamente incrementada.
* **Arquivos Mantenedores:**
  * `src/version.ts`: Objeto `SYSTEM_VERSION_INFO` com `version`, `buildNumber`, `releaseDate` e lista de `changelog` detalhada.
  * `package.json`: Campo `"version"` sempre sincronizado com o código.
* **Visualização:** A versão corrente é exibida de forma elegante no rodapé (`Footer.tsx`) e na barra lateral (`Sidebar.tsx`).

---

## 5. Procedimentos de Inicialização e Deploy

### Desenvolvimento Local:
```bash
npm run dev
# Inicia o servidor tsx server.ts na porta 3000 com o Vite integrado em modo middleware
```

### Build e Validação de Tipos:
```bash
npm run lint      # Executa tsc --noEmit para checagem estrita de TypeScript
npm run build     # Compila a aplicação frontend no diretório dist/
```

### Inicialização em Produção (Cloud Run / Docker):
```bash
npm start
# Executa node server.ts servindo os arquivos estáticos de dist/ e as rotas /api/*
```

---
*Documento gerado e mantido pela equipe de engenharia GL PRO FIT Enterprise.*
