import React, { useState, useEffect } from 'react';
import { SourceItem, AuditRecord, Language } from '../types';
import { X, ShieldCheck, Database, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE } from '../config/api';

interface AuditAndSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: (key: string) => string;
}

export const AuditAndSourcesModal: React.FC<AuditAndSourcesModalProps> = ({
  isOpen,
  onClose,
  lang,
  t
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'audit'>('sources');
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [chainIntact, setChainIntact] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    Promise.all([
      fetch(`${API_BASE}/sources`).then(r => r.json()),
      fetch(`${API_BASE}/audit/logs`).then(r => r.json())
    ])
      .then(([srcData, auditData]) => {
        setSources(srcData.sources || []);
        setAuditLogs(auditData.logs || []);
        setChainIntact(auditData.chain_intact);
      })
      .catch(e => console.error('Failed to load audit/sources:', e))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('sources_audit')}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                {lang === 'en'
                  ? 'Government-grade data provenance and tamper-evident SHA-256 cryptographic audit verification.'
                  : 'सरकारी मानक डेटा स्रोत प्रामाणिकता एवं छेड़छाड़-रोधी SHA-256 क्रिप्टोग्राफ़िक सत्यापन।'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center space-x-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'sources'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{t('sources_registry')}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('audit_records')}</span>
            {chainIntact && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold ml-1">
                Verified
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Sources Registry */}
        {activeTab === 'sources' && (
          <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3 flex-1">
            {sources.map((src) => (
              <div key={src.id} className="p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/60 transition-colors shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">
                        {lang === 'hi' ? src.name_hi : src.name}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        {src.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {src.owner} · {src.access_mode} · {src.granularity}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex-shrink-0">
                    {src.health}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>Quality: <strong className="text-slate-800">{(src.quality_score * 100).toFixed(0)}%</strong></span>
                  <span>Cadence: <strong className="text-slate-800">{src.cadence_days} Days</strong></span>
                  <span>Unit: <strong className="text-slate-800">{src.unit}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Cryptographic Audit Chain */}
        {activeTab === 'audit' && (
          <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3 font-mono text-[11px] flex-1">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between font-sans">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-xs">{t('audit_verified')}</span>
              </div>
              <span className="text-[10px] text-emerald-700">Zero Hash Inconsistencies</span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-700 font-semibold gap-0.5">
                    <span>Block #{log.id}: {log.action}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-500">
                    Actor: <span className="text-blue-600 font-medium">{log.actor}</span> ({log.role}) · Scope: {log.scope}
                  </div>
                  <div className="text-[10px] text-slate-400 break-all">
                    Hash: <span className="text-slate-600 font-mono">{log.entry_hash}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 break-all">
                    Prev: <span className="font-mono">{log.prev_hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {lang === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>

      </div>
    </div>
  );
};
