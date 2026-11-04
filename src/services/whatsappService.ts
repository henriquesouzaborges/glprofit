/**
 * GL PRO FIT - WhatsApp & CRM Service (Fase 2.1)
 * Gerencia conversas, mensagens e sincronização com suporte real-time
 * e fallback integral ao LocalStorage.
 */

import { WhatsappChat, WhatsappMessage, Lead } from '../types';
import { INITIAL_WHATSAPP_CHATS, INITIAL_WHATSAPP_MESSAGES } from '../mockWhatsappData';
import { INITIAL_LEADS } from '../mockData';
import { USE_REAL_DATABASE } from '../lib/db';

const CHATS_STORAGE_KEY = 'vbsport_whatsapp_chats';
const MESSAGES_STORAGE_KEY = 'vbsport_whatsapp_messages';
const CRM_STORAGE_KEY = 'vbsport_leads';

const WHATSAPP_UPDATED_EVENT = 'gl_pro_fit_whatsapp_updated';

class WhatsAppService {
  /**
   * Obtém todas as conversas do WhatsApp Multi-Atendimento
   */
  async getConversations(): Promise<WhatsappChat[]> {
    try {
      const stored = localStorage.getItem(CHATS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('[whatsappService] Erro ao ler conversas:', err);
    }
    return INITIAL_WHATSAPP_CHATS;
  }

  /**
   * Obtém o histórico completo de mensagens agrupadas por chat ou lista plana
   */
  async getAllMessages(): Promise<WhatsappMessage[]> {
    try {
      const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        if (parsed && typeof parsed === 'object') {
          return Object.values(parsed).flat() as WhatsappMessage[];
        }
      }
    } catch (err) {
      console.error('[whatsappService] Erro ao ler mensagens:', err);
    }
    // Flatten initial messages dictionary into a single array
    return Object.values(INITIAL_WHATSAPP_MESSAGES).flat();
  }

  /**
   * Obtém as mensagens de um chat específico
   */
  async getMessagesByChatId(chatId: string): Promise<WhatsappMessage[]> {
    const all = await this.getAllMessages();
    return all.filter(m => m.chatId === chatId);
  }

  /**
   * Envia ou persiste uma nova mensagem no atendimento
   */
  async sendMessage(
    chatId: string, 
    text: string, 
    sender: 'cliente' | 'atendente' | 'bot' = 'atendente',
    senderName?: string
  ): Promise<WhatsappMessage> {
    const allMessages = await this.getAllMessages();
    const chats = await this.getConversations();

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newMessage: WhatsappMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      chatId,
      sender,
      senderName: senderName || (sender === 'atendente' ? 'Atendente' : 'Cliente'),
      text,
      timestamp: timeFormatted,
      status: sender === 'atendente' ? 'enviado' : 'lido'
    };

    const updatedMessages = [...allMessages, newMessage];
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));

    // Sincronizar mensagem com Firestore
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('whatsapp_messages', [newMessage]);
    }).catch(err => {
      console.warn('Sync whatsapp message to firestore skipped:', err);
    });

    // Atualiza o resumo da conversa (lastMessage, lastMessageTime)
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex >= 0) {
      const updatedChats = [...chats];
      updatedChats[chatIndex] = {
        ...updatedChats[chatIndex],
        lastMessage: text,
        lastMessageTime: timeFormatted,
        unreadCount: sender === 'cliente' ? (updatedChats[chatIndex].unreadCount + 1) : updatedChats[chatIndex].unreadCount
      };
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));

      import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
        syncCollectionToFirestore('whatsapp_chats', updatedChats);
      }).catch(err => {
        console.warn('Sync whatsapp chats to firestore skipped:', err);
      });
    }

    this.notifyUpdate();
    return newMessage;
  }

  /**
   * Cria ou localiza uma conversa por número de telefone / contato
   */
  async getOrCreateChat(contactName: string, phone: string, avatar?: string): Promise<WhatsappChat> {
    const chats = await this.getConversations();
    const cleanPhone = phone.replace(/\D/g, '');

    const existing = chats.find(c => {
      const cPhone = (c.contactPhone || '').replace(/\D/g, '');
      return (cleanPhone && cPhone === cleanPhone) || c.contactName.toLowerCase() === contactName.toLowerCase();
    });

    if (existing) {
      return existing;
    }

    const newChat: WhatsappChat = {
      id: `chat-${Date.now()}`,
      contactName,
      contactPhone: phone || '+55 (11) 99999-0000',
      contactPhoto: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      lastMessage: 'Conversa iniciada via sistema GL PRO FIT.',
      lastMessageTime: 'Agora',
      unreadCount: 0,
      status: 'atendimento',
      queue: 'geral',
      tags: ['Aluno', 'Sistema']
    };

    const updated = [newChat, ...chats];
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updated));

    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('whatsapp_chats', updated);
    }).catch(err => {
      console.warn('Sync new chat to firestore skipped:', err);
    });

    this.notifyUpdate();
    return newChat;
  }

  /**
   * Obtém leads do funil CRM
   */
  async getCRMLeads(): Promise<Lead[]> {
    try {
      const stored = localStorage.getItem(CRM_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('[whatsappService] Erro ao ler CRM leads:', e);
    }
    return INITIAL_LEADS;
  }

  /**
   * Assina atualizações do chat em tempo real
   */
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(WHATSAPP_UPDATED_EVENT, handler);
    window.addEventListener('storage', (e) => {
      if (e.key === CHATS_STORAGE_KEY || e.key === MESSAGES_STORAGE_KEY) {
        callback();
      }
    });

    return () => {
      window.removeEventListener(WHATSAPP_UPDATED_EVENT, handler);
    };
  }

  private notifyUpdate(): void {
    window.dispatchEvent(new CustomEvent(WHATSAPP_UPDATED_EVENT));
  }
}

export const whatsappService = new WhatsAppService();
