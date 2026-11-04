import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Play,
  Pause,
  MessageSquare,
  CheckCircle2,
  Sliders,
  Send,
  RefreshCw,
  Zap,
  Settings,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { WhatsappChatbotFlow } from '../../../types';

interface WhatsappChatbotViewProps {
  flows: WhatsappChatbotFlow[];
  onToggleFlow: (flowId: string) => void;
}

export const WhatsappChatbotView: React.FC<WhatsappChatbotViewProps> = ({
  flows,
  onToggleFlow
}) => {
  const [activeTab, setActiveTab] = useState<'fluxos' | 'ia_prompt' | 'simulador'>('simulador');

  // Interactive Bot Simulator State
  const [simMessages, setSimMessages] = useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([
    {
      sender: 'bot',
      text: '👋 Olá! Seja muito bem-vindo à *VB SPORT Academia & Centro Esportivo*!\n\nComo posso te ajudar hoje? Digite o número da opção desejada:\n\n1️⃣ Conhecer Planos e Valores\n2️⃣ Agendar Aula Experimental Grátis\n3️⃣ Financeiro & 2ª Via PIX\n4️⃣ Falar com a Recepção / Consultor',
      time: '12:00'
    }
  ]);
  const [simInput, setSimInput] = useState('');

  // AI Knowledge Settings
  const [aiPrompt, setAiPrompt] = useState(
    'Você é a assistente virtual oficial da VB SPORT. Seu tom é motivador, esportivo, prestativo e profissional. Você conhece todas as modalidades da academia: Musculação com equipamentos de ponta, CrossFit / Box Funcional, Spinning, Natação e Beach Tennis. Nosso principal plano é o Plano Anual Black VIP por R$ 119,90/mês com acesso total. Sempre encoraje o lead a fazer uma aula experimental gratuita e informe que o estacionamento é gratuito.'
  );

  const handleSendSimulator = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!simInput.trim()) return;

    const userText = simInput.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgs = [...simMessages, { sender: 'user' as const, text: userText, time: now }];
    setSimMessages(newMsgs);
    setSimInput('');

    // Simulate smart bot response based on input
    setTimeout(() => {
      let botReply = '';
      const lower = userText.toLowerCase();

      if (userText === '1' || lower.includes('plano') || lower.includes('preço') || lower.includes('valor')) {
        botReply = '⭐ *Planos Oficiais VB SPORT*:\n\n1. *Plano Anual Black VIP*: R$ 119,90/mês (Musculação + CrossFit + Spinning + Natação + Catraca Livre)\n2. *Plano Semestral Fit*: R$ 139,90/mês\n3. *Plano Mensal Livre*: R$ 169,90/mês\n\nTodos os planos incluem o aplicativo exclusivo VB SPORT com ficha de treino digital!\n\nDeseja agendar sua aula experimental grátis para hoje? Digite 2!';
      } else if (userText === '2' || lower.includes('experimental') || lower.includes('agendar') || lower.includes('conhecer')) {
        botReply = '🎉 Maravilha! Na VB SPORT você tem direito a 1 aula experimental gratuita em qualquer modalidade (CrossFit, Musculação, Pilates, Spinning ou Beach Tennis)!\n\nQual dia e período fica melhor para você? (Manhã, Tarde ou Noite)?';
      } else if (userText === '3' || lower.includes('pix') || lower.includes('boleto') || lower.includes('pagar') || lower.includes('financeiro')) {
        botReply = '💳 *Autoatendimento Financeiro GL PRO FIT*:\n\nNossa chave PIX oficial é: *financeiro@glprofit.com.br*\n\nOu acesse sua fatura segura com cartão recorrente no *GL Profit Pay*: https://pay.glprofit.com.br/aluno\n\nAssim que o pagamento é identificado, sua catraca é liberada em menos de 1 minuto!';
      } else if (userText === '4' || lower.includes('atendente') || lower.includes('humano') || lower.includes('falar')) {
        botReply = 'Transferindo você imediatamente para um de nossos atendentes humanos na recepção... ⏳\n\nTempo médio de espera: menos de 2 minutos. Um consultor já irá te responder aqui no chat!';
      } else {
        botReply = `🤖 *VB SPORT IA*: Entendi sua dúvida sobre "${userText}"! Estamos abertos de Seg a Sex das 06h às 23h e Sábados das 08h às 18h. Se desejar saber sobre nossos planos, digite 1. Para agendar aula experimental gratuita, digite 2!`;
      }

      setSimMessages(prev => [...prev, { sender: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600);
  };

  const handleResetSimulator = () => {
    setSimMessages([
      {
        sender: 'bot',
        text: '👋 Olá! Seja muito bem-vindo à *VB SPORT Academia & Centro Esportivo*!\n\nComo posso te ajudar hoje? Digite o número da opção desejada:\n\n1️⃣ Conhecer Planos e Valores\n2️⃣ Agendar Aula Experimental Grátis\n3️⃣ Financeiro & 2ª Via PIX\n4️⃣ Falar com a Recepção / Consultor',
        time: '12:00'
      }
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Chatbot & Inteligência Artificial (VB SPORT IA)</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> IA Híbrida Ativa
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Respostas automáticas 24 horas por dia, triagem de leads e autoatendimento com menu numérico ou linguagem natural
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'simulador' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Simulador Interativo
          </button>
          <button
            onClick={() => setActiveTab('fluxos')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'fluxos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fluxos de Atendimento ({flows.length})
          </button>
          <button
            onClick={() => setActiveTab('ia_prompt')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'ia_prompt' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Base de Conhecimento & IA
          </button>
        </div>
      </div>

      {/* View 1: Interactive Chatbot Simulator */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Simulator phone mockup */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-3xl border-8 border-slate-900 bg-white shadow-2xl overflow-hidden flex flex-col h-[520px]">
              {/* Phone Status Bar & WhatsApp Header */}
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                    VB
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-none">VB SPORT Atendimento</h4>
                    <span className="text-[10px] text-emerald-400">online (Robô IA)</span>
                  </div>
                </div>

                <button
                  onClick={handleResetSimulator}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Reiniciar conversa de teste"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Chat messages canvas */}
              <div className="flex-1 overflow-y-auto p-3 bg-[#efeae2]/50 space-y-2.5 text-xs">
                {simMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl p-2.5 shadow-2xs whitespace-pre-line leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-700 text-white rounded-tr-xs'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                      <span className={`block text-[9px] text-right mt-1 opacity-70 ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick option buttons for simulator */}
              <div className="p-1.5 bg-slate-50 border-t border-slate-200 flex gap-1 overflow-x-auto text-[11px]">
                <button
                  onClick={() => { setSimInput('1'); }}
                  className="whitespace-nowrap px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  1 - Planos
                </button>
                <button
                  onClick={() => { setSimInput('2'); }}
                  className="whitespace-nowrap px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  2 - Aula Experimental
                </button>
                <button
                  onClick={() => { setSimInput('3'); }}
                  className="whitespace-nowrap px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  3 - PIX
                </button>
                <button
                  onClick={() => { setSimInput('4'); }}
                  className="whitespace-nowrap px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  4 - Humano
                </button>
              </div>

              {/* Simulator Input */}
              <form onSubmit={handleSendSimulator} className="p-2 bg-white border-t border-slate-200 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Digite uma mensagem ou número..."
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-hidden focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-emerald-500"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Simulator details & instructions */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-600" />
                Testador de Automação em Tempo Real
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use este simulador para testar como seus clientes e leads são recebidos pelo WhatsApp. O robô responde automaticamente comandos numéricos do menu (1 a 4) ou perguntas abertas usando a inteligência artificial treinada da <strong>VB SPORT</strong>.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="font-bold text-slate-800">Experimente digitar no simulador:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong className="text-slate-800">"1"</strong> ou <em>"qual o valor da mensalidade?"</em></li>
                  <li><strong className="text-slate-800">"2"</strong> ou <em>"quero agendar aula experimental"</em></li>
                  <li><strong className="text-slate-800">"3"</strong> ou <em>"manda a chave pix"</em></li>
                  <li><strong className="text-slate-800">"4"</strong> ou <em>"falar com atendente"</em></li>
                  <li><em>"quais horários vocês abrem no sábado?"</em></li>
                </ul>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>O robô está ativo e conectado no WhatsApp Oficial: <strong>+55 (11) 98765-4321</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Flow list */}
      {activeTab === 'fluxos' && (
        <div className="space-y-3">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-slate-300 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{flow.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    flow.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {flow.active ? 'Ativo' : 'Pausado'}
                  </span>
                  <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    Tipo: {flow.responseType}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{flow.description}</p>
                <div className="text-[11px] text-slate-400">
                  Gatilho: <strong className="text-slate-700">{flow.triggerKeyword}</strong> • Etapas: {flow.stepsCount}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleFlow(flow.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    flow.active
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {flow.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {flow.active ? 'Pausar Fluxo' : 'Ativar Fluxo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 3: AI Knowledge Prompt */}
      {activeTab === 'ia_prompt' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Base de Conhecimento da IA (VB SPORT GPT)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalize como o robô com IA deve se comportar ao atender alunos e leads no WhatsApp.
            </p>
          </div>

          <div>
            <label className="font-bold text-xs text-slate-700 block mb-1.5">
              Prompt de Instrução da Academia:
            </label>
            <textarea
              rows={6}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 text-xs leading-relaxed focus:border-purple-600 focus:outline-hidden font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Dados sincronizados com o catálogo de planos da VB SPORT
            </span>
            <button
              onClick={() => alert("Configurações da Inteligência Artificial salvas com sucesso!")}
              className="rounded-lg bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 text-xs font-bold transition-colors"
            >
              Salvar Configurações da IA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
