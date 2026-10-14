import React, { useState, useEffect } from 'react';
import { RankingItem, SimulationResult, Language } from '../types';
import { Sliders, RefreshCw, ArrowRight, CheckCircle2, TrendingUp, AlertCircle, X } from 'lucide-react';
import { API_BASE } from '../config/api';

interface WhatIfSimulatorProps {
  initialItem: RankingItem | null;
  lang: Language;
  onClose: () => void;
  t: (key: string) => string;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialItem,
  lang,
  onClose,
  t
}) => {
  const [seatDelta, setSeatDelta] = useState<number>(30);
  const [economicShock, setEconomicShock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const districtLgd = initialItem?.district_lgd || 490;
  const tradeId = initialItem?.trade_id || 'TRD-AUTO-01';

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district_lgd: districtLgd,
          trade_id: tradeId,
          seat_delta: seatDelta,
          economic_shock_pct: economicShock,
          horizon_months: 6,
          user_role: 'national_planner',
          actor: 'planner_demo'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error('Failed to run simulation:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [districtLgd, tradeId, seatDelta, economicShock]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 flex-shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('sim_title')}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {initialItem ? (lang === 'hi' ? initialItem.district_name_hi : initialItem.district_name) : 'Pune'} · {initialItem ? (lang === 'hi' ? initialItem.trade_name_hi : initialItem.trade_name) : 'CNC Operator'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable for mobile!) */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          <p className="text-xs text-slate-600">
            {t('sim_instructions')}
          </p>

          {/* Interactive Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
            
            {/* Slider 1: Seats Delta */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor="seat-delta-input" className="font-semibold text-slate-700">{t('sim_seat_delta')}</label>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${seatDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {seatDelta >= 0 ? `+${seatDelta}` : seatDelta} {lang === 'en' ? 'seats' : 'सीटें'}
                </span>
              </div>
              <input
                id="seat-delta-input"
                type="range"
                min="-60"
                max="120"
                step="5"
                value={seatDelta}
                onChange={(e) => setSeatDelta(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-60 seats</span>
                <span>0</span>
                <span>+120 seats</span>
              </div>
            </div>

            {/* Slider 2: Economic Shock Multiplier */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor="econ-shock-input" className="font-semibold text-slate-700">{t('sim_econ_shock')}</label>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${economicShock >= 0 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                  {economicShock >= 0 ? `+${economicShock}` : economicShock}%
                </span>
              </div>
              <input
                id="econ-shock-input"
                type="range"
                min="-30"
                max="50"
                step="5"
                value={economicShock}
                onChange={(e) => setEconomicShock(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-30%</span>
                <span>0% baseline</span>
                <span>+50% surge</span>
              </div>
            </div>

          </div>

          {/* Comparison Cards: Baseline vs Simulated */}
          {result && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                
                {/* Baseline Card */}
                <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t('sim_baseline')}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Demand (P50):</span>
                      <span className="font-semibold text-slate-800">{result.baseline.demand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Effective Supply:</span>
                      <span className="font-semibold text-slate-800">{result.baseline.effective_supply}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Net Gap:</span>
                      <span className="font-bold text-red-600">+{result.baseline.net_gap}</span>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-slate-500">Status:</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: `${result.baseline.color}20`, color: result.baseline.color }}
                      >
                        {lang === 'hi' ? result.baseline.severity_label_hi : result.baseline.severity_label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Card */}
                <div className="p-3.5 sm:p-4 rounded-xl border-2 border-blue-500 bg-blue-50/30">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center justify-between">
                    <span>{t('sim_simulated')}</span>
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold">Active</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Simulated Demand:</span>
                      <span className="font-semibold text-slate-900">{result.simulated.demand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Simulated Supply:</span>
                      <span className="font-semibold text-slate-900">{result.simulated.effective_supply}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Projected Net Gap:</span>
                      <span className={`font-bold ${result.simulated.net_gap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {result.simulated.net_gap > 0 ? `+${result.simulated.net_gap}` : result.simulated.net_gap}
                      </span>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-blue-100">
                      <span className="text-slate-500">Resulting Status:</span>
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ backgroundColor: `${result.simulated.color}25`, color: result.simulated.color }}
                      >
                        {lang === 'hi' ? result.simulated.severity_label_hi : result.simulated.severity_label}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Narrative Feedback Banner */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900 text-white text-xs flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px] sm:text-xs">
                  {lang === 'hi' ? result.narrative_hi : result.narrative_en}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 flex-shrink-0">
          <span className="text-[11px] text-center sm:text-left">
            {lang === 'en' ? 'Logged to tamper-evident audit chain with caller role.' : 'ऑडिट ट्रेल में स्वचालित रूप से दर्ज।'}
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {lang === 'en' ? 'Done' : 'पूर्ण'}
          </button>
        </div>

      </div>
    </div>
  );
};
