import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  Network, 
  Languages, 
  HelpCircle, 
  Search, 
  Binary, 
  Cpu, 
  Radio, 
  Code2, 
  ShieldCheck 
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenHelp,
}) => {
  const t = translations[lang];

  const tabs = [
    { id: 'mac', label: t.tabMac, icon: Search },
    { id: 'ip', label: t.tabIp, icon: Binary },
    { id: 'ports', label: t.tabPorts, icon: Network },
    { id: 'discovery', label: t.tabDiscovery, icon: Radio },
    { id: 'generator', label: t.tabGenerator, icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white font-black text-xl tracking-wider border border-cyan-400/30">
              <span className="font-mono">μ</span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" title="RouterOS Online" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 tracking-tight">
                  {t.appTitle}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                  v7.15+
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate max-w-xs md:max-w-md">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Tools (Language Switcher, Cheatsheet Modal) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cheatsheet Button */}
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors shadow-sm"
              title={t.openDocs}
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">{t.openDocs}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 shadow-inner">
              <button
                onClick={() => onLanguageChange('en')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'en'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>EN</span>
              </button>
              <button
                onClick={() => onLanguageChange('ar')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'ar'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>عربي</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 rtl:space-x-reverse overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
