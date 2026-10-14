import React from 'react';
import { OverviewData, Language } from '../types';
import { TrendingUp, Users, AlertTriangle, ArrowRightLeft, ShieldCheck, MapPin, Factory } from 'lucide-react';

interface KapellaMetricTilesProps {
  overview: OverviewData | null;
  lang: Language;
  t: (key: string) => string;
}

export const KapellaMetricTiles: React.FC<KapellaMetricTilesProps> = ({
  overview,
  lang,
  t
}) => {
  if (!overview) return null;

  const k = overview.kpis;
  const demandCoveragePct = 78;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-6">
      
      {/* Tile 1: Solid Blue Card matching Kapella's Bandwidth Usage card (Col 3) */}
      <div className="lg:col-span-3 bg-blue-600 rounded-2xl p-5 text-white shadow-[0_4px_15px_-2px_rgba(37,99,235,0.4)] flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider">
            {t('kpi_total_demand')}
          </div>
          <div className="text-2xl font-extrabold mt-1 tracking-tight">
            {k.total_projected_demand.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-blue-200">
              ({lang === 'en' ? 'P50 Forecast' : 'पूर्वानुमान'})
            </span>
          </div>

          {/* Yellow progress bar matching Kapella card */}
          <div className="w-full bg-blue-700/60 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${demandCoveragePct}%` }}
            />
          </div>
        </div>

        <div className="pt-3 text-[11px] text-blue-100 flex items-center justify-between">
          <span>{lang === 'en' ? 'Supply Readiness' : 'आपूर्ति तैयारी'}</span>
          <span className="font-bold text-white">{demandCoveragePct}%</span>
        </div>
      </div>

      {/* Tile 2: Clean White Card with Bottom Purple Accent (Col 3) */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border-b-4 border-b-indigo-500 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {k.total_effective_supply.toLocaleString('en-IN')}
          </div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">
            {t('kpi_total_supply')}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
            PMKVY 4.0 · CTS/ITI · Poly
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{lang === 'en' ? 'Avg Absorption' : 'औसत प्लेसमेंट'}</span>
          <span className="font-bold text-indigo-600">82.4%</span>
        </div>
      </div>

      {/* Tile 3: Clean White Card with Bottom Teal/Emerald Accent (Col 3) */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border-b-4 border-b-teal-500 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-baseline space-x-1">
            <span className={k.net_mismatch_gap > 0 ? 'text-red-600' : 'text-emerald-600'}>
              {k.net_mismatch_gap > 0 ? `+${k.net_mismatch_gap.toLocaleString('en-IN')}` : k.net_mismatch_gap.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">
            {t('kpi_net_gap')}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
            {k.critical_shortage_trades} {lang === 'en' ? 'Critical Shortage Clusters' : 'गंभीर कमी समूह'}
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{lang === 'en' ? 'Districts Monitored' : 'विश्लेषित ज़िले'}</span>
          <span className="font-bold text-teal-700">{k.monitored_districts} {lang === 'en' ? 'Hubs' : 'केंद्र'}</span>
        </div>
      </div>

      {/* Tile 4: Location / District Focus Card matching Kapella's Canada weather card (Col 3) */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1 text-slate-800 font-bold text-sm">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Pune Corridor</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Maharashtra · Auto Mega-Hub</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              LIVE
            </span>
          </div>

          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-slate-900">+22.4%</span>
            <span className="text-[11px] text-slate-500 font-medium">Industrial Power Surge</span>
          </div>
        </div>

        {/* Mini stats row matching Kapella's spending/income pill */}
        <div className="pt-3 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-blue-50/70 p-1.5 rounded-lg">
            <div className="text-[10px] text-blue-600 font-medium">{lang === 'en' ? 'Direct Demand' : 'प्रत्यक्ष मांग'}</div>
            <div className="font-bold text-blue-900 text-xs">31,450</div>
          </div>
          <div className="bg-purple-50/70 p-1.5 rounded-lg">
            <div className="text-[10px] text-purple-600 font-medium">{lang === 'en' ? 'Leontief Boost' : 'लियोनटिफ बूस्ट'}</div>
            <div className="font-bold text-purple-900 text-xs">+14,278</div>
          </div>
        </div>
      </div>

    </div>
  );
};
