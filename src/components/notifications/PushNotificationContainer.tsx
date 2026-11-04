import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X, 
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { PushNotification } from '../../services/notificationService';
import { TabType } from '../../types';

interface PushNotificationContainerProps {
  onNavigateTab?: (tab: TabType) => void;
}

interface ActivePushItem {
  notification: PushNotification;
  remainingMs: number;
  initialMs: number;
  isPaused: boolean;
}

export const PushNotificationContainer: React.FC<PushNotificationContainerProps> = ({
  onNavigateTab
}) => {
  const [activePushes, setActivePushes] = useState<ActivePushItem[]>([]);

  useEffect(() => {
    const handleNewPush = (e: Event) => {
      const customEvent = e as CustomEvent<PushNotification>;
      const notif = customEvent.detail;
      if (!notif) return;

      const duration = notif.autoDismissMs || 5000;

      setActivePushes(prev => [
        {
          notification: notif,
          remainingMs: duration,
          initialMs: duration,
          isPaused: false
        },
        ...prev.slice(0, 4) // max 5 simultaneous on screen
      ]);
    };

    window.addEventListener('vbsport_push_notification_event', handleNewPush);
    return () => {
      window.removeEventListener('vbsport_push_notification_event', handleNewPush);
    };
  }, []);

  // Countdown timer for active push notifications
  useEffect(() => {
    if (activePushes.length === 0) return;

    const interval = setInterval(() => {
      setActivePushes(prev => {
        return prev
          .map(item => {
            if (item.isPaused) return item;
            return {
              ...item,
              remainingMs: item.remainingMs - 100
            };
          })
          .filter(item => item.remainingMs > 0);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activePushes.length]);

  const handleDismiss = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActivePushes(prev => prev.filter(p => p.notification.id !== id));
  };

  const handleAction = (item: ActivePushItem) => {
    handleDismiss(item.notification.id);
    if (item.notification.linkTab && onNavigateTab) {
      onNavigateTab(item.notification.linkTab);
    }
  };

  const setPaused = (id: string, isPaused: boolean) => {
    setActivePushes(prev =>
      prev.map(p => (p.notification.id === id ? { ...p, isPaused } : p))
    );
  };

  if (activePushes.length === 0) return null;

  return (
    <div 
      className="fixed top-4 sm:top-6 right-3 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none"
      aria-live="polite"
    >
      {activePushes.map((item) => {
        const notif = item.notification;
        const progress = Math.max(0, Math.min(100, (item.remainingMs / item.initialMs) * 100));

        let icon = <Bell className="w-5 h-5 text-blue-600" />;
        let borderColor = 'border-blue-500/50';
        let barColor = 'bg-blue-600';
        let badgeBg = 'bg-blue-100 text-blue-800';

        if (notif.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
          borderColor = 'border-emerald-500/50';
          barColor = 'bg-emerald-600';
          badgeBg = 'bg-emerald-100 text-emerald-800';
        } else if (notif.type === 'warning' || notif.type === 'alert') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
          borderColor = 'border-amber-500/50';
          barColor = 'bg-amber-600';
          badgeBg = 'bg-amber-100 text-amber-800';
        } else if (notif.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-600" />;
          borderColor = 'border-rose-500/50';
          barColor = 'bg-rose-600';
          badgeBg = 'bg-rose-100 text-rose-800';
        }

        return (
          <div
            key={notif.id}
            onMouseEnter={() => setPaused(notif.id, true)}
            onMouseLeave={() => setPaused(notif.id, false)}
            onClick={() => handleAction(item)}
            className={`pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border ${borderColor} transition-all duration-300 transform hover:scale-[1.02] cursor-pointer relative overflow-hidden group animate-in slide-in-from-top-4 duration-200`}
          >
            {/* Top Bar with Module Badge and Time */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeBg}`}>
                  {notif.module.toUpperCase()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-medium">Alerta Push</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => handleDismiss(notif.id, e)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Fechar notificação"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification Body */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                  {notif.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>

            {/* Action Button Footer if available */}
            {notif.linkTab && (
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">Clique para abrir o módulo</span>
                <div className="flex items-center gap-1 text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>{notif.actionLabel || 'Ver Detalhes'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            {/* Animated Countdown Progress Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
              <div
                className={`h-full ${barColor} transition-all ease-linear duration-100`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
