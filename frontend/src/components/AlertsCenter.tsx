import React, { useState } from 'react';
import { AlertItem, Language } from '../types';
import { Bell, Check, ShieldAlert, ArrowUpRight, Clock } from 'lucide-react';

interface AlertsCenterProps {
  alerts: AlertItem[];
  lang: Language;
  loading?: boolean;
  t: (key: string) => string;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({ alerts, lang, loading = false, t }) => {
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const toggleAcknowledge = (id: string) => {
    setAcknowledged((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeAlerts = alerts.filter(a => !acknowledged[a.id]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                {t('alerts')}
              </h2>
              <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                {loading ? '...' : activeAlerts.length} {lang === 'en' ? 'Active' : 'सक्रिय'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'en'
                ? 'High-confidence early warnings raised when leading telemetry outpaces local capacity for 2+ consecutive runs.'
                : 'लगातार 2+ चरणों तक स्थानीय क्षमता से अधिक मांग रहने पर जारी उच्च-विश्वसनीयता पूर्व चेतावनियां।'}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {loading ? (
          // Loading Skeleton Alerts
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-4 bg-red-100/80 rounded" />
                    <div className="w-36 h-4 bg-slate-200/80 rounded" />
                    <div className="w-20 h-3 bg-slate-100 rounded" />
                  </div>
                  <div className="w-3/4 h-3 bg-slate-200/70 rounded-full" />
                  <div className="w-40 h-2.5 bg-slate-100 rounded-full" />
                </div>
                <div className="w-24 h-7 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))
        ) : alerts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm font-semibold text-slate-600">
              {lang === 'hi' ? 'कोई सक्रिय चेतावनी नहीं है' : 'No active alert flags'}
            </p>
          </div>
        ) : (
          alerts.slice(0, 10).map((alert) => {
          const isAck = acknowledged[alert.id];

          return (
            <div
              key={alert.id}
              className={`p-4 transition-all ${isAck ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50/80'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                
                {/* Left Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${alert.severity_color}20`, color: alert.severity_color }}
                    >
                      {lang === 'hi' ? alert.severity_label_hi : alert.severity_label}
                    </span>

                    <span className="text-xs font-bold text-slate-900">
                      {lang === 'hi' ? alert.district_name_hi : alert.district_name} · {lang === 'hi' ? alert.trade_name_hi : alert.trade_name}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {alert.id} · {alert.consecutive_runs} {lang === 'en' ? 'runs persistent' : 'चरणों से निरंतर'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lang === 'hi' ? alert.trigger_reason_hi : alert.trigger_reason_en}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp.replace('T', ' ').replace('Z', ' UTC')}</span>
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-red-600">
                      {alert.net_gap > 0 ? `+${alert.net_gap} gap` : `${alert.net_gap} gap`}
                    </span>
                  </div>
                </div>

                {/* Right Action */}
                <div className="self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => toggleAcknowledge(alert.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      isAck
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAck ? (lang === 'en' ? 'Acknowledged' : 'स्वीकृत') : (lang === 'en' ? 'Acknowledge' : 'स्वीकार करें')}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })
      )}
      </div>

    </div>
  );
};
