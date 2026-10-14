import React from 'react';
import { OverviewData, Language } from '../types';
import { TrendingUp, Users, AlertTriangle, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

interface OverviewKpisProps {
  data: OverviewData | null;
  lang: Language;
  t: (key: string) => string;
}

export const OverviewKpis: React.FC<OverviewKpisProps> = ({ data, lang, t }) => {
  if (!data) return null;

  const kpis = data.kpis;
  const dist = data.severity_distribution;

  return (
    <div className="space-y-4">
      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Demand Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('kpi_total_demand')}
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {kpis.total_projected_demand.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'workers / 6M' : 'श्रमिक / 6 माह'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{lang === 'en' ? 'P10-P90 Range Model' : 'P10-P90 विश्वसनीयता'}</span>
            <span className="font-semibold text-emerald-600">96.2% {lang === 'en' ? 'Coverage' : 'कवरेज'}</span>
          </div>
        </div>

        {/* Training Supply Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('kpi_total_supply')}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {kpis.total_effective_supply.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'certified seats' : 'प्रमाणित सीटें'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>PMKVY + ITI Capacity</span>
            <span className="font-semibold text-blue-600">82.4% {lang === 'en' ? 'Avg Placement' : 'प्लेसमेंट'}</span>
          </div>
        </div>

        {/* Net Mismatch Gap Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('kpi_net_gap')}
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${kpis.net_mismatch_gap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {kpis.net_mismatch_gap > 0 ? `+${kpis.net_mismatch_gap.toLocaleString('en-IN')}` : kpis.net_mismatch_gap.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'net deficit seats' : 'शुद्ध कमी सीटें'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{kpis.monitored_districts} {lang === 'en' ? 'Districts' : 'ज़िले'}</span>
            <span className="text-xs font-semibold text-red-500">{kpis.critical_shortage_trades} {lang === 'en' ? 'Critical' : 'गंभीर'}</span>
          </div>
        </div>

        {/* Reallocation Opportunities Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('kpi_reallocation_opps')}
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-purple-700">
              12
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Active Optimization Plans' : 'सक्रिय अनुकूलन योजनाएं'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{lang === 'en' ? 'Est. Capex Savings' : 'अनुमानित बचत'}</span>
            <span className="font-semibold text-purple-700">₹88.62 {lang === 'en' ? 'Lakhs' : 'लाख'}</span>
          </div>
        </div>

      </div>

      {/* 5-Band Severity Spectrum Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {lang === 'en' ? '5-Band Mismatch Classification Spectrum' : '5-स्तरीय बेमेल वर्गीकरण स्पेक्ट्रम'}
          </h2>
          <span className="text-xs text-slate-500">
            {lang === 'en' ? 'SRS FR-GAP Standard: Direct Action Triggers' : 'एसआरएस मानक: त्वरित कार्रवाई ट्रिगर'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-red-50 border border-red-200">
            <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-red-900">{dist['CRITICAL_SHORTAGE'] || 0}</div>
              <div className="text-[10px] text-red-700 font-medium">{lang === 'en' ? 'Critical Shortage' : 'गंभीर कमी'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-lg bg-orange-50 border border-orange-200">
            <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-orange-900">{dist['SHORTAGE_WATCH'] || 0}</div>
              <div className="text-[10px] text-orange-700 font-medium">{lang === 'en' ? 'Shortage Watch' : 'कमी निगरानी'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-900">{dist['BALANCED'] || 0}</div>
              <div className="text-[10px] text-emerald-700 font-medium">{lang === 'en' ? 'Balanced' : 'संतुलित'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
            <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-blue-900">{dist['OVERSUPPLY_WATCH'] || 0}</div>
              <div className="text-[10px] text-blue-700 font-medium">{lang === 'en' ? 'Oversupply Watch' : 'अधिशेष निगरानी'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-lg bg-purple-50 border border-purple-200">
            <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-purple-900">{dist['CRITICAL_SURPLUS'] || 0}</div>
              <div className="text-[10px] text-purple-700 font-medium">{lang === 'en' ? 'Critical Surplus' : 'गंभीर अधिशेष'}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
