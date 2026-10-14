import React, { useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  UserProfile,
  OverviewData,
  RankingItem,
  RecommendationItem,
  AlertItem
} from './types';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import { KapellaNavbar, ActiveTab } from './components/KapellaNavbar';
import { KapellaCharts } from './components/KapellaCharts';
import { KapellaMetricTiles } from './components/KapellaMetricTiles';
import { RankingsTable } from './components/RankingsTable';
import { DistrictDetailModal } from './components/DistrictDetailModal';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AlertsCenter } from './components/AlertsCenter';
import { AuditAndSourcesModal } from './components/AuditAndSourcesModal';

const API_BASE = 'http://127.0.0.1:8000/api';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('national_planner');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Filters
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedHorizon, setSelectedHorizon] = useState<number>(6);
  const [selectedBand, setSelectedBand] = useState<string>('');

  // Data
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & Drawers
  const [activeWhyItem, setActiveWhyItem] = useState<RankingItem | null>(null);
  const [activeSimulateItem, setActiveSimulateItem] = useState<RankingItem | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Localization helper
  const t = (key: string): string => {
    const dict = lang === 'hi' ? hiTranslations : enTranslations;
    return (dict as Record<string, string>)[key] || key;
  };

  // Fetch Current User Profile when role changes
  useEffect(() => {
    fetch(`${API_BASE}/auth/me?role=${role}`)
      .then(res => res.json())
      .then(data => setUserProfile(data))
      .catch(err => console.error('Error fetching profile:', err));
  }, [role]);

  // Fetch Overview Data
  const fetchOverview = () => {
    const params = new URLSearchParams();
    if (selectedState) params.append('state_code', selectedState);
    params.append('horizon_months', selectedHorizon.toString());

    fetch(`${API_BASE}/overview?${params.toString()}`)
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(err => console.error('Error fetching overview:', err));
  };

  // Fetch Rankings Data
  const fetchRankings = () => {
    const params = new URLSearchParams();
    if (selectedState) params.append('state_code', selectedState);
    if (selectedSector) params.append('sector_id', selectedSector);
    if (selectedBand) params.append('severity_band', selectedBand);
    params.append('horizon_months', selectedHorizon.toString());

    fetch(`${API_BASE}/rankings?${params.toString()}`)
      .then(res => res.json())
      .then(data => setRankings(data.items || []))
      .catch(err => console.error('Error fetching rankings:', err));
  };

  // Fetch Recommendations Data
  const fetchRecommendations = () => {
    fetch(`${API_BASE}/recommendations?horizon_months=${selectedHorizon}`)
      .then(res => res.json())
      .then(data => setRecommendations(data.recommendations || []))
      .catch(err => console.error('Error fetching recommendations:', err));
  };

  // Fetch Alerts Data
  const fetchAlerts = () => {
    const params = new URLSearchParams();
    if (selectedState) params.append('state_code', selectedState);

    fetch(`${API_BASE}/alerts?${params.toString()}`)
      .then(res => res.json())
      .then(data => setAlerts(data.alerts || []))
      .catch(err => console.error('Error fetching alerts:', err));
  };

  // Initial & Filter Data Loading
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchOverview(),
      fetchRankings(),
      fetchRecommendations(),
      fetchAlerts()
    ]).finally(() => setLoading(false));
  }, [selectedState, selectedSector, selectedHorizon, selectedBand]);

  // Handle Export Target Pack
  const handleExportTargetPack = () => {
    const url = `${API_BASE}/export/target-pack?horizon_months=${selectedHorizon}${selectedState ? `&state_code=${selectedState}` : ''}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-900 flex flex-col font-sans">
      
      {/* 1. Kapella-Styled Navigation Header & Tab Subheader */}
      <KapellaNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
        onLanguageChange={setLang}
        currentRole={role}
        onRoleChange={setRole}
        userProfile={userProfile}
        onExportTargetPack={handleExportTargetPack}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        alertsCount={alerts.length}
        reallocCount={recommendations.length}
        t={t}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Scoped View Notification Banner */}
        {userProfile && userProfile.scope !== 'ALL_STATES' && (
          <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-xs">
            <div>
              <strong>{lang === 'en' ? 'Scoped Role Active' : 'सीमांकित भूमिका सक्रिय'}:</strong> {userProfile.badge} ({userProfile.title})
            </div>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-mono font-semibold">
              RBAC Verified
            </span>
          </div>
        )}

        {/* ================= TAB 1: EXECUTIVE DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Visual Analytics Grid matching Kapella reference */}
            <KapellaCharts
              overview={overview}
              lang={lang}
              onOpenReallocationTab={() => setActiveTab('reallocation')}
              t={t}
            />

            {/* Metric Tiles matching Kapella reference */}
            <KapellaMetricTiles
              overview={overview}
              lang={lang}
              t={t}
            />

            {/* Quick Priority Action Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Top 5 Priority Shortage Trades */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {lang === 'en' ? 'Top Shortage Watch Clusters' : 'शीर्ष कमी निगरानी समूह'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {lang === 'en' ? 'Districts with steepest demand-supply deficit' : 'अधिकतम मांग-आपूर्ति घाटे वाले ज़िले'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('rankings')}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    {lang === 'en' ? 'View All Rankings →' : 'सभी रैंकिंग देखें →'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-left">
                        <th className="pb-2">District</th>
                        <th className="pb-2">Trade</th>
                        <th className="pb-2 text-right">Demand</th>
                        <th className="pb-2 text-right">Supply</th>
                        <th className="pb-2 text-right">Gap</th>
                        <th className="pb-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {rankings.slice(0, 5).map(r => (
                        <tr key={`${r.district_lgd}-${r.trade_id}`} className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-bold text-slate-800">
                            {lang === 'hi' ? r.district_name_hi : r.district_name}
                            <span className="block text-[10px] text-slate-400 font-normal">{r.state_code}</span>
                          </td>
                          <td className="py-2.5 text-slate-600">
                            {lang === 'hi' ? r.trade_name_hi : r.trade_name}
                          </td>
                          <td className="py-2.5 text-right font-bold text-slate-900">{r.demand_p50}</td>
                          <td className="py-2.5 text-right text-slate-600">{r.effective_supply}</td>
                          <td className="py-2.5 text-right font-bold text-red-600">+{r.net_gap}</td>
                          <td className="py-2.5 text-center">
                            <button
                              onClick={() => setActiveWhyItem(r)}
                              className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-bold text-[10px] hover:bg-teal-100"
                            >
                              Why?
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Quick Seat Reallocation Snapshot */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {lang === 'en' ? 'Seat Reallocation Quick Shifts' : 'सीट पुनर्वितरण त्वरित स्थानांतरण'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'en' ? 'Optimized Min-Cost moves' : 'अनुकूलित न्यूनतम लागत स्थानांतरण'}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('reallocation')}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      {lang === 'en' ? 'Explore 12 Routes →' : '12 मार्ग देखें →'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recommendations.slice(0, 3).map(rec => (
                      <div key={rec.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex justify-between items-center font-bold text-slate-800">
                          <span>{rec.source_district_name} → {rec.target_district_name}</span>
                          <span className="text-teal-700">+{rec.seats_to_shift} Seats</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {rec.target_trade_name} · Saves ₹{rec.estimated_capex_savings_lakhs}L
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{lang === 'en' ? 'Network Simplex Status:' : 'नेटवर्क सिम्प्लेक्स स्थिति:'}</span>
                  <span className="font-bold text-emerald-600">Converged (Optimal)</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: RANKINGS & GAPS ================= */}
        {activeTab === 'rankings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <RankingsTable
              items={rankings}
              lang={lang}
              selectedState={selectedState}
              onStateChange={setSelectedState}
              selectedSector={selectedSector}
              onSectorChange={setSelectedSector}
              selectedHorizon={selectedHorizon}
              onHorizonChange={setSelectedHorizon}
              selectedBand={selectedBand}
              onBandChange={setSelectedBand}
              onSelectWhy={(item) => setActiveWhyItem(item)}
              onSelectSimulate={(item) => setActiveSimulateItem(item)}
              t={t}
            />
          </div>
        )}

        {/* ================= TAB 3: SEAT REALLOCATION ================= */}
        {activeTab === 'reallocation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <RecommendationsPanel
              recommendations={recommendations}
              lang={lang}
              t={t}
            />
          </div>
        )}

        {/* ================= TAB 4: WHAT-IF SIMULATOR ================= */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <WhatIfSimulator
              initialItem={rankings[0] || null}
              lang={lang}
              onClose={() => setActiveTab('dashboard')}
              t={t}
            />
          </div>
        )}

        {/* ================= TAB 5: EARLY WARNING ALERTS ================= */}
        {activeTab === 'alerts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AlertsCenter
              alerts={alerts}
              lang={lang}
              t={t}
            />
          </div>
        )}

        {/* ================= TAB 6: DATA SOURCES & AUDIT ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AuditAndSourcesModal
              isOpen={true}
              onClose={() => setActiveTab('dashboard')}
              lang={lang}
              t={t}
            />
          </div>
        )}

      </main>

      {/* Floating Modal for "Why?" Drawer */}
      <DistrictDetailModal
        item={activeWhyItem}
        lang={lang}
        onClose={() => setActiveWhyItem(null)}
        t={t}
      />

      {/* Floating Modal for What-If from table click */}
      {activeSimulateItem && activeTab !== 'simulator' && (
        <WhatIfSimulator
          initialItem={activeSimulateItem}
          lang={lang}
          onClose={() => setActiveSimulateItem(null)}
          t={t}
        />
      )}

      {/* Global Audit Modal if opened from top action */}
      {isAuditModalOpen && activeTab !== 'audit' && (
        <AuditAndSourcesModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          lang={lang}
          t={t}
        />
      )}

      {/* Kapella-Styled Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 mt-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Kaushal Setu (कौशल सेतु)</span>
            <span>·</span>
            <span>Ministry of Skill Development & Entrepreneurship (MSDE)</span>
            <span>·</span>
            <span className="font-mono text-slate-400">SIH PS 26246</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="text-teal-700 font-semibold hover:underline"
            >
              Audit Manifest
            </button>
            <button
              onClick={handleExportTargetPack}
              className="text-teal-700 font-semibold hover:underline"
            >
              Export Pack
            </button>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              ● System Online
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
