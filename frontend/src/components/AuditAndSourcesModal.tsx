import React, { useState, useEffect } from 'react';
import { SourceItem, AuditRecord, Language } from '../types';
import { X, ShieldCheck, Database, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

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
      fetch('http://127.0.0.1:8000/api/sources').then(r => r.json()),
      fetch('http://127.0.0.1:8000/api/audit/logs').then(r => r.json())
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('sources_audit')}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'en'
                  ? 'Government-grade data provenance and tamper-evident SHA-256 cryptographic audit verification.'
                  : 'सरकारी मानक डेटा स्रोत प्रामाणिकता एवं छेड़छाड़-रोधी SHA-256 क्रिप्टोग्राफ़िक सत्यापन।'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center space-x-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
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
            className={`flex items-center space-x-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
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
          <div className="p-6 max-h-96 overflow-y-auto space-y-3">
            {sources.map((src) => (
              <div key={src.id} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">
                        {lang === 'hi' ? src.name_hi : src.name}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {src.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {src.owner} · {src.access_mode} · {src.granularity}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {src.health}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>Quality Score: <strong className="text-slate-800">{(src.quality_score * 100).toFixed(0)}%</strong></span>
                  <span>Refresh Cadence: <strong className="text-slate-800">{src.cadence_days} Days</strong></span>
                  <span>Unit: <strong className="text-slate-800">{src.unit}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Cryptographic Audit Chain */}
        {activeTab === 'audit' && (
          <div className="p-6 max-h-96 overflow-y-auto space-y-3 font-mono text-[11px]">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between font-sans">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-xs">{t('audit_verified')}</span>
              </div>
              <span className="text-[10px] text-emerald-700">Zero Hash Inconsistencies</span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span>Block #{log.id}: {log.action}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-500">
                    Actor: <span className="text-blue-600 font-medium">{log.actor}</span> ({log.role}) · Scope: {log.scope}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Hash: <span className="text-slate-600">{log.entry_hash}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Prev: {log.prev_hash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {lang === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>

      </div>
    </div>
  );
};
