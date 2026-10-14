import React from 'react';
import { Language, UserRole, UserProfile } from '../types';
import {
  Menu,
  Bell,
  Mail,
  MessageSquare,
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
  Printer,
  HelpCircle,
  MessageCircle,
  UserCheck
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'rankings' | 'reallocation' | 'simulator' | 'alerts' | 'audit';

interface KapellaNavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userProfile: UserProfile | null;
  onExportTargetPack: () => void;
  onOpenAuditModal: () => void;
  alertsCount: number;
  reallocCount: number;
  t: (key: string) => string;
}

export const KapellaNavbar: React.FC<KapellaNavbarProps> = ({
  activeTab,
  onSelectTab,
  lang,
  onLanguageChange,
  currentRole,
  onRoleChange,
  userProfile,
  onExportTargetPack,
  onOpenAuditModal,
  alertsCount,
  reallocCount,
  t
}) => {
  return (
    <div className="w-full bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      
      {/* 1. Top Navbar Header */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Menu, Notifications, Search */}
          <div className="flex items-center space-x-4">
            <button
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Notification icons with counters */}
            <div className="hidden sm:flex items-center space-x-3 text-slate-500">
              <button
                onClick={() => onSelectTab('alerts')}
                className="relative p-1.5 hover:text-slate-800 transition-colors"
                title="Early Warning Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {alertsCount > 0 ? alertsCount : 2}
                </span>
              </button>

              <button
                onClick={() => onSelectTab('reallocation')}
                className="relative p-1.5 hover:text-slate-800 transition-colors"
                title="Reallocation Proposals"
              >
                <Mail className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {reallocCount > 0 ? reallocCount : 4}
                </span>
              </button>

              <button
                onClick={onOpenAuditModal}
                className="p-1.5 hover:text-slate-800 transition-colors"
                title="System Audit Chain"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder={lang === 'en' ? 'Search district, trade, or NCO code...' : 'ज़िला, ट्रेड या NCO कोड खोजें...'}
                className="pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none w-56 lg:w-72 transition-all"
              />
            </div>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-black text-base flex items-center justify-center shadow-md">
              क
            </div>
            <div className="text-center">
              <span className="text-xl font-extrabold tracking-tight text-teal-700 font-sans">
                {t('app_title')}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block -mt-1">
                LMI SYSTEM · MSDE
              </span>
            </div>
          </div>

          {/* Right: Actions, Target Pack, Profile */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Action Pills matching Kapella: Product, Reports, Settings */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold">
              <button
                onClick={onExportTargetPack}
                className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>{lang === 'en' ? 'Target Pack' : 'टारगेट पैक'}</span>
              </button>

              <button
                onClick={onOpenAuditModal}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-1 border border-slate-200"
              >
                <span>{lang === 'en' ? 'Audit Proof' : 'ऑडिट सत्यापन'}</span>
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {userProfile?.name || 'Meera Sharma'}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {userProfile?.badge || 'National Planner'}
                </div>
              </div>
              
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow">
                  {userProfile?.name?.charAt(0) || 'M'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Horizontal Tab Navigation Bar matching Kapella Subheader */}
      <div className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            
            {/* Tab 1: Dashboard */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
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
              <TableProperties className="w-4 h-4" />
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
              <ArrowRightLeft className="w-4 h-4" />
              <span>{t('reallocations')}</span>
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
              <Sliders className="w-4 h-4" />
              <span>{t('simulator')}</span>
            </button>

            {/* Tab 5: Early Alerts */}
            <button
              onClick={() => onSelectTab('alerts')}
              className={`flex items-center space-x-2 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'alerts'
                  ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>{t('alerts')}</span>
              {alertsCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1">
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
              <Database className="w-4 h-4" />
              <span>{t('sources_audit')}</span>
            </button>

          </nav>
        </div>
      </div>

      {/* 3. Greeting Bar matching Kapella "Hi, welcome back!" */}
      <div className="bg-slate-50/70 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Greeting text */}
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {lang === 'en' ? 'Hi, welcome back!' : 'नमस्ते, पुनः स्वागत है!'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'en'
                ? 'Labour Market Intelligence System · Scheduled monthly run published today at 06:00 UTC'
                : 'श्रम बाज़ार आसूचना प्रणाली · निर्धारित मासिक पूर्वानुमान आज 06:00 UTC पर प्रकाशित'}
            </p>
          </div>

          {/* Action buttons matching Kapella: Feedback, Help, Print, Language, Role */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Persona Switcher */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
              <select
                aria-label="User Persona Selector"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-medium text-slate-700 outline-none pr-1 cursor-pointer"
              >
                <option value="national_planner">Meera (National MSDE)</option>
                <option value="state_planner">Rajesh (SSDM Maharashtra)</option>
                <option value="district_officer">Farida (Pune Officer)</option>
                <option value="auditor">Auditor (CAG/STQC)</option>
              </select>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Print / Export Target Pack */}
            <button
              onClick={onExportTargetPack}
              className="flex items-center space-x-1.5 px-3 py-1 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Print Target Pack' : 'टारगेट पैक प्रिंट'}</span>
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};
