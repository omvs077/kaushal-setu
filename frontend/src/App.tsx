import React, { useState, useEffect, useMemo } from 'react';
import {
  Language,
  UserRole,
  UserProfile,
  OverviewData,
  RankingItem,
  DistrictSummary,
  RecommendationItem,
  AlertItem
} from './types';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import { KapellaNavbar, ActiveTab } from './components/KapellaNavbar';
import { KapellaCharts } from './components/KapellaCharts';
import { KapellaMetricTiles } from './components/KapellaMetricTiles';
import { RankingsTable } from './components/RankingsTable';
import { IndiaMap } from './components/IndiaMap';
import { DistrictDetailModal } from './components/DistrictDetailModal';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AlertsCenter } from './components/AlertsCenter';
import { AuditAndSourcesModal } from './components/AuditAndSourcesModal';
import { SplitSquareVertical, MapPin, X, Layers, Filter } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSplitMapOpen, setIsSplitMapOpen] = useState<boolean>(true);
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('national_planner');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedHorizon, setSelectedHorizon] = useState<number>(6);
  const [selectedBand, setSelectedBand] = useState<string>('');
  const [selectedDistrictLgd, setSelectedDistrictLgd] = useState<number | null>(null);

  // Core Data
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [districts, setDistricts] = useState<DistrictSummary[]>([]);
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

  // Fetch Districts Data for Live Map
  const fetchDistricts = () => {
    const params = new URLSearchParams();
    if (selectedState) params.append('state_code', selectedState);

    fetch(`${API_BASE}/districts?${params.toString()}`)
      .then(res => res.json())
      .then(data => setDistricts(data || []))
      .catch(err => console.error('Error fetching districts:', err));
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
      fetchDistricts(),
      fetchRankings(),
      fetchRecommendations(),
      fetchAlerts()
    ]).finally(() => setLoading(false));
  }, [selectedState, selectedSector, selectedHorizon, selectedBand]);

  // Client-side search and map-district filtering
  const filteredRankings = useMemo(() => {
    return rankings.filter(item => {
      // Map selection filter
      if (selectedDistrictLgd && item.district_lgd !== selectedDistrictLgd) {
        return false;
      }
      // Text search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDistrict = item.district_name.toLowerCase().includes(q) || item.district_name_hi.includes(q);
        const matchesTrade = item.trade_name.toLowerCase().includes(q) || item.trade_name_hi.includes(q);
        const matchesNco = item.nco_code.toLowerCase().includes(q);
        return matchesDistrict || matchesTrade || matchesNco;
      }
      return true;
    });
  }, [rankings, selectedDistrictLgd, searchQuery]);

  // Handle Export Target Pack
  const handleExportTargetPack = () => {
    const url = `${API_BASE}/export/target-pack?horizon_months=${selectedHorizon}${selectedState ? `&state_code=${selectedState}` : ''}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-900 flex flex-col font-sans">
      
      {/* 1. Left-Aligned Top Navigation Header & Subheader Tabs */}
      <KapellaNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isSplitMapOpen={isSplitMapOpen}
        onToggleSplitMap={() => setIsSplitMapOpen(prev => !prev)}
        lang={lang}
        onLanguageChange={setLang}
        currentRole={role}
        onRoleChange={setRole}
        onExportTargetPack={handleExportTargetPack}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        alertsCount={alerts.length}
        reallocCount={recommendations.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        t={t}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Scoped Role Banner if user is state/district scoped */}
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

        {/* Map District Filter Active Pill */}
        {selectedDistrictLgd && (
          <div className="mb-4 bg-teal-50 border border-teal-200 text-teal-900 px-4 py-2 rounded-xl text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {lang === 'en' ? 'Filtering by Selected District: ' : 'चयनित ज़िले द्वारा फ़िल्टर: '}
                <strong className="underline">
                  {districts.find(d => d.lgd === selectedDistrictLgd)?.name} (LGD {selectedDistrictLgd})
                </strong>
              </span>
            </div>
            <button
              onClick={() => setSelectedDistrictLgd(null)}
              className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1 bg-white px-2 py-0.5 rounded border border-teal-300"
            >
              <X className="w-3 h-3" />
              <span>{lang === 'en' ? 'Clear Map Filter' : 'फ़िल्टर हटाएं'}</span>
            </button>
          </div>
        )}

        {/* ================= TAB 1: EXECUTIVE DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Visual Analytics Grid matching reference */}
            <KapellaCharts
              overview={overview}
              lang={lang}
              onOpenReallocationTab={() => setActiveTab('reallocation')}
              t={t}
            />

            {/* Metric Tiles matching reference */}
            <KapellaMetricTiles
              overview={overview}
              lang={lang}
              t={t}
            />

            {/* SPLIT WINDOW FEATURE: Live Survey of India Map + Ranked Shortage Table Side-by-Side */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    {isSplitMapOpen 
                      ? (lang === 'en' ? 'Split Window: Live Spatial Map & Priority Deficits' : 'स्प्लिट स्क्रीन: लाइव मानचित्र एवं प्राथमिकता घाटा तालिका')
                      : (lang === 'en' ? 'Priority Shortage Clusters' : 'प्राथमिकता कमी समूह')}
                  </h3>
                </div>

                <button
                  onClick={() => setIsSplitMapOpen(prev => !prev)}
                  className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <SplitSquareVertical className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {isSplitMapOpen ? (lang === 'en' ? 'Hide Map' : 'मानचित्र छिपाएं') : (lang === 'en' ? 'Open Split Map' : 'स्प्लिट मैप खोलें')}
                  </span>
                </button>
              </div>

              {isSplitMapOpen ? (
                /* Split Window Grid (Map on left, data on right) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Left Pane: Interactive Survey of India Map (5 cols) */}
                  <div className="lg:col-span-5 h-[560px]">
                    <IndiaMap
                      districts={districts}
                      selectedDistrictLgd={selectedDistrictLgd}
                      onSelectDistrict={(lgd) => {
                        setSelectedDistrictLgd(prev => prev === lgd ? null : lgd);
                      }}
                      lang={lang}
                    />
                  </div>

                  {/* Right Pane: Compact Ranked Gap Table (7 cols) */}
                  <div className="lg:col-span-7 h-[560px]">
                    <RankingsTable
                      items={filteredRankings.slice(0, 15)}
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
                      isCompactSplitView={true}
                      t={t}
                    />
                  </div>

                </div>
              ) : (
                /* Full Table View when Map is Closed */
                <RankingsTable
                  items={filteredRankings.slice(0, 20)}
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
                  isCompactSplitView={false}
                  t={t}
                />
              )}
            </div>

            {/* Quick Reallocation Snapshot */}
            <RecommendationsPanel
              recommendations={recommendations.slice(0, 4)}
              lang={lang}
              t={t}
            />

          </div>
        )}

        {/* ================= TAB 2: FULL RANKINGS & GAPS ================= */}
        {activeTab === 'rankings' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {isSplitMapOpen ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-5 h-[580px]">
                  <IndiaMap
                    districts={districts}
                    selectedDistrictLgd={selectedDistrictLgd}
                    onSelectDistrict={(lgd) => setSelectedDistrictLgd(prev => prev === lgd ? null : lgd)}
                    lang={lang}
                  />
                </div>
                <div className="lg:col-span-7 h-[580px]">
                  <RankingsTable
                    items={filteredRankings}
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
                    isCompactSplitView={true}
                    t={t}
                  />
                </div>
              </div>
            ) : (
              <RankingsTable
                items={filteredRankings}
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
                isCompactSplitView={false}
                t={t}
              />
            )}
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

      {/* Floating Modal for What-If simulator from table */}
      {activeSimulateItem && activeTab !== 'simulator' && (
        <WhatIfSimulator
          initialItem={activeSimulateItem}
          lang={lang}
          onClose={() => setActiveSimulateItem(null)}
          t={t}
        />
      )}

      {/* Global Audit Modal */}
      {isAuditModalOpen && activeTab !== 'audit' && (
        <AuditAndSourcesModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          lang={lang}
          t={t}
        />
      )}

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-10 text-xs text-slate-500">
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
