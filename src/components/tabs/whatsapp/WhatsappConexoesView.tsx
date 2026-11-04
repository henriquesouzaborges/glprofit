import React, { useState } from 'react';
import {
  Smartphone,
  Wifi,
  BatteryCharging,
  CheckCircle2,
  RefreshCw,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Send,
  AlertTriangle
} from 'lucide-react';
import { WhatsappConnectionInfo } from '../../../types';

interface WhatsappConexoesViewProps {
  connection: WhatsappConnectionInfo;
  onRefreshConnection: () => void;
}

export const WhatsappConexoesView: React.FC<WhatsappConexoesViewProps> = ({
  connection,
  onRefreshConnection
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(connection.apiToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(connection.webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSendTestPing = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Active Connection Status Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Instância WhatsApp Business VB SPORT
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conectado
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Número Conectado: <strong className="text-slate-900 font-mono">{connection.phone}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <QrCode className="h-4 w-4 text-slate-600" />
              Reconectar via QR Code
            </button>
            <button
              onClick={onRefreshConnection}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sincronizar
            </button>
          </div>
        </div>

        {/* Status Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Empresa Registrada</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              {connection.companyName}
              <span className="text-[10px] text-slate-500 font-normal">({connection.companyId})</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Qualidade do Sinal</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-emerald-600" />
              {connection.signalQuality}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Bateria do Aparelho</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <BatteryCharging className="h-3.5 w-3.5 text-emerald-600" />
              {connection.batteryLevel}% (Carregando)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Provedor Oficial</span>
            <span className="font-bold text-blue-700 truncate block">
              Meta Cloud API
            </span>
          </div>
        </div>
      </div>

      {/* Integration details & Webhook */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Credenciais da Integração da API
        </h4>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">URL do Webhook VB SPORT:</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={connection.webhookUrl}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-700 select-all"
              />
              <button
                onClick={handleCopyWebhook}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 font-medium"
              >
                {copiedWebhook ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Chave de API (Token de Acesso):</label>
            <div className="flex gap-2">
              <input
                type="password"
                readOnly
                value={connection.apiToken}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-700 select-all"
              />
              <button
                onClick={handleCopyToken}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 font-medium"
              >
                {copiedToken ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-700 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Instância Ativa (ID 37054276)
          </span>

          <button
            onClick={handleSendTestPing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors"
          >
            <Send className="h-3 w-3" />
            {testSent ? 'Mensagem de Teste Enviada!' : 'Testar Conexão WhatsApp'}
          </button>
        </div>
      </div>

      {/* QR Code Modal for Reconnecting */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl border border-slate-200 text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Escanear QR Code WhatsApp</h3>
            <p className="text-xs text-slate-500">
              Abra o WhatsApp no celular comercial da VB SPORT, vá em <strong>Aparelhos Conectados &gt; Conectar Aparelho</strong> e aponte a câmera.
            </p>

            {/* QR Code placeholder mockup */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block mx-auto">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://vbsport.com.br/whatsapp/connect"
                alt="QR Code WhatsApp Oficial"
                className="h-44 w-44 mx-auto rounded"
              />
            </div>

            <div className="text-[11px] text-slate-500">
              Aguardando leitura... Código expira em 45 segundos.
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full rounded-lg bg-slate-800 text-white py-2 text-xs font-bold hover:bg-slate-700"
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
