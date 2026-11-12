# GL PRO FIT Enterprise Suite — Dossiê & Documentação Mestre Consolidada

**Versão Corrente do Sistema:** v2.4.36  
**Build:** 20261111.01  
**Data da Consolidação:** 11 de Novembro de 2026  
**Mantenedor / Unidade:** Ville Blanche Sport — Gianluca Marinho  
**Ambiente de Nuvem Firestore:** `ai-studio-vbsportadm-f4a72c22-1567-475f-a82d-18ccf669ad1b`  

---

## 1. Visão Geral do Sistema

O **GL PRO FIT Enterprise Suite** é uma solução corporativa completa, robusta e modular desenvolvida para gestão de academias, centros de treinamento esportivo de alto rendimento, boxes de CrossFit/Funcional, estúdios de Pilates, artes marciais e franquias fitness. 

Além de cobrir toda a operação de uma unidade própria (da recepção à prescrição de treinos e fluxo de caixa), o sistema opera em modelo **Multi-Tenant e B2B SaaS**, permitindo cadastrar e licenciar o software para outras empresas parceiras, controlando contratos, mensalidades MRR e a ativação/bloqueio granular de módulos para cada empresa cliente.

---

## 2. Stack Tecnológica e Arquitetura de Software

* **Frontend:** React 19 (SPA) com TypeScript, Vite 6 e Tailwind CSS.
* **Backend:** Node.js Express em `server.ts` servindo proxies e endpoints seguros `/api/*` (ex: geração de relatórios de IA, webhooks e sincronização).
* **Banco de Dados em Nuvem (Firebase Firestore):**
  - ID do Banco: `ai-studio-vbsportadm-f4a72c22-1567-475f-a82d-18ccf669ad1b`.
  - Sincronização em tempo real bidirecional entre Firestore e o estado local React, com camada de fallback automático e cache em `localStorage`.
  - Regras de segurança ativas em `firestore.rules` (deploy automático via RPC).
* **Coleções Ativas no Firestore:**
  1. `students` — Cadastro completo de alunos, fotos, situação e dados médicos.
  2. `plans` — Planos de mensalidade (anual, semestral, mensal, etc.).
  3. `financial_transactions` — Lançamentos de receitas, despesas, PDV e cobranças.
  4. `classes` — Turmas, modalidades, instrutores, capacidade e listas de chamada.
  5. `workouts` — Prescrições de treino e fichas com séries, repetições e cargas.
  6. `leads` — Pipeline comercial de captação e conversão de novos clientes.
  7. `products` — Estoque físico de suplementos, roupas e itens esportivos.
  8. `comandas` — Controle de consumo na lanchonete da empresa.
  9. `stock_movements` — Entradas, saídas e ajustes de estoque.
  10. `suppliers` — Fornecedores cadastrados.
  11. `recurring_charges` — Assinaturas recorrentes no cartão via GL Profit Pay.
  12. `payment_links` — Links de pagamento gerados para envio pelo WhatsApp.
  13. `crm_activities` & `crm_automations` — Tarefas comerciais e réguas de contato.
  14. `satisfaction_surveys` — Pesquisas de satisfação e NPS dos alunos.
  15. `calendar_events` — Eventos institucionais, jogos e locações de quadras.
  16. `system_settings` — Identidade da unidade, chave Pix e políticas de tolerância.
  *(A antiga coleção `access_logs` de catraca física foi totalmente extinta na versão v2.4.35).*
* **Inteligência Artificial (Google Gemini API):**
  - SDK: `@google/genai` no backend.
  - Usos: Diagnósticos preditivos de Dashboards BI, parecer de sobrecarga fisiológica (ACWR), análise de composição corporal e OCR inteligente de fichas antigas e planilhas.
* **Autenticação e Biometria de Operadores:**
  - Login por e-mail/senha com controle de perfis de acesso (RBAC).
  - Autenticação Biométrica Nativa FIDO2 / WebAuthn (Touch ID, Face ID, Windows Hello e Passkeys) no `LoginPage.tsx` para acesso ultrarrápido e seguro de recepcionistas e administradores.

---

## 3. Arquitetura de Interface e Navegação

### 3.1. Layout 100% Full-Width (Sem Limites de Margem)
O sistema opera em modo de tela cheia sem contenção de largura máxima (`w-full min-w-0`), aproveitando 100% dos monitores modernos para tabelas completas, gráficos executivos e visões Kanban.

### 3.2. Cabeçalho Superior Fixo (`Header.tsx`)
* Logomarca oficial **GL PRO FIT**.
* Busca rápida global de alunos por nome ou código com abertura direta da ficha.
* Atalhos rápidos: Novo Cliente e Nova Venda (PDV).
* Central de notificações push em tempo real com alertas sonoros configuráveis.
* Menu do usuário logado: perfil, departamento, versão ativa e opção de logout.

### 3.3. Menu Superior em Pílulas com Sub-abas Retráteis (`TopNav.tsx`)
Navegação horizontal limpa e ergonômica com 16 módulos. Cada módulo que contém sub-abas possui uma seta indicativa (chevron) dentro da própria pílula, permitindo expandir ou recolher a linha secundária de sub-abas a qualquer momento.

---

## 4. Detalhamento dos Módulos e Funcionalidades

### 4.1. Início (`inicio`)
* **KPIs Rápidos:** Total de alunos ativos, faturamento do dia, aulas agendadas e taxa de inadimplência.
* **Régua de Cobrança Preventiva:** Alertas inteligentes para alunos com pagamentos próximos ao vencimento ou em atraso.
* **Status do Sistema:** Monitor em tempo real de integridade do servidor em nuvem e conexão com o Firebase Firestore.
* **Banner de Licenciamento:** Aviso com contagem regressiva em dias, horas e minutos quando uma escola ou empresa cliente parceira está em período de renovação de contrato.

### 4.2. Dashboards de Business Intelligence (`dashboards`)
Composto por 7 visões analíticas especializadas:
1. **CRM & Funil Comercial:** Origem dos leads, conversão de aulas experimentais, taxa de fechamento e ticket médio.
2. **Gerencial (DRE Executivo):** Faturamento bruto, receita líquida, custos operacionais, EBITDA, margem de contribuição e ponto de equilíbrio.
3. **Clientes & Retenção:** Base ativa, taxa de churn mensal, alunos em risco de abandono e tempo médio de permanência.
4. **Financeiro & Caixa:** Entradas e saídas diárias, projeções e divisão por forma de pagamento (Pix, Crédito, Débito, Recorrência).
5. **Agenda & Ocupação:** Taxa de ocupação das turmas, modalidades mais disputadas e assiduidade dos instrutores.
6. **Treino & Prescrição:** Cobertura de prescrições ativas, volume de séries prescritas e catálogo de exercícios.
7. **WhatsApp Robô:** Desempenho de mensagens automáticas, taxa de resposta e conversão de campanhas.
* **Card de Inteligência Artificial Gemini em cada sub-aba:**
  - Diagnóstico executivo gerado ao vivo com score de saúde (0 a 100).
  - Painel de **Metas & Preferências Pré-configuradas** permitindo ao gestor editar metas numéricas e diretrizes específicas da sua academia.
  - Simulação preditiva: confronta o cenário "Se o gestor agir" versus "Se não tomar ação".
  - Botões para copiar o relatório formatado ou compartilhar o resumo diretamente no WhatsApp do gestor.

### 4.3. Clientes / Alunos (`clientes`)
* Listagem completa de alunos com busca instantânea por nome, CPF, código ou telefone.
* Filtros por situação: Todos, Ativos, Inadimplentes, Trancados e Cancelados.
* Botão de WhatsApp direto na lista para abrir conversa contextualizada.
* **Ficha Completa do Aluno — Nova Tela Central 360° (`FichaCompletaAlunoView.tsx`):**
  - Substitui janelas modais sobrepostas por uma tela central dedicada com navegação por sub-abas e cards recolhíveis/minimizáveis:
  - **Sub-aba 1: Raio-X Geral:** Métricas resumidas em 3 colunas (Treinos Ativos, % Gordura Corporal e Prontidão Hooper), anamnese médica e alertas importantes.
  - **Sub-aba 2: Dados do Cadastro:** Formulário completo para alterar dados cadastrais (nome, CPF, nascimento, telefone, email, plano contratado, valor, vencimento, situação) e alteração/upload de foto com fallback para ícone elegante caso o aluno não possua imagem.
  - **Sub-aba 3: Treinos:** Histórico de fichas de treino vinculadas ao aluno, divisão ABC/ABCD, exercícios, séries, repetições e cargas.
  - **Sub-aba 4: Avaliações Físicas:** Histórico de bioimpedância, percentual de gordura, medidas antropométricas e gráficos de evolução.
  - **Sub-aba 5: Bem-Estar & Prontidão:** Histórico de check-ins matinais diários do aluno com cálculo de aptidão para o treino do dia.
  - **Sub-aba 6: Financeiro do Aluno:** Extrato financeiro individual do aluno, mensalidades pagas e pendentes, botão para liquidar mensalidade e botão **"Vender"** para lançar vendas de novos planos, produtos ou serviços vinculados a ele.
  - **Sub-aba 7: Nutrição & Dieta:** Plano alimentar do aluno, metas calóricas, distribuição de macronutrientes (proteínas, carboidratos e gorduras) e orientações nutricionais.

### 4.4. Professores & Instrutores (`professores`)
* **Folha de Ponto:** Marcação de entrada, saída, intervalo e total de horas trabalhadas por professor com cálculo de valor/hora e aulas ministradas.
* **Tarefas da Equipe:** Quadro de tarefas operacionais diárias atribuídas aos instrutores (manutenção de sala, higienização, elaboração de rotinas).
* **Agenda dos Professores:** Visão das aulas de cada professor com lista de alunos inscritos.

### 4.5. CRM & Captação de Alunos (`crm`)
* **Pipeline Kanban de Leads:** Colunas customizáveis (Novo Lead, Agendado, Compareceu, Em Negociação, Matriculado, Perdido) com arraste e atualização instantânea.
* **Atividades Comerciais:** Registro de ligações, mensagens de WhatsApp e visitas agendadas.
* **Automações de Vendas:** Réguas automáticas para contato com leads frios e follow-up pós-aula experimental.
* **Pesquisas de Satisfação:** Coleta e mensuração de NPS (Net Promoter Score) dos matriculados.

### 4.6. Agenda & Grade de Aulas (`agenda`)
* **Calendário Interativo:** Visão diária, semanal e mensal de horários e eventos.
* **Grade de Turmas:** Musculação, CrossFit / Funcional, Spinning, Natação, Muay Thai / Lutas e Pilates.
* **Controle de Vagas:** Lotação máxima, inscritos e lista de chamada rápida.
* **Locações:** Gestão de aluguel de quadras, estúdios e espaços para eventos externos com cobrança integrada.
* **Jogos e Torneios:** Organização de campeonatos internos da academia.

### 4.7. WhatsApp Integrado & Robô de Mensagens (`whatsapp`)
* **Atendimento Multicanal:** Visualização de conversas com histórico e dados cadastrais do aluno na barra lateral.
* **Kanban de Atendimento:** Organização de conversas em etapas de suporte e vendas.
* **Disparos em Massa:** Campanhas segmentadas (inadimplentes, ausentes há mais de 15 dias, aniversariantes do mês e comunicados gerais).
* **Chatbot com Menus Automáticos:** Resposta automática para opções numéricas (1 - Planos e Preços, 2 - Agendar Experimental, 3 - PIX e Regularização Financeira, 4 - Falar com atendente).
* **Conexão QR Code:** Gerenciador de conexão com o WhatsApp Web.

### 4.8. Financeiro & Gestão de Caixa (`financeiro`)
* **Contas a Receber & Inadimplência:** Listagem de mensalidades em atraso com cálculo de dias de atraso e botão de cobrança Pix via WhatsApp.
* **Contas a Pagar:** Registro de despesas operacionais (aluguel, contas de energia, folha salarial, manutenção).
* **DRE Gerencial:** Demonstrativo de Resultado do Exercício consolidado por período.
* **Extrato Completo:** Histórico de todas as movimentações financeiras.
* **GL Profit Pay:** Gateway nativo com gestão de cartões de crédito recorrentes (estilo Netflix), links de pagamento e liquidação instantânea por Pix sem tarifas abusivas.

### 4.9. Treinos & Prescrição Técnica (`treino`)
* **Prescrição Digital de Treinos:** Montagem de treinos segmentados (A, B, C, D, E) com seleção de exercícios.
* **Catálogo de Exercícios:** Base integrada com mais de 1.400 exercícios organizados por grupo muscular com animações e instruções de execução.
* **Modelos & Templates:** Fichas padrão pré-configuradas (Hipertrofia Iniciante, Emagrecimento, Força, Reabilitação).
* **Treino do Dia (Modo Aluno):** Interface limpa para o aluno acompanhar as séries e cronômetro de descanso pelo celular.
* **Controle de Carga & 1RM:** Cálculo de percentuais de repetição máxima e progressão de sobrecarga.

### 4.10. Bem-Estar & Prontidão Hooper (`bem_estar`)
* **Check-in Diário de Prontidão:** Escala validada de Hooper avaliando sono, dor muscular tardia, estresse e fadiga geral (score de 0 a 100).
* **Análise de Sobrecarga:** Parecer automatizado sobre risco de lesão por overtraining baseado na razão de carga aguda/crônica (ACWR).
* **Matriz do Elenco:** Visão geral da equipe/turma destacando alunos aptos e alunos que necessitam de treino regenerativo.
* **Monitoramento do Ciclo Menstrual:** Acompanhamento das fases hormonal, folicular e lútea para adaptação da intensidade de treino para alunas.

### 4.11. Avaliações Físicas & Cineantropometria (`avaliacoes`)
* **Composição Corporal:** Protocolo Pollock de 7 dobras cutâneas (tríceps, subescapular, axilar média, suprailíaca, abdominal, peitoral, coxa).
* **Bioimpedância e Circunferências:** Registro de massa magra, massa gorda, água corporal e perímetros musculares.
* **Gráficos de Comparação Temporal:** Confronto visual entre avaliações sucessivas do aluno.

### 4.12. Estoque & Almoxarifado (`estoque`)
* Controle de produtos (suplementos, bebidas, vestuário, acessórios).
* Registro de entradas e saídas de mercadorias com custo médio e preço de venda.
* Alerta de estoque mínimo para reposição automática.

### 4.13. Lanchonete da Empresa (`comandas`)
* Substitui as comandas genéricas por um módulo especializado no controle da **Lanchonete da Academia**.
* Abertura de comandas vinculadas ao aluno ou consumo avulso.
* Lançamento de shakes, sucos, cafés, açaí, barrinhas e lanches proteicos.
* Fechamento de conta com cobrança no cartão, dinheiro, Pix ou acréscimo na mensalidade do aluno.

### 4.14. Nutrição & Dietas (`nutricao`)
* Elaboração de planos alimentares e dietas com cálculo de calorias e macros.
* Tabela de alimentos TACO integrada para consulta nutricional.
* Metas de hidratação e recomendações de suplementação.

### 4.15. Relatórios Executivos (`relatorios`)
* Relatórios consolidados de fluxo de caixa, DRE sintético, taxa de inadimplência e taxa de churn.
* Impressão e exportação padronizada em formato limpo.

### 4.16. Empresas Clientes — Módulo B2B SaaS (`empresas_clientes`)
Localizado imediatamente à esquerda da aba de Configurações, este módulo permite comercializar o GL PRO FIT como uma plataforma SaaS para terceiros:
* **Sub-aba Dashboard B2B:**
  - MRR Total (Receita Recorrente Mensal de licenças vendidas).
  - Quantidade de empresas parceiras ativas.
  - Taxa de retenção e índice de adimplência dos contratos B2B.
* **Sub-aba Licenças, Acessos & Módulos:**
  - Tabela com todas as empresas clientes (ex: Matriz, Box de CrossFit Arena Central, Estúdios Parceiros).
  - Status em tempo real: **Ativo** (verde) ou **Bloqueado** (vermelho) com alternância com 1 clique.
  - Modal de cadastro de novas empresas parceiras (Razão Social, CNPJ, responsável, telefone, plano, mensalidade e vencimento).
  - **Seletor Granular de Módulos:** Para cada empresa cliente, o administrador marca quais módulos do GL PRO FIT estarão disponíveis (ex: habilitar apenas Treino + Agenda para um estúdio de lutas, ou o sistema completo para uma grande rede).

### 4.17. Configurações do Sistema (`configuracoes`)
* **Dados Cadastrais da Unidade:** Razão social, nome fantasia, CNPJ, endereço e chave Pix oficial.
* **Tolerância Financeira:** Carência em dias para atraso de mensalidade antes do acionamento de réguas de cobrança.
* **Gestão de Usuários e Equipe (RBAC):** Criação, edição de permissões modulares e redefinição de senhas para administradores, gerentes, professores e recepcionistas.
* **Migrações com IA Gemini:** Motor de OCR e processamento de planilhas Excel/CSV ou fotos de fichas físicas para importação massiva automática de cadastros e treinos.
* **Backup Manual do Administrador (Snapshot JSON):** Exportação e download completo de todo o banco de dados em arquivo `.json` com contadores de registros verificados.

---

## 5. Perfis de Usuário e Controle de Permissões (RBAC)

O sistema conta com controle de permissões por módulo implementado em `userService.ts`:
* **`admin` (Diretoria / Administrador Master):** Acesso irrestrito a todos os módulos, configurações financeiras, gestão de usuários e módulo Empresas Clientes.
* **`gerente` (Gerência Operacional):** Acesso a relatórios, clientes, agenda, estoque, CRM, lanchonete e PDV.
* **`professor` / `treinador`:** Acesso a treinos, avaliações físicas, bem-estar, chamada de aulas e folha de ponto.
* **`recepcao`:** Acesso ao balcão, clientes, vendas, comandas da lanchonete, agenda e WhatsApp.
* **`financeiro`:** Acesso a contas a pagar/receber, conciliação Pix, recorrência e DRE.
* **`nutricionista`:** Acesso a fichas de alunos, dietas e anamnese nutricional.

---

## 6. Histórico Recente de Versões e Evolução

* **v2.4.36 (Corrente):** Criação da documentação mestre consolidada e dossiê técnico completo para continuidade sem perda de contexto.
* **v2.4.35:** Remoção definitiva do módulo de catraca física/virtual e logs de passagem (`access_logs`), com preservação estrita da biometria de login WebAuthn e deploy das regras do Firestore.
* **v2.4.34:** Lançamento da aba **Empresas Clientes (B2B SaaS)** com dashboard de MRR e controle granular de módulos e licenças por empresa parceira.
* **v2.4.33:** Expansão do layout para 100% da largura útil da tela (Full-Width), eliminando bordas limitantes em telas widescreen.
* **v2.4.32:** Substituição da barra lateral pelo menu superior **TopNav** em pílulas com sub-abas retráteis por seta e cabeçalho claro corporativo.
* **v2.4.31:** Lançamento da aba "Dados do Cadastro" no perfil do aluno, cards minimizáveis por padrão com alternância por seta, botão "Vender" no financeiro do aluno e renomeação de Comandas para "Lanchonete da Empresa".
* **v2.4.30:** Correção de alinhamentos e sincronização de dados cadastrais na ficha do aluno.
* **v2.4.29:** Redesenho da Ficha do Aluno para Tela Central 360° em substituição a cards sobrepostos.
* **v2.4.28:** Posicionamento superior ergonômico de modais.
* **v2.4.26:** Redesign da tela de login com suporte a biometria nativa WebAuthn/Passkeys.

---

## 7. Instruções para Continuidade em Novas Sessões

Ao iniciar uma nova sessão ou conversa:
1. O desenvolvedor/assistente deve consultar este documento mestre (`DOCUMENTACAO_COMPLETA_SISTEMA_GL_PRO_FIT.md`) e o arquivo de versão (`src/version.ts`).
2. Qualquer solicitação de alteração deve respeitar a **`RULE[AGENTS_md]`**:
   - Incrementar obrigatoriamente a versão em `src/version.ts` e `package.json`.
   - Adicionar o respectivo item explicativo no array `changelog` de `src/version.ts`.
   - Criar o arquivo de registro técnico em `/.aistudio/artifacts/brain/f4a72c22-1567-475f-a82d-18ccf669ad1b/registro_alteracoes_vX.X.X.md`.
3. Nunca recriar ou reintroduzir módulos de catraca física a menos que expressamente solicitado pelo administrador.
4. Manter sempre a compilação limpa (`npm run build`) e sem erros de TypeScript (`tsc --noEmit`).
