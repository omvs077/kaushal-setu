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
import { Header } from './components/Header';
import { OverviewKpis } from './components/OverviewKpis';
import { RankingsTable } from './components/RankingsTable';
import { DistrictDetailModal } from './components/DistrictDetailModal';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AlertsCenter } from './components/AlertsCenter';
import { AuditAndSourcesModal } from './components/AuditAndSourcesModal';

const API_BASE = 'http://127.0.0.1:8000/api';

export function App() {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top App Header */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        currentRole={role}
        onRoleChange={setRole}
        userProfile={userProfile}
        onExportTargetPack={handleExportTargetPack}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        t={t}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* User Scope Banner if scoped */}
        {userProfile && userProfile.scope !== 'ALL_STATES' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 rounded-xl text-xs flex items-center justify-between">
            <div>
              <strong>{lang === 'en' ? 'Scoped View' : 'सीमांकित दृश्य'}:</strong> {userProfile.badge} ({userProfile.title})
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
              RBAC Scope Enforced
            </span>
          </div>
        )}

        {/* 1. Overview KPIs & Severity Bar */}
        <OverviewKpis
          data={overview}
          lang={lang}
          t={t}
        />

        {/* 2. Primary Layout: Rankings & Seat Reallocation */}
        <div className="space-y-6">
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

          {/* Seat Reallocation Recommendations Grid */}
          <RecommendationsPanel
            recommendations={recommendations}
            lang={lang}
            t={t}
          />
        </div>

        {/* 3. Early Warning Alerts Center */}
        <AlertsCenter
          alerts={alerts}
          lang={lang}
          t={t}
        />

      </main>

      {/* Modals & Drawers */}
      <DistrictDetailModal
        item={activeWhyItem}
        lang={lang}
        onClose={() => setActiveWhyItem(null)}
        t={t}
      />

      {activeSimulateItem && (
        <WhatIfSimulator
          initialItem={activeSimulateItem}
          lang={lang}
          onClose={() => setActiveSimulateItem(null)}
          t={t}
        />
      )}

      <AuditAndSourcesModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        lang={lang}
        t={t}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Kaushal Setu (कौशल सेतु) · Smart India Hackathon PS 26246 · Ministry of Skill Development and Entrepreneurship
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700">Audit-Verified MVP</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
