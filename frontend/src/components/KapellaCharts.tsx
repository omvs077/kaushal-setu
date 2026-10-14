import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { OverviewData, Language } from '../types';
import { Zap, Truck, CreditCard, Briefcase, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface KapellaChartsProps {
  overview: OverviewData | null;
  lang: Language;
  onOpenReallocationTab: () => void;
  t: (key: string) => string;
}

export const KapellaCharts: React.FC<KapellaChartsProps> = ({
  overview,
  lang,
  onOpenReallocationTab,
  t
}) => {
  if (!overview) return null;

  // Donut chart data from severity distribution
  const dist = overview.severity_distribution;
  const pieData = [
    { name: lang === 'hi' ? 'गंभीर कमी' : 'Critical Shortage', value: dist['CRITICAL_SHORTAGE'] || 0, color: '#ef4444' },
    { name: lang === 'hi' ? 'कमी निगरानी' : 'Shortage Watch', value: dist['SHORTAGE_WATCH'] || 0, color: '#f97316' },
    { name: lang === 'hi' ? 'संतुलित' : 'Balanced', value: dist['BALANCED'] || 0, color: '#10b981' },
    { name: lang === 'hi' ? 'अधिशेष निगरानी' : 'Oversupply Watch', value: dist['OVERSUPPLY_WATCH'] || 0, color: '#3b82f6' },
    { name: lang === 'hi' ? 'गंभीर अधिशेष' : 'Critical Surplus', value: dist['CRITICAL_SURPLUS'] || 0, color: '#8b5cf6' },
  ].filter(d => d.value > 0);

  // Sector breakdown data
  const maxDemand = Math.max(...overview.sector_breakdown.map(s => s.demand), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
      
      {/* 1. Sector Demand Horizontal Bars (Col 3.5) */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-800">
              {lang === 'en' ? 'Sector Skill Demand' : 'क्षेत्र-वार कौशल मांग'}
            </h3>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              6M Forecast
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-4">
            {lang === 'en' ? 'Projected worker demand across 5 focus industries' : '5 प्रमुख उद्योगों में अनुमानित कुशल जनशक्ति मांग'}
          </p>

          <div className="space-y-3">
            {overview.sector_breakdown.map((sec) => {
              const pct = Math.round((sec.demand / maxDemand) * 100);
              return (
                <div key={sec.sector_id}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-700 truncate max-w-[170px]">
                      {lang === 'hi' ? sec.sector_name_hi : sec.sector_name}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {sec.demand.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: sec.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{lang === 'en' ? 'Total Analyzed Demand:' : 'कुल विश्लेषित मांग:'}</span>
          <strong className="text-slate-800 font-mono font-bold">
            {overview.kpis.total_projected_demand.toLocaleString('en-IN')}
          </strong>
        </div>
      </div>

      {/* 2. Donut Chart: 5-Band Severity Distribution (Col 3) */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-800">
              {lang === 'en' ? 'Severity Spectrum' : 'गंभीरता स्पेक्ट्रम'}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              SRS FR-GAP
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            {lang === 'en' ? 'Trades classified into 5 operational bands' : '5 परिचालन श्रेणियों में वर्गीकृत ट्रेड'}
          </p>

          <div className="flex items-center justify-center my-1 relative h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={64}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} trades`, 'Count']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-extrabold text-slate-900 leading-none">
                {overview.kpis.monitored_trades * overview.kpis.monitored_districts}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                {lang === 'en' ? 'Pairs' : 'जोड़े'}
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] mt-2">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-slate-600 truncate">{p.name}</span>
                <span className="font-bold text-slate-800 ml-auto">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          {lang === 'en' ? 'Actionable Deficit Concentration: 72%' : 'सक्रिय कार्रवाई योग्य घाटा अनुपात: 72%'}
        </div>
      </div>

      {/* 3. Leading Telemetry Signals Status (Col 2.5) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-800">
              {lang === 'en' ? 'Telemetry Signals' : 'टेलीमेट्री संकेत'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            {lang === 'en' ? 'Leading growth momentum' : 'अग्रणी विकास दर गति'}
          </p>

          {/* Stacked color bar matching Kapella "Social Media Statistics" */}
          <div className="flex h-3 w-full rounded-full overflow-hidden mb-4 shadow-inner">
            <div className="bg-amber-500 w-[35%]" title="DISCOM Power" />
            <div className="bg-blue-600 w-[28%]" title="GSTN E-Way" />
            <div className="bg-purple-600 w-[22%]" title="RBI Credit" />
            <div className="bg-emerald-500 w-[15%]" title="NCS Postings" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px]">DISCOM Load</span>
              </span>
              <span className="font-bold text-amber-600">+22.4%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px]">GSTN E-Way</span>
              </span>
              <span className="font-bold text-blue-600">+18.2%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[11px]">RBI Credit</span>
              </span>
              <span className="font-bold text-purple-600">+16.5%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px]">NCS Postings</span>
              </span>
              <span className="font-bold text-emerald-600">+42.0%</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Freshness SLA:</span>
          <span className="font-semibold text-emerald-600">Within 1.5x</span>
        </div>
      </div>

      {/* 4. Kapella Hero Celebration / Announcement Card (Col 3) */}
      <div className="lg:col-span-3 bg-gradient-to-br from-teal-400 via-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-[0_4px_20px_-4px_rgba(20,184,166,0.5)] flex flex-col justify-between relative overflow-hidden">
        {/* Decorative Confetti & Banner Garland Graphic */}
        <div className="absolute top-0 right-0 left-0 h-10 pointer-events-none opacity-40">
          <div className="flex justify-around items-start">
            <span className="w-4 h-5 bg-yellow-300 clip-triangle transform rotate-12" />
            <span className="w-4 h-6 bg-pink-400 clip-triangle transform -rotate-6" />
            <span className="w-4 h-5 bg-purple-300 clip-triangle transform rotate-45" />
            <span className="w-4 h-6 bg-yellow-200 clip-triangle transform -rotate-12" />
            <span className="w-4 h-5 bg-blue-300 clip-triangle transform rotate-6" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>{lang === 'en' ? 'Optimization Active' : 'अनुकूलन सक्रिय'}</span>
          </div>

          <h3 className="text-lg font-extrabold leading-snug">
            {lang === 'en' ? '12 Reallocation Routes Ready' : '12 सीट पुनर्वितरण मार्ग तैयार'}
          </h3>

          <p className="text-xs text-white/90 mt-2 leading-relaxed">
            {lang === 'en'
              ? 'Shift surplus seats from Kanpur & Nashik to Pune & Noida. Mitigates critical shortage while saving ₹88.62 Lakhs in centre capex.'
              : 'कानपुर और नासिक से पुणे और नोएडा में अतिरिक्त सीटों का स्थानांतरण। नए केंद्र की स्थापना पर ₹88.62 लाख की बचत।'}
          </p>
        </div>

        <div className="pt-4 mt-2">
          <button
            onClick={onOpenReallocationTab}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white text-teal-800 text-xs font-bold shadow-md hover:bg-slate-50 transition-all"
          >
            <span>{lang === 'en' ? 'Review & Approve Plans' : 'योजनाओं की समीक्षा करें'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
