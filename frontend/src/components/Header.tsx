import React from 'react';
import { Language, UserRole, UserProfile } from '../types';
import { Globe, ShieldCheck, Download, UserCheck } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userProfile: UserProfile | null;
  onExportTargetPack: () => void;
  onOpenAudit: () => void;
  t: (key: string) => string;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  currentRole,
  onRoleChange,
  userProfile,
  onExportTargetPack,
  onOpenAudit,
  t
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      {/* Top Gov Tricolor Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Government Emblem */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md border border-slate-800">
              क
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {t('app_title')} <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider ml-1">MVP</span>
                </h1>
                <span className="text-xs bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5 rounded font-mono">
                  {t('sih_ps')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('gov_name')} · {t('app_subtitle')}
              </p>
            </div>
          </div>

          {/* Controls: Role, Language, Export, Audit */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Persona / Role Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1" />
              <select
                aria-label="User Persona Selector"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-medium text-slate-700 outline-none pr-2 cursor-pointer"
              >
                <option value="national_planner">Meera (National Planner)</option>
                <option value="state_planner">Rajesh (MH State Planner)</option>
                <option value="district_officer">Farida (Pune District Officer)</option>
                <option value="auditor">Auditor (CAG/STQC)</option>
              </select>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Audit & Sources Modal Button */}
            <button
              onClick={onOpenAudit}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'en' ? 'Audit & Sources' : 'ऑडिट एवं स्रोत'}</span>
            </button>

            {/* Target Pack CSV Export Button */}
            <button
              onClick={onExportTargetPack}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('export_target_pack')}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
