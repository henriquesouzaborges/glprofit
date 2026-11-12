export interface ChangelogItem {
  version: string;
  date: string;
  description: string;
  highlights: string[];
}

export interface SystemVersionInfo {
  version: string;
  versionName: string;
  releaseDate: string;
  buildNumber: string;
  status: 'stable' | 'beta' | 'release';
  changelog: ChangelogItem[];
}

export const SYSTEM_VERSION_INFO: SystemVersionInfo = {
  version: 'v2.5.3',
  versionName: 'GL PRO FIT Enterprise Suite',
  releaseDate: '12 de Novembro de 2026',
  buildNumber: '20261112.01',
  status: 'stable',
  changelog: [
    {
      version: 'v2.5.3',
      date: '12/11/2026',
      description: 'Sanitização geral de resíduos e dados fictícios em CRM, automações, pesquisas, agendamentos, DRE, Pay, avaliações, lanchonete, relatórios e dashboards, com criação de botão minimalista de edição no catálogo de exercícios e bloqueio de alucinação na IA.',
      highlights: [
        'Zerar Dados Fictícios Remanescentes: Expurgo de leads no CRM, automações, pesquisas de satisfação e licenças de escolas parceiras simuladas (0 escolas parceiras no painel master)',
        'Dinâmica de Badges e Métricas: Contador de CRM no TopNav e taxa de renovação no B2B calculados dinamicamente com base nos dados reais cadastrados',
        'Catálogo de Exercícios: Adicionado botão minimalista de "Editar" em cada item do catálogo biomecânico de treinos',
        'Abas Avaliações e Lanchonete: Limpeza de alertas de vencimento fake em avaliações e itens mais consumidos dinâmicos na lanchonete',
        'Relatórios e IA: Remoção de offsets fixos no relatório financeiro e instrução anti-alucinação server-side nos prompts de IA para cenários sem dados',
        'Limpeza de Interface: Remoção do cabeçalho redundante na tela central da aba Financeiro'
      ]
    },
    {
      version: 'v2.5.2',
      date: '11/11/2026',
      description: 'Expurgo completo de dados fictícios em Empresas Clientes B2B, Folha de Ponto / Professores, Eventos de Jogos, Conexão WhatsApp, Cargas 1RM e Avaliações Físicas para ambiente virgem de produção.',
      highlights: [
        'Expurgo B2B Empresas Clientes: Exclusão de empresa cliente simulada e definição de INITIAL_EMPRESAS_CLIENTES = [] mantendo o sistema 100% virgem',
        'Expurgo Folha de Ponto & Professores: Remoção dos perfis de professores fictícios, turmas, eventos de jogos e registros de aulas da folha de ponto',
        'Expurgo Conexão WhatsApp: Alteração do status inicial do WhatsApp para desconectado, pronto para vincular a instância real da empresa',
        'Expurgo Cargas 1RM e Avaliações Físicas: Limpeza de registros de cargas, testes físicos e histórico de avaliações nas fichas de alunos',
        'Mecanismo de Reset no Navegador (glprofit_clean_slate_v252): Expurgados automaticamente do localStorage dados de empresas, folha, cargas, testes e configurações de sessões anteriores'
      ]
    },
    {
      version: 'v2.5.1',
      date: '11/11/2026',
      description: 'Reset de produção e expurgo completo de dados fakes para inicialização limpa do sistema.',
      highlights: [
        'Limpeza Completa de Dados Fictícios: Expurgo de todos os alunos, transações, treinos, turmas, leads, produtos, comandas, fornecedores, pesquisas, histórico do WhatsApp e mensagens fictícias',
        'Manutenção dos Dados Cadastrais: Preservação dos dados cadastrais originais do GL PRO FIT na aba Configurações e manter apenas a empresa matriz GL PRO FIT no B2B',
        'Usuário Administrador Único: Gianluca Marinho (marinho.gianluca@gmail.com) mantido como único operador/administrador ativo com remoção da foto fictícia para ambiente de produção',
        'Purge Automático no Navegador: Mecanismo de reset v2.5.1 no App.tsx para expurgar dados em cache no localStorage de sessões anteriores'
      ]
    },
    {
      version: 'v2.5.0',
      date: '11/11/2026',
      description: 'Atualizações completas de Backend, Segurança, LGPD, Persistência Firestore e Gestão B2B SaaS de Empresas Clientes.',
      highlights: [
        'Proteção de Endpoints REST Server-Side: Middleware verifyAuthToken com verificação de token Firebase Auth, controle RBAC por papel, limite de taxa (30 chamadas/hora por UID) e limite de payload (1MB / 10MB para migração)',
        'Remoção de Dados Fakes e Resposta Graciosa do Gemini AI: Eliminação de relatórios fixos em server.ts e aiDashboardService.ts com resposta 503 quando a cota gratuita do Gemini é excedida',
        'Segurança de Autenticação Firebase: Integração de signInWithEmailAndPassword no LoginPage, eliminação de senhas em texto plano do modelo SystemUser e do código-fonte, suporte a mustChangePassword e script scripts/create-users.ts',
        'Saneamento de Regras Firestore (firestore.rules): Enforcement estrito de controle de acesso por papel (userRole), isolamento de dados de saúde/financeiro, proibição da propriedade password em documentos e validação consentLgpd == true',
        'Persistência em Tempo Real de Empresas Clientes (B2B SaaS): Sincronização direta com a coleção empresas_clientes no Firestore, operações por documento com feedback visual e bloqueio imediato de login/acesso para contratos com status "bloqueado"',
        'Conformidade LGPD & Direitos do Titular: Endpoints GET /api/lgpd/export/:studentId (JSON) e DELETE /api/lgpd/delete/:studentId (Expurgo), salvaguarda de consentLgpdDate/consentLgpdVersion e aviso visual para alunos pendentes',
        'Identificadores de Ambiente e Documentação Completa: Badges "Simulado — ambiente de testes" no WhatsApp e GL Profit Pay, criação do Dockerfile, .env.example, manuais BACKUP.md, LGPD.md, INTEGRACOES.md, DEPLOY.md e testes automatizados com Vitest'
      ]
    },
    {
      version: 'v2.4.37',
      date: '11/11/2026',
      description: 'Otimizações de performance com React.lazy/Suspense, saneamento arquitetural e conformidade LGPD.',
      highlights: [
        'Code-Splitting com React.lazy: Divisão dinâmica de 18 módulos de abas com Suspense fallback, reduzindo o bundle inicial do applet',
        'Exclusão Definitiva de Componentes Legados: Remoção do arquivo Sidebar.tsx e limpeza de estados/props desnecessários no App e Header',
        'Centralização de Tipos: Importação canônica de TabType diretamente de src/types.ts em todo o ecossistema da aplicação',
        'Conformidade LGPD no Cadastro de Alunos: Termo de consentimento explícito e obrigatório para tratamento de dados pessoais e de saúde com bloqueio de matrícula quando desmarcado',
        'Segurança no Login: Desativação do preenchimento automático de senha ao selecionar usuários de teste no LoginPage',
        'Ajuste no Manual do Sistema: Renomeação da coluna "Senha Padrão" para "Senha" com indicação "definida pelo administrador"'
      ]
    },
    {
      version: 'v2.4.36',
      date: '11/11/2026',
      description: 'Criação do Dossiê e Manual Mestre Consolidado do Sistema (DOCUMENTACAO_COMPLETA_SISTEMA_GL_PRO_FIT.md) para transferência íntegra e sem perdas de contexto entre conversas.',
      highlights: [
        'Dossiê Mestre 360°: Compilação de todas as funcionalidades, módulos, sub-abas, arquitetura de software, endpoints de backend e integração com Firestore',
        'Estruturas de Dados e RBAC: Documentação exaustiva de modelos, perfis de acesso, regras de persistência e chaves de configuração',
        'Controle de Continuidade: Especificação exata do estado atual para continuidade imediata em novas sessões sem perda de histórico'
      ]
    },
    {
      version: 'v2.4.35',
      date: '10/11/2026',
      description: 'Remoção total e definitiva do módulo de Catraca de Acesso (física e virtual), eliminando views, botões, simulação, regras de segurança de catraca e logs de passagem, com preservação estrita da biometria de login do usuário (WebAuthn/Touch ID/Face ID).',
      highlights: [
        'Remoção Completa da Catraca: Exclusão dos arquivos CatracaTab.tsx, accessLogService.ts, OperacionalDashboard.tsx, e eliminação de rotas e botões de atalho no TopNav, Header, Sidebar e AlunosTab',
        'Preservação da Biometria de Login: Autenticação biométrica de operadores e administradores (Touch ID, Face ID, Windows Hello / FIDO2) mantida 100% operacional no LoginPage',
        'Ajuste nos Dashboards: Eliminação da sub-aba "Operacional" focada em catraca, mantendo as sub-abas CRM, Gerencial, Clientes, Financeiro, Agenda, Treino e WhatsApp',
        'Ficha do Aluno 360°: Remoção da sub-aba "Presenças & Acessos" e do botão "Testar Catraca", com readequação dos cards do Raio-X Geral',
        'Tolerância Financeira: Campo preservado nas configurações com descrição direcionada exclusivamente a atraso e inadimplência financeira',
        'Saneamento de Segurança e Banco: Remoção da coleção access_logs nas regras de segurança firestore.rules (deploy efetuado com sucesso) e no firebase-blueprint.json'
      ]
    },
    {
      version: 'v2.4.34',
      date: '10/11/2026',
      description: 'Implementação da aba "Empresas Clientes" (B2B SaaS) à esquerda de Configurações, com Dashboard de Operação e gestão granular de Licenças e Módulos.',
      highlights: [
        'Aba Empresas Clientes: Módulo B2B dedicado para gerenciar contratos, faturamento MRR, status de acesso (Ativo/Bloqueado) e licenças das empresas que utilizam o sistema',
        'Sub-aba Dashboard B2B: Métricas executivas de MRR total, licenças ativas, taxa de retenção e visão geral dos contratos',
        'Sub-aba Licenças, Acessos & Módulos: Painel interativo com listagem de empresas, alteração de status em 1 clique, cadastro de novos contratos e seletor granular de módulos (Habilitar/Bloquear funcionalidades por empresa cliente)',
        'Integração Completa TopNav & Router: Posicionamento estratégico no menu superior (TopNav) com persistência local em tempo real'
      ]
    },
    {
      version: 'v2.4.33',
      date: '05/11/2026',
      description: 'Área central e rodapé ajustados para 100% da largura da tela (removido o limite max-w-7xl e mx-auto).',
      highlights: [
        'Layout Full-Width: Conteúdo central e rodapé ocupam 100% da largura útil da tela (w-full min-w-0), proporcionando máximo aproveitamento do espaço em telas grandes',
        'Responsividade e Expansão: Alinhamento de todos os módulos de dashboards, tabelas e cadastros com a barra superior e o rodapé'
      ]
    },
    {
      version: 'v2.4.32',
      date: '05/11/2026',
      description: 'Remoção da barra lateral e introdução do menu horizontal superior TopNav em pílulas com sub-abas retráteis e cabeçalho claro com logomarca oficial.',
      highlights: [
        'Menu Superior TopNav (Opção 3 Clean): Substituição da barra lateral pelo menu superior horizontal com 16 abas em formato pílula, roláveis suavemente',
        'Sub-abas com Chevron Retrátil: Indicador de seta dentro de cada aba para recolher ou expandir a linha de sub-abas dinamicamente',
        'Novo Cabeçalho Claro: Fundo branco com logomarca oficial GL PRO FIT e barra de busca estilizada em pílula',
        'Acesso Rápido à Catraca: Botão "Ao vivo" destacado alinhado à direita no menu superior'
      ]
    },
    {
      version: 'v2.4.31',
      date: '05/11/2026',
      description: 'Implementação da aba "Dados do Cadastro" no perfil do aluno, cards minimizados por padrão com alternância por seta, botão de "Vender" em Financeiro e renomeação de Comandas para Lanchonete da Empresa.',
      highlights: [
        'Aba "Dados do Cadastro": Edição completa de informações do aluno (nome, CPF, nascimento, telefone, email, plano, valor, vencimento, situação e notas médicas)',
        'Foto com Fallback Inteligente de Ícone: Gestão visual de imagem com upload do dispositivo, presets rápidos, URL e substituição por ícone estilizado de avatar caso o aluno não tenha foto',
        'Cards Minimizados por Padrão: Todos os cards das sub-abas do perfil iniciam compactados com indicador de seta (ChevronDown/ChevronUp) e controles rápidos de Expandir/Recolher Todos',
        'Botão de Vender no Financeiro: Modal de PDV direto na ficha do aluno para vender Planos, Produtos da Lanchonete e Serviços Especializados com geração instantânea de faturas e liquidação',
        'Renomeação de Comanda para Lanchonete: Ajuste de nomenclatura em menus, cabeçalhos e configurações para representar o controle da Lanchonete da Empresa',
        'Registro Histórico em Artefatos: Criação do documento registro_alteracoes_v2.4.31_dados_cadastro_cards_minimizados_vender_lanchonete.md'
      ]
    },
    {
      version: 'v2.4.30',
      date: '05/11/2026',
      description: 'Correção de segurança e compatibilidade de tipos no modelo de treinos (splits) da Ficha Completa do Aluno.',
      highlights: [
        'Resolução de Erro de Execução (TypeError slice): Ajustada a propriedade de divisões de treinos em FichaCompletaAlunoView para splits (WorkoutSplit[]) com fallback defensivo seguro',
        'Prevenção de Falhas em Alunos com Treinos Variados: Mapeamento defensivo para campos opcionais de splits, exercícios e objetivos de treino',
        'Registro Histórico em Artefatos: Criação do documento registro_alteracoes_v2.4.30_correcao_splits_ficha_aluno.md'
      ]
    },
    {
      version: 'v2.4.29',
      date: '05/11/2026',
      description: 'Nova tela central imersiva da Ficha do Aluno 360° na aba Clientes (substituição de card sobreposto por tela completa integrada com treinos, avaliações, bem-estar, financeiro, presenças e nutrição).',
      highlights: [
        'Ficha do Aluno em Tela Central: Ao clicar em "Ficha", o sistema abre uma tela central completa dedicada, eliminando o card sobreposto (modal) e permitindo navegação fluida',
        'Hub 360° de Informações do Perfil: Consolidação de Treinos prescritos, Avaliações físicas (Pollock e Bioimpedância), Questionários diários de Bem-Estar/Prontidão, Histórico Financeiro e mensalidades, Registros biométricos de Presenças na catraca e Plano Nutricional com cálculo de TMB/GET e refeições',
        'Navegação Ágil e Ações Imediatas: Botão de retorno à lista de alunos, disparo direto via WhatsApp, simulação de catraca, quitação de mensalidade em 1 clique e alternância rápida de status',
        'Registro Histórico em Artefatos: Criação do documento registro_alteracoes_v2.4.29_ficha_completa_aluno_tela_central.md'
      ]
    },
    {
      version: 'v2.4.28',
      date: '05/11/2026',
      description: 'Posicionamento superior central em todos os cards sobrepostos (modais, popups e dialogs do sistema).',
      highlights: [
        'Posicionamento Superior Central: Cards sobrepostos agora abrem diretamente no topo central da tela visível (items-start justify-center pt-6 sm:pt-10 md:pt-12), sem necessidade de rolar ou buscar no meio da tela',
        'Regras Globais de Overlay em CSS: Aplicação universal em src/index.css para overlays fixos z-50 e z-60 com scroll suave e margens automáticas neutralizadas',
        'Atualização dos Componentes de Modais: Padronização de Novo Aluno, Ficha do Aluno, Escolas Parceiras, Usuários, Biometria, Termos e Alertas Críticos de Sobrecarga',
        'Registro Histórico em Artefatos: Criação do documento registro_alteracoes_v2.4.28_posicionamento_superior_modais.md'
      ]
    },
    {
      version: 'v2.4.27',
      date: '05/11/2026',
      description: 'Implementação da governança de controle histórico com geração de artefatos (.md) a cada ciclo de alteração.',
      highlights: [
        'Registro Histórico Contínuo em Artefatos: Criação automática de documento .md no diretório de artefatos para cada alteração no sistema',
        'Artefato da Versão v2.4.26 Emitido: Documento registro_alteracoes_v2.4.26_redesign_login.md gerado com relatório técnico completo das mudanças visuais, fontes, imagens e componentes',
        'Governança Atualizada em AGENTS.md: Regra obrigatória consolidada para manter a trilha de auditoria e controle total das alterações para o administrador'
      ]
    },
    {
      version: 'v2.4.26',
      date: '05 de Novembro de 2026',
      description: 'Ajustes na tela de login conforme especificações do arquivo zip.',
      highlights: [
        'Card de login totalmente branco e logomarca oficial sem placa de fundo',
        'Destaques laterais esportivos: Escolas de Futebol, Academia, Personal e qualquer segmento esportivo/fitness',
        'Foto de fundo esportiva em alta definição com sobreposição e degradê institucional azul/escuro',
        'Tipografia moderna com fontes Barlow e Barlow Condensed para maior impacto visual'
      ]
    },
    {
      version: 'v2.4.25',
      date: '05/11/2026',
      description: 'Geração do Manual Completo do Sistema (MANUAL_DO_SISTEMA.md) contendo arquitetura, credenciais, governança e guia exaustivo de todos os módulos operacionais.',
      highlights: [
        'Documentação Integral do Ecossistema: Criação do arquivo MANUAL_DO_SISTEMA.md na raiz do projeto com o mapeamento das 20 abas e submódulos do sistema',
        'Detalhamento de Arquitetura e Engenharia: Especificação completa da pilha tecnológica (React 19, TypeScript, Node.js 22, Express, Firebase Firestore e Gemini 3.8 Flash)',
        'Guia de Credenciais e RBAC: Mapeamento de usuários, níveis de permissão, regras de segurança do Firestore e procedimentos de deploy'
      ]
    },
    {
      version: 'v2.4.24',
      date: '05/11/2026',
      description: 'Correção de compatibilidade com Node.js 22 no runtime do Cloud Run: isolamento de tipos Request e Response via type-only import do express no server.ts.',
      highlights: [
        'Resolução de Erro de Deploy no Cloud Run: Ajustada a importação de express no server.ts para "import type { Request, Response }", eliminando o SyntaxError de named export em módulos CommonJS no Node.js v22',
        'Estabilidade de Inicialização do Servidor: Garantida a inicialização perfeita do servidor full-stack tanto em ambiente de desenvolvimento (tsx) quanto em produção (node server.ts)'
      ]
    },
    {
      version: 'v2.4.23',
      date: '22/10/2026',
      description: 'Gestão granular de licenças e vencimento para escolas parceiras terceirizadas, ocultação do aviso de renovação para o administrador master e calibração de KPIs da aba Início com dados 100% reais.',
      highlights: [
        'Ocultação de Contrato para Administrador Master: Remoção definitiva do card "Seu contrato vence em..." e do botão "RENOVAR AGORA" para o perfil do administrador (Gianluca Marinho)',
        'Módulo de Gestão de Escolas Parceiras: Painel exclusivo para o administrador cadastrar escolas parceiras, definir datas de vencimento de plano, alternar aviso de bloqueio/renovação sob demanda e disparar mensagens de cobrança via WhatsApp',
        'Simulação e Preview de Escolas: Possibilidade de alternar e visualizar exatamente a experiência de cada escola parceira com alertas personalizados de contrato',
        'Calibração Real de KPIs na Aba Início: Eliminação do número artificial "202 clientes", sincronizando o card de Clientes Ativos diretamente com os alunos cadastrados no sistema (4 ativos, 1 inadimplente, 1 trancado)',
        'Saneamento das Notificações Iniciais: Substituição de notificações fictícias de bloqueio de conta por alertas reais de operação (inadimplência do aluno Carlos Eduardo Rocha, status de licenças e aniversariantes)'
      ]
    },
    {
      version: 'v2.4.22',
      date: '21/10/2026',
      description: 'Integração do Relatório Executivo da Inteligência Artificial ao final da aba Análise, analisando estritamente os gráficos selecionados pelo profissional (todos ou seleção pontual sob demanda).',
      highlights: [
        'Relatório da IA ao Final da Página: Inserção do card executivo e inteligente após o último gráfico da aba Análise, com parecer fisiológico completo e laudo de sobrecarga',
        'Escopo Dinâmico Focado Estritamente nos Gráficos Selecionados: Se o usuário seleciona todos os gráficos, a IA avalia o ecossistema completo; se seleciona apenas gráficos pontuais (ex: Prontidão, Sono, PSE), o parecer avalia exclusivamente esses dados',
        'Endpoint Dedicado /api/ai/analise-report: Processamento server-side via Gemini 3.8 Flash com prompt técnico de Ciências do Esporte e Fisiologia do Exercício (Foster, Gabbett e Banister)',
        'Diagnóstico Específico por Indicador: Detalhamento por item selecionado com badge de tendência, diagnóstico numérico, interpretação clínica e conduta recomendada',
        'Plano de Ação para o Treinador & Simulação Preditiva: Recomendações práticas de ajuste de carga para a próxima sessão, projeção de cenários e botões de cópia e envio via WhatsApp'
      ]
    },
    {
      version: 'v2.4.21',
      date: '21/10/2026',
      description: 'Otimização e simplificação visual da aba Análise: toolbar restrita a "Todos os Gráficos" e "Filtrar Gráficos", recomendação clínica em balão flutuante de comentário via hover, botão de ampliar minimalista apenas com as duas setas em diagonal e alerta crítico de sobrecarga conciso com acionamento sob demanda.',
      highlights: [
        'Simplificação da Barra de Gráficos: Mantidos exclusivamente os botões "Todos os Gráficos" e "Filtrar Gráficos", retirando todos os outros botões externos e concentrando a seleção 100% no dropdown de checkboxes',
        'Recomendação Clínica em Formato de Balão de Comentário: Botão discreto com ícone de comentário ao lado do título de cada indicador que exibe a recomendação fisiológica ao passar o mouse (hover), eliminando relatórios e instruções textuais fixas',
        'Botão de Ampliação Minimalista (Apenas Duas Setas em Diagonal): O cabeçalho dos cards de gráfico agora exibe apenas o ícone das duas setas diagonais (Maximize2/Minimize2), sem nenhum texto adicional',
        'Cards Mais Limpos e Agradáveis: Remoção de blocos numéricos estáticos e relatórios textuais redundantes, destacando as curvas e barras de acompanhamento temporal',
        'Alerta Crítico de Sobrecarga Otimizado: Card com placa pulando animada, título "Alerta crítico de sobrecarga", contagem exata de alunos acima dos limites e botão "Ver Alunos" que abre modal detalhado sem poluir a visão inicial'
      ]
    },
    {
      version: 'v2.4.20',
      date: '21/10/2026',
      description: 'Filtro em lista suspensa com caixas de seleção para escolha sob demanda de gráficos na aba Análise, layout responsivo dividindo a tela em 2 gráficos por linha, ampliação em alta resolução de gráficos individuais e eliminação de tabelas de respostas.',
      highlights: [
        'Filtro de Caixa de Seleção em Lista Suspensa: Substituição de botões estáticos por dropdown inteligente com checkboxes para selecionar livremente quais gráficos visualizar, além de busca interna por métrica e ações rápidas (Marcar Todos / Apenas 1)',
        'Barra de Controle de Gráficos Otimizada: Primeiro botão dedicado a "Todos os Gráficos" para reset rápido, botão de filtro com contador dinâmico e botões diretos para os gráficos selecionados pelo profissional',
        'Divisão da Tela Principal em Pares (2 por linha): Ao selecionar mais de um gráfico para visualização, o sistema reduz proporcionalmente suas dimensões e os acomoda em grade de dois por linha (md:grid-cols-2), mantendo tamanhos equilibrados e excelente aproveitamento de tela',
        'Ampliação Dinâmica de Tamanho (Modo Individual): Ao selecionar ou clicar em um gráfico específico, ele amplia imediatamente ocupando 100% da largura com altura estendida, diagnósticos de evolução (Δ%), régua de valores e controles de navegação',
        'Eliminação de Tabelas de Respostas: Remoção completa das tabelas estáticas de respostas dos alunos na aba Análise, mantendo o foco analítico 100% puro nos gráficos, indicadores fisiológicos e curvas de evolução'
      ]
    },
    {
      version: 'v2.4.19',
      date: '20/10/2026',
      description: 'Evolução da aba Análise com gráficos individuais para todos os itens do questionário de bem-estar e controle de carga, visualização em linhas ou barras de todo o período com indicadores de evolução, e ampliação dinâmica de tamanho ao selecionar qualquer gráfico.',
      highlights: [
        'Gráficos Individuais Completos de Todo o Questionário: Exibição temporal detalhada de Prontidão Diária (%), Qualidade do Sono, Horas Dormidas, Despertares Noturnos, PSE (Fadiga), EVA (Dor Muscular), Estresse Mental, Humor & Disposição, PSR (Recuperação), Carga Foster (UA), Duração do Treino, Índice Hooper, Salto CMJ, Balanço Hídrico/Peso, Hidratação (L), Pontos de Dor no Boneco, ACWR, Strain e Monotonia',
        'Alternador de Visualização Linhas 📈 ou Barras 📊: Possibilidade de alternar globalmente e individualmente por gráfico para analisar a evolução ou não daquele dado em todas as datas selecionadas',
        'Cálculo e Indicador Visual de Evolução: Diagnóstico automático de evolução positiva, estabilidade ou alerta com variação percentual (Δ%) e comparação do primeiro ao último registro do período, respeitando métricas diretas e inversas',
        'Ampliação Dinâmica de Tamanho (Modo Expandido Individual): Ao clicar ou selecionar qualquer gráfico na grade, ele não permanece no mesmo tamanho, mas expande-se imediatamente ocupando a largura total (col-span-full), com altura ampliada para alta resolução, eixos detalhados, régua de valores e tabela longitudinal dia a dia com interpretação clínica',
        'Navegação Sequencial e Filtro Rápido: Controles de navegação anterior/próximo para transitar entre os gráficos ampliados sem precisar fechar, botão de redução instantânea para voltar à grade, e abas de categoria para foco imediato'
      ]
    },
    {
      version: 'v2.4.18',
      date: '20/10/2026',
      description: 'Integração do card executivo de "Relatório & Sugestões" com Inteligência Artificial ao vivo ao final de cada sub-aba do módulo Dashboards, com análise de dados em tempo real e confronto com metas e preferências pré-configuradas.',
      highlights: [
        'Card de Relatório e Sugestões com IA ao Final de Cada Sub-aba: Análise automática dos dados da sub-aba ativa (CRM, Gerencial, Operacional, Clientes, Financeiro, Agenda, Treino e WhatsApp) com diagnóstico de saúde operacional (score 0-100)',
        'Análise ao Vivo via Gemini 3.8 Flash: Endpoint /api/ai/dashboard-report com prompt especializado em gestão esportiva e motor analítico determinístico avançado para garantia de disponibilidade ininterrupta',
        'Metas e Preferências Pré-configuradas e Editáveis: Painel de ajuste de metas operacionais e seleção de modo de foco estratégico (Equilibrado, Crescimento Agressivo ou Eficiência de Custos) com persistência local',
        'Plano de Ação para Tomada de Decisão: Sugestões prioritárias com impacto financeiro/operacional estimado, prazos sugeridos e botões de atalho direto para as abas de execução do sistema',
        'Simulação Preditiva e Compartilhamento: Projeção de cenários ("Se aplicar a decisão" vs "Se inerte") e botões de cópia e envio direto do briefing executivo para WhatsApp da diretoria'
      ]
    },
    {
      version: 'v2.4.17',
      date: '19/10/2026',
      description: 'Auditoria abrangente de funcionalidades, integridade de dados e segurança (LGPD, RBAC, Firebase Cloud Firestore e proteção de endpoints).',
      highlights: [
        'Deploy e Atualização das Regras do Firestore: Adição e publicação das regras de segurança para a coleção lesson_plans com validação de tipagem, controle de acesso por autenticação e limites de caracteres',
        'Sincronização em Nuvem de Planos de Aula: Integração da persistência em nuvem bidirecional da coleção lesson_plans via Firestore, garantindo backup contínuo além do armazenamento local',
        'Validação Completa de Tipos e Build: Compilação TypeScript e Vite aprovada com 100% de conformidade, sem erros ou warnings bloqueantes',
        'Auditoria de Segurança e Invariantes: Verificação da proteção contra ataques de força bruta, trilha de auditoria LGPD, imutabilidade financeira e controle de permissões por perfil (RBAC)'
      ]
    },
    {
      version: 'v2.4.16',
      date: '19/10/2026',
      description: 'Otimização visual da sub-aba Plano de Treino com botão "Ver Treino" nos cards dos últimos treinos criados, ocultação padrão da ficha preenchida e limpeza de texto no cabeçalho.',
      highlights: [
        'Botão "Ver Treino" nos Cards: Cada card de treino agora possui um botão dedicado "Ver Treino" para abrir a ficha completa sob demanda, alternando para "Ocultar Treino" quando selecionado',
        'Página Central Limpa e Focada: A ficha preenchida não fica mais exibida por padrão na parte inferior da tela inicial, mantendo a visualização limpa e focada na listagem e busca',
        'Controle de Visualização e Fechamento: Botões "Fechar Ficha" no topo e no rodapé da ficha detalhada para retorno instantâneo à lista de treinos',
        'Limpeza do Cabeçalho: Remoção da etiqueta com menção a planilha oficial no cabeçalho superior do módulo'
      ]
    },
    {
      version: 'v2.4.15',
      date: '19/10/2026',
      description: 'Atualização da navegação da Central de Configurações para carregar o módulo diretamente na tela principal (sem cards sobrepostos/modais), com botões de voltar dedicados no topo e no rodapé.',
      highlights: [
        'Transição Direta na Tela Principal: Ao clicar em qualquer bloco quadrado, toda a tela principal é atualizada para a visualização das configurações do módulo selecionado, eliminando caixas de diálogo ou cards sobrepostos',
        'Botões de Voltar Estratégicos: Inclusão de botões "Voltar aos Módulos" destacados tanto no cabeçalho quanto no rodapé da página, além de atalho pela tecla ESC, permitindo retornar à grade de módulos a qualquer momento',
        'Preservação Integral de Parâmetros: Todas as configurações de dados da academia, usuários, catraca, migrações com IA Gemini 3.5 Flash, notificações, backup e módulos dinâmicos operam em tela cheia com sincronização em tempo real'
      ]
    },
    {
      version: 'v2.4.14',
      date: '19/10/2026',
      description: 'Remoção do cabeçalho de abas superiores na Central de Configurações, garantindo seleção de módulos exclusivamente através dos blocos quadrados.',
      highlights: [
        'Seleção Exclusiva por Blocos Quadrados: Remoção das abas/chips superiores de categoria e seletores secundários, centralizando a navegação nos blocos quadrados',
        'Experiência Focada e Direta: Cada módulo é acessado diretamente clicando em seu quadrado na grade principal, que abre a tela central com seus parâmetros configuráveis',
        'Retorno Simplificado: O retorno à grade de módulos é feito diretamente pelo botão "Voltar aos Módulos" ou tecla ESC, sem interferência de abas superiores'
      ]
    },
    {
      version: 'v2.4.13',
      date: '16/10/2026',
      description: 'Transformação do cabeçalho de escolha da aba de Configurações em blocos quadrados elegantes com abertura de nova tela central dedicada com todas as informações configuráveis do módulo selecionado.',
      highlights: [
        'Navegação em Blocos Quadrados: Grade visual de blocos quadrados para todos os 20 módulos com ícones vibrantes, badges temáticos, categorias e busca instantânea',
        'Tela Central de Configuração: Ao clicar em qualquer bloco quadrado (ex: Notificações, Migrações, Catraca, Agenda, Usuários), abre uma tela central focada com cabeçalho sticky, sub-divisões e botão de retorno aos módulos',
        'Seletor Rápido e Atalhos: Troca de módulo direta no cabeçalho da tela central, fechamento por tecla ESC ou botão de conclusão e sincronização em tempo real',
        'Integração com Gemini 3.5 Flash: Priorização do modelo Gemini 3.5 Flash no backend e frontend para migrações inteligentes de planilhas, PDFs e fotos com vínculo automático aos clientes'
      ]
    },
    {
      version: 'v2.4.12',
      date: '16/10/2026',
      description: 'Implementação da sub-aba "Migrações" na aba de Configurações, equipada com IA Gemini 3.5 Flash para reconhecimento inteligente de arquivos (planilhas, PDFs, fotos) nas 5 modalidades e vínculo automático aos clientes cadastrados.',
      highlights: [
        'Sub-Aba Migrações: Nova área dedicada com as 5 opções de importação (Cadastro de clientes, Avaliação física, Plano alimentar, Treinos e Financeiro)',
        'Reconhecimento Multimodal com Gemini 3.5 Flash: Processamento e leitura de planilhas (.xlsx, .csv), documentos (.pdf) e fotos de fichas físicas (.jpg, .png) com extração de entidades estruturadas',
        'Vínculo Inteligente a Clientes: Identificação e associação automática com alunos pré-existentes via CPF, Nome ou E-mail com opções de ajuste e confirmação prévia',
        'Conexão Multi-Módulos: Dados migrados são imediatamente sincronizados com os módulos de Alunos, Avaliações Físicas, Nutrição, Treinos e Financeiro com trilha de auditoria'
      ]
    },
    {
      version: 'v2.4.11',
      date: '15/10/2026',
      description: 'Configuração de chamada de turmas com sinal de dedão (👍 Presença / 👎 Falta) e integração automática de presença via catraca com parametrização completa na aba Configurações.',
      highlights: [
        'Chamada com Sinal de Dedão: Interface na Agenda com dedão para cima (👍 presença) e dedão para baixo (👎 falta) para o professor avaliar a turma com um clique, além de ações em lote e feedback sonoro',
        'Presença Automática via Catraca: Sincronização direta entre liberação na catraca e presença automática na turma da Agenda com carimbo em tempo real e aviso na recepção',
        'Configurabilidade Completa: O gestor pode alternar entre sinal de dedão e botão tradicional e habilitar/desabilitar a presença da catraca tanto pela Agenda quanto na aba Configurações'
      ]
    },
    {
      version: 'v2.4.10',
      date: '15/10/2026',
      description: 'Otimização de responsividade da tela/modal de autenticação Google com layout flexível, suporte a rolagem interna em telas pequenas e compactação de botões e cartões de confirmação para dispositivos móveis.',
      highlights: [
        'Responsividade Total no Modal Google: inclusão de container scrollável (max-h de 92vh), overflow inteligente e padding adaptativo para smartphones e tablets',
        'Ajuste de Ações em Telas Estreitas: botões de ação e campos com quebra inteligente e área de toque otimizada para toque nos dispositivos móveis',
        'Controle de Credenciais: verificação e reforço das credenciais de acesso seguro da conta administrativa'
      ]
    },
    {
      version: 'v2.4.9',
      date: '15/10/2026',
      description: 'Configuração do botão "Acessar com Google" e implementação do fluxo com etapas de confirmação para login seguro com Conta Google (Identificação da Conta, Revisão de Permissões/Consentimento e Acesso Concluído com Redirecionamento).',
      highlights: [
        'Botão Acessar com Google: atualização visual e semântica do botão na tela de login para "Acessar com Google", integrado ao fluxo assistido de confirmação',
        'Etapa 1 - Identificação e Seleção da Conta: suporte à autenticação oficial via Popup Google OAuth (Firebase Auth), seleção de contas vinculadas ao sistema e opção de e-mail Google alternativo',
        'Etapa 2 - Confirmação e Permissões: visualização detalhada do perfil autenticado, validação de permissões/cargo, checklist de segurança e aceite explícito dos termos LGPD',
        'Etapa 3 - Autenticação Concluída: animação de confirmação, registro no log de auditoria de segurança e redirecionamento instantâneo ao painel'
      ]
    },
    {
      version: 'v2.4.8',
      date: '14/10/2026',
      description: 'Remoção do componente de badge de inadimplência/notificação selecionado na navegação lateral do módulo Financeiro, mantendo o menu limpo e simplificado.',
      highlights: [
        'Remoção do Badge Selecionado: retirada do indicador numérico de pendências no botão do menu Financeiro da barra lateral',
        'Interface Otimizada: navegação limpa e livre de alertas visuais intrusivos no menu lateral'
      ]
    },
    {
      version: 'v2.4.7',
      date: '14/10/2026',
      description: 'Restauração da aba de Configurações no menu lateral e de usuário; remoção do card e botões manuais de armazenamento em nuvem no cabeçalho; e consolidação da sincronização 100% automática, contínua e em tempo real no Firebase Firestore para todas as ações de clientes, alunos e equipe.',
      highlights: [
        'Aba de Configurações Restaurada e Fixada: inclusão definitiva de Configurações na lista principal do menu lateral (Sidebar) e acesso rápido no menu de perfil do usuário (Header), garantindo disponibilidade imediata para toda a equipe administrativa e operacional',
        'Remoção de Cards e Botões Manuais de Sincronização: retirado o card de armazenamento em nuvem (DatabaseStatusBadge) do cabeçalho superior na tela inicial e botões manuais, tornando o processo de salvamento totalmente transparente e sem atritos',
        'Sincronização 100% Automática em Segundo Plano: qualquer ação de clientes, alunos, instrutores ou gestores (matrículas, treinos, pagamentos, comandas, alterações de regras e agendamentos) é sincronizada instantaneamente na nuvem via Firestore em tempo real',
        'Controle de Acesso Consistente (RBAC): permissão da aba de configurações configurada para que nenhum operador da academia fique com a aba ocultada indevidamente'
      ]
    },
    {
      version: 'v2.4.6',
      date: '14/10/2026',
      description: 'Integração completa e persistência integral de todas as configurações e entidades do sistema no banco de dados em nuvem (Firebase Firestore). Mapeamento de coleções pendentes (Planos, Fornecedores, Leads, Automações de CRM, Pesquisas NPS, Configurações de Abas, Folha de Ponto, WhatsApp, Catálogo de Treinos e Logs de Auditoria) com sincronização em tempo real e botão de sincronização mestre.',
      highlights: [
        'Persistência Total no Firebase Firestore: ativação permanente do banco de dados em nuvem com sincronização bidirecional em tempo real de todas as coleções do sistema',
        'Mapeamento de Configurações Institucionais e Abas: parâmetros de cada módulo (tab_settings) e configurações da academia (system_settings) agora são salvos e reidratados diretamente do banco de dados',
        'Sincronização de Planos, Fornecedores e CRM: planos de mensalidades, fornecedores cadastrados, leads do funil de vendas, réguas de automação e pesquisas de satisfação NPS agora vinculados ao Firestore',
        'Folha de Ponto e Professores Conectados: turmas, perfis de instrutores e registros diários de aulas com persistência em nuvem',
        'WhatsApp e Treinos Integrados: histórico de conversas, mensagens do multi-atendimento, catálogo de exercícios e histórico de progressão de carga vinculados ao banco de dados',
        'Painel de Controle e Botão de Sincronização Mestre: novo indicador em tempo real da saúde da nuvem em Configurações > Backup com botão para sincronizar instantaneamente todas as entidades do sistema com 1 clique'
      ]
    },
    {
      version: 'v2.4.5',
      date: '14/10/2026',
      description: 'Correção crítica de segurança na autenticação: bloqueio rigoroso de acessos não autorizados. O sistema agora exige validação estrita de cadastro prévio e verificação de senha; e-mails e senhas arbitrários têm o acesso sumariamente negado com auditoria de segurança.',
      highlights: [
        'Eliminação de Acesso por Credenciais Arbitrárias: removido o comportamento que gerava contas provisórias na tela de login; e-mails não cadastrados são terminantemente rejeitados',
        'Validação Estrita de Senha: cada conta agora exige correspondência exata com a senha registrada do usuário ou aluno, eliminando senhas universais',
        'Autenticação de Alunos Matriculados: validação por senha cadastrada ou credenciais de matrícula e CPF cadastrado',
        'Proteção Estendida no Login Google: verificação prévia de que a conta Google já pertence a um usuário ou aluno matriculado antes de autorizar o acesso',
        'Segurança na Recuperação de Senhas: o fluxo de redefinição de senha agora exige confirmação de cadastro prévio do e-mail informado',
        'Registro de Tentativas e Bloqueio: integração com o limitador de tentativas (brute-force rate limiting) e trilha de auditoria para tentativas de login inválidas'
      ]
    },
    {
      version: 'v2.4.4',
      date: '13/10/2026',
      description: 'Refatoração da tela de login: remoção das listas públicas de usuários autorizados e atalhos de bypass para reforço de segurança; reposicionamento do botão "Realizar Cadastro" diretamente abaixo de "Entrar com E-mail e Senha" com abertura em nova guia; e implementação da nova Tela de Cadastro com opções "Sou Aluno" e "Sou o Responsável do Aluno" (fluxo em duas etapas com cadastro prévio do responsável e posterior do dependente).',
      highlights: [
        'Remoção de Elementos Públicos de Demonstração: retirados "Usuários Autorizados no Sistema" e "Acessar painel completo (Acesso Rápido)" da tela de login para privacidade e proteção de credenciais',
        'Botão "Realizar Cadastro" reposicionado: colocado em destaque imediatamente abaixo do botão "Entrar com E-mail e Senha", com abertura em nova guia e detecção de rotas (?view=cadastro)',
        'Nova Tela Completa de Cadastro (CadastroPage): interface dedicada e elegante com seleção entre "Sou Aluno" e "Sou o Responsável do Aluno"',
        'Fluxo de Responsável Legal em 2 Etapas: criação orientada primeiro do perfil do responsável legal/financeiro (nome, parentesco, CPF, WhatsApp, e-mail de acesso e senha) e, na sequência, do perfil do aluno dependente (nascimento, restrições médicas/saúde, autorização de menor e LGPD)',
        'Cadastro Direto de Alunos Maiores: preenchimento de dados pessoais, modalidade principal de treino, contato de emergência e credenciais com medidor dinâmico de força de senha',
        'Geração Automática de Matrícula e Usuário: persistência unificada em vbsport_system_users e vbsport_students com auditoria criptográfica de segurança'
      ]
    },
    {
      version: 'v2.4.3',
      date: '13/10/2026',
      description: 'Implementação da integração completa com a API nativa de Web Authentication (WebAuthn / FIDO2) na tela de login: autenticação biométrica via hardware do dispositivo (Touch ID, Face ID, Windows Hello e Android Biometric Prompt), gerenciamento e vinculação de Passkeys criptografadas e fallback resiliente.',
      highlights: [
        'Integração Completa com a API WebAuthn: implementação dos fluxos padrão W3C navigator.credentials.create e navigator.credentials.get com desafios criptográficos de 32 bytes (challenges)',
        'Detecção Ativa de Hardware Biométrico: verificação em tempo real via PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable para identificar Touch ID, Face ID, Windows Hello e autenticadores FIDO2',
        'Vinculação e Cadastro de Passkeys: suporte para cadastrar e vincular chaves de segurança biométricas diretamente ao perfil de cada usuário no dispositivo com armazenamento isolado e seguro',
        'Acesso Rápido com Biometria nos Cards de Usuários: novo botão de leitor biométrico direto na listagem de contas rápidas e botão destacado "Biometria WebAuthn" no formulário de login',
        'Feedback Visual do Sensor com Estados de Leitura: indicador interativo de pulso do sensor biométrico com mensagens em tempo real da validação de chaves FIDO2 e fallback suave para múltiplos ambientes',
        'Registro na Trilha de Auditoria: eventos de criação de credencial e validação biométrica registrados em securityService e persistidos no Firebase Firestore'
      ]
    },
    {
      version: 'v2.4.2',
      date: '13/10/2026',
      description: 'Implementação da nova Tela de Login com múltiplos métodos de autenticação (E-mail/Senha, Google e Biometria), fluxo de recuperação de senha ("Esqueci minha senha"), botão de novo cadastro ("Realizar cadastro") e suíte avançada de segurança e proteção de dados (LGPD, prevenção de força bruta e trilha de auditoria).',
      highlights: [
        'Múltiplas Opções de Autenticação: login seguro via E-mail e Senha criptografada, autenticação com conta Google OAuth/Workspace e login por Biometria (Touch ID / Face ID / WebAuthn FIDO2)',
        'Fluxo "Esqueci minha Senha": modal interativo em 4 etapas para recuperação e redefinição segura de senha com código de verificação de 6 dígitos, medidor dinâmico de força e sincronização automática com o Firebase',
        'Novo Cadastro ("Realizar cadastro"): formulário completo de registro de novos membros da equipe e alunos com confirmação de senha, validação de termos LGPD e seleção de perfil',
        'Prevenção contra Ataques de Força Bruta (Rate Limiting): bloqueio temporário inteligente após 5 tentativas consecutivas incorretas com temporizador regressivo no formulário',
        'Trilha de Auditoria & Segurança (Security Audit Trail): registro detalhado de eventos críticos de autenticação sincronizados no Firebase Firestore (security_audit_logs)',
        'Central de Segurança & Proteção de Dados (LGPD): modal informativo com diretrizes da Lei 13.709/2018, criptografia em trânsito (TLS 1.3) e em repouso (AES-256 no Firestore), e visualizador de logs de acesso'
      ]
    },
    {
      version: 'v2.4.1',
      date: '13/10/2026',
      description: 'Implementação da funcionalidade de Backup Manual e Exportação JSON na aba Configurações: permite aos administradores gerar e baixar cópia de segurança completa de todos os dados do aplicativo (alunos, transações financeiras, treinos, planos, produtos, comandas e configurações).',
      highlights: [
        'Central de Backup & Dados na Aba Configurações: nova sub-aba dedicada e card de acesso rápido no painel Geral para geração de cópias de segurança sob demanda',
        'Exportação Integral em Formato JSON: arquivo estruturado com metadados (versão do sistema, data/hora da exportação, autor do backup e sumário) englobando 100% dos dados cadastrais e operacionais',
        'Controle de Acesso Exclusivo para Administradores: validação de perfil com bloqueio de acesso para operadores e aviso em conformidade com as diretrizes de governança e LGPD',
        'Painel com Estatísticas em Tempo Real: contagem de alunos cadastrados, transações financeiras, fichas de treino, turmas, produtos e registros prontos para backup',
        'Pré-visualização e Cópia Rápida de JSON: modal interativo para inspeção do código JSON gerado e botão para copiar conteúdo para a área de transferência',
        'Auditoria da Sessão: registro dinâmico do horário do último backup efetuado'
      ]
    },
    {
      version: 'v2.4.0',
      date: '13/10/2026',
      description: 'Implementação e integração completa do banco de dados na nuvem (Firebase Firestore Enterprise): persistência em tempo real de todas as funções do sistema, compartilhamento de dados e tarefas entre membros da equipe, armazenamento seguro de logins, senhas e permissões, e monitoramento de sincronização ao vivo no cabeçalho.',
      highlights: [
        'Banco de Dados Firebase Firestore Provisionado: infraestrutura em nuvem integrada com regras de segurança ativas e schema validado (firebase-blueprint.json e firestore.rules)',
        'Persistência Integral de Dados: sincronização bidirecional em tempo real de alunos, mensalidades, transações financeiras, turmas, fichas de treino, controle de estoque, comandas, cobranças recorrentes e logs de catraca',
        'Controle de Acesso, Logins e Senhas: autenticação da equipe com armazenamento e validação de senhas para todos os usuários cadastrados, preservando cargos e permissões administrativas',
        'Colaboração da Equipe em Tempo Real: tarefas compartilhadas (team_tasks) e folha de ponto sincronizadas instantaneamente entre todos os membros e dispositivos',
        'Badge de Monitoramento do Banco de Dados: indicador visual dinâmico no cabeçalho com status ao vivo, total de documentos sincronizados e botão para forçar sincronização imediata'
      ]
    },
    {
      version: 'v2.3.0',
      date: '13/10/2026',
      description: 'Reestruturação arquitetural de navegação e pagamentos: módulo WhatsApp configurado como Em Breve (Fase 2) com sub-abas preservadas, integração do GL Profit Pay como sub-aba nativa do Financeiro, e reposicionamento hierárquico das abas Treino, Bem-Estar e Avaliações Físicas diretamente abaixo do Financeiro.',
      highlights: [
        'Módulo WhatsApp em Breve (Fase 2): sub-abas (Atendimento, Kanban, Disparos, Chatbot, Contatos, Respostas Rápidas, Etiquetas e Conexão) e parâmetros preservados, com indicação de pré-configuração para a segunda fase do projeto',
        'Rebranding GL Profit Pay: substituição integral da nomenclatura VB Sport Pay para GL Profit Pay em toda a suíte (links de pagamento, cartões recorrentes, simulações de POS e PIX)',
        'GL Profit Pay como Sub-aba do Financeiro: unificação dentro da aba Financeiro com seletor superior de sub-abas (Contas a Receber, Contas a Pagar, DRE Gerencial, Extrato Completo e GL Profit Pay), além de integração de métricas recorrentes, criação de links de pagamento e retentativas',
        'Reorganização Hierárquica da Navegação: abas Treino, Bem-Estar e Avaliações Físicas posicionadas estrategicamente diretamente abaixo da aba Financeiro na barra lateral e nas configurações'
      ]
    },
    {
      version: 'v2.2.9',
      date: '12/10/2026',
      description: 'Otimização dos módulos de Bem-Estar e Análise Científica: card sobreposto para mapa de dor, filtro dinâmico de grupos e categorias na Matriz do Elenco, e listas suspensas com caixas de seleção e calendário na Análise.',
      highlights: [
        'Aba Bem-Estar • Mapa Anatômico de Dor Sobreposto: remoção da sub-aba independente do mapa de dor; agora acessível exclusivamente via card sobreposto modal através do botão "Editar no mapa" durante o preenchimento do check-in',
        'Aba Bem-Estar • Matriz do Elenco com Filtro de Grupos e Categorias: inclusão de botão de filtro avançado para seleção de elencos de competição, categorias de base (Sub-20, Sub-17), alto rendimento e personal',
        'Gerenciador de Grupos & Elencos Pré-configurados: modal integrado para criar e gerenciar grupos com atribuição de atletas e persistência em localStorage',
        'Aba Bem-Estar • Remoção da sub-aba Histórico & Alertas: unificação completa das análises longitudinais e alertas críticos no painel central de Análise',
        'Aba Análise • Filtro de Alunos em Lista Suspensa: substituição do card aberto por dropdown compacto com caixas de seleção, campo de busca em tempo real, atalhos rápidos e destaque visual de alerta crítico',
        'Aba Análise • Filtro de Período em Lista Suspensa: dropdown com caixas de seleção para Manhã, Tarde e Noite',
        'Aba Análise • Seletor de Intervalo com Calendário: novo botão e modal de calendário para definição de dia de início e dia de término com inputs de data nativos'
      ]
    },
    {
      version: 'v2.2.8',
      date: '08/10/2026',
      description: 'Padronização de Nova Avaliação: Card inicial obrigatório de Peso e Altura antes do acesso aos cards superiores, com propagação automática de dados para todos os módulos selecionados.',
      highlights: [
        'Fluxo de Nova Avaliação: introdução do Card à Frente prévio de Peso e Altura logo após a seleção de aluno e módulos, antes do direcionamento aos cards quadrados superiores',
        'Propagação Automática: o peso corporal e a estatura definidos no card inicial são automaticamente injetados em todas as avaliações selecionadas (Dobras Cutâneas, Bioimpedância, Perimetria, Testes de Campo, Testes de Força e Saltos), eliminando a digitação repetida',
        'Cálculo e Feedback em Tempo Real: exibição instantânea do IMC calculado com classificação técnica (Eutrófico, Sobrepeso, etc.) e conversão métrica de estatura',
        'Widget de Biometria na Sessão: inclusão de chip informativo no cabeçalho da sessão ativa com botão rápido de alteração que reabre o card para ajustes a qualquer momento',
        'Persistência em Rascunhos e Prontuários: garantia de que peso e altura informados permaneçam salvos nos rascunhos da sessão e na finalização oficial'
      ]
    },
    {
      version: 'v2.2.7',
      date: '08/10/2026',
      description: 'Otimização operacional dos Testes de Campo para novas avaliações e remoção definitiva de históricos comparativos de retestes.',
      highlights: [
        'Aba Testes de Campo: remoção da aba "Dashboard Consolidado" para acesso e aplicação direta e focada dos testes no momento da avaliação',
        'Teste Yo-Yo (Ioiô): remoção do card de histórico de retestes; integração em um card único e sincronizado para preenchimento de voltas realizadas e metros percorridos, com mensagem de classificação técnica e espaço para observações clínicas e biomecânicas',
        'Teste RAST: remoção do histórico de retestes; preservação dos espaços de preenchimento dos 6 sprints com os 4 cards analíticos (tempo médio, potência máxima, potência média e índice de fadiga), classificação técnica e observações técnicas',
        'Teste T de Agilidade: remoção do histórico comparativo de agilidade; manutenção exclusiva dos campos de preenchimento de voltas e observações técnicas',
        'Remoção de variáveis de comparativo longitudinal multiavaliação em todos os setores de análise da avaliação física'
      ]
    },
    {
      version: 'v2.2.6',
      date: '08/10/2026',
      description: 'Remoção completa das variáveis de comparativo longitudinal multiavaliação de todos os setores de análise da avaliação física.',
      highlights: [
        'Remoção da seção "Comparativo Longitudinal Multi-avaliação" e seus cards e tabelas comparativas delta de todos os setores de análise',
        'Foco exclusivo na avaliação física especializada de cada setor: análise limpa, objetiva e orientada aos parâmetros clínicos e motores específicos',
        'Ajuste das rotinas de exportação e compartilhamento de relatórios: remoção de referências longitudinais residuais',
        'Sincronização contínua de versão com padronização da suíte GL PRO FIT'
      ]
    },
    {
      version: 'v2.2.5',
      date: '08/10/2026',
      description: 'Remoção de gráficos consolidados e do prontuário oficial geral com distribuição especializada dos gráficos em seus respectivos setores de análise.',
      highlights: [
        'Retirada de todos os gráficos comparativos consolidados: remoção do gráfico consolidado multi-séries geral, mantendo foco direto nas análises especializadas',
        'Retirada do prontuário cineantropométrico oficial estático: eliminação do bloco redundante ao final das análises',
        'Distribuição dos gráficos nos 7 setores de análise: cada setor conta com seus próprios painéis e visualizações especializadas diretamente na aba ativa',
        'Setor Composição Corporal: 6 grandes KPIs, bioimpedância tetrapolar com hidratação, adipometria clínica com 9 dobras e perimetria com simetria bilateral e RCQ',
        'Setor Fotos: visualizador comparativo fotográfico com grade de simetria e fio de prumo, além de laudo postural anterior, posterior e lateral',
        'Setor Anamnese: triagem cardiovascular PAR-Q+ e painel de hábitos de vida, sono, hidratação, estresse e dor EVA',
        'Setor Testes Funcionais: pontuação FMS /21, classificação de risco Gray Cook, flexibilidade no Banco de Wells e os 7 padrões motores funcionais',
        'Setor Testes de Força e Salto: força máxima 1RM Brzycki, zonas de prescrição, dinamometria Jamar e pliometria Bosco (CMJ, SJ, IE%, Sayers Watts, RSI)',
        'Setor Testes de Campo: teste Yo-Yo IR1, RAST 6 sprints anaeróbios, teste T de agilidade, Cooper 12min e 1 Milha Rockport',
        'Setor Testes Personalizados: protocolos específicos da academia integrados diretamente na análise setorial'
      ]
    },
    {
      version: 'v2.2.4',
      date: '07/10/2026',
      description: 'Evolução da Central de Análise: separação rigorosa em 7 setores especializados, gráficos interativos multi-séries com cliques de filtragem, tooltips dinâmicos e comparativo fotográfico com grade biomecânica.',
      highlights: [
        'Organização por 7 Setores Específicos: Composição corporal, fotos, Anamnese, testes funcionais, testes de força e salto, testes de campo e testes personalizados, com filtros interativos em abas e contadores em tempo real',
        'Gráficos Interativos Consolidados por Setor: componente multi-curvas com legendas clicáveis para ativar/desativar métricas individualmente (cliques de filtragem), linha guia vertical e tooltip flutuante ao passar o cursor com valores, datas e metas',
        'Cores Variadas para Identificação: paleta vibrante e consistente por métrica e setor para diferenciação visual imediata das curvas e nós',
        'Gráficos de Linha por Métrica com Linha Base do Objetivo: cada card com linha contínua de evolução, linha base âmbar tracejada com badge de meta cadastrada, e legendas flutuantes interativas em hover',
        'Setor Especializado de Fotos: visualizador comparativo de fotos (Frontal, Costas, Perfil D, Perfil E) com alternância Lado a Lado / Antes & Depois e Grade de Simetria / Fio de Prumo anatômico',
        'Tela Pré-Análise Limpa: exibição restrita aos cards essenciais (Card 1: Aluno com total e data da última avaliação; Card 2: Seleção de avaliações sem botões redundantes; Card 3: Ações Analisar, Gerar PDF e Enviar WhatsApp)'
      ]
    },
    {
      version: 'v2.2.3',
      date: '07/10/2026',
      description: 'Refatoração da Central de Analisar Avaliações: tela de seleção com cards essenciais (aluno, avaliações e ações) e nova tela central com gráficos de linha evolutivos por métrica e linha base de meta.',
      highlights: [
        'Cards de Seleção Pré-Análise: exibição limpa contendo apenas o Card 1 (selecionar aluno, total de avaliações no prontuário e data da última avaliação), Card 2 (seleção das avaliações para análise com caixas de seleção, removendo botões redundantes de individual/comparar) e Card 3 (ações: Gerar PDF, Enviar WhatsApp e botão principal Analisar)',
        'Nova Tela Central de Análise: acionada ao clicar em "Analisar", abrindo a visualização central completa com botão de retorno, identificação do período analisado e botões rápidos de exportação',
        'Gráficos de Linha por Métrica com Linha Base: construção de gráficos de linha de alta precisão conectando cada avaliação realizada e plotando a linha base (tracejada amarela/âmbar com badge de meta) para todas as 32+ métricas (Composição, Dobras, Circunferências, Força, Campo, Saltos e Funcional)',
        'Módulos Completos & Comparativo Longitudinal: preservação de todos os 10 módulos detalhados preenchidos e tabela comparativa lado a lado com deltas absolutos e percentuais'
      ]
    },
    {
      version: 'v2.2.2',
      date: '07/10/2026',
      description: 'Correção crítica no ecossistema de dependências e sincronização do instalador Bun/NPM.',
      highlights: [
        'Deduplicação de Dependências: remoção de declaração duplicada do Vite entre dependencies e devDependencies que causava conflitos no instalador de pacotes',
        'Sincronização de Lockfiles: regeneração consistente do bun.lock e package-lock.json garantindo instalação determinística sem falhas em ambientes de CI/CD e containers'
      ]
    },
    {
      version: 'v2.2.1',
      date: '06/10/2026',
      description: 'Central de Analisar Avaliações com cards superiores de seleção de aluno e avaliações e dashboard integral preenchido com todos os módulos e métricas clínicas, funcionais e motoras.',
      highlights: [
        'Cards Superiores de Seleção: Card 1 dedicado à seleção e perfil do aluno (com fotos, matrícula, status PAR-Q+ e resumo do prontuário) e Card 2 para seleção de avaliações (com cards clicáveis, badges de data, protocolo, peso e % gordura, com alternância entre consulta individual e comparativo multi-avaliação)',
        'Dashboard Integral com Todos os Dados Preenchidos: visualização instantânea de todos os 10 módulos com valores completos e laudos estruturados: KPIs de Composição Corporal (Peso, IMC, % Gordura, Massa Magra/Gorda, TMB), Bioimpedância Tetrapolar & Hidratação (ACT, Gordura Visceral, Massa Muscular e Óssea, Ângulo de Fase, Idade Metabólica)',
        'Módulos Adipométricos e Morfológicos Completos: 9 Dobras Cutâneas com somatório total e barras de preenchimento, e 16 Circunferências com RCQ e radar de assimetrias bilaterais',
        'Módulos Funcionais, Força e Motores: Anamnese & PAR-Q+, Avaliação Postural & Fotogrametria, Testes Funcionais (FMS 21 pts e Banco de Wells), Testes de Força (1RM Brzycki em 4 exercícios e Jamar kgf)',
        'Testes de Campo & Saltos Pliométricos: Yo-Yo IR1 com VO2máx e VMA, Teste RAST (6 sprints com potência e fadiga), Teste T de agilidade, Cooper 12min e 1 Milha Rockport; Saltos CMJ Sayers Watts, Squat Jump SJ, Índice Elástico IE%, Drop Jump RSI e assimetria unipodal'
      ]
    },
    {
      version: 'v2.2.0',
      date: '06/10/2026',
      description: 'Refinamento avançado da Central de Avaliações: remoção de seleção de aluno da tela de configurações e do painel geral, seletor de aluno sob demanda nos 3 botões de ação, cards quadrados verdes ao salvar avaliação, botão de cancelamento com opção de rascunho/descarte e compartilhamento no WhatsApp exclusivo no relatório.',
      highlights: [
        'Configurações Puras sem Aluno: remoção completa de seleção de aluno da sub-aba Configurações, tornando-a uma central exclusiva para configurar parâmetros, equações, tolerâncias e tabelas normativas dos 10 módulos',
        'Painel Geral Despoluído: remoção do card seletor de aluno do topo do dashboard de avaliações, exibindo a seleção de aluno somente quando o profissional clica em Nova Avaliação, Gerar PDF ou Analisar Avaliações',
        'Cards Quadrados com Status Verde: ao salvar qualquer avaliação da sessão, o respectivo card quadrado superior fica imediatamente verde com badge de concluído (CheckCircle2), proporcionando feedback visual instantâneo',
        'Botão Cancelar com Rascunho ou Descarte: modal interativo ao cancelar uma avaliação em andamento, permitindo descartar totalmente as alterações ou salvar como rascunho no localStorage para continuar depois',
        'Compartilhamento WhatsApp Exclusivo no Relatório: remoção de botões de WhatsApp das telas de preenchimento e integração exclusiva no modal de Gerar PDF / Relatório Oficial com laudo formatado e assinatura CREF'
      ]
    },
    {
      version: 'v2.1.9',
      date: '06/10/2026',
      description: 'Reestruturação completa da aba de Avaliações com Hub Operacional de Nova Avaliação (cards quadrados no topo), Gerador de PDF, Analisador & Comparativo Multi-avaliação e Central de Configurações das 10 sub-abas.',
      highlights: [
        'Hub Operacional de Nova Avaliação: fluxo interativo onde o profissional seleciona quais avaliações realizar na sessão, gerando cards quadrados no topo para navegação ágil entre os formulários na tela central',
        'Botão Gerar PDF: seletor com checkboxes dos 10 módulos de avaliação para exportação de laudos clínicos completos prontos para impressão em folha A4 com cabeçalho institucional e assinatura técnica',
        'Botão Analisar Avaliações & Comparativo Multi-avaliação: consulta individual de prontuários ou comparação de 2 ou mais avaliações lado a lado (evolução de peso, % gordura, massa magra, dobras, perímetros e testes motores com cálculo de Δ% e Δ absoluto)',
        'Gráficos Centrais de Avaliações Realizadas & A Vencer: acompanhamento mensal do volume de avaliações concluídas e monitor de prazos de vencimento (vencidas, urgentes e em dia com alerta aos treinadores)',
        'Remoção de Comparativo e Gráficos: unificação definitiva da análise comparativa e gráfica diretamente dentro do botão Analisar Avaliações',
        'Nova Sub-aba Configurações: centralização dos 10 módulos de avaliação física (Anamnese, Dobras Cutâneas, Bioimpedância, Perimetria, Fotos e Postural, Testes Funcionais, Força, Campo, Salto e Personalizados) em navegação interna por abas'
      ]
    },
    {
      version: 'v2.1.8',
      date: '06/10/2026',
      description: 'Módulo operacional completo de Testes Personalizados e Métricas Sob Demanda com biblioteca pré-configurada por modalidade esportiva e construtor de testes customizados.',
      highlights: [
        'Biblioteca Esportiva Pré-configurada: modelos prontos para Lutas/BJJ (Suspensão com Pegada de Kimono, Prancha Dinâmica), CrossFit (Pull-ups unbroken, Remo 500m, Burpee Box Jump Over), Natação (Velocidade Crítica CSS, Nado Submerso em Apneia), Basquete/Vôlei (Spike Jump Reach, Lane Agility NBA) e Corrida (Tiro de 30m Lançado)',
        'Construtor de Testes Customizados (Custom Test Builder): interface interativa para criar testes do zero definindo nome, modalidade, métricas livres (segundos, repetições, metros, cm, kg, watts, escala), número de tentativas (1 a 5), critérios de cálculo (melhor marca ou média) e tabelas normativas personalizadas',
        'Registro & Classificação em Tempo Real: preenchimento intuitivo de tentativas por aluno com cálculo automático de melhor marca/média, atribuição de faixas normativas (Excelente, Bom, Médio, Fraco) e pareceres técnicos',
        'Persistência & Compartilhamento: armazenamento isolado em LocalStorage da biblioteca e dos registros do aluno, exportação formatada para WhatsApp e impressão em PDF',
        'Estabilização de Servidor: reinicialização e validação completa do servidor de desenvolvimento na porta 3000'
      ]
    },
    {
      version: 'v2.1.7',
      date: '05/10/2026',
      description: 'Módulo operacional completo de Testes de Campo integrado à Planilha Oficial (Yo-Yo, RAST, Teste T, Cooper e 1 Milha) mensurando Resistência, Potência e Agilidade.',
      highlights: [
        'Dashboard Consolidado de Campo: espelhamento da planilha oficial com status integrado dos 3 pilares fundamentais (Nível de Resistência, Nível de Potência e Nível de Agilidade) e pareceres diagnósticos da comissão técnica',
        'Teste Yo-Yo de Recuperação Intermitente (Yo-Yo IR1): shuttles de 40m com cálculo automático de metros, voltas, VO2máx (Bangsbo 2008), velocidade máxima aeróbia (VMA), histórico comparativo de 3 retestes e simulador sonoro de bips com Web Audio API',
        'Teste RAST (Running-based Anaerobic Sprint Test): 6 sprints com suporte a 35m (oficial) ou 20m (reduzido/futsal), cálculo biomecânico de potência em Watts e W/kg para cada sprint, pico de potência, potência mínima, média, índice de fadiga (W/s e %) e curva de fadiga',
        'Teste T de Agilidade & Mudança de Direção: mensuração de 1ª e 2ª volta no circuito em T de 4 cones (aceleração, passos laterais e recuo de costas) com histórico de 3 testes e classificação normativa',
        'Teste de Cooper (12 Minutos): corrida contínua com cálculo de VO2máx pela equação clássica de Cooper, pace médio (min/km), velocidade (km/h) e estratificação por gênero e idade',
        'Teste de 1 Milha (Rockport 1609m): caminhada vigorosa ou corrida com mensuração de tempo (min:seg), FC final (bpm) e equação oficial de Kline et al. com conversão automática de peso em lbs',
        'Carregador de Atletas de Exemplo da Planilha: atalhos para carregar dados reais da planilha (Matheus Vanderlei, Lucas Tibana, Juliano Ferreira, Pietro Noah)',
        'Sincronização & Compartilhamento: persistência em localStorage por aluno, exportação formatada para WhatsApp e impressão'
      ]
    },
    {
      version: 'v2.1.6',
      date: '05/10/2026',
      description: 'Módulo operacional completo de Testes de Salto e Potência Muscular (Bosco, Sayers, CMJ, SJ, Drop Jump, RSI, Salto Unipodal e Salto Horizontal).',
      highlights: [
        'CMJ (Countermovement Jump): 3 tentativas com cálculo automático do melhor salto, tempo de voo (ms), potência mecânica de pico (Sayers Watts e W/kg) e classificação normativa',
        'Squat Jump & Índice de Elasticidade: avaliação da força concêntrica pura e cálculo do Índice de Elasticidade do Ciclo Alongamento-Encurtamento (IE%) com interpretação diagnóstica',
        'Drop Jump & Índice de Força Reativa (RSI): teste de pliometria em profundidade (caixotes de 20cm a 45cm) com mensuração de tempo de contato com o solo e classificação de reatividade',
        'Salto Unipodal & Triagem de Assimetria (LCA): comparação bilateral D vs E com alerta automático de risco lesivo caso a assimetria seja superior a 10%',
        'Salto em Distância Parado (Broad Jump): potência explosiva no vetor horizontal com classificação populacional',
        'Sincronização & Compartilhamento: integração com LocalStorage, exportação formatada para WhatsApp e impressão'
      ]
    },
    {
      version: 'v2.1.5',
      date: '05/10/2026',
      description: 'Módulos operacionais de Testes Funcionais (FMS, Wells, Y-Balance) e Testes de Força (1RM, RML, Handgrip) e unificação da navegação exclusiva pelo menu lateral.',
      highlights: [
        'Testes Funcionais & Triagem Biomecânica (FMS): bateria de 7 movimentos com cálculo automático de escore (0 a 21), classificação de risco lesivo, detecção de assimetrias bilaterais e clearing tests',
        'Banco de Wells & Y-Balance: mensuração de flexibilidade posterior (Sentar e Alcançar) e equilíbrio dinâmico com triagem de risco lesivo',
        'Testes de Força & 1RM Preditivo: calculadora com equações científicas (Brzycki, Epley, Baechle) para Supino, Agachamento, Terra e Puxada, com cálculo de força relativa e zonas percentuais de sobrecarga',
        'Resistência de Força ACSM & Dinamometria: testes padronizados de flexão de braço, abdominal 1 min, prancha isométrica e dinamometria manual (handgrip) com cálculo de assimetria',
        'Navegação Exclusiva pela Barra Lateral: remoção dos cabeçalhos superiores redundantes em todas as abas e sub-abas (Avaliações, Dashboards, CRM, Agenda e Nutrição), concentrando a navegação no menu lateral',
        'Sincronização de Estado & Exportação: persistência em localStorage, laudos formatados para WhatsApp e impressão em PDF'
      ]
    },
    {
      version: 'v2.1.4',
      date: '05/10/2026',
      description: 'Opções pré-definidas completas para Objetivos e Frequência Alvo na sub-aba de Anamnese (Avaliações Físicas).',
      highlights: [
        'Objetivos Predefinidos: seletor categorizado em 5 grupos (Hipertrofia & Força, Emagrecimento & Composição, Saúde & Reabilitação, Performance Esportiva e Populações Especiais)',
        'Seleção Rápida de Objetivos (Chips 1-clique): atalhos para Hipertrofia, Emagrecimento, Definição, Reabilitação, Condicionamento, Futebol e Longevidade',
        'Metas Complementares Opcionais: tags ativáveis de foco complementar (mobilidade articular, aumento de cargas, core/abdômen, alívio lombar, etc.)',
        'Frequência Alvo Predefinida: seletor com 10 frequências semanais padronizadas e chips rápidos para 2x/sem, 3x/sem, 4x/sem, 5x/sem, 6x/sem e Dias Alternados',
        'Turno Preferencial & Duração por Sessão: seleção de horários (Manhã, Almoço, Tarde, Noite, Flexível) e tempo de treino (30-45m, 45-60m, 60-75m, 90m+)',
        'Sugestões Rápidas de Conduta: inserção em 1 clique de condutas clínicas no campo de observações do avaliador'
      ]
    },
    {
      version: 'v2.1.3',
      date: '05/10/2026',
      description: 'Configuração operacional dos módulos clínicos de Avaliações Físicas: Anamnese (PAR-Q + personalizável), Dobras Cutâneas, Bioimpedância, Perimetria e Fotos/Postural.',
      highlights: [
        'Anamnese Clínica & PAR-Q: questionário padrão de prontidão cardiovascular com 7 perguntas oficiais, alertas automáticos de risco, histórico de patologias, cirurgias, estilo de vida e criador de perguntas personalizadas',
        'Dobras Cutâneas Ágil: protocolos de adipometria científica (Pollock 7 dobras, Pollock 3 dobras, Guedes 3, Petroski 4 e Faulkner 4) com cálculo instantâneo de densidade, % de gordura (Siri), massa gorda e massa magra',
        'Bioimpedância Completa: campos disponíveis para peso, estatura, IMC, %BF, massa muscular esquelética, massa gorda/magra, água corporal, gordura visceral, TMB, idade metabólica, massa óssea e ângulo de fase',
        'Perimetria & Simetrias: preenchimento de todas as circunferências corporais (tórax, braços, antebraços, cintura, abdômen, quadril, coxas e panturrilhas) com análise de assimetria bilateral e RCQ',
        'Fotos & Avaliação Postural: 4 fotos fotogramétricas padronizadas (frente, costas, lateral D/E) com malha de simetrógrafo/fio de prumo ativável, checklist anatômico e prescrição corretiva',
        'Sub-abas restantes com status "Em breve": avaliações, comparativo/gráficos, testes funcionais, força, campo, salto e personalizados mantidos em roadmap'
      ]
    },
    {
      version: 'v2.1.2',
      date: '05/10/2026',
      description: 'Reinicialização e validação de integridade do servidor de desenvolvimento Vite na porta 3000.',
      highlights: [
        'Verificação de build e tipagem completa sem erros (tsc & vite build OK)',
        'Reinicialização do processo do servidor de desenvolvimento na porta 3000 (0.0.0.0)',
        'Sincronização de versão do sistema e validação de dependências'
      ]
    },
    {
      version: 'v2.1.1',
      date: '04/10/2026',
      description: 'Correção crítica de conformidade com as Regras de Hooks do React (Rules of Hooks) nos modais de seleção de vídeo e lembretes.',
      highlights: [
        'Correção do PlanoTreinoVideoSelectorModal: garantia de execução incondicional do hook useMemo antes de qualquer retorno antecipado, eliminando o erro "Rendered more hooks than during the previous render"',
        'Correção do WhatsAppReminderModal: posicionamento incondicional de todos os estados useState no topo do componente',
        'Renderização condicional segura: montagem dos modais de configuração e catálogo sob demanda no PlanoTreinoView, otimizando performance e estabilidade de renderização'
      ]
    },
    {
      version: 'v2.1.0',
      date: '04/10/2026',
      description: 'Aprimoramentos interativos no Plano de Treino: seleção de materiais cadastrados, botões laterais de ±5 minutos, configurações de grupo e integração com Catálogo de Vídeos e categoria FUTEBOL.',
      highlights: [
        'Seleção de Materiais Cadastrados: formato dropdown com checkboxes, busca instantânea e tags removíveis para que o professor selecione apenas materiais pré-cadastrados',
        'Controle de Tempo ±5m: botões laterais à esquerda (-5m) e à direita (+5m) em todas as seções de tempo (Aquecimento, Atividades e Volta à Calma) para ajuste ágil',
        'Modal de Configurações Abrangente: gerenciamento completo das opções de Materiais, Objetivos, Local de Treino, Modalidade e Turma Alvo (exclusivo para atividades em grupo)',
        'Anexação de Vídeos do Catálogo: botão que abre modal completo com todos os exercícios cadastrados, busca e prévia direta para anexar o vídeo ao plano com 1 clique',
        'Nova Categoria "FUTEBOL": adicionada ao Catálogo de Exercícios com exercícios técnicos e táticos (passes, rondos, finalizações e cruzamentos)'
      ]
    },
    {
      version: 'v2.0.9',
      date: '04/10/2026',
      description: 'Implementação completa da sub-aba "Plano de Treino" baseada na estrutura da planilha oficial anexada, permitindo ao professor criar planos de aula e treinos com agilidade.',
      highlights: [
        'Estrutura Fiel à Planilha Oficial: cabeçalho com Data e Nível em destaque (ex: NÍVEL - INTERMEDIÁRIO), blocos de Objetivos Principais, Objetivos Atingidos e Observações da Aula',
        'Planejamento de Atividades com Tempo e Materiais: seção Aquecimento com tempo e materiais, e 3 colunas dedicadas (Atividade 01, Atividade 02, Atividade 03) com tempos, materiais e links de vídeos demonstrativos',
        'Criação Prática & Ágil: preenchimento instantâneo através de modelos prontos, tags rápidas de materiais comuns com 1 clique e chips de objetivos pré-definidos',
        'Recursos Operacionais: registro rápido de feedback pós-aula, modo cronômetro de aula para celular/tablet, impressão/PDF formatado para prancheta e compartilhamento via WhatsApp'
      ]
    },
    {
      version: 'v2.0.8',
      date: '01/10/2026',
      description: 'Criação das 12 sub-abas do módulo de Avaliações Físicas com status "Em breve" (Avaliações, Comparativo e gráficos, Anamnese, Dobras Cutâneas, Bioimpedância, Perimetria, Fotos e postural, Testes funcionais, Testes de força, Testes de campo, Testes de salto e Testes personalizados).',
      highlights: [
        '12 Sub-abas no Menu e no Cabeçalho: todas identificadas individualmente com badge "Em breve" e ícones específicos na barra lateral e na navegação superior',
        'Painéis de Especificação e Roadmap Técnico: referências científicas (Pollock, ACSM, ISAK, BIA multifrequencial, FMS, Sayers/Bosco), fórmulas preditivas e destaques funcionais planejados',
        'Seleção de Aluno & Contexto Integrado: prontuário do aluno ativo com código de matrícula, plano vigente e switcher rápido',
        'Ferramentas de Interação: alertas de notificação no lançamento, solicitação de acesso ao programa Beta e simulador prévio do motor de avaliação'
      ]
    },
    {
      version: 'v2.0.7',
      date: '01/10/2026',
      description: 'Promoção do módulo "Avaliações Físicas" de sub-aba para aba principal da barra lateral, posicionado diretamente abaixo de "Treinos".',
      highlights: [
        'Aba Principal "Avaliações Físicas": acesso direto e desvinculado de Treinos no menu de navegação, com ícone ClipboardCheck e status operacional completo',
        'Suíte Completa de Avaliações: protocolos de composição corporal (Pollock 7 e 3 dobras, Guedes, Petroski, Bioimpedância), perimetria detalhada, anamnese clínica com PAR-Q, testes cardiorrespiratórios (VO2 máx), testes de força e flexibilidade',
        'Permissões & Controle de Acesso (RBAC): permissão "avaliacoes" integrada a todos os perfis autorizados (administradores, coordenadores e treinadores)',
        'Otimização da Sub-Navegação de Treinos: remoção da redundância na sub-aba de Treinos, tornando a navegação mais ágil e intuitiva'
      ]
    },
    {
      version: 'v2.0.6',
      date: '01/10/2026',
      description: 'Criação da sub-aba "Notificações" na aba de Configurações, com controle granular de alertas push visuais para cada tipo específico de evento do sistema.',
      highlights: [
        'Sub-aba Notificações em Configurações: painel administrativo dedicado para gerenciar alertas push, som de chime e notificações de área de trabalho',
        'Toggles Granulares por Tipo de Evento: chaves individuais para novo aluno, fatura vencida, pagamento recebido, venda no PDV, catraca liberada/bloqueada, folha de ponto, tarefas e agenda',
        'Controles Mestres: interruptores globais para desativar ou reativar todos os banners visuais, som de notificação e permissão de push do navegador',
        'Ação de Teste e Restauração: botões para testar em tempo real o alerta com som e restaurar configurações padrão com um clique'
      ]
    },
    {
      version: 'v2.0.5',
      date: '30/09/2026',
      description: 'Implementação do Sistema Central de Alertas Push (Notificações Visuais) em tempo real, disparado automaticamente em qualquer registro ou movimentação no sistema.',
      highlights: [
        'Banner Flutuante de Alerta Push: container visual animado no canto superior com indicador de status, barra de contagem regressiva, pausa ao passar o mouse e ação direta com 1 clique',
        'Som de Notificação Chime: alerta sonoro sutil sintetizado via Web Audio API, com controle de ativação/desativação no cabeçalho',
        'Central de Notificações no Cabeçalho: histórico completo com contagem de não lidas, filtros por status, botão de leitura em lote e botão de teste de disparo instantâneo',
        'Integração com Todos os Módulos: disparos automáticos para registros na Catraca, Folha de Ponto, Tarefas, Agenda de Professores, Matrículas e Vendas'
      ]
    },
    {
      version: 'v2.0.4',
      date: '30/09/2026',
      description: 'Remoção do badge "Em breve" da aba principal de Professores na barra lateral, consolidando a liberação integral de todas as suas funcionalidades (Folha de Ponto, Tarefas Google Tasks e Agenda).',
      highlights: [
        'Status Ativo na Navegação: remoção do indicador "Em breve" no menu lateral para a aba Professores',
        'Módulo Integralmente Operacional: todas as 3 sub-abas (Folha de Ponto, Tarefas e Agenda) encontram-se 100% implementadas e funcionais'
      ]
    },
    {
      version: 'v2.0.3',
      date: '30/09/2026',
      description: 'Implementação do Calendário Integrado na sub-aba "Agenda" do módulo de Professores, consolidando todos os compromissos, aulas, eventos e tarefas vinculados ao usuário.',
      highlights: [
        'Calendário Integrado Pessoal: consolidação de turmas fixas da grade, eventos avulsos, tarefas do Google Tasks com prazo e plantões/avaliações de cada professor',
        'Múltiplas Visões (Mês, Semana e Timeline Diária): navegação de mês com chips visuais de atividades por dia, visão semanal em colunas e timeline detalhada com horários e locais',
        'Filtros por Tipo de Vínculo: alternância entre Aulas, Eventos/Jogos, Tarefas e Plantões com contadores em tempo real',
        'Agendamento de Novos Compromissos: modal para adicionar compromissos pessoais, reuniões técnicas, avaliações biomecânicas e plantões na agenda de qualquer professor da equipe'
      ]
    },
    {
      version: 'v2.0.2',
      date: '30/09/2026',
      description: 'Implementação do sistema de Tarefas & Rotinas estilo Google Tasks na sub-aba "Tarefas" do módulo de Professores.',
      highlights: [
        'Quadro em Colunas por Usuário: colunas dedicadas para cada professor e coordenador, permitindo atribuição cruzada de afazeres',
        'Interface Estilo Google Tasks: checkboxes circulares com efeito de conclusão, favoritos com estrela, prioridades (alta, média, normal) e tags de categoria',
        'Criação Rápida Inline e Subtarefas: formulário inline no topo de cada coluna para adicionar tarefas em segundos com data limite e suporte a checklists de subtarefas',
        'Seção Retrátil de Concluídas: agrupamento elegante das tarefas finalizadas no rodapé de cada coluna com opção de limpar concluídas'
      ]
    },
    {
      version: 'v2.0.1',
      date: '30/09/2026',
      description: 'Implementação completa da sub-aba "Folha de Ponto" no módulo de Professores, baseada no sistema de controle de horas Controle VB Sport.',
      highlights: [
        'Diário & Registro de Presença: registro diário de aulas ministradas por data e professor, com cálculo automático de duração em horas e confirmação de presença com um clique',
        'Dashboard & Projeção Financeira: acompanhamento de ganhos acumulados e custos da escala no mês, projeção de fechamento até o fim do período, carga horária e ranking por professor',
        'Controle de Avisos & Lembretes: identificação automática de professores com preenchimento pendente no dia e ferramenta para disparo de lembretes',
        'Histórico & Calendário Visual: calendário mensal navegável com indicadores de aulas realizadas vs agendadas e detalhamento das atividades por dia selecionado',
        'Gestão de Turmas Fixas, Eventos Avulsos e Taxas Horárias: CRUD completo de turmas por dias da semana, eventos especiais e configuração do valor da hora/aula da equipe'
      ]
    },
    {
      version: 'v2.0.0',
      date: '30/09/2026',
      description: 'Central Unificada de Configurações do Sistema: reestruturação completa da aba de Configurações com sub-abas dedicadas para cada um dos 17 módulos principais do sistema.',
      highlights: [
        'Sub-Abas de Todos os Módulos: criação de abas para Geral & Academia, Usuários & Permissões RBAC, Dashboards, Clientes, Professores, CRM, Agenda, WhatsApp, Pay, Financeiro, Vendas/PDV, Treinos, Nutrição, Bem-Estar, Catraca, Estoque e Relatórios',
        'Parametrização Granular: cada sub-aba permite configurar toggles, regras numéricas, prazos, taxas, limiares de alerta e fórmulas',
        'Busca Rápida de Parâmetros e Persistência: filtro inteligente de regras por palavra-chave, salvamento local instantâneo e botão de restauração de fábrica por módulo'
      ]
    },
    {
      version: 'v1.9.9',
      date: '29/09/2026',
      description: 'Criação da sub-aba "Plano de Treino" dentro do módulo de Treinos com tela estruturada de Em Breve para futuras configurações de periodização esportiva e macrociclos.',
      highlights: [
        'Nova Sub-aba Plano de Treino: inserida no menu lateral na aba de Treinos com badge indicador "Em breve"',
        'Tela de Em Breve: layout moderno com visualização prévia de macrociclos/fases, cronogramas de troca de treino e distribuição de volume semanal',
        'Integração com Atalho de Configurações: mapeamento em tabSettingsService com parâmetros padrão de periodização e duração de mesociclos'
      ]
    },
    {
      version: 'v1.9.8',
      date: '29/09/2026',
      description: 'Remoção do cabeçalho superior de sub-abas na aba de Treinos, centralizando a navegação exclusivamente no menu lateral, e remoção do botão de configuração do cabeçalho fixo, mantendo-o apenas no topo da página central.',
      highlights: [
        'Aba de Treinos: remoção completa da barra horizontal de sub-abas no topo da tela, unificando a navegação de todas as divisões e ferramentas de treino através da barra lateral',
        'Cabeçalho Fixo: remoção do botão de configurações da barra superior fixa, mantendo o botão de atalho de configurações exclusivamente no canto superior direito de cada página e sub-aba no conteúdo central'
      ]
    },
    {
      version: 'v1.9.7',
      date: '29/09/2026',
      description: 'Implementação de botão de configuração contextual no canto superior direito de todas as abas e sub-abas com painel completo de atalhos e parâmetros operacionais.',
      highlights: [
        'Botão de Configuração no Canto Superior Direito: inserido de forma fixa no topo do layout principal e na barra superior para acesso imediato em qualquer tela',
        'Painel Modal Contextual (TabConfigModal): reúne parâmetros específicos da aba e sub-aba ativa (limiares de dor, tolerância de ponto, carência de inadimplência, juros, regras de agenda, etc.)',
        'Persistência e Atalhos Ágeis: salvamento local instantâneo com toasts de confirmação e atalho direto para o painel de configurações gerais da academia'
      ]
    },
    {
      version: 'v1.9.6',
      date: '29/09/2026',
      description: 'Criação da nova aba principal "PROFESSORES" posicionada logo abaixo da aba "Clientes", com as sub-abas Folha de ponto, Tarefas e Agenda (todas estruturadas com tela de Em Breve).',
      highlights: [
        'Nova Aba PROFESSORES: inserida na barra lateral e na ordem do sistema imediatamente abaixo da aba "Clientes"',
        'Sub-aba Folha de Ponto: estruturada com visualização prévia das funcionalidades de ponto digital, banco de horas e espelho de ponto',
        'Sub-aba Tarefas: estruturada com visão de checklists operacionais de abertura/fechamento e rotinas técnicas da equipe',
        'Sub-aba Agenda: estruturada com visão de escala semanal, plantões de sala e trocas de aulas dos professores',
        'Páginas "Em Breve": layout moderno, badges de status, cards de antecipação de recursos e integração total com o menu lateral e permissões'
      ]
    },
    {
      version: 'v1.9.5',
      date: '29/09/2026',
      description: 'Implementação de botão de salvamento no Mapa Anatômico de Dor com persistência dos dados e retorno automático ao questionário de Check-in.',
      highlights: [
        'Botão "Salvar e Voltar ao Check-in": adicionado de forma destacada no cabeçalho e no rodapé da sub-aba de Mapa Anatômico de Dor',
        'Persistência e Feedback Imediato: feedback via toast com contagem de pontos mapeados e preservação dos dados para o aluno ativo',
        'Sincronização com o Questionário de Check-in: exibição de badge informativo de pontos mapeados no slider EVA e salvamento integrado no envio final do check-in'
      ]
    },
    {
      version: 'v1.9.4',
      date: '29/09/2026',
      description: 'Remoção dos cards informativos de resposta na aba de Check-in e eliminação dos cabeçalhos superiores das sub-abas de Bem-Estar, centralizando a navegação exclusivamente no menu lateral.',
      highlights: [
        'Aba de Check-in: remoção dos cards e caixas de visualização prévia de respostas e scores, mantendo a interface puramente dedicada aos formulários de entrada e botão de salvamento direto',
        'Navegação por Menu Lateral Exclusivo: eliminação do cabeçalho superior e da barra horizontal de abas em todas as sub-abas de Bem-Estar (Check-in, Análise, Mapa Anatômico, Matriz do Elenco, Ciclo Menstrual e Histórico)',
        'Maximização do Espaço Visual: telas limpas e sem duplicação de controles, permitindo que a navegação e seleção ocorram unicamente pela árvore lateral do sistema'
      ]
    },
    {
      version: 'v1.9.3',
      date: '28/09/2026',
      description: 'Implementação de sistema de alertas visuais automáticos em vermelho na aba ANÁLISE para índices críticos de Monotonia e Strain com limiares configuráveis.',
      highlights: [
        'Sistema de Alertas Visuais em Vermelho: identificação e destaque automático de alunos com sobrecarga perigosa e risco de lesão musculoesquelética ou sobretreinamento',
        'Banner Superior de Risco Crítico: notificação proeminente com contagem de alunos em perigo, tags individuais dos índices estourados e botão de filtro rápido',
        'Destaque no Filtro de Alunos: caixas de seleção com borda vermelha pulsante e badge "CRÍTICO" para atletas que violaram os limiares de segurança',
        'Modal de Configuração de Limiares: ajuste personalizado dos níveis críticos de Monotonia (padrão 2.0 de Foster) e Strain (padrão 6.000 AU) com persistência local',
        'Destaque nos Cards de Análise Rápida: transição imediata para estilo de alerta vermelho pulsante quando Monotonia ou Strain do aluno atingem níveis críticos',
        'Destaque na Tabela Comparativa: linhas avermelhadas com borda lateral de destaque, colunas individuais de Monotonia e Strain com badges de aviso e botão direto "Avisar Aluno"'
      ]
    },
    {
      version: 'v1.9.2',
      date: '28/09/2026',
      description: 'Substituição da sub-aba Prontidão por "Análise" com cards de resposta rápida, filtros múltiplos (alunos, período e data) e gráficos científicos de ACWR, Strain, Recovery e Monotonia.',
      highlights: [
        'Substituição da sub-aba "Prontidão" pela nova sub-aba "Análise" no Questionário de Bem-Estar',
        'Cards de análise rápida exibindo em tempo real todas as métricas da última resposta enviada (Sono, PSE, EVA, Estresse, Humor, PSR, Carga da Sessão em AU, Perda Hídrica e Salto CMJ)',
        'Filtros com caixas de seleção (checkboxes) para análise simultânea e comparativa de múltiplos alunos, períodos (Manhã, Tarde, Noite) e intervalos de data',
        'Gráfico interativo do Índice ACWR (Acute:Chronic Workload Ratio) com faixas científicas demarcadas: Sub-treino (<0.8), Sweet Spot (0.8 - 1.3), Atenção (1.3 - 1.5) e Risco de Lesão (>1.5)',
        'Gráfico do índice de STRAIN (Estresse Acumulado de Foster) calculando o impacto psicofisiológico semanal',
        'Gráfico do índice de RECOVERY (Escala PSR 0 a 10) com evolução temporal de recuperação antes das sessões',
        'Gráfico e medidor do índice de MONOTONIA com análise do grau de ondulação diária das cargas e alerta para valores acima de 2.0',
        'Tabela comparativa detalhada com ordenação e exportação de feedback via WhatsApp para múltiplos alunos'
      ]
    },
    {
      version: 'v1.9.1',
      date: '28/09/2026',
      description: 'Separação das sub-abas de Check-in e Prontidão, adoção da escala 0 a 10, inclusão de PSE, EVA, Período, PSR, Peso Pré/Pós, Salto CMJ e novo Boneco Anatômico com divisões musculares e articulações.',
      highlights: [
        'Separação das sub-abas: "Check-in" dedicada exclusivamente ao formulário de preenchimento na página e "Prontidão" com diagnóstico individual e conduta do treinador',
        'Conversão das escalas de avaliação para o padrão 0 a 10 (Sono, PSE, EVA, Estresse, Humor e PSR)',
        'Padronização de nomenclaturas esportivas: "Nível de fadiga geral" alterado para "PSE" e "Dor muscular" alterado para "EVA"',
        'Substituição do campo "Horário" por "Período" com seleção rápida entre Manhã, Tarde e Noite',
        'Inclusão de novos marcadores fisiológicos: PSR (Percepção Subjetiva de Recuperação 0-10), Tempo de treino (minutos), Peso pré e pós exercício (kg) com cálculo de desidratação, e Salto CMJ pré e pós exercício (cm) com taxa de fadiga neuromuscular',
        'Novo Boneco Anatômico Interativo no Mapa de Dor com separação clara de todas as principais divisões musculares e articulações (Vistas Anterior e Posterior)',
        'Remoção completa de menções e marcas externas no sistema'
      ]
    },
    {
      version: 'v1.9.0',
      date: '28/09/2026',
      description: 'Criação do módulo "Questionário de Bem-Estar" e Prontidão de Carga com monitoramento diário pré-treino.',
      highlights: [
        'Nova aba principal "Bem-Estar" integrada na barra lateral e navegação global com ícone HeartPulse',
        'Questionário diário pré-treino com cálculo instantâneo do Índice de Hooper e Escore de Prontidão (0 a 100%)',
        'Mapa Anatômico de Dor com silhueta corporal humana e pontos anatômicos clicáveis',
        'Matriz de Hooper e semáforo coletivo do elenco (Verde/Amarelo/Vermelho)',
        'Módulo Fisiológico de Monitoramento do Ciclo Menstrual com orientações práticas para as 4 fases hormonais',
        'Disparador oficial de feedback via WhatsApp integrado ao app do aluno'
      ]
    },
    {
      version: 'v1.8.0',
      date: '27/09/2026',
      description: 'Reestruturação completa da aba "Testes Físicos" para "Avaliações Físicas" baseada na plataforma de referência avaliacaofisica.app.',
      highlights: [
        'Renomeação e padronização da sub-aba de "Testes Físicos" para "Avaliações Físicas" na barra superior de navegação e no menu lateral',
        'Implementação da suíte completa de avaliação física inspirada no avaliacaofisica.app com cálculo em tempo real de protocolos científicos (Pollock 7 e 3 dobras, Guedes, Petroski e Bioimpedância)',
        'Módulo de Composição Corporal com fracionamento em 4 componentes (Massa Muscular, Massa Gorda, Massa Óssea e Residual), Equação de Siri e escala visual de gordura',
        'Módulo de Adipometria com medição dos 9 pontos anatômicos de dobras cutâneas, somatório total e comparativo de deltas (mm) com a avaliação anterior',
        'Módulo de Perimetria completo com cálculo automático de assimetria lateral (D vs. E) e classificação de risco cardiovascular pela relação Cintura-Quadril (RCQ)',
        'Anamnese clínica digital com questionário de prontidão PAR-Q, histórico de lesões, rotina de sono e hidratação',
        'Testes funcionais de VO2 Máx (Cooper 12 min), resistência neuromuscular (flexões/abdominais) e flexibilidade (Banco de Wells)',
        'Modal wizard interativo de "Nova Avaliação Física" com cálculo instantâneo automático e disparador oficial de resultados formatados via WhatsApp',
        'Laudo pericial e relatório PDF oficial atualizados para impressão e exportação com cabeçalho profissional e assinatura do treinador'
      ]
    },
    {
      version: 'v1.7.0',
      date: '27/09/2026',
      description: 'Criação do módulo completo de Nutrição com 6 sub-abas especializadas e tela de apresentação "Em breve" para todas as seções.',
      highlights: [
        'Nova aba principal "Nutrição" adicionada na barra lateral e na navegação do sistema com ícone temático e indicador "Em breve"',
        'Criação de 6 sub-abas especializadas: Planos Alimentares & Dietas, Avaliação & Anamnese, Composição Corporal & Bioimpedância, Suplementação & Fitoterapia, Metas & Hidratação e Tabela TACO & Alimentos',
        'Barra superior de navegação por sub-abas integrada com seletor rápido de alunos ativos para contextualização personalizada de cada atleta',
        'Tela principal "Em breve" completa para cada sub-aba: cards com as 4 funcionalidades centrais planejadas (cálculo de TMB/GET, divisão de macros, bioimpedância, dobras cutâneas e base TACO/IBGE)',
        'Botão interativo "Quero ser notificado no lançamento" com confirmação imediata via toast e protótipo visual do painel de registro',
        'Integração com controle de acesso RBAC (userService.ts) e suporte completo nos modos expandido e recolhido (flyout)'
      ]
    },
    {
      version: 'v1.6.3',
      date: '27/09/2026',
      description: 'Implementação de configuração de lembretes automáticos e notificações via WhatsApp para os alunos no Controle de Carga.',
      highlights: [
        'Novo botão em destaque "Lembrete WhatsApp" no cabeçalho do Controle de Carga e banner interativo de status da automação para o aluno selecionado',
        'Modal completo de configuração de automação via WhatsApp: edição do número com código DDI (+55), seleção de regras de disparo (ao salvar nova carga, lembrete semanal ou apenas em novos recordes PR)',
        'Pré-visualização em tempo real estilo WhatsApp com balão verde, cabeçalho da central, formatação de texto com emojis, 1RM estimado e link direto para o app do aluno',
        'Botão "Enviar WhatsApp Agora" integrado com API oficial do WhatsApp Web/Desktop para disparo imediato de mensagens pré-formatadas',
        'Caixa de seleção "Notificar aluno no WhatsApp" integrada diretamente no formulário de registro de nova carga com toast flutuante para disparo rápido'
      ]
    },
    {
      version: 'v1.6.2',
      date: '27/09/2026',
      description: 'Implementação do botão "Exportar PDF" no topo das abas e geração de relatório profissional completo para o aluno selecionado.',
      highlights: [
        'Novo botão em destaque "Exportar PDF" adicionado na barra superior unificada de navegação de abas e diretamente no módulo de Controle de Carga',
        'Geração dinâmica de documento oficial formatado em padrão A4, com cabeçalho GL PRO FIT, CREF profissional, dados cadastrais do aluno e autenticação',
        'Resumo contextual inteligente de acordo com a aba ativa: Controle de Carga (1RM, histórico de sessões e progressão), Prescrição (divisões, exercícios e cadências), Treino do Dia (séries e execução) ou Testes Físicos (VO2 Máx e tabelas)',
        'Suporte nativo a impressão direta e salvamento em arquivo PDF com folha de estilo dedicada (@media print) sem elementos de interface ou barras laterais',
        'Campos de assinatura técnica do treinador (CREF) e do aluno para validade documental em acompanhamento físico'
      ]
    },
    {
      version: 'v1.6.1',
      date: '27/09/2026',
      description: 'Limpeza visual da aba de Controle de Carga com remoção de cards redundantes ao lado do filtro.',
      highlights: [
        'Remoção dos cards informativos que apareciam ao lado do botão de filtro (exercício, grupamento, divisão, prescrição e última carga), eliminando repetição desnecessária de informações',
        'Otimização do layout do seletor de exercícios prescritos com espaçamento limpo e destaque focado no botão de filtro dropdown',
        'Manutenção da integridade de todos os dados completos nos cards analíticos de KPI logo abaixo (Última Carga, 1RM Máximo, Total de Sessões e Prescrição do Treinador)'
      ]
    },
    {
      version: 'v1.6.0',
      date: '27/09/2026',
      description: 'Aprimoramento do Controle de Carga com dados dinâmicos dos exercícios prescritos do aluno, botão de filtro e sincronização inteligente da calculadora 1RM.',
      highlights: [
        'Exibição exclusiva dos exercícios realmente prescritos na ficha de treino do aluno selecionado, eliminando a dependência de listas de exercícios genéricos ou estáticos',
        'Substituição do cabeçalho horizontal pelo novo "Botão de Filtro" com menu suspenso (dropdown popover), busca em tempo real, agrupamento por grupamento muscular e divisões da ficha',
        'Calculadora de 1RM com sincronização reativa imediata: responde automaticamente ao exercício selecionado carregando a última carga e repetições registradas',
        'Badge de status detalhado com informações da divisão, carga prescrita e última carga registrada, além de botão para restaurar a última carga na calculadora',
        'Modal de registro de nova carga alimentado dinamicamente com os exercícios da ficha do aluno e preenchimento prévio das cargas anteriores'
      ]
    },
    {
      version: 'v1.5.9',
      date: '24/09/2026',
      description: 'Implementação de botão de seleção de aluno e modal de troca rápida na sub-aba "Treino do Dia".',
      highlights: [
        'Novo botão em destaque "Selecionar Aluno" / "Trocar Aluno" integrado diretamente no banner superior da sub-aba Treino do Dia',
        'Modal completo de seleção de aluno com busca em tempo real por nome, matrícula, plano ou e-mail, além de filtro de alunos com ficha ativa',
        'Exibição das fichas de treino cadastradas para cada aluno, permitindo selecionar qual divisão ou rotina executar com 1 clique',
        'Atalho rápido para prescrever uma nova ficha de treino caso o aluno selecionado ainda não possua rotina cadastrada',
        'Carregamento instantâneo do treino selecionado, redefinindo as séries, cargas e o cronômetro sonoro de descanso, acompanhado de notificação de confirmação'
      ]
    },
    {
      version: 'v1.5.8',
      date: '24/09/2026',
      description: 'Implementação de lista suspensa com seleção múltipla no filtro de categorias de treino e novos filtros avançados.',
      highlights: [
        'Adição dos novos filtros de categoria solicitados: Masculino, Reabilitação, Intermediário e Avançado, integrados ao lado dos filtros pré-existentes (Hipertrofia, Emagrecimento, Força, Feminino, Iniciante, Funcional)',
        'Transformação do filtro em um botão moderno de lista suspensa (dropdown popover) com seleção múltipla (multi-select), permitindo selecionar várias categorias simultaneamente',
        'Contadores dinâmicos em tempo real de modelos disponíveis para cada categoria dentro do menu suspenso e busca instantânea de categorias',
        'Controle de combinação flexível no rodapé da lista suspensa: Modo Qualquer (OU) para união de resultados e Modo Todas (E) para interseção estrita',
        'Exibição de chips/tags interativos dos filtros ativos com botão de remoção individual instantânea (X) e ação rápida de limpar seleção',
        'Inclusão de novos protocolos oficiais nativos da plataforma: "Treino Masculino - Força & Hipertrofia (Upper/Lower 4x)" e "Reabilitação & Estabilidade Funcional (Ombro, Coluna & Joelho)"',
        'Sincronização da lista suspensa com múltipla seleção também no seletor de modelos de treino do modal de prescrição direta de ficha ao aluno'
      ]
    },
    {
      version: 'v1.5.7',
      date: '24/09/2026',
      description: 'Implementação de criação de modelos de treino personalizados pelo profissional e filtros avançados de templates.',
      highlights: [
        'Novo botão "+ Criar Meu Modelo Padrão" na aba de Modelos & Templates, permitindo ao treinador cadastrar seus próprios protocolos de treino com título, categoria, nível, objetivo, orientações técnicas e divisões musculares customizadas',
        'Filtro dinâmico com 3 modos de seleção: "Todas as Opções", "Padrões da Plataforma" (templates nativos oficiais) e "Criados por Mim" (templates do profissional), com contadores e badges em tempo real',
        'Modal de edição e criação de modelos padrão (WorkoutTemplateEditorModal) integrado com o catálogo completo de +1.480 exercícios biomecânicos',
        'Gerenciamento completo dos modelos criados: aplicação direta a qualquer aluno em 1 clique, edição, exclusão, duplicação e visualização anatômica detalhada das divisões',
        'Sincronização e filtro dos modelos personalizados também disponíveis dentro do modal de prescrição de fichas de treino (WorkoutEditorModal)'
      ]
    },
    {
      version: 'v1.5.6',
      date: '24/09/2026',
      description: 'Expansão completa do catálogo de exercícios para mais de 1.480 itens biomecânicos e otimização de paginação e filtros.',
      highlights: [
        'Expansão massiva da base de dados de exercícios: de 34 exemplos iniciais para 1.482 exercícios biomecânicos catalogados',
        'Cobertura integral de todos os grupos musculares: Peitoral, Costas, Ombros, Bíceps, Tríceps, Antebraço, Quadríceps, Posteriores/Isquiotibiais, Glúteos, Panturrilhas, Core/Abdômen, Cárdio, Funcional/LPO e Alongamento/Mobilidade',
        'Variedade completa de equipamentos: Barra Olímpica, Halteres, Cabos/Polia, Máquinas Seletivas e Articuladas, Peso Corporal/Calistenia, Smith Machine, Kettlebell, Elásticos/Superband, Aparelhos de Cárdio e Acessórios',
        'Implementação de paginação de alta performance (40 itens por página com controles Anterior/Próxima e indicador de páginas) tanto na tela principal do Catálogo quanto no modal de seleção de exercícios',
        'Pesquisa em tempo real com busca instantânea por nome, músculo primário, grupo muscular, sinergistas e equipamentos'
      ]
    },
    {
      version: 'v1.5.5',
      date: '24/09/2026',
      description: 'Refatoração da aba Treinos: navegação exclusiva pelo menu lateral, expansão de ficha em janela sobreposta e catálogo de exercícios padrão.',
      highlights: [
        'Remoção das sub-abas de navegação do cabeçalho da aba Treinos, mantendo a navegação 100% centralizada nas sub-abas do menu lateral',
        'Novo botão "Expandir Ficha" no card de treino do aluno, abrindo uma janela sobreposta (modal com backdrop blur) que exibe a ficha completa detalhada com séries, repetições, carga, descanso, métodos e impressão',
        'Exibição direta da interface de consulta/pesquisa biomecânica completa (+1.400 exercícios) logo ao clicar na sub-aba "Catálogo de Exercícios", sem a necessidade de clicar em botão para abri-la',
        'Ações integradas na visualização expandida: impressão profissional, WhatsApp/PDF, edição e execução no app'
      ]
    },
    {
      version: 'v1.5.4',
      date: '24/09/2026',
      description: 'Remoção do cabeçalho/barra de sub-abas dentro da tela central do Financeiro.',
      highlights: [
        'Remoção completa dos indicadores e blocos de sub-abas dentro do cabeçalho da tela central do Financeiro',
        'Navegação do módulo Financeiro centralizada 100% de forma exclusiva através das sub-abas do menu lateral (Contas a Receber, Contas a Pagar, DRE Gerencial e Extrato Completo)',
        'Área central limpa e focada diretamente nos dados financeiros com transição suave fade-in'
      ]
    },
    {
      version: 'v1.5.3',
      date: '24/09/2026',
      description: 'Implementação de animações suaves de transição (fade-in) na alternância entre abas e sub-abas.',
      highlights: [
        'Transição suave com fade-in e sutil deslocamento vertical (translateY) ao alternar entre quaisquer abas principais do sistema',
        'Animações reativas e fluidas aplicadas também nas trocas de sub-abas nos módulos Dashboards, Financeiro, CRM, Agenda, Treinos e WhatsApp',
        'Curva de aceleração cúbica ergonômica (ease-out quint) de alta performance sem causar repaints desnecessários',
        'Suporte completo a acessibilidade com desativação automática para usuários com preferência por movimento reduzido (prefers-reduced-motion)'
      ]
    },
    {
      version: 'v1.5.2',
      date: '24/09/2026',
      description: 'Criação das sub-abas do Financeiro no menu lateral e remoção das sub-abas internas da tela central.',
      highlights: [
        'Criação das 4 sub-abas no menu lateral para a aba Financeiro: "Contas a Receber e Inadimplência", "Contas a Pagar", "DRE Gerencial" e "Extrato Completo"',
        'Remoção das sub-abas do menu superior interno da tela central do Financeiro, unificando a experiência de navegação com os demais módulos do sistema',
        'Suporte completo a modo recolhido (flyout menu flutuante) e modo expandido (accordion) para o módulo Financeiro na barra lateral',
        'Exibição de badge com quantidade de contas vencidas diretamente na sub-aba de Contas a Receber e no menu pai do Financeiro',
        'Correção de imports e estabilização de inicialização da aplicação'
      ]
    },
    {
      version: 'v1.5.1',
      date: '23/09/2026',
      description: 'Otimização e simplificação do menu superior da aplicação.',
      highlights: [
        'Menu superior simplificado mantendo exclusivamente a barra de pesquisa, ícone de notificações, ícone de interrogação (ajuda) e identificação do perfil',
        'Remoção de botões e atalhos intermediários desnecessários da barra superior para maior clareza visual e foco',
        'Novo menu interativo no ícone de interrogação com acesso rápido à Base de Conhecimento, Suporte Técnico e Atalhos do sistema',
        'Preservação da barra de pesquisa com busca dinâmica de clientes e leads'
      ]
    },
    {
      version: 'v1.5.0',
      date: '23/09/2026',
      description: 'Remoção da sub-aba redundante de Dashboard no módulo de WhatsApp.',
      highlights: [
        'Eliminação da sub-aba duplicada de Dashboards do módulo WhatsApp, centralizando os indicadores na aba principal de DASHBOARDS do sistema',
        'Definição do Atendimento ao Vivo como tela inicial padrão ao acessar o WhatsApp',
        'Simplificação da navegação lateral do WhatsApp, mantendo apenas as operações ativas: Atendimento, Kanban, Disparos, Chatbot, Contatos, Respostas Rápidas, Etiquetas e Conexão'
      ]
    },
    {
      version: 'v1.4.9',
      date: '23/09/2026',
      description: 'Criação da sub-aba de Etiquetas no WhatsApp com configuração avançada de cores, diretrizes e integração ao Kanban e atendimento.',
      highlights: [
        'Criação da nova sub-aba "Etiquetas" no menu lateral do WhatsApp com listagem, criação, edição e exclusão de etiquetas personalizadas',
        'Configuração precisa de cada etiqueta: nome obrigatório, seletor de cores vivas com paleta prévia e código hexadecimal, e diretrizes/descrição de uso opcional',
        'Substituição de tags livres por etiquetas estruturadas no Atendimento ao Vivo, com badges coloridos e seletor rápido no perfil do contato',
        'Controle dinâmico do Kanban através de barra de filtros por etiquetas e badges coloridos nos cards de oportunidade',
        'Identificação visual rápida e clara em toda a esteira de conversas e clientes do WhatsApp'
      ]
    },
    {
      version: 'v1.4.8',
      date: '23/09/2026',
      description: 'Validação e consolidação da integridade do módulo WhatsApp e build do sistema.',
      highlights: [
        'Verificação completa de integridade dos tipos e compilação de todas as 8 sub-abas de WhatsApp',
        'Consolidação dos seletores laterais e do estado de navegação reativo entre abas e sub-abas',
        'Validação bem-sucedida do linter TypeScript e compilação do bundle de produção'
      ]
    },
    {
      version: 'v1.4.7',
      date: '23/09/2026',
      description: 'Estruturação do módulo WhatsApp em sub-abas no menu lateral e limpeza do menu superior.',
      highlights: [
        'Criação de sub-abas dedicadas no menu lateral para o WhatsApp: DASHBOARDS, Atendimento, Kanban, Disparos, Chatbot, Contatos, Respostas Rápidas e Conexão',
        'Remoção das opções horizontais do menu superior do WhatsApp, centralizando a navegação exclusivamente na barra lateral',
        'Comportamento harmônico de sanfona: clicar na aba principal WhatsApp expande/recolhe as sub-abas sem alterar a tela central até o clique na sub-aba',
        'Barra de status no topo do módulo com identificação clara da sub-aba ativa e indicador de conexão em tempo real',
        'Suporte completo a flyout flutuante quando a barra lateral estiver recolhida'
      ]
    },
    {
      version: 'v1.4.6',
      date: '23/09/2026',
      description: 'Comportamento inteligente de expansão dos menus laterais com sub-abas sem alterar a tela central.',
      highlights: [
        'Ao clicar em uma aba principal com sub-abas (Dashboards, CRM, Agenda, Treino), apenas o sanfona de sub-abas é expandido ou recolhido',
        'A tela central não é alterada ao clicar no cabeçalho do menu, permanecendo intacta até a seleção explícita da sub-aba desejada',
        'Sincronização automática para manter a sub-aba expandida quando ativada por atalhos rápidos ou busca',
        'Preservação do drawer aberto no modo mobile durante a expansão para facilitar a escolha da sub-aba'
      ]
    },
    {
      version: 'v1.4.5',
      date: '23/09/2026',
      description: 'Rolagem isolada para menus laterais e fixação permanente dos atalhos superiores.',
      highlights: [
        'Separação definitiva da barra de rolagem do menu lateral, permitindo navegar pelos itens sem rolar o conteúdo central',
        'Cabeçalho superior e atalhos rápidos (Novo Cliente, Nova Venda, Catraca, Nova Oportunidade) permanentemente fixos no topo da tela',
        'Barra de rolagem estilizada e independente para a área central da aplicação (.custom-main-scrollbar e .custom-sidebar-scrollbar)',
        'Barra de ações rápidas e saudações na aba Início configurada com fixação sticky suave para navegação ininterrupta'
      ]
    },
    {
      version: 'v1.4.4',
      date: '23/09/2026',
      description: 'Bloqueio estrito de permissões de abas, tela de acesso restrito e edição granular de permissões.',
      highlights: [
        'Efetivação de bloqueio total de abas e módulos não autorizados para usuários comuns e perfis restritos',
        'Criação de tela nativa de Acesso Restrito com explicação da regra do Administrador e redirecionamento direto',
        'Novo modal completo "Editar Usuário e Permissões" com seleção por categorias (Geral, Clientes, Operacional, Gestão)',
        'Atualização dos atalhos rápidos do Cabeçalho e Painel Inicial para ocultar opções restritas a cada perfil'
      ]
    },
    {
      version: 'v1.4.3',
      date: '22/09/2026',
      description: 'Correção crítica na autenticação multiusuário e separação definitiva de contas e perfis de acesso.',
      highlights: [
        'Resolução do erro onde novos usuários cadastrados (ex: testeacesso@gmail.com) assumiam a identidade do administrador',
        'Criação do serviço centralizado userService para autenticação e gerenciamento de perfis de sessão ativos',
        'Tela de login dinâmica com listagem de usuários do sistema, seleção rápida e suporte a credenciais próprias',
        'Sincronização dinâmica do usuário ativo no cabeçalho (Header), na barra lateral (Sidebar) e na aba de Configurações'
      ]
    },
    {
      version: 'v1.4.2',
      date: '22/09/2026',
      description: 'Implementação do botão e fluxo completo de cadastro e gestão de usuários do sistema na aba de Configurações.',
      highlights: [
        'Botão "Cadastrar Usuário" integrado diretamente ao cabeçalho da seção de usuários nas Configurações',
        'Modal completo para cadastro com nome, e-mail, perfil/cargo, telefone, senha inicial e turno/setor',
        'Seleção e personalização granular de módulos e telas com permissão de acesso liberada',
        'Listagem dinâmica com busca instantânea, badges de perfil, alternância de status ativo/inativo e persistência local'
      ]
    },
    {
      version: 'v1.4.1',
      date: '22/09/2026',
      description: 'Adicionada nota de rodapé persistente com monitoramento dinâmico de versão e histórico de atualizações.',
      highlights: [
        'Rodapé dinâmico exibindo a versão corrente do sistema',
        'Modal interativo de Notas de Versão e Registro de Mudanças (Changelog)',
        'Centralização do versionamento para incrementos contínuos a cada modificação'
      ]
    },
    {
      version: 'v1.4.0',
      date: '22/09/2026',
      description: 'Roteamento interno obrigatório de todos os botões de WhatsApp do sistema.',
      highlights: [
        'Abertura direta na aba de WhatsApp interno com o número cadastrado no perfil',
        'Eliminação de links externos para aplicativos externos do dispositivo',
        'Criação automática e enriquecimento de conversas com dados do perfil do aluno ou lead'
      ]
    },
    {
      version: 'v1.3.0',
      date: '22/09/2026',
      description: 'Implementação das funções de prescrição de treinos inspiradas no avaliaçaofisica.app.',
      highlights: [
        'Catálogo de exercícios com filtros por grupo muscular e equipamento',
        'Modal de prescrição avançada com séries, descanso, métodos e cadência',
        'Treino do Dia interativo, Controle de Carga e Testes Físicos/Avaliação'
      ]
    },
    {
      version: 'v1.2.0',
      date: '21/09/2026',
      description: 'Módulo WhatsApp Multi-Atendimento e CRM integrado.',
      highlights: [
        'Atendimento com filas, chatbot, respostas rápidas e histórico persistido',
        'Funil de vendas CRM (Kanban) e gestão de atividades'
      ]
    }
  ]
};

export const CURRENT_SYSTEM_VERSION = SYSTEM_VERSION_INFO.version;
