import { TabType } from '../types';

export interface TabConfigField {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'number' | 'text' | 'select';
  value: any;
  options?: { value: string; label: string }[];
  unit?: string;
}

export interface TabConfigGroup {
  id: string;
  title: string;
  description: string;
  fields: TabConfigField[];
}

export interface TabConfiguration {
  tab: TabType;
  subTab?: string;
  title: string;
  description: string;
  groups: TabConfigGroup[];
}

const STORAGE_KEY = 'vbsport_tab_configurations';

export const DEFAULT_TAB_CONFIGURATIONS: Record<string, TabConfiguration> = {
  // 1. INÍCIO
  inicio: {
    tab: 'inicio',
    title: 'Painel Inicial',
    description: 'Parâmetros de exibição, metas do dia e atalhos rápidos da visão geral.',
    groups: [
      {
        id: 'geral',
        title: 'Indicadores do Dia & Métricas',
        description: 'Personalize os cards e limiares de faturamento exibidos no topo.',
        fields: [
          { id: 'meta_diaria_faturamento', label: 'Meta de Faturamento Diário (R$)', description: 'Valor esperado de faturamento diário para cálculo da barra de progresso', type: 'number', value: 1200, unit: 'R$' },
          { id: 'alerta_inadimplentes_inicio', label: 'Card de Atenção a Inadimplentes', description: 'Destacar alertas de mensalidades em atraso no painel', type: 'toggle', value: true }
        ]
      },
      {
        id: 'atalhos',
        title: 'Atalhos e Ações Rápidas',
        description: 'Configure botões rápidos visíveis para a equipe de atendimento.',
        fields: [
          { id: 'quick_sale_enabled', label: 'Habilitar PDV Rápido', description: 'Atalho para abertura rápida de vendas no balcão', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // 2. DASHBOARDS
  dashboards_gerencial: {
    tab: 'dashboards',
    subTab: 'gerencial',
    title: 'Dashboards • Visão Gerencial',
    description: 'Parâmetros analíticos e metas do módulo de Business Intelligence.',
    groups: [
      {
        id: 'bi_gerencial',
        title: 'Metas & Indicadores Executivos',
        description: 'Metas de receita mensal e ticket médio para comparativos dos gráficos.',
        fields: [
          { id: 'meta_mensal_receita', label: 'Meta de Faturamento Mensal (R$)', description: 'Linha de base para os gráficos de desempenho mensal', type: 'number', value: 50000, unit: 'R$' },
          { id: 'periodo_graficos', label: 'Janela Temporal Padrão', description: 'Período padrão ao abrir os relatórios de BI', type: 'select', value: '30_dias', options: [
            { value: '7_dias', label: 'Últimos 7 dias' },
            { value: '30_dias', label: 'Últimos 30 dias' },
            { value: '90_dias', label: 'Último Trimestre' },
            { value: 'ano_atual', label: 'Ano Vigente' }
          ] },
          { id: 'incluir_previsao_recorrente', label: 'Considerar Projeção de Recorrência', description: 'Projetar receitas automáticas de cartão no gráfico futuro', type: 'toggle', value: true }
        ]
      }
    ]
  },

  dashboards_retencao: {
    tab: 'dashboards',
    subTab: 'retencao',
    title: 'Dashboards • Retenção & Churn',
    description: 'Critérios para identificação de risco de evasão e corte de frequência.',
    groups: [
      {
        id: 'retencao_rules',
        title: 'Regras de Alerta de Evasão',
        description: 'Defina os dias sem treino para acionar o protocolo de retenção de alunos.',
        fields: [
          { id: 'dias_inatividade_churn', label: 'Dias de Ausência para Alerta de Churn', description: 'Alunos ausentes nos treinos por este período são marcados em risco', type: 'number', value: 10, unit: 'dias' },
          { id: 'auto_tag_risco', label: 'Etiquetagem Automática no CRM', description: 'Enviar automaticamente para a coluna de resgate no CRM', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // 3. CLIENTES / ALUNOS
  clientes: {
    tab: 'clientes',
    title: 'Clientes & Alunos',
    description: 'Regras cadastrais, carência e políticas de inadimplência.',
    groups: [
      {
        id: 'cadastro',
        title: 'Políticas Cadastrais & Contratuais',
        description: 'Definições sobre exigência de documentos e termos na matrícula.',
        fields: [
          { id: 'exigir_cpf_valido', label: 'Validação Rígida de CPF', description: 'Impede o cadastro de alunos sem CPF devidamente validado', type: 'toggle', value: true },
          { id: 'exigir_anamnese_medica', label: 'Exigir Questionário de Saúde (PAR-Q)', description: 'Alerta a recepção se o aluno não responder o questionário de saúde', type: 'toggle', value: true },
          { id: 'termo_adesao_digital', label: 'Assinatura Digital de Contrato', description: 'Enviar termo de adesão para assinatura eletrônica via WhatsApp', type: 'toggle', value: true }
        ]
      },
      {
        id: 'carencia_bloqueio',
        title: 'Tolerância Financeira',
        description: 'Configurações de carência e tolerância para mensalidades em atraso.',
        fields: [
          { id: 'dias_carencia_inadimplente', label: 'Dias de Tolerância Após Vencimento', description: 'Número de dias de carência antes de considerar o aluno como inadimplente', type: 'number', value: 3, unit: 'dias' }
        ]
      }
    ]
  },

  // 4. PROFESSORES
  professores_folha_ponto: {
    tab: 'professores',
    subTab: 'folha_ponto',
    title: 'Professores • Folha de Ponto',
    description: 'Parâmetros de ponto eletrônico, tolerância de entrada/saída e banco de horas.',
    groups: [
      {
        id: 'ponto_rules',
        title: 'Regras da Jornada & Tolerância',
        description: 'Parametrização legal da CLT e regras internas para marcação.',
        fields: [
          { id: 'tolerancia_minutos', label: 'Tolerância de Marcação (minutos)', description: 'Minutos aceitos de variação na entrada e saída sem gerar atraso/extra', type: 'number', value: 10, unit: 'min' },
          { id: 'bloquear_marca_fora_raio', label: 'Geofencing / Raio de Presença', description: 'Exigir que o professor esteja conectado ao Wi-Fi ou IP da unidade', type: 'toggle', value: true },
          { id: 'banco_horas_ativo', label: 'Acúmulo Automático em Banco de Horas', description: 'Horas excedentes são creditadas automaticamente no espelho de ponto', type: 'toggle', value: true }
        ]
      }
    ]
  },

  professores_tarefas: {
    tab: 'professores',
    subTab: 'tarefas',
    title: 'Professores • Tarefas',
    description: 'Checklists diários da musculação e rotinas técnicas dos professores.',
    groups: [
      {
        id: 'tarefas_rules',
        title: 'Checklists & Inspeções',
        description: 'Rotinas operacionais de abertura, fechamento e vistoria de aparelhos.',
        fields: [
          { id: 'exigir_checklist_abertura', label: 'Obrigatoriedade de Checklist de Abertura', description: 'Cobrar preenchimento do checklist nos primeiros 30min do turno', type: 'toggle', value: true },
          { id: 'notificar_coordenacao_atraso', label: 'Alertar Coordenação de Pendências', description: 'Notificar gestor caso tarefas essenciais não sejam cumpridas no prazo', type: 'toggle', value: true }
        ]
      }
    ]
  },

  professores_agenda: {
    tab: 'professores',
    subTab: 'agenda',
    title: 'Professores • Agenda',
    description: 'Escalas de aulas, regras de substituição de professores e plantões.',
    groups: [
      {
        id: 'agenda_prof_rules',
        title: 'Escalas & Substituições',
        description: 'Antecedência para pedidos de folgas e trocas de aulas coletivas.',
        fields: [
          { id: 'antecedencia_substituicao', label: 'Antecedência Mínima para Substituição (horas)', description: 'Prazo limite para o professor solicitar troca de aula sem penalidade', type: 'number', value: 12, unit: 'horas' },
          { id: 'notificar_alunos_substituicao', label: 'Avisar Alunos Matriculados na Turma', description: 'Disparar WhatsApp avisando que a aula terá professor substituto', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // 5. CRM
  crm_leads: {
    tab: 'crm',
    subTab: 'leads',
    title: 'CRM • Funil de Leads',
    description: 'Automações de novos contatos, tempo de resposta e regras de distribuição.',
    groups: [
      {
        id: 'leads_rules',
        title: 'Gestão de Oportunidades',
        description: 'Velocidade de atendimento e triagem automática de novos leads.',
        fields: [
          { id: 'alerta_lead_sem_contato', label: 'Tempo Máximo Sem Contato (horas)', description: 'Destacar leads que aguardam primeiro contato após este período', type: 'number', value: 2, unit: 'horas' },
          { id: 'auto_distribuicao_leads', label: 'Distribuição Automática de Leads (Rodízio)', description: 'Distribuir novos contatos igualmente entre os consultores de vendas', type: 'toggle', value: true },
          { id: 'disparar_boas_vindas', label: 'Mensagem de Boas-Vindas Imediata', description: 'Disparar mensagem no WhatsApp assim que o lead preencher o formulário', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // 6. AGENDA & TURMAS
  agenda_calendario: {
    tab: 'agenda',
    subTab: 'calendario',
    title: 'Agenda • Calendário & Turmas',
    description: 'Horários de funcionamento, capacidade e regras de check-in em turmas.',
    groups: [
      {
        id: 'chamada_professor',
        title: 'Controle de Chamada & Presença do Professor',
        description: 'Configure o sinal e formato utilizado pelo professor para registrar a frequência dos alunos.',
        fields: [
          { 
            id: 'modo_chamada_professor', 
            label: 'Modo de Chamada da Turma', 
            description: 'Escolha se o professor usará o sinal de dedão (👍 Presença / 👎 Falta) ou o botão tradicional', 
            type: 'select', 
            value: 'dedao', 
            options: [
              { value: 'dedao', label: 'Sinal de Dedão (👍 Dedão pra Cima = Presença / 👎 Dedão pra Baixo = Falta)' },
              { value: 'tradicional', label: 'Botão Tradicional (Confirmar Presença / Desfazer)' }
            ] 
          },
          { 
            id: 'feedback_sonoro_chamada', 
            label: 'Feedback Sonoro ao Marcar Chamada', 
            description: 'Emitir bipe sonoro suave de confirmação ao registrar presença ou falta', 
            type: 'toggle', 
            value: true 
          }
        ]
      },
      {
        id: 'agenda_rules',
        title: 'Regras de Grade & Agendamento',
        description: 'Controle de capacidade de turmas e prazos de cancelamento.',
        fields: [
          { id: 'antecedencia_cancelamento_aula', label: 'Antecedência para Cancelar Vaga (minutos)', description: 'Tempo mínimo para o aluno desmarcar aula sem perder a diária/crédito', type: 'number', value: 60, unit: 'min' },
          { id: 'limite_fila_espera', label: 'Fila de Espera Automática', description: 'Promover automaticamente o próximo aluno da fila se houver desistência', type: 'toggle', value: true },
          { id: 'duracao_padrao_aula', label: 'Duração Padrão das Aulas (minutos)', description: 'Tempo padrão sugerido ao criar uma nova turma na grade', type: 'number', value: 50, unit: 'min' }
        ]
      }
    ]
  },

  // 7. TREINO
  treino_plano_treino: {
    tab: 'treino',
    subTab: 'plano_treino',
    title: 'Treinos • Plano de Treino',
    description: 'Parâmetros de periodização, macrociclos e distribuição de volume semanal.',
    groups: [
      {
        id: 'plano_rules',
        title: 'Periodização & Macrociclos',
        description: 'Regras de planejamento de médio e longo prazo dos alunos.',
        fields: [
          { id: 'duracao_mesociclo_semanas', label: 'Duração Padrão do Mesociclo (semanas)', description: 'Quantidade de semanas de cada ciclo antes de rodar nova fase', type: 'number', value: 6, unit: 'sem' },
          { id: 'alerta_deload_automatico', label: 'Sugerir Semana Regenerativa (Deload)', description: 'Sugerir automaticamente semana de recuperação ativa ao final do ciclo', type: 'toggle', value: true },
          { id: 'divisao_padrao', label: 'Divisão Semanal Recomendada', description: 'Estrutura sugerida para novos planos', type: 'select', value: 'abcd', options: [
            { value: 'fullbody', label: 'Fullbody (3x por semana)' },
            { value: 'ab', label: 'Upper / Lower (AB)' },
            { value: 'abc', label: 'Push / Pull / Legs (ABC)' },
            { value: 'abcd', label: 'ABCD Tradicional' },
            { value: 'abcde', label: 'ABCDE Foco Isolado' }
          ] }
        ]
      }
    ]
  },

  treino_prescricao: {
    tab: 'treino',
    subTab: 'prescricao',
    title: 'Treinos • Prescrição de Fichas',
    description: 'Validade de fichas de treino, cálculo de carga e convenções metodológicas.',
    groups: [
      {
        id: 'treino_rules',
        title: 'Parâmetros de Montagem & Validade',
        description: 'Configuração da rotina de prescrição e alertas de vencimento.',
        fields: [
          { id: 'validade_padrao_dias', label: 'Validade Padrão da Ficha de Treino (dias)', description: 'Tempo para a ficha expirar e solicitar atualização da rotina', type: 'number', value: 60, unit: 'dias' },
          { id: 'alerta_treino_vencendo', label: 'Alertar Treinador com Antecedência (dias)', description: 'Notificar o professor antes da ficha do aluno expirar', type: 'number', value: 7, unit: 'dias' },
          { id: 'permitir_registro_carga_aluno', label: 'Permitir Aluno Registrar Carga no App', description: 'Aluno pode atualizar os quilos utilizados durante a execução', type: 'toggle', value: true },
          { id: 'formula_1rm', label: 'Fórmula Padrão para Cálculo de 1RM', description: 'Equação matemática utilizada na estimativa de força máxima', type: 'select', value: 'brzycki', options: [
            { value: 'brzycki', label: 'Brzycki (Mais precisa para 1 a 10 reps)' },
            { value: 'epley', label: 'Epley (Muito utilizada em força)' },
            { value: 'lombardi', label: 'Lombardi' }
          ] }
        ]
      }
    ]
  },

  // 8. BEM-ESTAR
  bem_estar_checkin: {
    tab: 'bem_estar',
    subTab: 'checkin',
    title: 'Bem-Estar • Check-in & Prontidão',
    description: 'Parâmetros de prontidão, Índice Hooper, limiares de sono e dor muscular.',
    groups: [
      {
        id: 'hooper_rules',
        title: 'Limiares do Índice Hooper & Alertas',
        description: 'Definição dos níveis de corte para estresse, sono, fadiga e dor.',
        fields: [
          { id: 'limite_dor_alerta_treinador', label: 'Limiar de Dor EVA para Acionar Treinador', description: 'Notas de dor acima deste valor alertam o professor no início do treino', type: 'number', value: 5, unit: 'EVA (0-10)' },
          { id: 'score_prontidao_critico', label: 'Prontidão Crítica (Hooper Elevado)', description: 'Pontuação Hooper que aciona bandeira vermelha no painel', type: 'number', value: 20, unit: 'pts' },
          { id: 'exigir_checkin_matinal', label: 'Sugerir Check-in Antes do Treino', description: 'Sugerir preenchimento diário do questionário de prontidão', type: 'toggle', value: true },
          { id: 'notificar_whatsapp_coach', label: 'Notificar Coach em Dores Fortes (EVA >= 7)', description: 'Disparar alerta direto no WhatsApp do treinador responsável', type: 'toggle', value: true }
        ]
      }
    ]
  },

  bem_estar_mapa_dor: {
    tab: 'bem_estar',
    subTab: 'mapa_dor',
    title: 'Bem-Estar • Mapa Anatômico de Dor',
    description: 'Configuração do manequim anatômico, regiões corporais e histórico.',
    groups: [
      {
        id: 'manequim_rules',
        title: 'Visualização Anatômica & Regras',
        description: 'Ajuste a sensibilidade de exibição das divisões musculares.',
        fields: [
          { id: 'destacar_dores_cronicas', label: 'Realçar Dores Persistentes (>3 dias)', description: 'Colorir em vermelho pulsante regiões com dor relatada recorrente', type: 'toggle', value: true },
          { id: 'limiar_eva_minimo_mapa', label: 'Grau Mínimo de Dor para Registro', description: 'Nota mínima da Escala EVA para exigir gravação no boneco', type: 'number', value: 2, unit: 'EVA' }
        ]
      }
    ]
  },

  // 9. FINANCEIRO
  financeiro_receber: {
    tab: 'financeiro',
    subTab: 'receber',
    title: 'Financeiro • Contas a Receber',
    description: 'Régua de cobrança automática, juros de mora e multas por atraso.',
    groups: [
      {
        id: 'cobranca_rules',
        title: 'Juros, Multas & Régua de Cobrança',
        description: 'Definições financeiras aplicadas a mensalidades e parcelas em aberto.',
        fields: [
          { id: 'multa_atraso_percentual', label: 'Multa por Atraso (%)', description: 'Percentual fixo aplicado logo após o vencimento da mensalidade', type: 'number', value: 2.0, unit: '%' },
          { id: 'juros_diarios_percentual', label: 'Juros de Mora Diários (%)', description: 'Juros aplicados por dia de atraso sobre o valor original', type: 'number', value: 0.033, unit: '%/dia' },
          { id: 'enviar_aviso_vencimento_3dias', label: 'Lembrete no WhatsApp 3 Dias Antes', description: 'Avisar o aluno com antecedência para evitar atrasos involuntários', type: 'toggle', value: true },
          { id: 'enviar_cobranca_dia_vencimento', label: 'Mensagem no Dia do Vencimento com Chave PIX', description: 'Disparar QR Code e código Copia e Cola no dia do pagamento', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // 10. WHATSAPP
  whatsapp: {
    tab: 'whatsapp',
    title: 'WhatsApp • Multi-Atendimento',
    description: 'Filas de conversa, mensagem de ausência e delay de segurança anti-bloqueio.',
    groups: [
      {
        id: 'wpp_rules',
        title: 'Segurança & Filas de Atendimento',
        description: 'Parâmetros de entrega e proteção do número corporativo.',
        fields: [
          { id: 'anti_ban_delay', label: 'Intervalo Anti-Ban nos Disparos (segundos)', description: 'Pausa aleatória entre envios em lote para proteger a conta', type: 'number', value: 8, unit: 'seg' },
          { id: 'msg_ausencia_ativa', label: 'Mensagem Automática Fora do Horário', description: 'Responder automaticamente fora do expediente com o horário de retorno', type: 'toggle', value: true },
          { id: 'fechamento_automatico_horas', label: 'Encerrar Conversas Sem Resposta (horas)', description: 'Mover para finalizados chamados que o aluno não respondeu', type: 'number', value: 24, unit: 'horas' }
        ]
      }
    ]
  },

  // 11. VENDAS & PDV
  vendas: {
    tab: 'vendas',
    title: 'Vendas & PDV no Balcão',
    description: 'Políticas de desconto, limites de comanda e comprovante não fiscal.',
    groups: [
      {
        id: 'pdv_rules',
        title: 'Regras do Caixa & Ponto de Venda',
        description: 'Parâmetros de permissão de descontos e formas de recebimento.',
        fields: [
          { id: 'desconto_maximo_sem_gerente', label: 'Desconto Máximo Sem Senha Gerencial (%)', description: 'Percentual de desconto que o operador pode conceder sem autorização', type: 'number', value: 10, unit: '%' },
          { id: 'imprimir_recibo_automatico', label: 'Imprimir Cupom/Comprovante Automaticamente', description: 'Enviar para impressora térmica assim que a venda for concluída', type: 'toggle', value: true },
          { id: 'bloquear_venda_aluno_bloqueado', label: 'Bloquear Vendas a Prazo para Inadimplentes', description: 'Impede inclusão de novos débitos em comanda para alunos em atraso', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // 12. COMANDAS
  comandas: {
    tab: 'comandas',
    title: 'Lanchonete da Empresa',
    description: 'Controle de consumo na lanchonete, limite de crédito e pedidos dos alunos.',
    groups: [
      {
        id: 'comandas_rules',
        title: 'Crédito & Faturamento',
        description: 'Regras para compras fiado e cobrança na mensalidade do aluno.',
        fields: [
          { id: 'limite_credito_aluno', label: 'Limite Máximo de Débito por Aluno (R$)', description: 'Teto de consumo antes de exigir liquidação do saldo devedor', type: 'number', value: 150, unit: 'R$' },
          { id: 'permitir_comanda_avulsa', label: 'Permitir Comandas sem Aluno Vinculado', description: 'Abrir comanda para visitantes ou consumações imediatas', type: 'toggle', value: true },
          { id: 'auto_lancar_fatura', label: 'Incluir Saldo Devedor na Mensalidade', description: 'Somar automaticamente consumos pendentes no próximo boleto/pix', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // 12. ESTOQUE
  estoque: {
    tab: 'estoque',
    title: 'Estoque & Suplementos',
    description: 'Ponto de reposição, alertas de estoque baixo e margens de venda.',
    groups: [
      {
        id: 'estoque_rules',
        title: 'Controle de Reposição',
        description: 'Notificações de reposição de suplementos, bebidas e vestuário.',
        fields: [
          { id: 'estoque_minimo_padrao', label: 'Estoque Mínimo Padrão para Alerta (unidades)', description: 'Quantidade que ativa o badge vermelho de reposição urgente', type: 'number', value: 5, unit: 'unid.' },
          { id: 'markup_sugerido', label: 'Margem Sugerida sobre Custo (%)', description: 'Margem sugerida ao cadastrar o preço de venda de um produto', type: 'number', value: 45, unit: '%' }
        ]
      }
    ]
  },

  // 13. NUTRIÇÃO
  nutricao: {
    tab: 'nutricao',
    title: 'Nutrição & Dietas',
    description: 'Fórmulas calóricas basais, metas de macros e tabelas nutricionais.',
    groups: [
      {
        id: 'nutricao_rules',
        title: 'Cálculos Nutricionais & Metas',
        description: 'Padrões adotados nas prescrições de planos alimentares.',
        fields: [
          { id: 'formula_tmb', label: 'Fórmula Padrão de Taxa Metabólica Basal (TMB)', description: 'Equação de referência para cálculo do gasto calórico diário', type: 'select', value: 'harris_benedict', options: [
            { value: 'harris_benedict', label: 'Harris-Benedict (Revisada 1984)' },
            { value: 'mifflin_st_jeor', label: 'Mifflin-St Jeor (Padrão ouro em obesidade/massa)' },
            { value: 'katch_mcardle', label: 'Katch-McArdle (Baseada em Massa Magra)' }
          ] },
          { id: 'meta_agua_ml_kg', label: 'Meta Diária de Hidratação (ml por kg de peso)', description: 'Recomendação base calculada para o cardápio do aluno', type: 'number', value: 35, unit: 'ml/kg' }
        ]
      }
    ]
  },

  // 15. GL PROFIT PAY (Sub-aba do Financeiro & Gateway)
  financeiro_gl_profit_pay: {
    tab: 'financeiro',
    subTab: 'gl_profit_pay',
    title: 'GL Profit Pay • Cobrança Recorrente',
    description: 'Cobrança recorrente no cartão, retentativas automáticas e links de pagamento.',
    groups: [
      {
        id: 'pay_rules',
        title: 'Regras de Transação & Retentativa',
        description: 'Políticas do gateway para recuperação de transações recusadas.',
        fields: [
          { id: 'retentativa_dias_1_3_7', label: 'Retentativas Inteligentes nos Dias 1, 3 e 7', description: 'Reprocessar automaticamente cartões que falharam por saldo insuficiente', type: 'toggle', value: true },
          { id: 'validade_link_horas', label: 'Validade dos Links de Pagamento (horas)', description: 'Tempo até o link expirar para segurança do pagamento', type: 'number', value: 48, unit: 'horas' },
          { id: 'aceitar_pix_automatico', label: 'Geração Instantânea de QR Code PIX Dinâmico', description: 'Conciliação imediata de pagamentos PIX', type: 'toggle', value: true }
        ]
      }
    ]
  },

  pay: {
    tab: 'pay',
    title: 'GL Profit Pay (Gateway & Cobranças)',
    description: 'Cobrança recorrente no cartão, retentativas automáticas e links.',
    groups: [
      {
        id: 'pay_rules',
        title: 'Regras de Transação & Retentativa',
        description: 'Políticas do gateway para recuperação de transações recusadas.',
        fields: [
          { id: 'retentativa_dias_1_3_7', label: 'Retentativas Inteligentes nos Dias 1, 3 e 7', description: 'Reprocessar automaticamente cartões que falharam por saldo insuficiente', type: 'toggle', value: true },
          { id: 'validade_link_horas', label: 'Validade dos Links de Pagamento (horas)', description: 'Tempo até o link expirar para segurança do pagamento', type: 'number', value: 48, unit: 'horas' },
          { id: 'aceitar_pix_automatico', label: 'Geração Instantânea de QR Code PIX Dinâmico', description: 'Conciliação imediata de pagamentos PIX', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // AVALIAÇÕES FÍSICAS
  avaliacoes: {
    tab: 'avaliacoes',
    title: 'Avaliações Físicas & Protocolos',
    description: 'Protocolos de Pollock 7 dobras, bioimpedância, testes e card inicial de biometria.',
    groups: [
      {
        id: 'avaliacoes_rules',
        title: 'Protocolos & Parâmetros de Avaliação',
        description: 'Definições sobre obrigatoriedade do card de peso/altura e fórmulas de gordura corporal.',
        fields: [
          { id: 'exigir_biometria_inicial', label: 'Exigir Card Inicial de Peso e Altura', description: 'Card sobreposto obrigatório antes de prosseguir com os testes', type: 'toggle', value: true },
          { id: 'formula_densidade_padrao', label: 'Fórmula Padrão de Dobras', description: 'Equação de referência para predição da densidade corporal', type: 'select', value: 'pollock_7', options: [
            { value: 'pollock_7', label: 'Pollock 7 Dobras (Padrão Ouro)' },
            { value: 'pollock_3', label: 'Pollock 3 Dobras' },
            { value: 'guedes_3', label: 'Guedes 3 Dobras' }
          ] },
          { id: 'alerta_reavaliacao_dias', label: 'Período Recomendado de Reavaliação (dias)', description: 'Intervalo sugerido para reagendamento de nova avaliação física', type: 'number', value: 60, unit: 'dias' }
        ]
      }
    ]
  },

  // 16. RELATÓRIOS
  relatorios: {
    tab: 'relatorios',
    title: 'Relatórios & Exportações',
    description: 'Configurações de relatórios fiscais, timbrados e exportação de dados.',
    groups: [
      {
        id: 'relatorios_rules',
        title: 'Formatação & Cabeçalhos',
        description: 'Informações presentes nos documentos exportados em PDF e planilhas.',
        fields: [
          { id: 'incluir_logo_timbrado', label: 'Incluir Logotipo nos Relatórios PDF', description: 'Imprimir cabeçalho oficial da VB SPORT nos comprovantes', type: 'toggle', value: true },
          { id: 'incluir_dados_fiscais', label: 'Exibir CNPJ e Endereço Completo no Rodapé', description: 'Atende às exigências contábeis de comprovação de serviços prestados', type: 'toggle', value: true }
        ]
      }
    ]
  },

  // 17. CONFIGURAÇÕES
  configuracoes: {
    tab: 'configuracoes',
    title: 'Configurações Gerais da Academia',
    description: 'Parâmetros institucionais, chave PIX e gerenciamento de permissões.',
    groups: [
      {
        id: 'geral_rules',
        title: 'Parâmetros Gerais do Sistema',
        description: 'Regras aplicadas globalmente em toda a estrutura do software.',
        fields: [
          { id: 'modo_manutencao', label: 'Bloqueio de Manutenção Geral', description: 'Restringe acesso apenas a usuários administradores', type: 'toggle', value: false },
          { id: 'auditoria_logs', label: 'Registro Detalhado de Auditoria (Logs)', description: 'Registra todas as ações e alterações realizadas por usuários', type: 'toggle', value: true }
        ]
      }
    ]
  }
};

/**
 * Retorna as configurações armazenadas ou padrão para a combinação de aba e sub-aba.
 */
export const getTabConfiguration = (tab: TabType, subTab?: string): TabConfiguration => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const storedMap: Record<string, TabConfiguration> = saved ? JSON.parse(saved) : {};

    const keyWithSub = subTab ? `${tab}_${subTab}` : tab;
    
    // Procura chave específica com subTab, depois sem subTab, ou usa a primeira disponível para a aba
    if (storedMap[keyWithSub]) return storedMap[keyWithSub];
    if (DEFAULT_TAB_CONFIGURATIONS[keyWithSub]) return DEFAULT_TAB_CONFIGURATIONS[keyWithSub];
    
    if (storedMap[tab]) return storedMap[tab];
    if (DEFAULT_TAB_CONFIGURATIONS[tab]) return DEFAULT_TAB_CONFIGURATIONS[tab];

    // Fallback genérico caso a sub-aba ainda não tenha chave específica
    const genericParent = DEFAULT_TAB_CONFIGURATIONS[tab] || {
      tab,
      subTab,
      title: `Configurações de ${tab.toUpperCase()}`,
      description: `Parâmetros e personalizações operacionais para a aba ${tab}.`,
      groups: [
        {
          id: 'padrao',
          title: 'Parâmetros Operacionais',
          description: 'Ajustes rápidos de funcionamento do módulo.',
          fields: [
            { id: 'notificacoes_ativas', label: 'Notificações Ativas neste Módulo', description: 'Emitir avisos sonoros e pop-ups sobre alterações no módulo', type: 'toggle', value: true },
            { id: 'exibir_dicas_ajuda', label: 'Exibir Dicas e Tooltips de Ajuda', description: 'Instruções contextuais para a equipe', type: 'toggle', value: true }
          ]
        }
      ]
    };

    return {
      ...genericParent,
      subTab,
      title: subTab ? `${genericParent.title} (${subTab.toUpperCase()})` : genericParent.title
    };
  } catch (error) {
    console.error('Erro ao ler configurações de aba:', error);
    return DEFAULT_TAB_CONFIGURATIONS[tab] || {
      tab,
      title: `Configurações: ${tab}`,
      description: 'Ajuste os parâmetros deste módulo.',
      groups: []
    };
  }
};

/**
 * Salva as alterações de configuração para uma aba/sub-aba.
 */
export const saveTabConfiguration = (config: TabConfiguration): void => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const storedMap: Record<string, TabConfiguration> = saved ? JSON.parse(saved) : {};
    
    const key = config.subTab ? `${config.tab}_${config.subTab}` : config.tab;
    storedMap[key] = config;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedMap));

    // Notificar componentes em tempo real sobre a atualização de configurações
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vbsport_tab_settings_changed', { 
        detail: { key, config, timestamp: Date.now() } 
      }));
    }

    // Sincronizar com banco de dados em nuvem
    import('./firebaseDbService').then(({ saveDocToFirestore }) => {
      saveDocToFirestore('tab_settings', { id: key, ...config });
    }).catch(err => {
      console.warn('Sync tab settings to firestore skipped:', err);
    });
  } catch (error) {
    console.error('Erro ao salvar configurações de aba:', error);
  }
};

/**
 * Restaura as configurações originais de uma aba.
 */
export const resetTabConfiguration = (tab: TabType, subTab?: string): TabConfiguration => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const storedMap: Record<string, TabConfiguration> = saved ? JSON.parse(saved) : {};
    
    const keyWithSub = subTab ? `${tab}_${subTab}` : tab;
    delete storedMap[keyWithSub];
    if (!subTab) delete storedMap[tab];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedMap));

    // Excluir do banco em nuvem
    import('./firebaseDbService').then(({ deleteDocFromFirestore }) => {
      deleteDocFromFirestore('tab_settings', keyWithSub);
    }).catch(err => {
      console.warn('Delete tab settings from firestore skipped:', err);
    });

    return getTabConfiguration(tab, subTab);
  } catch (error) {
    console.error('Erro ao resetar configurações de aba:', error);
    return getTabConfiguration(tab, subTab);
  }
};

// Auto-inicializar sincronização em tempo real das configurações de abas com o Firestore
if (typeof window !== 'undefined') {
  import('./firebaseDbService').then(({ subscribeToFirestoreCollection }) => {
    subscribeToFirestoreCollection('tab_settings', (remoteItems: any[]) => {
      try {
        if (!remoteItems || remoteItems.length === 0) return;
        const saved = localStorage.getItem(STORAGE_KEY);
        const storedMap: Record<string, TabConfiguration> = saved ? JSON.parse(saved) : {};
        let updated = false;

        for (const item of remoteItems) {
          if (item && item.id && item.tab && item.groups) {
            storedMap[item.id] = {
              tab: item.tab,
              subTab: item.subTab,
              title: item.title,
              description: item.description,
              groups: item.groups
            };
            updated = true;
          }
        }

        if (updated) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(storedMap));
        }
      } catch (err) {
        console.warn('Erro ao mesclar configurações remotas de aba:', err);
      }
    });
  }).catch(() => {});
}

export interface ActiveSubTabsContext {
  dashboardSubTab?: string;
  professoresSubTab?: string;
  crmSubTab?: string;
  agendaSubTab?: string;
  treinoSubTab?: string;
  avaliacoesSubTab?: string;
  nutricaoSubTab?: string;
  bemEstarSubTab?: string;
  whatsappSubTab?: string;
  financeiroSubTab?: string;
}

const TAB_DISPLAY_NAMES: Record<string, string> = {
  inicio: 'Início',
  dashboards: 'Dashboards',
  clientes: 'Clientes & Alunos',
  alunos: 'Clientes & Alunos',
  professores: 'Professores',
  crm: 'CRM & Vendas',
  agenda: 'Agenda',
  whatsapp: 'WhatsApp',
  pay: 'GL Profit Pay',
  financeiro: 'Financeiro',
  vendas: 'Vendas & PDV',
  estoque: 'Estoque',
  comandas: 'Lanchonete',
  treino: 'Treino',
  avaliacoes: 'Avaliações Físicas',
  nutricao: 'Nutrição',
  bem_estar: 'Bem-Estar',
  relatorios: 'Relatórios',
  empresas_clientes: 'Empresas Clientes',
  configuracoes: 'Configurações'
};

const SUBTAB_DISPLAY_NAMES: Record<string, string> = {
  // Dashboards
  gerencial: 'Visão Gerencial',
  retencao: 'Retenção & Churn',
  ticket: 'Ticket Médio & LTV',
  // Professores
  folha_ponto: 'Folha de Ponto',
  tarefas: 'Tarefas & Checklists',
  agenda: 'Agenda de Aulas',
  // CRM
  leads: 'Funil de Leads',
  kambam: 'Kanban Comercial',
  atividades: 'Atividades & Follow-up',
  automacoes: 'Automações & Gatilhos',
  pesquisas: 'Pesquisas de Satisfação',
  // Agenda
  calendario: 'Calendário Geral',
  grade: 'Grade de Turmas',
  locacoes: 'Locação de Quadras',
  jogos: 'Eventos de Jogos',
  eventos: 'Eventos Diversos',
  // Treino
  plano_treino: 'Plano de Treino',
  prescricao: 'Prescrição de Treinos',
  catalogo_exercicios: 'Catálogo de Exercícios',
  modelos_templates: 'Modelos & Templates',
  treino_do_dia: 'Treino do Dia',
  controle_carga: 'Controle de Carga & 1RM',
  testes_fisicos: 'Avaliações Físicas',
  // Avaliações Físicas Sub-abas
  avaliacoes: 'Avaliações',
  configuracoes: 'Configurações',
  comparativo_graficos: 'Comparativo e Gráficos',
  anamnese: 'Anamnese',
  dobras_cutaneas: 'Dobras Cutâneas',
  bioimpedancia: 'Bioimpedância',
  perimetria: 'Perimetria',
  fotos_postural: 'Fotos e Postural',
  testes_funcionais: 'Testes Funcionais',
  testes_forca: 'Testes de Força',
  testes_campo: 'Testes de Campo',
  testes_salto: 'Testes de Salto',
  testes_personalizados: 'Testes Personalizados',
  // Nutrição
  planos_alimentares: 'Planos Alimentares',
  anamnese_nutricional: 'Anamnese Nutricional',
  composicao_corporal: 'Composição Corporal',
  suplementacao: 'Suplementação',
  metas_hidratacao: 'Metas de Hidratação',
  tabela_alimentos: 'Tabela de Alimentos',
  // Bem-Estar
  checkin: 'Check-in Matinal',
  analise: 'Análise de Prontidão',
  mapa_dor: 'Mapa Anatômico de Dor',
  elenco_hooper: 'Matriz do Elenco',
  ciclo_menstrual: 'Ciclo Menstrual',
  historico_alertas: 'Histórico & Alertas',
  // WhatsApp
  dashboard: 'Visão Geral',
  atendimento: 'Multi-Atendimento',
  kanban: 'Kanban WhatsApp',
  disparos: 'Disparos em Massa',
  chatbot: 'Chatbot Automático',
  contatos: 'Base de Contatos',
  respostas_rapidas: 'Respostas Rápidas',
  etiquetas: 'Etiquetas & Tags',
  conexoes: 'Conexão & QR Code',
  // Financeiro
  receber: 'Contas a Receber',
  pagar: 'Contas a Pagar',
  dre: 'DRE Gerencial',
  extrato: 'Extrato Financeiro',
  gl_profit_pay: 'GL Profit Pay (Recorrência)'
};

export const getActiveSubTabInfo = (
  tab: TabType,
  subTabs: ActiveSubTabsContext
): { subTabKey?: string; tabLabel: string; subTabLabel?: string } => {
  const tabLabel = TAB_DISPLAY_NAMES[tab] || tab.toUpperCase();
  let subTabKey: string | undefined;

  switch (tab) {
    case 'dashboards':
      subTabKey = subTabs.dashboardSubTab;
      break;
    case 'professores':
      subTabKey = subTabs.professoresSubTab;
      break;
    case 'crm':
      subTabKey = subTabs.crmSubTab;
      break;
    case 'agenda':
      subTabKey = subTabs.agendaSubTab;
      break;
    case 'treino':
      subTabKey = subTabs.treinoSubTab;
      break;
    case 'avaliacoes':
      subTabKey = subTabs.avaliacoesSubTab;
      break;
    case 'nutricao':
      subTabKey = subTabs.nutricaoSubTab;
      break;
    case 'bem_estar':
      subTabKey = subTabs.bemEstarSubTab;
      break;
    case 'whatsapp':
      subTabKey = subTabs.whatsappSubTab;
      break;
    case 'financeiro':
      subTabKey = subTabs.financeiroSubTab;
      break;
    default:
      subTabKey = undefined;
  }

  const subTabLabel = subTabKey ? (SUBTAB_DISPLAY_NAMES[subTabKey] || subTabKey) : undefined;

  return { subTabKey, tabLabel, subTabLabel };
};

export interface AgendaSettingsConfig {
  modoChamada: 'dedao' | 'tradicional';
  feedbackSonoro: boolean;
}

export const getAgendaSettings = (): AgendaSettingsConfig => {
  try {
    const config = getTabConfiguration('agenda', 'calendario');
    const findField = (id: string, defaultVal: any) => {
      for (const group of config.groups) {
        const field = group.fields.find(f => f.id === id);
        if (field !== undefined && field.value !== undefined) return field.value;
      }
      return defaultVal;
    };

    return {
      modoChamada: findField('modo_chamada_professor', 'dedao'),
      feedbackSonoro: Boolean(findField('feedback_sonoro_chamada', true))
    };
  } catch (err) {
    console.error('Erro ao ler agenda settings:', err);
    return {
      modoChamada: 'dedao',
      feedbackSonoro: true
    };
  }
};

export const updateAgendaSettings = (updates: Partial<AgendaSettingsConfig>): void => {
  try {
    const config = getTabConfiguration('agenda', 'calendario');
    const updatedGroups = config.groups.map(group => ({
      ...group,
      fields: group.fields.map(field => {
        if (updates.modoChamada !== undefined && field.id === 'modo_chamada_professor') {
          return { ...field, value: updates.modoChamada };
        }
        if (updates.feedbackSonoro !== undefined && field.id === 'feedback_sonoro_chamada') {
          return { ...field, value: updates.feedbackSonoro };
        }
        return field;
      })
    }));

    saveTabConfiguration({ ...config, groups: updatedGroups });
  } catch (err) {
    console.error('Erro ao salvar agenda settings:', err);
  }
};

