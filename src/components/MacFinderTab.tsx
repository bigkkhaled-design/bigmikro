import React, { useState, useMemo, useEffect } from 'react';
import { Language, MacAnalysis } from '../types';
import { translations } from '../i18n/translations';
import { 
  analyzeMac, 
  generateRandomMikrotikMac, 
  generateVrrpMac,
  cleanMacString
} from '../utils/macUtils';
import { lookupMacVendorApi, ApiLookupResult } from '../services/macApiService';
import { 
  Search, 
  Copy, 
  Check, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Terminal, 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  RefreshCw,
  Cloud,
  CheckCircle2
} from 'lucide-react';

interface MacFinderTabProps {
  lang: Language;
}

const SAMPLE_MACS = [
  { label: 'MikroTik CCR2004', mac: '48:8F:5A:21:44:88' },
  { label: 'MikroTik RB5009', mac: 'CC:2D:E0:6B:7A:12' },
  { label: 'MikroTik Classic RB', mac: '00:0C:42:3B:19:FE' },
  { label: 'MikroTik hAP ax3', mac: 'C4:AD:34:55:12:34' },
  { label: 'Ubiquiti UniFi AP', mac: '04:18:D6:AA:BB:CC' },
  { label: 'Cisco Catalyst', mac: '00:00:0C:88:99:AA' },
];

export const MacFinderTab: React.FC<MacFinderTabProps> = ({ lang }) => {
  const t = translations[lang];
  const [inputMac, setInputMac] = useState('48:8F:5A:21:44:88');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Online API lookup state
  const [apiResult, setApiResult] = useState<ApiLookupResult | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  // Batch lookup state
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<MacAnalysis[]>([]);
  const [vrrpId, setVrrpId] = useState<number>(1);

  const baseAnalysis = useMemo(() => {
    return analyzeMac(inputMac);
  }, [inputMac]);

  // Trigger online API vendor lookup
  const runApiLookup = async (macToLookup: string) => {
    const cleaned = cleanMacString(macToLookup);
    if (cleaned.length < 6) return;
    setIsApiLoading(true);
    try {
      const res = await lookupMacVendorApi(cleaned);
      setApiResult(res);
    } catch {
      setApiResult(null);
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    // Automatically trigger on valid input debounce
    const cleaned = cleanMacString(inputMac);
    if (cleaned.length >= 6) {
      const timer = setTimeout(() => {
        runApiLookup(inputMac);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setApiResult(null);
    }
  }, [inputMac]);

  // Combine local analysis and API result
  const analysis = useMemo(() => {
    if (apiResult && apiResult.vendor && apiResult.source === 'online_api') {
      return {
        ...baseAnalysis,
        vendor: apiResult.vendor,
        isMikroTik: apiResult.isMikroTik || baseAnalysis.isMikroTik,
        country: apiResult.country || baseAnalysis.country,
      };
    }
    return baseAnalysis;
  }, [baseAnalysis, apiResult]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateRandomMikrotik = () => {
    const randomMac = generateRandomMikrotikMac();
    setInputMac(randomMac);
  };

  const handleGenerateVrrp = () => {
    const vrrpMac = generateVrrpMac(vrrpId);
    setInputMac(vrrpMac);
  };

  const handleProcessBatch = () => {
    if (!batchInput.trim()) return;
    const lines = batchInput
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    const results = lines.map(item => analyzeMac(item));
    setBatchResults(results);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                OUI & Layer-2 MAC Inspector
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">{t.macTitle}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.macDesc}</p>
          </div>

          {/* Quick Generator Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGenerateRandomMikrotik}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.randomMikrotikBtn}</span>
            </button>
            <button
              onClick={handleGenerateVrrp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all shadow-sm"
            >
              <Layers className="w-4 h-4" />
              <span>{t.generateVrrpBtn}</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              value={inputMac}
              onChange={(e) => setInputMac(e.target.value)}
              placeholder={t.macPlaceholder}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-mono text-base transition-all shadow-inner rtl:pr-11 rtl:pl-4"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 rtl:right-3.5 rtl:left-auto" />
            {inputMac && (
              <button
                onClick={() => setInputMac('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2 py-1 rounded rtl:left-3 rtl:right-auto"
              >
                Clear
              </button>
            )}
          </div>

          {/* Samples Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">{t.quickTestSamples}</span>
            {SAMPLE_MACS.map((sample) => (
              <button
                key={sample.mac}
                onClick={() => setInputMac(sample.mac)}
                className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-750 transition-colors font-mono"
              >
                {sample.label} ({sample.mac.slice(0, 8)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Vendor & Hardware Match */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Vendor Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            {analysis.isMikroTik ? (
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500" />
            ) : (
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-slate-700" />
            )}

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  {t.vendorDetails}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-100">
                    {analysis.vendor}
                  </span>
                </div>
              </div>

              {analysis.isMikroTik ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-xs font-bold animate-pulse">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{t.isMikrotikDevice}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.otherVendorDevice}</span>
                </div>
              )}
            </div>

            {/* API Lookup Source Indicator & Manual Refresh */}
            <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                {isApiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="text-slate-400 font-medium">{t.onlineApiFetching}</span>
                  </>
                ) : apiResult?.source === 'online_api' ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">{t.onlineApiSuccess}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-400/90 font-medium">{t.onlineApiFallback}</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => runApiLookup(inputMac)}
                disabled={isApiLoading}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold transition-colors disabled:opacity-50"
                title={t.onlineApiLookup}
              >
                <RefreshCw className={`w-3 h-3 ${isApiLoading ? 'animate-spin' : ''}`} />
                <span>{t.onlineApiLookup}</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t.ouiPrefix}</span>
                <span className="font-mono font-semibold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {analysis.oui || 'N/A'}
                </span>
              </div>

              {analysis.country && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t.vendorCountry}</span>
                  <span className="text-slate-200 font-medium">{analysis.country}</span>
                </div>
              )}

              {analysis.notes && (
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-xs text-slate-400 block mb-1">{t.vendorNotes}</span>
                  <p className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                    {analysis.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* MAC Bit Properties & IPv6 Link-Local */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              {t.macAddressProperties}
            </h3>

            <div className="space-y-3 text-sm">
              {/* Transmission Type */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">{t.transmissionType}</span>
                  <span className="font-semibold text-slate-200">
                    {analysis.isMulticast ? t.multicast : t.unicast}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                  analysis.isMulticast 
                    ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {analysis.isMulticast ? 'Bit 0 = 1 (Multicast)' : 'Bit 0 = 0 (Unicast)'}
                </span>
              </div>

              {/* Scope */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">{t.administrationType}</span>
                  <span className="font-semibold text-slate-200">
                    {analysis.isLocallyAdministered ? t.locallyAdministered : t.universallyAdministered}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${
                  analysis.isLocallyAdministered 
                    ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' 
                    : 'bg-blue-950 text-blue-400 border border-blue-800'
                }`}>
                  {analysis.isLocallyAdministered ? 'LAA (Bit 1 = 1)' : 'UAA (Bit 1 = 0)'}
                </span>
              </div>

              {/* IPv6 EUI-64 */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{t.ipv6LinkLocal}</span>
                  <button
                    onClick={() => copyToClipboard(analysis.ipv6LinkLocal, 'ipv6')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedKey === 'ipv6' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ipv6' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-sky-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {analysis.ipv6LinkLocal || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Normalized Formats & CLI commands */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Format Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">
              {t.macFormatHeader}
            </h3>

            <div className="space-y-2.5">
              {[
                { label: t.macColon, value: analysis.formats.colon, key: 'colon' },
                { label: t.macDash, value: analysis.formats.dash, key: 'dash' },
                { label: t.macCisco, value: analysis.formats.cisco, key: 'cisco' },
                { label: t.macRaw, value: analysis.formats.raw, key: 'raw' },
              ].map((fmt) => (
                <div
                  key={fmt.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <span className="text-xs text-slate-400 font-medium">{fmt.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-200 select-all">
                      {fmt.value || 'N/A'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(fmt.value, fmt.key)}
                      disabled={!fmt.value}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                      title="Copy"
                    >
                      {copiedKey === fmt.key ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Binary Bitstream */}
            {analysis.formats.binary && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400 font-medium">{t.macBinary}</span>
                  <button
                    onClick={() => copyToClipboard(analysis.formats.binary, 'binary')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedKey === 'binary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-emerald-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 overflow-x-auto whitespace-nowrap">
                  {analysis.formats.binary}
                </div>
              </div>
            )}
          </div>

          {/* MikroTik Terminal CLI Command Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  {t.macMikrotikCli}
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(analysis.formats.mikrotikCli, 'cli')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
              >
                {copiedKey === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'cli' ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto">
              <code>{analysis.formats.mikrotikCli || '# Enter valid 12-digit MAC to generate MikroTik command'}</code>
            </div>
          </div>

          {/* Batch Lookup Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  {t.batchMacLookup}
                </h3>
              </div>
              <button
                onClick={handleProcessBatch}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                {t.batchProcessBtn}
              </button>
            </div>

            <textarea
              rows={3}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder={t.batchPlaceholder}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {batchResults.length > 0 && (
              <div className="mt-3 overflow-x-auto max-h-48 border border-slate-800 rounded-xl">
                <table className="w-full text-xs text-left rtl:text-right">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="px-3 py-2">MAC</th>
                      <th className="px-3 py-2">Vendor</th>
                      <th className="px-3 py-2">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono bg-slate-900/60">
                    {batchResults.map((res, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="px-3 py-1.5 text-cyan-300 font-medium">{res.normalized || res.input}</td>
                        <td className="px-3 py-1.5 text-slate-300">{res.vendor}</td>
                        <td className="px-3 py-1.5">
                          {res.isMikroTik ? (
                            <span className="text-emerald-400 font-bold">MikroTik</span>
                          ) : (
                            <span className="text-slate-400">Standard</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
