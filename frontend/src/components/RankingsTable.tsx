import React from 'react';
import { RankingItem, Language } from '../types';
import { HelpCircle, Sliders, ChevronDown, CheckCircle, ArrowUpRight, Filter } from 'lucide-react';

interface RankingsTableProps {
  items: RankingItem[];
  lang: Language;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  selectedHorizon: number;
  onHorizonChange: (horizon: number) => void;
  selectedBand: string;
  onBandChange: (band: string) => void;
  onSelectWhy: (item: RankingItem) => void;
  onSelectSimulate: (item: RankingItem) => void;
  t: (key: string) => string;
}

export const RankingsTable: React.FC<RankingsTableProps> = ({
  items,
  lang,
  selectedState,
  onStateChange,
  selectedSector,
  onSectorChange,
  selectedHorizon,
  onHorizonChange,
  selectedBand,
  onBandChange,
  onSelectWhy,
  onSelectSimulate,
  t
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Table Header & Controls Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>{t('rankings')}</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
              {items.length} {lang === 'en' ? 'trades monitored' : 'ट्रेड सक्रिय'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en' 
              ? 'Ranked by absolute skill deficit severity and leading industrial momentum.'
              : 'कौशल कमी की गंभीरता एवं औद्योगिक मांग गति के आधार पर प्राथमिकता क्रमबद्ध।'}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* State Filter */}
          <select
            aria-label="Filter by state"
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 shadow-sm outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">{t('all_states')}</option>
            <option value="MH">Maharashtra</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="TN">Tamil Nadu</option>
          </select>

          {/* Sector Filter */}
          <select
            aria-label="Filter by sector"
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 shadow-sm outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">{t('all_sectors')}</option>
            <option value="auto">Automotive & EV Mobility</option>
            <option value="capgoods">Capital Goods & Precision</option>
            <option value="esdm">Electronics & ESDM</option>
            <option value="healthcare">Healthcare & Allied</option>
            <option value="logistics">Logistics & Supply Chain</option>
          </select>

          {/* Severity Band Filter */}
          <select
            aria-label="Filter by severity band"
            value={selectedBand}
            onChange={(e) => onBandChange(e.target.value)}
            className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 shadow-sm outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">{lang === 'en' ? 'All Severity Bands' : 'सभी गंभीरता श्रेणियां'}</option>
            <option value="CRITICAL_SHORTAGE">Critical Shortage</option>
            <option value="SHORTAGE_WATCH">Shortage Watch</option>
            <option value="BALANCED">Balanced</option>
            <option value="OVERSUPPLY_WATCH">Oversupply Watch</option>
            <option value="CRITICAL_SURPLUS">Critical Surplus</option>
          </select>

          {/* Horizon Selector */}
          <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
            {[3, 6, 12].map((h) => (
              <button
                key={h}
                onClick={() => onHorizonChange(h)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedHorizon === h
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {h}M
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-3 py-3 w-12 text-center">{t('table_rank')}</th>
              <th scope="col" className="px-4 py-3">{t('table_district')}</th>
              <th scope="col" className="px-4 py-3">{t('table_trade')}</th>
              <th scope="col" className="px-4 py-3">{t('table_sector')}</th>
              <th scope="col" className="px-4 py-3 text-right">{t('table_demand')}</th>
              <th scope="col" className="px-4 py-3 text-right">{t('table_supply')}</th>
              <th scope="col" className="px-4 py-3 text-right">{t('table_gap')}</th>
              <th scope="col" className="px-4 py-3 text-center">{t('table_severity')}</th>
              <th scope="col" className="px-4 py-3 text-center">{t('table_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.slice(0, 30).map((row) => {
              const isShortage = row.net_gap > 0;
              return (
                <tr key={`${row.district_lgd}-${row.trade_id}`} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Rank */}
                  <td className="px-3 py-3 text-center font-bold text-slate-500">
                    {row.rank}
                  </td>

                  {/* District */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {lang === 'hi' ? row.district_name_hi : row.district_name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      LGD {row.district_lgd} · {row.state_code}
                    </div>
                  </td>

                  {/* Trade */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">
                      {lang === 'hi' ? row.trade_name_hi : row.trade_name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      NCO {row.nco_code} · NSQF Level {row.nsqf_level}
                    </div>
                  </td>

                  {/* Sector */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                      style={{ backgroundColor: `${row.sector_color}15`, color: row.sector_color }}
                    >
                      {lang === 'hi' ? row.sector_name_hi : row.sector_name}
                    </span>
                  </td>

                  {/* Demand (P10 - P90) */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="font-bold text-slate-900">{row.demand_p50}</div>
                    <div className="text-[10px] text-slate-400">
                      ({row.demand_p10} - {row.demand_p90})
                    </div>
                  </td>

                  {/* Effective Supply */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="font-semibold text-slate-700">{row.effective_supply}</div>
                    <div className="text-[10px] text-slate-400">
                      {row.sanctioned_seats} sanctioned
                    </div>
                  </td>

                  {/* Net Gap */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className={`font-bold ${isShortage ? 'text-red-600' : 'text-emerald-600'}`}>
                      {isShortage ? `+${row.net_gap}` : row.net_gap}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ratio {row.mismatch_ratio}x
                    </div>
                  </td>

                  {/* Severity Band Badge */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{ backgroundColor: `${row.severity_color}18`, color: row.severity_color }}
                    >
                      {lang === 'hi' ? row.severity_label_hi : row.severity_label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1">
                      
                      {/* Why? Button */}
                      <button
                        onClick={() => onSelectWhy(row)}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                        title={lang === 'en' ? 'Explain calculation factors' : 'गणना कारक देखें'}
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>{t('why_button')}</span>
                      </button>

                      {/* What-If Simulator Button */}
                      <button
                        onClick={() => onSelectSimulate(row)}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                        title={lang === 'en' ? 'Simulate seat adjustments' : 'नीतिगत हस्तक्षेप सिम्युलेट करें'}
                      >
                        <Sliders className="w-3 h-3" />
                        <span>{t('simulate_button')}</span>
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
        <span>
          {lang === 'en' 
            ? 'Showing top priority mismatch rankings · P10-P90 bounds calculated via Monte Carlo empirical Bayes shrinkage.' 
            : 'शीर्ष प्राथमिकता बेमेल रैंकिंग प्रदर्शित · P10-P90 सीमाएं मोंटे कार्लो अनुभवजन्य बेयस मॉडल द्वारा संकलित।'}
        </span>
        <span className="font-semibold text-blue-700">
          {items.length} {lang === 'en' ? 'Records' : 'प्रविष्टियां'}
        </span>
      </div>

    </div>
  );
};
