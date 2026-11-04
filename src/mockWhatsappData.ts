import {
  WhatsappChat,
  WhatsappMessage,
  WhatsappCampaign,
  WhatsappQuickReply,
  WhatsappConnectionInfo,
  WhatsappChatbotFlow,
  WhatsappEtiqueta
} from './types';

export const INITIAL_WHATSAPP_CONNECTION: WhatsappConnectionInfo = {
  status: 'conectado',
  companyName: 'VB SPORT',
  companyId: '37054276',
  phone: '+55 (11) 98765-4321',
  batteryLevel: 96,
  isCharging: true,
  signalQuality: 'Excelente (Wi-Fi 5GHz)',
  webhookUrl: 'https://api.vbsport.com.br/whatsapp/webhook',
  apiToken: 'vb_live_37054276_98df8921a9c8b7',
  provider: 'Multi-Device API (Meta Cloud Business)',
  connectedAt: 'Hoje, 07:45'
};

export const WHATSAPP_AGENTS = [
  { id: 'juliana', name: 'Juliana Silva', role: 'Recepção & Balcão', online: true, activeChats: 4 },
  { id: 'carlos', name: 'Carlos Eduardo', role: 'Consultor Comercial / CRM', online: true, activeChats: 6 },
  { id: 'mariana', name: 'Mariana Duarte', role: 'Financeiro & Cobrança', online: true, activeChats: 3 },
  { id: 'bot_ia', name: 'VB SPORT IA (Robô Inteligente)', role: 'Atendimento Automatizado 24/7', online: true, activeChats: 12 }
];

export const INITIAL_WHATSAPP_CHATS: WhatsappChat[] = [
  {
    id: 'chat-1',
    contactName: 'Carlos Eduardo Rocha',
    contactPhone: '+55 (11) 99876-1234',
    contactPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    studentId: 'std-1',
    unreadCount: 1,
    lastMessage: 'Ainda tem vaga para a aula de CrossFit das 19h hoje?',
    lastMessageTime: '11:42',
    status: 'atendimento',
    queue: 'recepcao',
    assignedTo: 'juliana',
    tags: ['Aluno VIP', 'CrossFit', 'Frequente'],
    notes: 'Aluno adora as aulas de alta intensidade. Sempre confirma presença pelo WhatsApp.',
    pipelineStage: 'posvenda',
    studentPlan: 'Plano Anual Black VIP',
    pendingAmount: 0
  },
  {
    id: 'chat-2',
    contactName: 'Mariana de Souza',
    contactPhone: '+55 (11) 98123-5566',
    contactPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    leadId: 'lead-1',
    unreadCount: 2,
    lastMessage: 'Vi o anúncio da quadra de Beach Tennis no Instagram, como funciona a aula experimental?',
    lastMessageTime: '11:28',
    status: 'aguardando',
    queue: 'comercial',
    assignedTo: 'carlos',
    tags: ['Lead Quente', 'Instagram Ads', 'Beach Tennis'],
    notes: 'Interessada em treinar à noite com amigas. Quer saber sobre raquetes inclusas.',
    pipelineStage: 'novos',
    studentPlan: 'Interesse: Beach Tennis + Musculação'
  },
  {
    id: 'chat-3',
    contactName: 'Rafael Mendes',
    contactPhone: '+55 (11) 97654-3210',
    contactPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    studentId: 'std-3',
    unreadCount: 0,
    lastMessage: 'Perfeito, já fiz o PIX com a chave que me enviaram! Muito obrigado.',
    lastMessageTime: '10:15',
    status: 'atendimento',
    queue: 'financeiro',
    assignedTo: 'mariana',
    tags: ['Financeiro', 'PIX', 'Regularizado'],
    notes: 'Regularizou a mensalidade de Agosto. Catraca liberada automaticamente.',
    pipelineStage: 'posvenda',
    studentPlan: 'Plano Semestral Fit',
    pendingAmount: 0
  },
  {
    id: 'chat-4',
    contactName: 'Patrícia Lima Castro',
    contactPhone: '+55 (11) 98877-4411',
    contactPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    leadId: 'lead-2',
    unreadCount: 0,
    lastMessage: 'Vou passar aí hoje às 18h30 para conhecer a academia pessoalmente!',
    lastMessageTime: '09:50',
    status: 'atendimento',
    queue: 'comercial',
    assignedTo: 'carlos',
    tags: ['Aula Agendada', 'Visita Presencial', 'Pilates'],
    notes: 'Agendou tour guiado e aula experimental de Pilates.',
    pipelineStage: 'experimental',
    studentPlan: 'Interesse: Plano Black VIP'
  },
  {
    id: 'chat-5',
    contactName: 'Lucas Ferreira',
    contactPhone: '+55 (11) 99122-3344',
    contactPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    studentId: 'std-2',
    unreadCount: 0,
    lastMessage: 'O professor Pedro já atualizou minha ficha de treino C no app. Obrigado pela agilidade!',
    lastMessageTime: 'Ontem',
    status: 'finalizado',
    queue: 'recepcao',
    assignedTo: 'juliana',
    tags: ['Suporte App', 'Treino', 'Concluído'],
    notes: 'Ficha C atualizada com foco em membros inferiores.',
    pipelineStage: 'posvenda',
    studentPlan: 'Plano Anual Black VIP',
    pendingAmount: 0
  },
  {
    id: 'chat-6',
    contactName: 'Beatriz Vasconcelos',
    contactPhone: '+55 (11) 98223-9900',
    contactPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    lastMessage: 'Vocês têm plano familiar ou desconto para casal?',
    lastMessageTime: 'Ontem',
    status: 'aguardando',
    queue: 'comercial',
    assignedTo: 'carlos',
    tags: ['Lead', 'Plano Família'],
    notes: 'Quer matricular ela e o marido.',
    pipelineStage: 'proposta',
    studentPlan: 'Interesse: 2 Planos Semestrais'
  },
  {
    id: 'chat-7',
    contactName: 'Rodrigo Pires Barbosa',
    contactPhone: '+55 (11) 99778-1122',
    contactPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    lastMessage: 'Recebi a mensagem da campanha de retorno sem taxa de matrícula. Como faço pra reativar?',
    lastMessageTime: 'Ontem',
    status: 'atendimento',
    queue: 'comercial',
    assignedTo: 'carlos',
    tags: ['Ex-Aluno', 'Campanha Retorno', 'Quente'],
    notes: 'Treinou por 2 anos na VB SPORT, quer retornar agora em Setembro.',
    pipelineStage: 'fechamento',
    studentPlan: 'Ex-aluno Black VIP'
  }
];

export const INITIAL_WHATSAPP_MESSAGES: Record<string, WhatsappMessage[]> = {
  'chat-1': [
    {
      id: 'm1-1',
      chatId: 'chat-1',
      sender: 'cliente',
      senderName: 'Carlos Eduardo Rocha',
      text: 'Olá pessoal da VB SPORT, boa tarde!',
      timestamp: '11:40',
      status: 'lido'
    },
    {
      id: 'm1-2',
      chatId: 'chat-1',
      sender: 'cliente',
      senderName: 'Carlos Eduardo Rocha',
      text: 'Ainda tem vaga para a aula de CrossFit das 19h hoje?',
      timestamp: '11:42',
      status: 'lido'
    }
  ],
  'chat-2': [
    {
      id: 'm2-1',
      chatId: 'chat-2',
      sender: 'bot',
      senderName: 'VB SPORT IA',
      text: 'Olá Mariana! Seja muito bem-vinda à VB SPORT! 🏋️‍♂️ Sou a assistente virtual da academia. Como posso te ajudar hoje?',
      timestamp: '11:25',
      status: 'lido'
    },
    {
      id: 'm2-2',
      chatId: 'chat-2',
      sender: 'cliente',
      senderName: 'Mariana de Souza',
      text: 'Vi o anúncio da quadra de Beach Tennis no Instagram, como funciona a aula experimental?',
      timestamp: '11:28',
      status: 'entregue'
    }
  ],
  'chat-3': [
    {
      id: 'm3-1',
      chatId: 'chat-3',
      sender: 'atendente',
      senderName: 'Mariana Duarte (VB SPORT)',
      text: 'Olá Rafael! Tudo bem? Passando para lembrar da sua fatura do Plano Semestral em aberto. Segue o código PIX Copia e Cola para regularização rápida:',
      timestamp: '10:10',
      status: 'lido'
    },
    {
      id: 'm3-2',
      chatId: 'chat-3',
      sender: 'atendente',
      senderName: 'Mariana Duarte (VB SPORT)',
      text: '00020126580014br.gov.bcb.pix0136pix@vbsport.com.br5204000053039865406139.905802BR5908VB SPORT6009SAO PAULO62070503***6304C92A',
      timestamp: '10:11',
      status: 'lido'
    },
    {
      id: 'm3-3',
      chatId: 'chat-3',
      sender: 'cliente',
      senderName: 'Rafael Mendes',
      text: 'Perfeito, já fiz o PIX com a chave que me enviaram! Muito obrigado.',
      timestamp: '10:15',
      status: 'lido'
    },
    {
      id: 'm3-4',
      chatId: 'chat-3',
      sender: 'atendente',
      senderName: 'Mariana Duarte (VB SPORT)',
      text: 'Confirmado Rafael! A catraca já está liberada automaticamente para você treinar hoje. Bons treinos! 💪',
      timestamp: '10:16',
      status: 'lido'
    }
  ],
  'chat-4': [
    {
      id: 'm4-1',
      chatId: 'chat-4',
      sender: 'cliente',
      senderName: 'Patrícia Lima Castro',
      text: 'Bom dia! Gostaria de agendar uma aula experimental de Pilates na unidade.',
      timestamp: '09:30',
      status: 'lido'
    },
    {
      id: 'm4-2',
      chatId: 'chat-4',
      sender: 'atendente',
      senderName: 'Carlos Eduardo (VB SPORT)',
      text: 'Bom dia Patrícia! Que ótimo, o nosso estúdio de Pilates é super completo com aparelhos Cadillac e Reformer. Temos horários hoje às 18h30 ou amanhã às 08h00. Qual fica melhor pra você?',
      timestamp: '09:35',
      status: 'lido'
    },
    {
      id: 'm4-3',
      chatId: 'chat-4',
      sender: 'cliente',
      senderName: 'Patrícia Lima Castro',
      text: 'Vou passar aí hoje às 18h30 para conhecer a academia pessoalmente!',
      timestamp: '09:50',
      status: 'lido'
    },
    {
      id: 'm4-4',
      chatId: 'chat-4',
      sender: 'atendente',
      senderName: 'Carlos Eduardo (VB SPORT)',
      text: 'Combinado Patrícia! Já deixei seu nome na recepção com a Juliana. Venha com roupa confortável de treino. Até mais tarde!',
      timestamp: '09:52',
      status: 'lido'
    }
  ],
  'chat-5': [
    {
      id: 'm5-1',
      chatId: 'chat-5',
      sender: 'cliente',
      senderName: 'Lucas Ferreira',
      text: 'Olá! Não estou conseguindo ver meu treino C no app.',
      timestamp: 'Ontem 15:20',
      status: 'lido'
    },
    {
      id: 'm5-2',
      chatId: 'chat-5',
      sender: 'atendente',
      senderName: 'Juliana Silva (VB SPORT)',
      text: 'Oi Lucas! Falei com o professor Pedro agora mesmo e ele acabou de subir os novos exercícios.',
      timestamp: 'Ontem 15:35',
      status: 'lido'
    },
    {
      id: 'm5-3',
      chatId: 'chat-5',
      sender: 'cliente',
      senderName: 'Lucas Ferreira',
      text: 'O professor Pedro já atualizou minha ficha de treino C no app. Obrigado pela agilidade!',
      timestamp: 'Ontem 15:40',
      status: 'lido'
    }
  ],
  'chat-6': [
    {
      id: 'm6-1',
      chatId: 'chat-6',
      sender: 'cliente',
      senderName: 'Beatriz Vasconcelos',
      text: 'Vocês têm plano familiar ou desconto para casal?',
      timestamp: 'Ontem 19:10',
      status: 'lido'
    }
  ],
  'chat-7': [
    {
      id: 'm7-1',
      chatId: 'chat-7',
      sender: 'cliente',
      senderName: 'Rodrigo Pires Barbosa',
      text: 'Recebi a mensagem da campanha de retorno sem taxa de matrícula. Como faço pra reativar?',
      timestamp: 'Ontem 16:45',
      status: 'lido'
    }
  ]
};

export const INITIAL_WHATSAPP_CAMPAIGNS: WhatsappCampaign[] = [
  {
    id: 'camp-1',
    name: 'Campanha Resgate de Alunos Inativos (Ausência > 20 dias)',
    targetAudience: 'Alunos sem passar na catraca há mais de 20 dias',
    message: 'Oi {{nome}}! Sentimos muito sua falta aqui na VB SPORT! 💪 Sabemos como a rotina pode apertar, mas que tal voltar com tudo nesta semana? Preparamos um presente especial para sua volta: 1 avaliação física com bioimpedância grátis! Responda SIM para agendar.',
    status: 'ativa',
    totalRecipients: 84,
    sentCount: 84,
    deliveredCount: 82,
    readCount: 71,
    repliedCount: 29,
    createdAt: '18/09/2026',
    antiBanDelaySeconds: 25
  },
  {
    id: 'camp-2',
    name: 'Lembrete Amigável de Vencimento GL Profit Pay',
    targetAudience: 'Alunos com fatura vencendo em 2 dias',
    message: 'Olá {{nome}}! Sua mensalidade do {{plano}} na GL PRO FIT vence em breve. Para sua comodidade, você pode pagar direto no PIX com a chave financeiro@glprofit.com.br ou pelo link: {{link_pay}}. Qualquer dúvida conte conosco!',
    status: 'ativa',
    totalRecipients: 42,
    sentCount: 42,
    deliveredCount: 42,
    readCount: 39,
    repliedCount: 14,
    createdAt: '20/09/2026',
    antiBanDelaySeconds: 20
  },
  {
    id: 'camp-3',
    name: 'Convite Torneio Interno de Beach Tennis & Futvôlei',
    targetAudience: 'Todos os alunos e praticantes de areia',
    message: 'Fala {{nome}}! 🏆 Estão abertas as inscrições para o 2º Torneio Arena VB SPORT de Beach Tennis & Futvôlei! Serão 2 dias de jogos, churrasco de encerramento e troféus para as duplas campeãs. Clique no link para garantir sua vaga!',
    status: 'concluida',
    totalRecipients: 215,
    sentCount: 215,
    deliveredCount: 210,
    readCount: 188,
    repliedCount: 64,
    createdAt: '15/09/2026',
    antiBanDelaySeconds: 30
  },
  {
    id: 'camp-4',
    name: 'Boas-Vindas & Acesso ao App VB SPORT',
    targetAudience: 'Novos matriculados nas últimas 48 horas',
    message: '🎉 Parabéns {{nome}}! Você agora é oficialmente atleta VB SPORT! Baixe nosso aplicativo exclusivo para ver sua ficha de treino, agendar aulas e liberar a catraca com seu celular. Seu login é seu e-mail cadastrado.',
    status: 'ativa',
    totalRecipients: 36,
    sentCount: 36,
    deliveredCount: 36,
    readCount: 35,
    repliedCount: 18,
    createdAt: '21/09/2026',
    antiBanDelaySeconds: 15
  }
];

export const INITIAL_WHATSAPP_QUICK_REPLIES: WhatsappQuickReply[] = [
  {
    id: 'qr-1',
    shortcut: '/planos',
    title: 'Tabela de Planos e Valores',
    category: 'Vendas',
    message: 'Olá! Nossos principais planos na VB SPORT são:\n\n⭐ *Plano Anual Black VIP*: R$ 119,90/mês (Acesso total a musculação, crossfit, spinning, natação e catraca livre)\n🏋️ *Plano Semestral Fit*: R$ 139,90/mês\n📆 *Plano Mensal Livre*: R$ 169,90/mês\n\nTodos sem taxa de cancelamento abusiva e com direito ao App VB SPORT completo!'
  },
  {
    id: 'qr-2',
    shortcut: '/experimental',
    title: 'Convite Aula Experimental Grátis',
    category: 'Vendas',
    message: 'Que legal! Você é nosso convidado de honra para fazer uma aula experimental gratuita na VB SPORT. 🎯\n\nQual modalidade você mais gosta? (Musculação, CrossFit, Spinning, Natação ou Beach Tennis)? Me diga o dia e horário que fica melhor pra você!'
  },
  {
    id: 'qr-3',
    shortcut: '/pix',
    title: 'Chave PIX Oficial VB SPORT',
    category: 'Financeiro',
    message: 'Segue nossa chave PIX oficial para pagamento:\n\n🔑 Chave CNPJ / E-mail: *financeiro@vbsport.com.br*\nRazão Social: *VB SPORT ACADEMIA E CENTRO ESPORTIVO LTDA*\n\nAssim que fizer o pagamento, pode mandar o comprovante aqui que o sistema libera sua catraca automaticamente!'
  },
  {
    id: 'qr-4',
    shortcut: '/horarios',
    title: 'Horários de Funcionamento da Academia',
    category: 'Atendimento',
    message: 'Horários de funcionamento da VB SPORT:\n\n⏰ Segunda a Sexta: 06h00 às 23h00\n⏰ Sábados: 08h00 às 18h00\n⏰ Domingos e Feriados: 08h00 às 14h00\n\nEstacionamento gratuito para alunos no local!'
  },
  {
    id: 'qr-5',
    shortcut: '/localizacao',
    title: 'Endereço e Localização da Unidade',
    category: 'Atendimento',
    message: '📍 *VB SPORT Academia & Centro Esportivo*\nAv. dos Esportes, 1500 - São Paulo/SP\nPróximo à estação e com estacionamento conveniado gratuito.\n\nLink do Google Maps: https://maps.google.com/?q=VB+SPORT'
  },
  {
    id: 'qr-6',
    shortcut: '/app',
    title: 'Instruções de Acesso ao App VB SPORT',
    category: 'Suporte',
    message: 'Para acessar o aplicativo VB SPORT:\n1. Baixe o app "VB SPORT Aluno" na Play Store ou Apple Store.\n2. Insira seu e-mail cadastrado na matrícula.\n3. Digite a senha temporária recebida por SMS ou clique em "Esqueci minha senha".\n\nLá você acompanha seus treinos e libera a catraca por QR Code!'
  }
];

export const INITIAL_WHATSAPP_FLOWS: WhatsappChatbotFlow[] = [
  {
    id: 'flow-1',
    name: 'Triagem Principal (Menu de Opções)',
    active: true,
    triggerKeyword: 'Oi / Olá / Boa tarde / Bom dia / Menu',
    stepsCount: 4,
    responseType: 'menu',
    description: 'Apresenta as opções: 1- Planos, 2- Aula Experimental, 3- Financeiro, 4- Falar com Atendente.'
  },
  {
    id: 'flow-2',
    name: 'Atendente Inteligente VB SPORT (IA)',
    active: true,
    triggerKeyword: 'Qualquer pergunta em linguagem natural',
    stepsCount: 1,
    responseType: 'ia_prompt',
    description: 'Responde dúvidas sobre preços, professores, modalidades e regras usando a base de conhecimento da VB SPORT.'
  },
  {
    id: 'flow-3',
    name: 'Transferência para Fila Comercial',
    active: true,
    triggerKeyword: 'Opção 1 ou 2',
    stepsCount: 2,
    responseType: 'transfer',
    description: 'Transfere o lead automaticamente para a fila do consultor de vendas no CRM.'
  },
  {
    id: 'flow-4',
    name: 'Autoatendimento Financeiro (2ª Via PIX)',
    active: true,
    triggerKeyword: 'Opção 3 / Boleto / PIX / Mensalidade',
    stepsCount: 3,
    responseType: 'menu',
    description: 'Localiza o aluno pelo telefone e gera link do GL Profit Pay ou chave PIX instantânea.'
  }
];

export const INITIAL_WHATSAPP_ETIQUETAS: WhatsappEtiqueta[] = [
  {
    id: 'eti-1',
    name: 'Lead Quente',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    textColor: '#991B1B',
    description: 'Contato em estágio avançado de negociação com alta probabilidade de matrícula nas próximas 48h.',
    createdAt: '10/01/2026'
  },
  {
    id: 'eti-2',
    name: 'Aluno VIP',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    textColor: '#5B21B6',
    description: 'Alunos do Plano Anual Black VIP ou com alta frequência. Prioridade máxima no atendimento.',
    createdAt: '10/01/2026'
  },
  {
    id: 'eti-3',
    name: 'Aula Experimental',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    textColor: '#1E40AF',
    description: 'Agendamento confirmado de aula experimental nas quadras de areia ou musculação.',
    createdAt: '12/01/2026'
  },
  {
    id: 'eti-4',
    name: 'Aguardando Pagamento',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    textColor: '#92400E',
    description: 'Cobrança, link GL Profit Pay ou chave PIX emitida com compensação pendente.',
    createdAt: '15/01/2026'
  },
  {
    id: 'eti-5',
    name: 'Renovação Pendente',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    textColor: '#9D174D',
    description: 'Contrato com vencimento previsto para os próximos 15 dias para renegociação ativa.',
    createdAt: '18/01/2026'
  },
  {
    id: 'eti-6',
    name: 'Beach Tennis',
    color: '#10B981',
    bgColor: '#D1FAE5',
    textColor: '#065F46',
    description: 'Interesse específico nas quadras de Beach Tennis, aulas em grupo ou locação avulsa.',
    createdAt: '20/01/2026'
  },
  {
    id: 'eti-7',
    name: 'CrossFit',
    color: '#F97316',
    bgColor: '#FFEDD5',
    textColor: '#9A3412',
    description: 'Alunos ou interessados no box de CrossFit, WODs e condicionamento funcional.',
    createdAt: '22/01/2026'
  },
  {
    id: 'eti-8',
    name: 'Suporte & Dúvidas',
    color: '#64748B',
    bgColor: '#F1F5F9',
    textColor: '#334155',
    description: 'Dúvidas gerais sobre catraca, app do aluno, atestados ou horários de funcionamento.',
    createdAt: '25/01/2026'
  }
];
