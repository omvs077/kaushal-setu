import React, { useState } from 'react';
import { Language, UserRole } from '../types';
import {
  Search,
  Globe,
  ShieldCheck,
  Download,
  LayoutDashboard,
  TableProperties,
  ArrowRightLeft,
  Sliders,
  BellRing,
  Map,
  UserCheck,
  Menu,
  X,
  FileCheck2
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'map' | 'rankings' | 'reallocation' | 'simulator' | 'alerts' | 'audit';

interface KapellaNavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: t('overview'),
      icon: LayoutDashboard,
      color: 'text-teal-600',
      badge: null
    },
    {
      id: 'map' as ActiveTab,
      label: lang === 'en' ? 'Live Map Explorer' : 'लाइव मैप एक्सप्लोरर',
      icon: Map,
      color: 'text-emerald-600',
      badge: { text: 'SOI', bg: 'bg-emerald-100 text-emerald-800' }
    },
    {
      id: 'rankings' as ActiveTab,
      label: t('rankings'),
      icon: TableProperties,
      color: 'text-blue-600',
      badge: null
    },
    {
      id: 'reallocation' as ActiveTab,
      label: t('reallocations'),
      icon: ArrowRightLeft,
      color: 'text-purple-600',
      badge: reallocCount > 0 ? { text: `${reallocCount}`, bg: 'bg-purple-100 text-purple-800' } : null
    },
    {
      id: 'simulator' as ActiveTab,
      label: t('simulator'),
      icon: Sliders,
      color: 'text-indigo-600',
      badge: null
    },
    {
      id: 'alerts' as ActiveTab,
      label: t('alerts'),
      icon: BellRing,
      color: 'text-red-500',
      badge: alertsCount > 0 ? { text: `${alertsCount}`, bg: 'bg-red-500 text-white' } : null
    },
    {
      id: 'audit' as ActiveTab,
      label: t('sources_audit'),
      icon: ShieldCheck,
      color: 'text-emerald-600',
      badge: null
    }
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const currentTabObj = navItems.find(item => item.id === activeTab) || navItems[0];
  const CurrentIcon = currentTabObj.icon;

  return (
    <header className="w-full bg-white shadow-xs border-b border-slate-200 sticky top-0 z-40">
      
      {/* 1. Main Header Bar: Edge-to-Edge Fluid (No max-w-7xl blank margins!) */}
      <div className="border-b border-slate-100">
        <div className="w-full px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* LEFT: Mobile Hamburger + Official Brand (Icon removed, pure text!) */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Hamburger Button for Mobile Drawer */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Official Title Left Aligned */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-sans">
                  {t('app_title')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
                  MVP
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 block -mt-0.5 truncate max-w-[210px] sm:max-w-none">
                {lang === 'en' ? 'Labour Market Intelligence System · MSDE' : 'श्रम बाज़ार आसूचना प्रणाली · भारत सरकार'}
              </span>
            </div>
          </div>

          {/* MIDDLE: Live Search Input (Hidden on mobile, present in drawer) */}
          <div className="relative hidden md:block flex-1 max-w-xs lg:max-w-md mx-2 sm:mx-4">
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

          {/* RIGHT: Persona / Scoping Selector, Language Switcher, Target Pack */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            
            {/* Persona / Scoping Selector */}
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 mr-1.5 flex-shrink-0" />
              <select
                aria-label="User Persona Selector"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-semibold text-slate-700 outline-none pr-1 cursor-pointer text-xs"
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
              <span className="text-[11px] font-semibold">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
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

      {/* 2. Desktop Horizontal Navigation Tabs (Icons before text!) */}
      <div className="hidden md:block border-b border-slate-100 bg-white">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 lg:space-x-2 py-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-teal-700 bg-teal-50/90 border-b-2 border-teal-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${item.badge.bg}`}>
                      {item.badge.text}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Mobile Current-Module Subheader (Quick switch & context on phone) */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-slate-50/90 border-b border-slate-200 text-xs">
        <div className="flex items-center space-x-2">
          <CurrentIcon className={`w-4 h-4 ${currentTabObj.color}`} />
          <span className="font-extrabold text-slate-900">{currentTabObj.label}</span>
          {currentTabObj.badge && (
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${currentTabObj.badge.bg}`}>
              {currentTabObj.badge.text}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-[11px] font-bold text-teal-700 bg-white border border-teal-200 px-2.5 py-1 rounded-md shadow-2xs flex items-center space-x-1"
        >
          <span>{lang === 'en' ? 'All Sections' : 'सभी अनुभाग'}</span>
          <span className="text-slate-400">☰</span>
        </button>
      </div>

      {/* 4. Mobile Slide-Out Side Navigation Drawer (Full off-canvas experience!) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-black text-slate-900 font-sans">
                    {t('app_title')}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                    MVP
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {lang === 'en' ? 'Labour Market Intelligence System' : 'श्रम बाज़ार आसूचना प्रणाली'}
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={lang === 'en' ? 'Search district or trade...' : 'ज़िला या ट्रेड खोजें...'}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            {/* Drawer Navigation List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                {lang === 'en' ? 'Navigation Modules' : 'नेविगेशन मॉड्यूल'}
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badge.bg}`}>
                        {item.badge.text}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Scoping Persona Selector for Mobile */}
              <div className="pt-4 mt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5">
                  {lang === 'en' ? 'User Scope & Persona' : 'उपयोगकर्ता भूमिका'}
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center text-xs text-slate-700 font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                    <span>Select Persona</span>
                  </div>
                  <select
                    value={currentRole}
                    onChange={(e) => onRoleChange(e.target.value as UserRole)}
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="national_planner">National Planner (MSDE)</option>
                    <option value="state_planner">State Planner (Maharashtra)</option>
                    <option value="district_officer">District Officer (Pune)</option>
                    <option value="auditor">Auditor (CAG/STQC)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-2">
              <button
                onClick={() => {
                  onExportTargetPack();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Download Target Pack' : 'टारगेट पैक डाउनलोड करें'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenAuditModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'en' ? 'Audit Manifest' : 'ऑडिट मेनिफेस्ट'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </header>
  );
};
