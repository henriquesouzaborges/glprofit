import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Headphones,
  Kanban,
  Zap,
  Bot,
  Users,
  MessageSquareCode,
  Link2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Tag
} from 'lucide-react';
import { WhatsappSubTab, WhatsappChat, WhatsappMessage, WhatsappCampaign, WhatsappChatbotFlow, WhatsappConnectionInfo, WhatsappEtiqueta, Student, Lead } from '../../../types';
import {
  INITIAL_WHATSAPP_CHATS,
  INITIAL_WHATSAPP_MESSAGES,
  INITIAL_WHATSAPP_CAMPAIGNS,
  INITIAL_WHATSAPP_FLOWS,
  INITIAL_WHATSAPP_CONNECTION,
  INITIAL_WHATSAPP_ETIQUETAS
} from '../../../mockWhatsappData';

import { WhatsappAtendimentoView } from './WhatsappAtendimentoView';
import { WhatsappKanbanView } from './WhatsappKanbanView';
import { WhatsappDisparosView } from './WhatsappDisparosView';
import { WhatsappChatbotView } from './WhatsappChatbotView';
import { WhatsappContatosView } from './WhatsappContatosView';
import { WhatsappRespostasRapidasView } from './WhatsappRespostasRapidasView';
import { WhatsappEtiquetasView } from './WhatsappEtiquetasView';
import { WhatsappConexoesView } from './WhatsappConexoesView';

export interface WhatsappTargetChat {
  phone: string;
  text?: string;
  contactName?: string;
  studentId?: string;
  timestamp?: number;
}

interface WhatsappTabProps {
  students?: Student[];
  leads?: Lead[];
  targetChat?: WhatsappTargetChat | null;
  onClearTargetChat?: () => void;
  activeSubTab?: WhatsappSubTab;
  onNavigateSubTab?: (subTab: WhatsappSubTab) => void;
}

export const WhatsappTab: React.FC<WhatsappTabProps> = ({ 
  students = [], 
  leads = [],
  targetChat,
  onClearTargetChat,
  activeSubTab: propActiveSubTab,
  onNavigateSubTab
}) => {
  const [internalSubTab, setInternalSubTab] = useState<WhatsappSubTab>('atendimento');
  const activeSubTab = propActiveSubTab ?? internalSubTab;

  const setActiveSubTab = (tab: WhatsappSubTab) => {
    setInternalSubTab(tab);
    if (onNavigateSubTab) {
      onNavigateSubTab(tab);
    }
  };

  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);

  // WhatsApp state
  const [chats, setChats] = useState<WhatsappChat[]>(() => {
    const saved = localStorage.getItem('vbsport_whatsapp_chats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_WHATSAPP_CHATS;
  });

  const [messages, setMessages] = useState<Record<string, WhatsappMessage[]>>(() => {
    const saved = localStorage.getItem('vbsport_whatsapp_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_WHATSAPP_MESSAGES;
  });

  const [campaigns, setCampaigns] = useState<WhatsappCampaign[]>(() => {
    const saved = localStorage.getItem('vbsport_whatsapp_campaigns');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_WHATSAPP_CAMPAIGNS;
  });

  const [flows, setFlows] = useState<WhatsappChatbotFlow[]>(() => {
    const saved = localStorage.getItem('vbsport_whatsapp_flows');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_WHATSAPP_FLOWS;
  });

  const [connection, setConnection] = useState<WhatsappConnectionInfo>(INITIAL_WHATSAPP_CONNECTION);

  const [etiquetas, setEtiquetas] = useState<WhatsappEtiqueta[]>(() => {
    const saved = localStorage.getItem('vbsport_whatsapp_etiquetas');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_WHATSAPP_ETIQUETAS;
  });

  // Sync to localStorage
  const saveChats = (newChats: WhatsappChat[]) => {
    setChats(newChats);
    localStorage.setItem('vbsport_whatsapp_chats', JSON.stringify(newChats));
  };

  const saveEtiquetas = (newEtiquetas: WhatsappEtiqueta[]) => {
    setEtiquetas(newEtiquetas);
    localStorage.setItem('vbsport_whatsapp_etiquetas', JSON.stringify(newEtiquetas));
  };

  const saveMessages = (newMsgs: Record<string, WhatsappMessage[]>) => {
    setMessages(newMsgs);
    localStorage.setItem('vbsport_whatsapp_messages', JSON.stringify(newMsgs));
  };

  // Handle incoming targetChat from internal system buttons
  useEffect(() => {
    if (!targetChat || !targetChat.phone) return;

    const rawTargetPhone = targetChat.phone.replace(/\D/g, '');
    const cleanDigits = rawTargetPhone.startsWith('55') ? rawTargetPhone.slice(2) : rawTargetPhone;

    // Search in existing chats by phone (match digits) or contact name
    const existingChat = chats.find(c => {
      const chatDigits = c.contactPhone.replace(/\D/g, '');
      const cClean = chatDigits.startsWith('55') ? chatDigits.slice(2) : chatDigits;
      const phoneMatch = cleanDigits.length >= 8 && (cClean.includes(cleanDigits) || cleanDigits.includes(cClean));
      const nameMatch = targetChat.contactName && c.contactName.trim().toLowerCase() === targetChat.contactName.trim().toLowerCase();
      return phoneMatch || nameMatch;
    });

    let currentChatId = existingChat?.id;

    if (!existingChat) {
      // Find matching student or lead to get profile details
      const student = students.find(s => {
        const sDigits = s.phone.replace(/\D/g, '');
        const sClean = sDigits.startsWith('55') ? sDigits.slice(2) : sDigits;
        return (targetChat.studentId && s.id === targetChat.studentId) ||
          (cleanDigits.length >= 8 && (sClean.includes(cleanDigits) || cleanDigits.includes(sClean))) ||
          (targetChat.contactName && s.name.trim().toLowerCase() === targetChat.contactName.trim().toLowerCase());
      });

      const lead = leads.find(l => {
        const lDigits = l.phone.replace(/\D/g, '');
        const lClean = lDigits.startsWith('55') ? lDigits.slice(2) : lDigits;
        return (cleanDigits.length >= 8 && (lClean.includes(cleanDigits) || cleanDigits.includes(lClean))) ||
          (targetChat.contactName && l.name.trim().toLowerCase() === targetChat.contactName.trim().toLowerCase());
      });

      const newId = `chat-${Date.now()}`;
      const newChat: WhatsappChat = {
        id: newId,
        contactName: targetChat.contactName || student?.name || lead?.name || 'Novo Contato',
        contactPhone: student?.phone || targetChat.phone,
        contactPhoto: student?.photoUrl,
        unreadCount: 0,
        lastMessage: targetChat.text || 'Conversa iniciada pelo perfil.',
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'atendimento',
        queue: 'geral',
        assignedTo: 'gianluca',
        tags: student ? ['Aluno GL PRO FIT', student.plan] : (lead ? ['Lead CRM', lead.interest] : ['GL PRO FIT']),
        studentPlan: student?.plan || (lead ? `Interesse: ${lead.interest}` : 'Matriculado GL PRO FIT'),
        pipelineStage: student ? 'posvenda' : 'novos',
        pendingAmount: student?.pendingAmount,
        notes: student
          ? `Matrícula: ${student.enrollmentNumber || student.id} • Status: ${student.status} • CPF: ${student.cpf || 'N/D'} • Plano: ${student.plan}`
          : (lead ? `Lead CRM • Origem: ${lead.source} • Interesse: ${lead.interest}` : '')
      };

      currentChatId = newId;
      const updatedChats = [newChat, ...chats];
      saveChats(updatedChats);

      if (targetChat.text) {
        const initialMsg: WhatsappMessage = {
          id: `msg-${Date.now()}`,
          chatId: newId,
          sender: 'atendente',
          senderName: 'Gian Luca (GL PRO FIT)',
          text: targetChat.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'entregue'
        };
        const updatedMsgs = {
          ...messages,
          [newId]: [initialMsg]
        };
        saveMessages(updatedMsgs);
      }
    } else {
      // Existing chat: If targetChat.text provided, append message to the thread
      if (targetChat.text) {
        const initialMsg: WhatsappMessage = {
          id: `msg-${Date.now()}`,
          chatId: existingChat.id,
          sender: 'atendente',
          senderName: 'Gian Luca (GL PRO FIT)',
          text: targetChat.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'entregue'
        };
        const currentMsgs = messages[existingChat.id] || [];
        const updatedMsgs = {
          ...messages,
          [existingChat.id]: [...currentMsgs, initialMsg]
        };
        saveMessages(updatedMsgs);

        const updatedChats = chats.map(c => c.id === existingChat.id ? {
          ...c,
          lastMessage: targetChat.text!,
          lastMessageTime: 'Agora',
          status: 'atendimento' as const
        } : c);
        saveChats(updatedChats);
      }
    }

    if (currentChatId) {
      setSelectedChatId(currentChatId);
    }
    setActiveSubTab('atendimento');

    if (onClearTargetChat) {
      onClearTargetChat();
    }
  }, [targetChat]);

  // Handlers
  const handleSendMessage = (chatId: string, text: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: WhatsappMessage = {
      id: `msg-${Date.now()}`,
      chatId,
      sender: 'atendente',
      senderName: 'Juliana Silva',
      text,
      timestamp: now,
      status: 'enviado'
    };

    const currentChatMsgs = messages[chatId] || [];
    const updatedMessages = {
      ...messages,
      [chatId]: [...currentChatMsgs, newMsg]
    };
    saveMessages(updatedMessages);

    // Update chat last message
    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          lastMessage: text,
          lastMessageTime: now,
          status: 'atendimento' as const
        };
      }
      return c;
    });
    saveChats(updatedChats);

    // Simulated interactive reply after 2 seconds for active demo
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const targetChat = chats.find(c => c.id === chatId);
      let replyText = 'Perfeito, muito obrigado pelo retorno!';

      if (text.toLowerCase().includes('pix')) {
        replyText = 'Já recebi a chave PIX aqui! Vou fazer a transferência agora mesmo e aviso vocês!';
      } else if (text.toLowerCase().includes('treino') || text.toLowerCase().includes('horário')) {
        replyText = 'Ótimo, estarei na VB SPORT hoje às 18h30!';
      } else if (text.toLowerCase().includes('experimental')) {
        replyText = 'Que maravilha! Quero muito fazer a aula experimental hoje à noite!';
      }

      const clientReply: WhatsappMessage = {
        id: `msg-rep-${Date.now()}`,
        chatId,
        sender: 'cliente',
        senderName: targetChat?.contactName || 'Aluno',
        text: replyText,
        timestamp: replyTime,
        status: 'lido'
      };

      setMessages(prev => {
        const list = prev[chatId] || [];
        const next = { ...prev, [chatId]: [...list, clientReply] };
        localStorage.setItem('vbsport_whatsapp_messages', JSON.stringify(next));
        return next;
      });

      setChats(prev => {
        const next = prev.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: replyTime,
              unreadCount: (c.unreadCount || 0) + 1
            };
          }
          return c;
        });
        localStorage.setItem('vbsport_whatsapp_chats', JSON.stringify(next));
        return next;
      });
    }, 1800);
  };

  const handleUpdateChatStatus = (chatId: string, status: 'aguardando' | 'atendimento' | 'finalizado') => {
    const updated = chats.map(c => c.id === chatId ? { ...c, status } : c);
    saveChats(updated);
  };

  const handleUpdateChatQueue = (chatId: string, queue: 'geral' | 'comercial' | 'recepcao' | 'financeiro') => {
    const updated = chats.map(c => c.id === chatId ? { ...c, queue } : c);
    saveChats(updated);
  };

  const handleAddTag = (chatId: string, tag: string) => {
    const updated = chats.map(c => {
      if (c.id === chatId && !c.tags.includes(tag)) {
        return { ...c, tags: [...c.tags, tag] };
      }
      return c;
    });
    saveChats(updated);
  };

  const handleRemoveTag = (chatId: string, tag: string) => {
    const updated = chats.map(c => {
      if (c.id === chatId) {
        return { ...c, tags: c.tags.filter(t => t !== tag) };
      }
      return c;
    });
    saveChats(updated);
  };

  const handleAddEtiqueta = (data: Omit<WhatsappEtiqueta, 'id' | 'createdAt'>) => {
    const newEtiqueta: WhatsappEtiqueta = {
      ...data,
      id: `eti-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };
    saveEtiquetas([...etiquetas, newEtiqueta]);
  };

  const handleUpdateEtiqueta = (id: string, updated: Partial<WhatsappEtiqueta>) => {
    const oldEtiqueta = etiquetas.find(e => e.id === id);
    const newEtiquetas = etiquetas.map(e => e.id === id ? { ...e, ...updated } : e);
    saveEtiquetas(newEtiquetas);

    if (updated.name && oldEtiqueta && updated.name !== oldEtiqueta.name) {
      const updatedChats = chats.map(c => ({
        ...c,
        tags: c.tags.map(t => t === oldEtiqueta.name ? updated.name! : t)
      }));
      saveChats(updatedChats);
    }
  };

  const handleDeleteEtiqueta = (id: string) => {
    const toDelete = etiquetas.find(e => e.id === id);
    if (!toDelete) return;
    saveEtiquetas(etiquetas.filter(e => e.id !== id));
    const updatedChats = chats.map(c => ({
      ...c,
      tags: c.tags.filter(t => t !== toDelete.name)
    }));
    saveChats(updatedChats);
  };

  const handleSaveNotes = (chatId: string, notes: string) => {
    const updated = chats.map(c => c.id === chatId ? { ...c, notes } : c);
    saveChats(updated);
  };

  const handleUpdateChatStage = (
    chatId: string,
    pipelineStage: 'novos' | 'experimental' | 'proposta' | 'fechamento' | 'posvenda'
  ) => {
    const updated = chats.map(c => c.id === chatId ? { ...c, pipelineStage } : c);
    saveChats(updated);
  };

  const handleAddNewContact = (newContact: Partial<WhatsappChat>) => {
    const fullContact: WhatsappChat = {
      id: newContact.id || `chat-${Date.now()}`,
      contactName: newContact.contactName || 'Novo Contato',
      contactPhone: newContact.contactPhone || '+55 (11) 99999-9999',
      unreadCount: 0,
      lastMessage: newContact.lastMessage || 'Contato criado.',
      lastMessageTime: 'Agora',
      status: newContact.status || 'atendimento',
      queue: newContact.queue || 'comercial',
      assignedTo: newContact.assignedTo || 'carlos',
      tags: newContact.tags || ['Novo Lead'],
      pipelineStage: newContact.pipelineStage || 'novos',
      studentPlan: newContact.studentPlan || 'Plano Anual Black VIP'
    };
    saveChats([fullContact, ...chats]);
  };

  const handleCreateCampaign = (camp: WhatsappCampaign) => {
    const updated = [camp, ...campaigns];
    setCampaigns(updated);
    localStorage.setItem('vbsport_whatsapp_campaigns', JSON.stringify(updated));
  };

  const handleTriggerCampaign = (campId: string) => {
    const updated = campaigns.map(c => {
      if (c.id === campId) {
        return {
          ...c,
          sentCount: c.totalRecipients,
          deliveredCount: c.totalRecipients,
          readCount: Math.round(c.totalRecipients * 0.82),
          repliedCount: Math.round(c.totalRecipients * 0.28),
          status: 'concluida' as const
        };
      }
      return c;
    });
    setCampaigns(updated);
    localStorage.setItem('vbsport_whatsapp_campaigns', JSON.stringify(updated));
  };

  const handleToggleFlow = (flowId: string) => {
    const updated = flows.map(f => f.id === flowId ? { ...f, active: !f.active } : f);
    setFlows(updated);
    localStorage.setItem('vbsport_whatsapp_flows', JSON.stringify(updated));
  };

  const handleOpenChatFromOtherView = (chatId: string) => {
    setSelectedChatId(chatId);
    setActiveSubTab('atendimento');
  };

  const subTabLabels: Record<WhatsappSubTab, string> = {
    atendimento: 'Multi-Atendimento em Tempo Real',
    kanban: 'Kanban & Pipeline de Oportunidades',
    disparos: 'Disparos em Massa & Campanhas',
    chatbot: 'Chatbot & Automação Inteligente',
    contatos: 'Gestão de Contatos & Leads',
    respostas_rapidas: 'Respostas Rápidas & Modelos',
    etiquetas: 'Gestão de Etiquetas & Tags',
    conexoes: 'Conexão WhatsApp Web & API'
  };

  return (
    <div className="space-y-4">
      {/* Banner de Em Breve (Fase 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-50 via-amber-50/80 to-amber-100/50 border border-amber-200/80 p-4 rounded-2xl shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-sm shrink-0 shadow-xs">
            ⏳
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-black text-amber-950">
                Módulo WhatsApp Multi-Atendimento • Em Breve
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                Fase 2 do Projeto
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              Todas as sub-abas (Atendimento, Kanban, Disparos, Chatbot, Contatos, Respostas Rápidas, Etiquetas e Conexões) e parâmetros já estão totalmente estruturados. A ativação das instâncias de envio oficial será concluída na segunda fase.
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Status do WhatsApp */}
      <div className="flex items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">WhatsApp Multi-Atendimento</span>
            <span className="text-xs font-bold text-slate-800 truncate block">
              {subTabLabels[activeSubTab] || 'Módulo'}
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Simulado — ambiente de testes
          </span>
        </div>
      </div>

      {/* Render selected Sub-Tab with Smooth Fade-in */}
      <div key={activeSubTab} className="animate-subtab-fade-in">
        {activeSubTab === 'atendimento' && (
        <WhatsappAtendimentoView
          chats={chats}
          messages={messages}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onSendMessage={handleSendMessage}
          onUpdateChatStatus={handleUpdateChatStatus}
          onUpdateChatQueue={handleUpdateChatQueue}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onSaveNotes={handleSaveNotes}
          etiquetas={etiquetas}
          onNavigateToEtiquetas={() => setActiveSubTab('etiquetas')}
        />
      )}

      {activeSubTab === 'kanban' && (
        <WhatsappKanbanView
          chats={chats}
          etiquetas={etiquetas}
          onOpenChat={handleOpenChatFromOtherView}
          onUpdateChatStage={handleUpdateChatStage}
          onAddNewContact={handleAddNewContact}
        />
      )}

      {activeSubTab === 'disparos' && (
        <WhatsappDisparosView
          campaigns={campaigns}
          onCreateCampaign={handleCreateCampaign}
          onTriggerCampaign={handleTriggerCampaign}
        />
      )}

      {activeSubTab === 'chatbot' && (
        <WhatsappChatbotView
          flows={flows}
          onToggleFlow={handleToggleFlow}
        />
      )}

      {activeSubTab === 'contatos' && (
        <WhatsappContatosView
          chats={chats}
          students={students}
          leads={leads}
          onOpenChat={handleOpenChatFromOtherView}
          onAddNewContact={handleAddNewContact}
        />
      )}

      {activeSubTab === 'respostas_rapidas' && (
        <WhatsappRespostasRapidasView />
      )}

      {activeSubTab === 'etiquetas' && (
        <WhatsappEtiquetasView
          etiquetas={etiquetas}
          chats={chats}
          onAddEtiqueta={handleAddEtiqueta}
          onUpdateEtiqueta={handleUpdateEtiqueta}
          onDeleteEtiqueta={handleDeleteEtiqueta}
          onNavigateToAtendimentoWithEtiqueta={() => setActiveSubTab('atendimento')}
          onNavigateToKanbanWithEtiqueta={() => setActiveSubTab('kanban')}
        />
      )}

      {activeSubTab === 'conexoes' && (
        <WhatsappConexoesView
          connection={connection}
          onRefreshConnection={() => {
            alert('Conexão com a API do WhatsApp sincronizada com sucesso! Todos os serviços operacionais.');
          }}
        />
      )}
      </div>
    </div>
  );
};
