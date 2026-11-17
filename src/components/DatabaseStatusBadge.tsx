import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  Cloud, 
  ShieldCheck, 
  Layers, 
  HardDrive,
  AlertTriangle
} from 'lucide-react';
import { 
  subscribeDatabaseStatus, 
  DatabaseStatus, 
  initializeDatabase 
} from '../services/firebaseDbService';

export const DatabaseStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<DatabaseStatus>({
    connected: false,
    syncing: false,
    lastSync: null,
    error: null,
    collectionsCount: {},
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeDatabaseStatus((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleForceSync = async () => {
    setIsManualSyncing(true);
    await initializeDatabase();
    setTimeout(() => {
      setIsManualSyncing(false);
    }, 600);
  };

  const totalSyncedDocs = Object.values(status.collectionsCount).reduce<number>((acc, val) => acc + (Number(val) || 0), 0);
  const hasError = Boolean(status.error);
  const isConnected = status.connected && !hasError;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
          hasError
            ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-400/50 text-rose-100'
            : isConnected
              ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-400/30 text-white'
              : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-100'
        }`}
        title={status.error || 'Status do Banco de Dados Firebase Firestore'}
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            hasError ? 'bg-rose-400' : isConnected ? 'bg-emerald-400' : 'bg-amber-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            hasError ? 'bg-rose-500' : isConnected ? 'bg-emerald-500' : 'bg-amber-500'
          }`}></span>
        </span>
        <Database className={`w-3.5 h-3.5 ${
          hasError ? 'text-rose-200' : isConnected ? 'text-emerald-300' : 'text-amber-200'
        }`} />
        <span className={`hidden md:inline text-[11px] font-bold tracking-tight ${
          hasError ? 'text-rose-100' : isConnected ? 'text-emerald-200' : 'text-amber-100'
        }`}>
          {hasError ? 'Falha Conexão' : status.syncing ? 'Sincronizando...' : isConnected ? 'Firebase Ativo' : 'Conectando...'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                hasError
                  ? 'bg-rose-50 text-rose-600 border-rose-100'
                  : isConnected
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {hasError ? <AlertTriangle className="h-5 w-5" /> : <Cloud className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-xs">Banco de Dados em Nuvem</h4>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    hasError
                      ? 'bg-rose-100 text-rose-700'
                      : isConnected
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}>
                    {hasError ? 'Erro' : isConnected ? 'Ao Vivo' : 'Aguardando'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Firebase Firestore Enterprise</p>
              </div>
            </div>
            <button
              onClick={handleForceSync}
              disabled={isManualSyncing}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer"
              title="Testar conexão e sincronizar"
            >
              <RefreshCw className={`w-3 h-3 ${isManualSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Reconectar</span>
            </button>
          </div>

          {hasError && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Erro de Conexão / Permissão</span>
              </div>
              <p className="text-[10px] text-rose-700 break-words">{status.error}</p>
            </div>
          )}

          {/* Status Box */}
          <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                {hasError ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-600' : 'text-amber-500'}`} />
                )}
                Status da Conexão:
              </span>
              <span className={`font-bold ${
                hasError ? 'text-rose-700' : isConnected ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {hasError ? 'Falha na Sincronização' : isConnected ? 'Conectado & Sincronizado' : 'Verificando Conexão...'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                Registros Sincronizados:
              </span>
              <span className="font-bold text-slate-800">
                {totalSyncedDocs} documentos
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                Última Atualização:
              </span>
              <span className="font-mono text-[11px] text-slate-700">
                {status.lastSync || 'Sem registro'}
              </span>
            </div>
          </div>

          {/* Sync Guarantee Notice */}
          <div className="mt-3 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80 text-[11px] text-blue-900 leading-relaxed">
            <div className="flex items-start gap-1.5 font-bold mb-0.5 text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Política Zero-Mock Ativa</span>
            </div>
            <p className="text-[10px] text-blue-700/90 pl-5">
              Todos os dados exibidos refletem exclusivamente o estado real armazenado no Firebase Firestore, sem dados fictícios de fallback.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <Layers className="w-3 h-3 text-slate-500" />
              Coleções Monitoradas: {Object.keys(status.collectionsCount).length}
            </span>
            <span className={isConnected ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
              {isConnected ? '100% Real-Time' : 'Modo Alerta'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
