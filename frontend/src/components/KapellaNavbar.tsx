import React from 'react';
import { Language, UserRole } from '../types';
import {
  Bell,
  Search,
  Globe,
  ShieldCheck,
  Download,
  LayoutDashboard,
  TableProperties,
  ArrowRightLeft,
  Sliders,
  BellRing,
  Database,
  Map,
  UserCheck,
  SplitSquareVertical
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'rankings' | 'reallocation' | 'simulator' | 'alerts' | 'audit';

interface KapellaNavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isSplitMapOpen: boolean;
  onToggleSplitMap: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onExportTargetPack: () => void;
  onOpenAuditModal: () => void;
  alertsCount: number;
  reallocCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  t: (key: string) => string;
}

export const KapellaNavbar: React.FC<KapellaNavbarProps> = ({
  activeTab,
  onSelectTab,
  isSplitMapOpen,
  onToggleSplitMap,
  lang,
  onLanguageChange,
  currentRole,
  onRoleChange,
  onExportTargetPack,
  onOpenAuditModal,
  alertsCount,
  reallocCount,
  searchQuery,
  onSearchChange,
  t
}) => {
  return (
    <div className="w-full bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      
      {/* 1. Main Header Bar: Brand Left-Aligned, Search, Functional Controls */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* LEFT: Kaushal Setu Official Brand (Left Aligned!) */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-black text-lg flex items-center justify-center shadow-md">
              क
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                  {t('app_title')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
                  MVP
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 block -mt-0.5">
                {lang === 'en' ? 'Labour Market Intelligence System · MSDE' : 'श्रम बाज़ार आसूचना प्रणाली · भारत सरकार'}
              </span>
            </div>
          </div>

          {/* MIDDLE: Live Search Input */}
          <div className="relative hidden md:block flex-1 max-w-xs lg:max-w-md mx-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={lang === 'en' ? 'Search district, trade, or NCO code...' : 'ज़िला, ट्रेड या NCO कोड खोजें...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-2xs"
            />
          </div>

          {/* RIGHT: Live Split Map Toggle, Language, Role Selector, Export */}
          <div className="flex items-center space-x-2.5">
            
            {/* Split Screen Live Map Toggle Button */}
            <button
              onClick={onToggleSplitMap}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                isSplitMapOpen
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white text-teal-800 border-teal-200 hover:bg-teal-50'
              }`}
              title={lang === 'en' ? 'Toggle Split Window Map' : 'स्प्लिट स्क्रीन मानचित्र टॉगल करें'}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isSplitMapOpen ? (lang === 'en' ? 'Hide Map' : 'मानचित्र छिपाएं') : (lang === 'en' ? 'Live Map' : 'लाइव मैप')}
              </span>
            </button>

            {/* Persona / Scoping Selector */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 mr-1.5 flex-shrink-0" />
              <select
                aria-label="User Persona Selector"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-semibold text-slate-700 outline-none pr-1 cursor-pointer"
              >
                <option value="national_planner">National Planner (MSDE)</option>
                <option value="state_planner">State Planner (Maharashtra)</option>
                <option value="district_officer">District Officer (Pune)</option>
                <option value="auditor">Auditor (CAG/STQC)</option>
              </select>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Export Target Pack Button */}
            <button
              onClick={onExportTargetPack}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Target Pack' : 'टारगेट पैक'}</span>
            </button>

          </div>

        </div>
      </div>

      {/* 2. Horizontal Navigation Tabs (Icons before text!) */}
      <div className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 no-scrollbar">
            
            {/* Tab 1: Dashboard */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              <span>{t('overview')}</span>
            </button>

            {/* Tab 2: Rankings & Gaps */}
            <button
              onClick={() => onSelectTab('rankings')}
              className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'rankings'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TableProperties className="w-4 h-4 text-blue-600" />
              <span>{t('rankings')}</span>
            </button>

            {/* Tab 3: Seat Reallocation */}
            <button
              onClick={() => onSelectTab('reallocation')}
              className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'reallocation'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-purple-600" />
              <span>{t('reallocations')}</span>
              {reallocCount > 0 && (
                <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {reallocCount}
                </span>
              )}
            </button>

            {/* Tab 4: What-If Simulator */}
            <button
              onClick={() => onSelectTab('simulator')}
              className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'simulator'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>{t('simulator')}</span>
            </button>

            {/* Tab 5: Early Warning Alerts */}
            <button
              onClick={() => onSelectTab('alerts')}
              className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'alerts'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BellRing className="w-4 h-4 text-red-500" />
              <span>{t('alerts')}</span>
              {alertsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {alertsCount}
                </span>
              )}
            </button>

            {/* Tab 6: Data Sources & Audit */}
            <button
              onClick={() => onSelectTab('audit')}
              className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'audit'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('sources_audit')}</span>
            </button>

          </nav>
        </div>
      </div>

    </div>
  );
};
