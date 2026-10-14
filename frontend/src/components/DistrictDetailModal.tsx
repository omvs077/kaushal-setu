import React from 'react';
import { RankingItem, Language } from '../types';
import { X, Zap, Truck, Briefcase, CreditCard, Network, ShieldCheck } from 'lucide-react';

interface DistrictDetailModalProps {
  item: RankingItem | null;
  lang: Language;
  onClose: () => void;
  t: (key: string) => string;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  item,
  lang,
  onClose,
  t
}) => {
  if (!item) return null;

  const f = item.factors;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold"
                style={{ backgroundColor: `${item.severity_color}20`, color: item.severity_color }}
              >
                {lang === 'hi' ? item.severity_label_hi : item.severity_label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                LGD {item.district_lgd} · {item.state_code}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {lang === 'hi' ? item.district_name_hi : item.district_name} — {lang === 'hi' ? item.trade_name_hi : item.trade_name}
            </h2>
            <p className="text-xs text-slate-500">
              {t('why_drawer_subtitle')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Summary Metric Ribbon */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-center text-xs">
            <div>
              <div className="text-slate-500 font-medium">{lang === 'en' ? 'P50 Demand' : 'P50 अनुमानित मांग'}</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{item.demand_p50}</div>
              <div className="text-[10px] text-slate-400">({item.demand_p10} - {item.demand_p90})</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">{lang === 'en' ? 'Effective Supply' : 'प्रभावी आपूर्ति'}</div>
              <div className="text-lg font-bold text-slate-800 mt-0.5">{item.effective_supply}</div>
              <div className="text-[10px] text-slate-400">{item.sanctioned_seats} sanctioned</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">{lang === 'en' ? 'Net Mismatch' : 'शुद्ध अंतर'}</div>
              <div className={`text-lg font-bold mt-0.5 ${item.net_gap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {item.net_gap > 0 ? `+${item.net_gap}` : item.net_gap}
              </div>
              <div className="text-[10px] text-slate-400">{item.mismatch_ratio}x demand ratio</div>
            </div>
          </div>

          {/* Factor Attribution Decomposition */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-1.5">
              <span>{t('telemetry_drivers')}</span>
              <span className="text-[10px] font-normal text-slate-400">({lang === 'en' ? 'Leading Elasticity Contributions' : 'अग्रणी लोच योगदान'})</span>
            </h3>

            <div className="space-y-3">
              
              {/* Factor 1: Industrial Electricity */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'en' ? 'DISCOM Industrial Power Load Surge' : 'डिस्कॉम औद्योगिक बिजली वृद्धि'}</span>
                  </span>
                  <span className="font-bold text-amber-600">+{f.power_telemetry_contrib_pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, f.power_telemetry_contrib_pct * 3))}%` }}
                  />
                </div>
              </div>

              {/* Factor 2: E-Way Bills */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>{lang === 'en' ? 'GSTN Inter-State Freight E-Way Bill Velocity' : 'जीएसटीएन ई-वे बिल फ्रेट गतिशीलता'}</span>
                  </span>
                  <span className="font-bold text-blue-600">+{f.eway_bill_contrib_pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, f.eway_bill_contrib_pct * 3))}%` }}
                  />
                </div>
              </div>

              {/* Factor 3: Online Postings & NCS */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    <span>{lang === 'en' ? 'NCS / e-Shram Job Posting Velocity' : 'एनसीएस / ई-श्रम जॉब पोस्टिंग गति'}</span>
                  </span>
                  <span className="font-bold text-emerald-600">+{f.postings_momentum_contrib_pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, f.postings_momentum_contrib_pct * 3))}%` }}
                  />
                </div>
              </div>

              {/* Factor 4: Bank Credit */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <span>{lang === 'en' ? 'RBI District MSME Credit Deployment' : 'आरबीआई ज़िला एमएसएमई ऋण विस्तार'}</span>
                  </span>
                  <span className="font-bold text-purple-600">+{f.bank_credit_contrib_pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, f.bank_credit_contrib_pct * 3))}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Leontief Multiplier Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs">
            <div className="flex items-start space-x-3">
              <Network className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-blue-900">
                  {t('leontief_multiplier')}: {f.indirect_supply_chain_multiplier}x
                </div>
                <p className="text-blue-800 mt-1 leading-relaxed">
                  {lang === 'en'
                    ? `Accounting for direct factory hiring plus indirect Tier-1/Tier-2 vendor demand adds a +${f.leontief_boost_pct}% structural employment boost via Indian Input-Output technical coefficient matrices.`
                    : `प्रत्यक्ष फैक्ट्री भर्ती के साथ-साथ टियर-1/टियर-2 आपूर्तिकर्ताओं की मांग को शामिल करने से इनपुट-आउटपुट मैट्रिक्स के माध्यम से +${f.leontief_boost_pct}% अतिरिक्त रोजगार मांग संकलित होती है।`}
                </p>
              </div>
            </div>
          </div>

          {/* Provenance and Confidence Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('confidence_rating')}: <strong className="text-slate-800">{(item.confidence_score * 100).toFixed(0)}%</strong></span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
              {t('provenance_badge')}
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {lang === 'en' ? 'Close Drawer' : 'बंद करें'}
          </button>
        </div>

      </div>
    </div>
  );
};
