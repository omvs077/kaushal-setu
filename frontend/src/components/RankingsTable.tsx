import React from 'react';
import { RankingItem, Language } from '../types';
import {
  HelpCircle,
  Sliders,
  MapPin,
  Briefcase,
  Clock,
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';

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
  isCompactSplitView?: boolean;
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
  isCompactSplitView = false,
  t
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span>{t('rankings')}</span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                {items.length} {lang === 'en' ? 'Trades' : 'ट्रेड'}
              </span>
            </h3>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            {[3, 6, 12].map((h) => (
              <button
                key={h}
                onClick={() => onHorizonChange(h)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  selectedHorizon === h
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {h}M
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* State Filter */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-2xs text-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1 flex-shrink-0" />
            <select
              aria-label="Filter by state"
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none pr-1 cursor-pointer"
            >
              <option value="">{t('all_states')}</option>
              <option value="MH">Maharashtra</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="TN">Tamil Nadu</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-2xs text-xs">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 mr-1 flex-shrink-0" />
            <select
              aria-label="Filter by sector"
              value={selectedSector}
              onChange={(e) => onSectorChange(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none pr-1 cursor-pointer max-w-[140px] truncate"
            >
              <option value="">{t('all_sectors')}</option>
              <option value="auto">Automotive & EV</option>
              <option value="capgoods">Capital Goods</option>
              <option value="esdm">Electronics & ESDM</option>
              <option value="healthcare">Healthcare</option>
              <option value="logistics">Logistics</option>
            </select>
          </div>

          {/* Severity Band Filter */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-2xs text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mr-1 flex-shrink-0" />
            <select
              aria-label="Filter by severity band"
              value={selectedBand}
              onChange={(e) => onBandChange(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none pr-1 cursor-pointer"
            >
              <option value="">{lang === 'en' ? 'All Severity Bands' : 'सभी श्रेणियां'}</option>
              <option value="CRITICAL_SHORTAGE">Critical Shortage</option>
              <option value="SHORTAGE_WATCH">Shortage Watch</option>
              <option value="BALANCED">Balanced</option>
              <option value="OVERSUPPLY_WATCH">Oversupply Watch</option>
              <option value="CRITICAL_SURPLUS">Critical Surplus</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto flex-1 max-h-[520px]">
        <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0 z-10 uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="px-3 py-2.5 text-center w-10">#</th>
              <th scope="col" className="px-3 py-2.5">{t('table_district')}</th>
              <th scope="col" className="px-3 py-2.5">{t('table_trade')}</th>
              {!isCompactSplitView && (
                <th scope="col" className="px-3 py-2.5">{t('table_sector')}</th>
              )}
              <th scope="col" className="px-3 py-2.5 text-right">{t('table_demand')}</th>
              <th scope="col" className="px-3 py-2.5 text-right">{t('table_supply')}</th>
              <th scope="col" className="px-3 py-2.5 text-right">{t('table_gap')}</th>
              <th scope="col" className="px-3 py-2.5 text-center">{t('table_severity')}</th>
              <th scope="col" className="px-3 py-2.5 text-center">{t('table_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.map((row) => {
              const isShortage = row.net_gap > 0;
              return (
                <tr key={`${row.district_lgd}-${row.trade_id}`} className="hover:bg-teal-50/30 transition-colors">
                  
                  {/* Rank */}
                  <td className="px-3 py-2.5 text-center font-bold text-slate-400">
                    {row.rank}
                  </td>

                  {/* District */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="font-bold text-slate-900">
                      {lang === 'hi' ? row.district_name_hi : row.district_name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {row.state_code} · LGD {row.district_lgd}
                    </div>
                  </td>

                  {/* Trade */}
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-slate-800 leading-tight">
                      {lang === 'hi' ? row.trade_name_hi : row.trade_name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      NCO {row.nco_code}
                    </div>
                  </td>

                  {/* Sector (hidden on narrow split view for maximum readability) */}
                  {!isCompactSplitView && (
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ backgroundColor: `${row.sector_color}18`, color: row.sector_color }}
                      >
                        {lang === 'hi' ? row.sector_name_hi : row.sector_name}
                      </span>
                    </td>
                  )}

                  {/* Demand (P10 - P90) */}
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    <span className="font-bold text-slate-900">{row.demand_p50}</span>
                    <span className="text-[10px] text-slate-400 block">
                      ({row.demand_p10}-{row.demand_p90})
                    </span>
                  </td>

                  {/* Effective Supply */}
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    <span className="font-semibold text-slate-700">{row.effective_supply}</span>
                    <span className="text-[10px] text-slate-400 block">
                      {row.sanctioned_seats} cap
                    </span>
                  </td>

                  {/* Net Gap */}
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    <span className={`font-bold ${isShortage ? 'text-red-600' : 'text-emerald-600'}`}>
                      {isShortage ? `+${row.net_gap}` : row.net_gap}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {row.mismatch_ratio}x
                    </span>
                  </td>

                  {/* Severity Badge */}
                  <td className="px-3 py-2.5 text-center whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold"
                      style={{ backgroundColor: `${row.severity_color}18`, color: row.severity_color }}
                    >
                      {lang === 'hi' ? row.severity_label_hi : row.severity_label}
                    </span>
                  </td>

                  {/* Action Buttons with Icons */}
                  <td className="px-3 py-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1.5">
                      
                      {/* Why? Button */}
                      <button
                        onClick={() => onSelectWhy(row)}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md border border-teal-200 transition-colors"
                        title={lang === 'en' ? 'View Factor Attribution' : 'कारक विवरण देखें'}
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Why?</span>
                      </button>

                      {/* Test What-If Button */}
                      <button
                        onClick={() => onSelectSimulate(row)}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition-colors"
                        title={lang === 'en' ? 'Simulate policy intervention' : 'हस्तक्षेप सिम्युलेट करें'}
                      >
                        <Sliders className="w-3 h-3 text-slate-600" />
                        <span>Simulate</span>
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="truncate">
          {lang === 'en'
            ? 'P10-P90 range via Monte Carlo Bayesian shrinkage'
            : 'मोंटे कार्लो अनुभवजन्य मॉडल द्वारा संकलित सीमा'}
        </span>
        <span className="font-bold text-slate-800 flex-shrink-0 ml-2">
          {items.length} {lang === 'en' ? 'Rows' : 'पंक्तियां'}
        </span>
      </div>

    </div>
  );
};
