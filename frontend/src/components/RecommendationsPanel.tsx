import React, { useState } from 'react';
import { RecommendationItem, Language } from '../types';
import { ArrowRight, Check, ArrowRightLeft, Sparkles, MapPin, IndianRupee } from 'lucide-react';

interface RecommendationsPanelProps {
  recommendations: RecommendationItem[];
  lang: Language;
  t: (key: string) => string;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  lang,
  t
}) => {
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});

  const handleApprove = (id: string) => {
    setApprovedIds((prev) => ({ ...prev, [id]: true }));
  };

  const totalShifted = recommendations.reduce((acc, r) => acc + r.seats_to_shift, 0);
  const totalSavings = recommendations.reduce((acc, r) => acc + r.estimated_capex_savings_lakhs, 0).toFixed(2);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {t('reallocations')}
            </h2>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              Min-Cost Flow
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'en'
              ? 'Algorithmic optimization shifting dormant seats from surplus centres to deficit clusters, minimizing transit distances and capital costs.'
              : 'अतिरिक्त क्षमता वाले केंद्रों से कमी वाले समूहों में सीटों का स्थानांतरण, न्यूनतम यात्रा दूरी और पूंजीगत लागत के साथ।'}
          </p>
        </div>

        {/* Aggregate Savings Pill */}
        <div className="flex items-center space-x-3 bg-purple-50 border border-purple-200 px-3 py-2 rounded-xl text-xs">
          <div>
            <div className="text-[10px] text-purple-700 font-medium uppercase tracking-wider">{t('realloc_seats')}</div>
            <div className="text-sm font-bold text-purple-900">{totalShifted} {lang === 'en' ? 'Seats' : 'सीटें'}</div>
          </div>
          <div className="h-6 w-px bg-purple-200" />
          <div>
            <div className="text-[10px] text-purple-700 font-medium uppercase tracking-wider">{t('realloc_capex')}</div>
            <div className="text-sm font-bold text-purple-900">₹{totalSavings} {lang === 'en' ? 'Lakhs' : 'लाख'}</div>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="divide-y divide-slate-100 p-2">
        {recommendations.slice(0, 6).map((rec) => {
          const isApproved = approvedIds[rec.id];

          return (
            <div key={rec.id} className="p-4 hover:bg-slate-50/80 rounded-xl transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                
                {/* Left: Origin -> Destination Graphic */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    
                    {/* Source District */}
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{lang === 'hi' ? rec.source_district_name_hi : rec.source_district_name}</span>
                      <span className="text-[10px] text-blue-600 font-mono">({rec.source_state})</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400" />

                    {/* Target District */}
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'hi' ? rec.target_district_name_hi : rec.target_district_name}</span>
                      <span className="text-[10px] text-emerald-600 font-mono">({rec.target_state})</span>
                    </div>

                    {/* Trade Badge */}
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[11px]">
                      {lang === 'hi' ? rec.target_trade_name_hi : rec.target_trade_name}
                    </span>

                  </div>

                  {/* Plain Language Rationale */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'hi' ? rec.rationale_hi : rec.rationale_en}
                  </p>
                </div>

                {/* Right: Metrics & Action */}
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Seats & Distance */}
                  <div className="text-left sm:text-right text-xs">
                    <div className="font-bold text-slate-900 text-sm">
                      +{rec.seats_to_shift} <span className="text-xs font-normal text-slate-500">{lang === 'en' ? 'seats' : 'सीटें'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {rec.distance_km} km · saves ₹{rec.estimated_capex_savings_lakhs}L
                    </div>
                  </div>

                  {/* Approval Button */}
                  <button
                    onClick={() => handleApprove(rec.id)}
                    disabled={isApproved}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                    }`}
                  >
                    {isApproved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{lang === 'en' ? 'Proposal Staged' : 'प्रस्ताव स्वीकृत'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('realloc_apply')}</span>
                      </>
                    )}
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
