import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  generatePythonScript, 
  generateNodeScript, 
  generateRestCurl, 
  generateRouterOsCli, 
  ApiScriptOptions 
} from '../utils/apiScriptGenerator';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Server 
} from 'lucide-react';

interface ApiCodeGeneratorTabProps {
  lang: Language;
}

export const ApiCodeGeneratorTab: React.FC<ApiCodeGeneratorTabProps> = ({ lang }) => {
  const t = translations[lang];
  const [host, setHost] = useState('192.168.88.1');
  const [port, setPort] = useState(8728);
  const [username, setUsername] = useState('admin');
  const [useSsl, setUseSsl] = useState(false);
  const [action, setAction] = useState<ApiScriptOptions['action']>('system_info');
  const [activeLangTab, setActiveLangTab] = useState<'python' | 'node' | 'rest' | 'cli'>('python');
  const [copied, setCopied] = useState(false);

  const handleSslToggle = (enabled: boolean) => {
    setUseSsl(enabled);
    if (enabled && port === 8728) {
      setPort(8729);
    } else if (!enabled && port === 8729) {
      setPort(8728);
    }
  };

  const scriptOptions: ApiScriptOptions = {
    host,
    port,
    username,
    useSsl,
    action,
  };

  const currentCode = React.useMemo(() => {
    switch (activeLangTab) {
      case 'python':
        return generatePythonScript(scriptOptions);
      case 'node':
        return generateNodeScript(scriptOptions);
      case 'rest':
        return generateRestCurl(scriptOptions);
      case 'cli':
        return generateRouterOsCli(scriptOptions);
      default:
        return '';
    }
  }, [activeLangTab, scriptOptions]);

  const copyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-400 border border-indigo-800/80 flex items-center gap-1.5 font-mono">
                <Code2 className="w-3.5 h-3.5" />
                RouterOS API Client Script Generator
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">{t.genTitle}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.genDesc}</p>
          </div>
        </div>
      </div>

      {/* Configuration & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
            <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wider pb-2 border-b border-slate-800">
              Connection Parameters
            </h3>

            {/* Target Host */}
            <div>
              <label className="text-slate-400 block mb-1 font-medium">{t.targetHost}</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Port & SSL */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">{t.targetPort}</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">{t.targetUser}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* SSL Checkbox */}
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={useSsl}
                onChange={(e) => handleSslToggle(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500 bg-slate-900 border-slate-700"
              />
              <span className="text-slate-200 font-medium">{t.useSslCheckbox}</span>
            </label>

            {/* Desired Action */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-2 font-medium">{t.selectAction}</label>
              <div className="space-y-1.5">
                {[
                  { id: 'system_info', label: t.actSystemInfo },
                  { id: 'list_interfaces', label: t.actListInterfaces },
                  { id: 'add_firewall_rule', label: t.actAddFirewall },
                  { id: 'add_user', label: t.actAddUser },
                  { id: 'reboot', label: t.actReboot },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setAction(act.id as ApiScriptOptions['action'])}
                    className={`w-full text-left rtl:text-right px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      action === act.id
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code Output Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
            
            {/* Language Selection Tabs & Copy button */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {[
                  { id: 'python', label: t.tabPython },
                  { id: 'node', label: t.tabNode },
                  { id: 'rest', label: t.tabRest },
                  { id: 'cli', label: t.tabCli },
                ].map((langTab) => (
                  <button
                    key={langTab.id}
                    onClick={() => setActiveLangTab(langTab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeLangTab === langTab.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    {langTab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all ml-2 rtl:mr-2 rtl:ml-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copied : t.copyScript}</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="p-4 bg-slate-950/90 font-mono text-xs text-sky-200 overflow-x-auto min-h-[380px] leading-relaxed select-all">
              <pre>
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
