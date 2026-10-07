/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { translations } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { MacFinderTab } from './components/MacFinderTab';
import { IpCalculatorTab } from './components/IpCalculatorTab';
import { ApiPortsTab } from './components/ApiPortsTab';
import { NeighborDiscoveryTab } from './components/NeighborDiscoveryTab';
import { ApiCodeGeneratorTab } from './components/ApiCodeGeneratorTab';
import { QuickHelpModal } from './components/QuickHelpModal';
import { Network, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('bigmikro_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  const [activeTab, setActiveTab] = useState<string>('mac');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('bigmikro_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'mac' && <MacFinderTab lang={lang} />}
        {activeTab === 'ip' && <IpCalculatorTab lang={lang} />}
        {activeTab === 'ports' && <ApiPortsTab lang={lang} />}
        {activeTab === 'discovery' && <NeighborDiscoveryTab lang={lang} />}
        {activeTab === 'generator' && <ApiCodeGeneratorTab lang={lang} />}
      </main>

      {/* Cheatsheet / Reference Modal */}
      <QuickHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-cyan-600 flex items-center justify-center text-white font-mono font-bold text-[10px]">
              μ
            </div>
            <span className="font-semibold text-slate-300">
              BigMikro • بيج ميكرو
            </span>
            <span className="text-slate-600">|</span>
            <span>{t.footerText}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              API: 8728 • SSL: 8729 • Winbox: 8291
            </span>
            <span className="font-mono text-[11px] text-cyan-400">
              RouterOS v7 & v6
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
