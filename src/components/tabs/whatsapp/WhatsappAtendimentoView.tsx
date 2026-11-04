import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Mic,
  CheckCheck,
  Check,
  Clock,
  User,
  Phone,
  Tag,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Play,
  Pause,
  ChevronRight,
  MoreVertical,
  Plus,
  Zap,
  CheckCircle,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { WhatsappChat, WhatsappMessage, WhatsappQuickReply, WhatsappEtiqueta } from '../../../types';
import { WHATSAPP_AGENTS, INITIAL_WHATSAPP_QUICK_REPLIES } from '../../../mockWhatsappData';
import { formatCurrency } from '../../../utils';

interface WhatsappAtendimentoViewProps {
  chats: WhatsappChat[];
  messages: Record<string, WhatsappMessage[]>;
  selectedChatId?: string;
  onSelectChat?: (chatId: string) => void;
  onSendMessage: (chatId: string, text: string) => void;
  onUpdateChatStatus: (chatId: string, status: 'aguardando' | 'atendimento' | 'finalizado') => void;
  onUpdateChatQueue: (chatId: string, queue: 'geral' | 'comercial' | 'recepcao' | 'financeiro') => void;
  onAddTag: (chatId: string, tag: string) => void;
  onRemoveTag?: (chatId: string, tag: string) => void;
  onSaveNotes: (chatId: string, notes: string) => void;
  etiquetas?: WhatsappEtiqueta[];
  onNavigateToEtiquetas?: () => void;
}

export const WhatsappAtendimentoView: React.FC<WhatsappAtendimentoViewProps> = ({
  chats,
  messages,
  selectedChatId: externalSelectedChatId,
  onSelectChat,
  onSendMessage,
  onUpdateChatStatus,
  onUpdateChatQueue,
  onAddTag,
  onRemoveTag,
  onSaveNotes,
  etiquetas,
  onNavigateToEtiquetas
}) => {
  const [internalSelectedChatId, setInternalSelectedChatId] = useState<string>(
    externalSelectedChatId || chats[0]?.id || ''
  );
  const [filterTab, setFilterTab] = useState<'todos' | 'aguardando' | 'atendimento' | 'finalizado'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showQuickRepliesModal, setShowQuickRepliesModal] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync external selection
  useEffect(() => {
    if (externalSelectedChatId) {
      setInternalSelectedChatId(externalSelectedChatId);
      const target = chats.find(c => c.id === externalSelectedChatId);
      if (target && filterTab !== 'todos' && target.status !== filterTab) {
        setFilterTab('todos');
      }
    }
  }, [externalSelectedChatId, chats]);

  const activeChatId = externalSelectedChatId || internalSelectedChatId || chats[0]?.id || '';
  const selectedChat = chats.find(c => c.id === activeChatId) || chats[0];
  const chatMessages = selectedChat ? (messages[selectedChat.id] || []) : [];

  const availableEtiquetas = useMemo(() => {
    if (!etiquetas || !selectedChat) return [];
    return etiquetas.filter(et => !selectedChat.tags.includes(et.name));
  }, [etiquetas, selectedChat]);

  // Auto-scroll on messages change or chat change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, selectedChat?.id]);

  const filteredChats = chats.filter(chat => {
    if (filterTab !== 'todos' && chat.status !== filterTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        chat.contactName.toLowerCase().includes(q) ||
        chat.contactPhone.toLowerCase().includes(q) ||
        chat.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSend = () => {
    if (!inputText.trim() || !selectedChat) return;
    onSendMessage(selectedChat.id, inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectQuickReply = (qr: WhatsappQuickReply) => {
    setInputText(qr.message);
    setShowQuickRepliesModal(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden h-[calc(100vh-210px)] min-h-[580px] flex flex-col">
      {/* Top Header of the Atendimento view */}
      <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">
            Central WhatsApp Live
          </span>
          <span className="text-slate-400 text-xs">• VB SPORT (+55 11 98765-4321)</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-300">
            Atendente Ativo: <strong className="text-white">Juliana Silva (Recepção)</strong>
          </span>
          <button
            onClick={() => setShowQuickRepliesModal(true)}
            className="flex items-center gap-1 rounded bg-blue-700 hover:bg-blue-600 px-2.5 py-1 text-white font-medium text-xs transition-colors"
          >
            <Zap className="h-3 w-3" />
            Respostas Rápidas (/)
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Chats List */}
        <div className="w-80 sm:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
          {/* Search & Tabs */}
          <div className="p-3 border-b border-slate-200 bg-white space-y-2.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar conversa, telefone ou etiqueta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg text-[11px]">
              <button
                onClick={() => setFilterTab('todos')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  filterTab === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({chats.length})
              </button>
              <button
                onClick={() => setFilterTab('aguardando')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  filterTab === 'aguardando' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aguardando ({chats.filter(c => c.status === 'aguardando').length})
              </button>
              <button
                onClick={() => setFilterTab('atendimento')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  filterTab === 'atendimento' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Atendendo ({chats.filter(c => c.status === 'atendimento').length})
              </button>
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhuma conversa encontrada neste filtro.
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isSelected = chat.id === activeChatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setInternalSelectedChatId(chat.id);
                      if (onSelectChat) onSelectChat(chat.id);
                    }}
                    className={`p-3 cursor-pointer transition-all flex items-start gap-3 hover:bg-slate-100/80 ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-700' : 'bg-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      {chat.contactPhoto ? (
                        <img
                          src={chat.contactPhoto}
                          alt={chat.contactName}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                          {chat.contactName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      {chat.status === 'aguardando' && (
                        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-500 border-2 border-white" title="Na fila de espera" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                          {chat.contactName}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {chat.lastMessageTime}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {chat.lastMessage}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase tracking-tight ${
                          chat.queue === 'comercial'
                            ? 'bg-blue-100 text-blue-800'
                            : chat.queue === 'financeiro'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {chat.queue}
                        </span>

                        {chat.tags.slice(0, 2).map((tag, i) => {
                          const et = etiquetas?.find(e => e.name === tag);
                          return (
                            <span
                              key={i}
                              style={et ? {
                                backgroundColor: et.bgColor || `${et.color}15`,
                                color: et.textColor || et.color,
                                borderColor: `${et.color}35`
                              } : undefined}
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs border truncate max-w-[95px] ${
                                !et ? 'bg-slate-100 text-slate-600 border-slate-200' : ''
                              }`}
                            >
                              {tag}
                            </span>
                          );
                        })}

                        {chat.unreadCount > 0 && (
                          <span className="ml-auto rounded-full bg-emerald-600 px-1.5 py-0.2 text-[9px] font-bold text-white">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center Column: Chat Messages View */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-[#efeae2]/30 min-w-0 relative">
            {/* Active Chat Header */}
            <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                {selectedChat.contactPhoto ? (
                  <img
                    src={selectedChat.contactPhoto}
                    alt={selectedChat.contactName}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                    {selectedChat.contactName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {selectedChat.contactName}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {selectedChat.contactPhone}
                    </span>
                    {selectedChat.tags.map((tag, i) => {
                      const et = etiquetas?.find(e => e.name === tag);
                      return (
                        <span
                          key={i}
                          style={et ? {
                            backgroundColor: et.bgColor || `${et.color}15`,
                            color: et.textColor || et.color,
                            borderColor: `${et.color}40`
                          } : undefined}
                          title={et?.description || tag}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-flex items-center gap-1 shadow-2xs ${
                            !et ? 'bg-slate-100 text-slate-700 border-slate-200' : ''
                          }`}
                        >
                          {et && <span style={{ backgroundColor: et.color }} className="h-1.5 w-1.5 rounded-full" />}
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                    <span>Fila: <strong className="capitalize text-slate-700">{selectedChat.queue}</strong></span>
                    <span>•</span>
                    <span>Status: 
                      <span className={`ml-1 font-semibold ${
                        selectedChat.status === 'atendimento' ? 'text-emerald-700' : selectedChat.status === 'aguardando' ? 'text-amber-700' : 'text-slate-600'
                      }`}>
                        {selectedChat.status === 'atendimento' ? 'Em Atendimento' : selectedChat.status === 'aguardando' ? 'Aguardando Fila' : 'Finalizado'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={selectedChat.queue}
                  onChange={(e) => onUpdateChatQueue(selectedChat.id, e.target.value as any)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 focus:outline-hidden"
                  title="Alterar fila de atendimento"
                >
                  <option value="comercial">Fila: Comercial</option>
                  <option value="recepcao">Fila: Recepção</option>
                  <option value="financeiro">Fila: Financeiro</option>
                  <option value="geral">Fila: Geral</option>
                </select>

                {selectedChat.status !== 'finalizado' ? (
                  <button
                    onClick={() => onUpdateChatStatus(selectedChat.id, 'finalizado')}
                    className="flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    Finalizar
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateChatStatus(selectedChat.id, 'atendimento')}
                    className="flex items-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 transition-colors"
                  >
                    Reabrir
                  </button>
                )}

                <button
                  onClick={() => setShowDetailsPanel(prev => !prev)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    showDetailsPanel ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                  title="Exibir Ficha do Contato"
                >
                  <User className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Encryption badge */}
              <div className="flex justify-center my-2">
                <span className="rounded-md bg-amber-50 px-3 py-1 text-[11px] text-amber-800 border border-amber-200/70 flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  As mensagens são transmitidas com criptografia de ponta a ponta pela API Oficial do WhatsApp.
                </span>
              </div>

              {chatMessages.map((msg) => {
                const isMe = msg.sender === 'atendente';
                const isBot = msg.sender === 'bot';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 shadow-2xs text-xs relative ${
                        isMe
                          ? 'bg-emerald-700 text-white rounded-tr-xs'
                          : isBot
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-tl-xs'
                            : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                      }`}
                    >
                      {/* Sender label */}
                      <div className="flex items-center justify-between gap-3 text-[10px] font-bold mb-1 opacity-80">
                        <span>
                          {isBot ? '🤖 VB SPORT IA (Robô)' : isMe ? (msg.senderName || 'Você') : selectedChat.contactName}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Message Content */}
                      <div className="whitespace-pre-line leading-relaxed text-xs">
                        {msg.text}
                      </div>

                      {/* Status Checkmarks for outgoing */}
                      {isMe && (
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-200">
                          {msg.status === 'lido' ? (
                            <CheckCheck className="h-3.5 w-3.5 text-sky-300" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-emerald-200" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowQuickRepliesModal(true)}
                className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Respostas Rápidas (/)"
              >
                <Zap className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => alert("Envio de anexo/imagem pronto para seleção de arquivo da academia.")}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Anexar arquivo ou foto"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem no WhatsApp (digite / para respostas rápidas)..."
                className="flex-1 rounded-lg border border-slate-200 px-3.5 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
              />

              <button
                type="button"
                onClick={() => setIsRecordingAudio(prev => !prev)}
                className={`p-2 rounded-lg transition-colors ${
                  isRecordingAudio ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isRecordingAudio ? 'Gravando áudio...' : 'Gravar áudio simulado'}
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="flex items-center justify-center rounded-lg bg-emerald-600 text-white p-2 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                title="Enviar Mensagem"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400 bg-slate-50">
            Selecione uma conversa para iniciar o atendimento.
          </div>
        )}

        {/* Right Column: Contact Details / Ficha VB SPORT */}
        {showDetailsPanel && selectedChat && (
          <div className="w-72 lg:w-80 border-l border-slate-200 bg-white p-4 overflow-y-auto space-y-4 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Ficha do Contato
              </h4>
              <button
                onClick={() => setShowDetailsPanel(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Summary */}
            <div className="text-center space-y-1.5">
              {selectedChat.contactPhoto ? (
                <img
                  src={selectedChat.contactPhoto}
                  alt={selectedChat.contactName}
                  className="h-16 w-16 rounded-full object-cover mx-auto border-2 border-blue-700 shadow-2xs"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg mx-auto">
                  {selectedChat.contactName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <h3 className="text-sm font-bold text-slate-900">{selectedChat.contactName}</h3>
              <p className="text-xs text-slate-500 font-mono">{selectedChat.contactPhone}</p>
            </div>

            {/* Info Cards */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Plano / Interesse</div>
                <div className="font-semibold text-slate-900">
                  {selectedChat.studentPlan || 'Aluno Matriculado na VB SPORT'}
                </div>
              </div>

              {selectedChat.pendingAmount !== undefined && selectedChat.pendingAmount > 0 ? (
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 space-y-1 text-rose-900">
                  <div className="text-[10px] font-bold uppercase text-rose-600">Débito em Aberto</div>
                  <div className="text-sm font-black text-rose-700">
                    {formatCurrency(selectedChat.pendingAmount)}
                  </div>
                  <div className="text-[11px] text-rose-700">Catraca bloqueada até regularização</div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1 text-emerald-900">
                  <div className="text-[10px] font-bold uppercase text-emerald-600">Situação Financeira</div>
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCheck className="h-3.5 w-3.5" /> Mensalidades em dia / Catraca Liberada
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[10px] font-bold uppercase text-slate-400">Ações Rápidas</div>
              <button
                onClick={() => {
                  setInputText(`Olá ${selectedChat.contactName}! Segue nossa chave PIX oficial da VB SPORT para regularização: financeiro@vbsport.com.br`);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="h-3.5 w-3.5 text-emerald-600" />
                  Enviar Chave PIX
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setInputText(`Olá ${selectedChat.contactName}! Segue seu link de pagamento seguro do GL Profit Pay: https://pay.glprofit.com.br/fatura-${Date.now().toString().slice(-4)}`);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                  Gerar Link GL Profit Pay
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>

            {/* Etiquetas do Contato */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">Etiquetas</span>
                {onNavigateToEtiquetas && (
                  <button
                    type="button"
                    onClick={onNavigateToEtiquetas}
                    className="text-[10px] font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    Gerenciar Etiquetas
                  </button>
                )}
              </div>

              {/* Lista de etiquetas aplicadas */}
              <div className="flex flex-wrap gap-1.5">
                {selectedChat.tags.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Nenhuma etiqueta atribuída</span>
                ) : (
                  selectedChat.tags.map((tag, idx) => {
                    const et = etiquetas?.find(e => e.name === tag);
                    return (
                      <span
                        key={idx}
                        style={et ? {
                          backgroundColor: et.bgColor || `${et.color}15`,
                          color: et.textColor || et.color,
                          borderColor: `${et.color}40`
                        } : undefined}
                        title={et?.description || tag}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-bold border shadow-2xs ${
                          !et ? 'bg-blue-50 text-blue-700 border-blue-200' : ''
                        }`}
                      >
                        <Tag className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[130px]">{tag}</span>
                        {onRemoveTag && (
                          <button
                            type="button"
                            onClick={() => onRemoveTag(selectedChat.id, tag)}
                            className="hover:opacity-75 p-0.5 rounded cursor-pointer transition-opacity"
                            title="Remover etiqueta deste contato"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    );
                  })
                )}
              </div>

              {/* Seletor de Etiquetas Configuradas */}
              {availableEtiquetas.length > 0 ? (
                <div className="pt-1">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onAddTag(selectedChat.id, e.target.value);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700 font-medium focus:border-blue-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="">+ Atribuir Etiqueta...</option>
                    {availableEtiquetas.map(et => (
                      <option key={et.id} value={et.name}>
                        {et.name} {et.description ? `— ${et.description.slice(0, 25)}...` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Todas as etiquetas cadastradas já foram atribuídas.
                </div>
              )}
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">Notas Internas (Equipe)</span>
                <span className="text-[10px] text-amber-600 font-semibold">Privado</span>
              </div>
              <textarea
                rows={3}
                defaultValue={selectedChat.notes || ''}
                onBlur={(e) => onSaveNotes(selectedChat.id, e.target.value)}
                placeholder="Observações que apenas a equipe da VB SPORT consegue ler..."
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden bg-amber-50/40 text-slate-700 leading-relaxed"
              />
              <p className="text-[10px] text-slate-400">Salvo automaticamente ao clicar fora.</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Replies Modal */}
      {showQuickRepliesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">Respostas Rápidas VB SPORT</h3>
              </div>
              <button
                onClick={() => setShowQuickRepliesModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto divide-y divide-slate-100">
              {INITIAL_WHATSAPP_QUICK_REPLIES.map((qr) => (
                <div
                  key={qr.id}
                  onClick={() => handleSelectQuickReply(qr)}
                  className="py-3 px-2 hover:bg-blue-50/70 rounded-lg cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {qr.shortcut}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">{qr.category}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{qr.title}</div>
                  <div className="text-xs text-slate-600 line-clamp-2">{qr.message}</div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowQuickRepliesModal(false)}
                className="rounded-lg bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
