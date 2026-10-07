import React, { useState, useMemo } from 'react';
import { Language, MikroTikPort } from '../types';
import { translations } from '../i18n/translations';
import { MIKROTIK_PORTS } from '../data/mikrotikPorts';
import { 
  Network, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  Activity, 
  Radio, 
  ExternalLink, 
  SlidersHorizontal,
  Lock,
  Unlock,
  AlertTriangle,
  Play
} from 'lucide-react';

interface ApiPortsTabProps {
  lang: Language;
}

export const ApiPortsTab: React.FC<ApiPortsTabProps> = ({ lang }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Port Probe Simulator State
  const [probeIp, setProbeIp] = useState('192.168.88.1');
  const [probePort, setProbePort] = useState(8728);
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<{
    status: 'open' | 'filtered' | 'closed';
    latencyMs: number;
    serviceMatch?: MikroTikPort;
    advice: string;
    firewallRule: string;
  } | null>(null);

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'api', label: t.catApi },
    { id: 'management', label: t.catManagement },
    { id: 'discovery', label: t.catDiscovery },
    { id: 'vpn', label: t.catVpn },
    { id: 'routing', label: t.catRouting },
    { id: 'service', label: t.catService },
  ];

  const filteredPorts = useMemo(() => {
    return MIKROTIK_PORTS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.port.toString().includes(searchTerm) ||
        (p.serviceName && p.serviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descriptionAr.includes(searchTerm);

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunProbe = () => {
    setIsProbing(true);
    setProbeResult(null);

    setTimeout(() => {
      setIsProbing(false);
      const match = MIKROTIK_PORTS.find(p => p.port === probePort);
      const latency = Math.floor(Math.random() * 8) + 2; // 2-10ms simulated local router latency

      // Assessment logic
      let advice = '';
      let fwRule = '';

      if (match?.id === 'api') {
        advice = lang === 'ar' 
          ? 'منفذ API نشط ويستقبل اتصالات غير مشفرة. يُنصح بحصر الآي بي أو الانتقال إلى API-SSL (8729).'
          : 'Plain API port detected. Ensure access is restricted to management subnet or migrate to API-SSL (8729).';
        fwRule = `/ip firewall filter add chain=input protocol=tcp dst-port=8728 src-address=192.168.88.0/24 action=accept comment="Allow API Only From Trusted LAN"`;
      } else if (match?.id === 'api-ssl') {
        advice = lang === 'ar'
          ? 'منفذ API المشفر (8729) آمن للنقل عبر الشبكة بشرط استخدام شهادة TLS صحيحة.'
          : 'Encrypted API-SSL port (8729). Safe for programmatic transport with valid TLS certificate.';
        fwRule = `/ip firewall filter add chain=input protocol=tcp dst-port=8729 src-address=192.168.88.0/24 action=accept comment="Allow API-SSL From Management"`;
      } else if (match?.id === 'winbox') {
        advice = lang === 'ar'
          ? 'منفذ Winbox الافتراضي (8291). أغلق هذا المنفذ على كارت الإنترنت WAN لحماية الراوتر من هجمات التخمين.'
          : 'Default Winbox port 8291. Keep blocked on WAN interface to prevent automated credential attacks.';
        fwRule = `/ip firewall filter add chain=input in-interface-list=WAN protocol=tcp dst-port=8291 action=drop comment="Drop Winbox from Internet WAN"`;
      } else {
        advice = lang === 'ar'
          ? `المنفذ ${probePort} يعمل بصورة طبيعية مع استجابة ${latency}ms.`
          : `Port ${probePort} responding with healthy handshake latency ${latency}ms.`;
        fwRule = `/ip firewall filter add chain=input protocol=tcp dst-port=${probePort} action=accept comment="Custom Port Rule"`;
      }

      setProbeResult({
        status: 'open',
        latencyMs: latency,
        serviceMatch: match,
        advice,
        firewallRule: fwRule,
      });
    }, 600);
  };

  const getRiskBadge = (risk: MikroTikPort['riskLevel']) => {
    switch (risk) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-400 border border-rose-800">{t.riskCritical}</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-950 text-amber-400 border border-amber-800">{t.riskHigh}</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-950 text-yellow-300 border border-yellow-800">{t.riskMedium}</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">{t.riskLow}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 flex items-center gap-1.5 font-mono">
                <Network className="w-3.5 h-3.5" />
                RouterOS Ports: 8728 API • 8729 API-SSL • 8291 Winbox
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">{t.portsTitle}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.portsDesc}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.portSearchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono text-sm rtl:pr-10 rtl:pl-4"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 rtl:right-3.5 rtl:left-auto" />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Port Probe & Diagnostic Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            {t.portTesterHeader}
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">{t.portTesterNotice}</p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="text-xs text-slate-400 block mb-1 font-medium">{t.targetIp}</label>
            <input
              type="text"
              value={probeIp}
              onChange={(e) => setProbeIp(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-xs text-slate-400 block mb-1 font-medium">{t.testPort}</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={probePort}
                onChange={(e) => setProbePort(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                onClick={() => setProbePort(8728)}
                className="px-2 py-1.5 rounded-lg bg-slate-800 text-[10px] text-cyan-400 font-mono"
                title="API"
              >
                8728
              </button>
              <button
                onClick={() => setProbePort(8729)}
                className="px-2 py-1.5 rounded-lg bg-slate-800 text-[10px] text-indigo-400 font-mono"
                title="API-SSL"
              >
                8729
              </button>
              <button
                onClick={() => setProbePort(8291)}
                className="px-2 py-1.5 rounded-lg bg-slate-800 text-[10px] text-sky-400 font-mono"
                title="Winbox"
              >
                8291
              </button>
            </div>
          </div>

          <div className="sm:col-span-3">
            <button
              onClick={handleRunProbe}
              disabled={isProbing}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all disabled:opacity-50 shadow-md shadow-cyan-500/20"
            >
              {isProbing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{t.probing}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.runCheck}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Probe Outcome Card */}
        {probeResult && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">
                  {probeResult.serviceMatch?.name || `Port ${probePort}`} ({probeResult.status.toUpperCase()})
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Latency: {probeResult.latencyMs}ms
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                Target: {probeIp}:{probePort}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-850 p-2.5 rounded-xl border border-slate-750">
              💡 {probeResult.advice}
            </p>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-mono">Suggested RouterOS Firewall Hardening Rule:</span>
                <button
                  onClick={() => copyToClipboard(probeResult.firewallRule, 'probe_fw')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedKey === 'probe_fw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Firewall Rule</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                <code>{probeResult.firewallRule}</code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ports Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPorts.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-extrabold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-800/80">
                      {item.port}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.protocol}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-2">
                    {item.name}
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {getRiskBadge(item.riskLevel)}
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    item.defaultEnabled 
                      ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.defaultEnabled ? t.enabled : t.disabled}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {lang === 'ar' ? item.descriptionAr : item.descriptionEn}
              </p>

              {/* Best Practice Advice */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400">
                <span className="font-bold text-slate-300 block mb-0.5">{t.securityAdvice}:</span>
                <p className="text-slate-400">
                  {lang === 'ar' ? item.bestPracticeAr : item.bestPracticeEn}
                </p>
              </div>
            </div>

            {/* Quick CLI Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                {t.cliCommands}
              </span>

              <div className="space-y-1.5 font-mono text-[11px]">
                {item.cliCommandEnable && (
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800/60">
                    <span className="text-emerald-400 truncate max-w-[260px] sm:max-w-xs">{item.cliCommandEnable}</span>
                    <button
                      onClick={() => copyToClipboard(item.cliCommandEnable!, `en_${item.id}`)}
                      className="text-slate-400 hover:text-cyan-400 p-1"
                      title={t.enableService}
                    >
                      {copiedKey === `en_${item.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {item.cliCommandDisable && (
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800/60">
                    <span className="text-rose-400 truncate max-w-[260px] sm:max-w-xs">{item.cliCommandDisable}</span>
                    <button
                      onClick={() => copyToClipboard(item.cliCommandDisable!, `dis_${item.id}`)}
                      className="text-slate-400 hover:text-cyan-400 p-1"
                      title={t.disableService}
                    >
                      {copiedKey === `dis_${item.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {item.cliCommandSetPort && (
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800/60">
                    <span className="text-sky-400 truncate max-w-[260px] sm:max-w-xs">{item.cliCommandSetPort}</span>
                    <button
                      onClick={() => copyToClipboard(item.cliCommandSetPort!, `cfg_${item.id}`)}
                      className="text-slate-400 hover:text-cyan-400 p-1"
                      title={t.changePort}
                    >
                      {copiedKey === `cfg_${item.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
