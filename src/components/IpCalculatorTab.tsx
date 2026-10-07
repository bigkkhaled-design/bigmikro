import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { calculateSubnet, divideNetwork } from '../utils/ipUtils';
import { 
  Binary, 
  Copy, 
  Check, 
  Terminal, 
  Split, 
  Network, 
  Sliders, 
  Layers 
} from 'lucide-react';

interface IpCalculatorTabProps {
  lang: Language;
}

const SAMPLE_IPS = [
  { label: 'MikroTik Default (192.168.88.1/24)', value: '192.168.88.1/24' },
  { label: 'Class A Private (10.10.0.1/16)', value: '10.10.0.1/16' },
  { label: 'Medium ISP Pool (172.16.20.1/22)', value: '172.16.20.1/22' },
  { label: 'Point-to-Point /30 (10.0.0.1/30)', value: '10.0.0.1/30' },
  { label: 'VLAN Office /27 (192.168.100.1/27)', value: '192.168.100.1/27' },
];

export const IpCalculatorTab: React.FC<IpCalculatorTabProps> = ({ lang }) => {
  const t = translations[lang];
  const [ipInput, setIpInput] = useState('192.168.88.1/24');
  const [targetCidr, setTargetCidr] = useState<number>(26);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const subnet = useMemo(() => {
    return calculateSubnet(ipInput);
  }, [ipInput]);

  const dividedSubnets = useMemo(() => {
    if (!subnet) return [];
    if (targetCidr <= subnet.cidr) return [];
    return divideNetwork(subnet.networkAddress, subnet.cidr, targetCidr);
  }, [subnet, targetCidr]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                IPv4 Subnet & CIDR Planner
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">{t.ipTitle}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.ipDesc}</p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder={t.ipInputPlaceholder}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono text-base transition-all shadow-inner rtl:pr-11 rtl:pl-4"
            />
            <Binary className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 rtl:right-3.5 rtl:left-auto" />
          </div>

          {/* Quick presets */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">{t.quickTestSamples}</span>
            {SAMPLE_IPS.map((sample) => (
              <button
                key={sample.value}
                onClick={() => setIpInput(sample.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-750 transition-colors font-mono"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {subnet ? (
        <div className="space-y-6">
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-medium block mb-1">{t.networkAddress}</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{subnet.networkAddress}</span>
              <span className="text-xs text-slate-500 block mt-1">/{subnet.cidr}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-medium block mb-1">{t.broadcastAddress}</span>
              <span className="text-lg font-bold font-mono text-sky-400">{subnet.broadcastAddress}</span>
              <span className="text-xs text-slate-500 block mt-1">Wildcard: {subnet.wildcard}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-medium block mb-1">{t.usableHosts}</span>
              <span className="text-lg font-bold font-mono text-indigo-400">
                {subnet.usableHosts.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 block mt-1">Total: {subnet.totalHosts.toLocaleString()}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 font-medium block mb-1">{t.subnetMask}</span>
              <span className="text-lg font-bold font-mono text-cyan-400">{subnet.netmask}</span>
              <span className="text-xs text-slate-500 block mt-1">Class {subnet.ipClass} • {subnet.ipType.toUpperCase()}</span>
            </div>
          </div>

          {/* Subnet Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                {t.usableRange}
              </span>
              <span className="text-xs font-mono bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                {subnet.usableHosts} Hosts Available
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">{subnet.firstUsableIp}</span>
                <span className="text-slate-500">→</span>
                <span className="text-emerald-400 font-bold">{subnet.lastUsableIp}</span>
              </div>
              <button
                onClick={() => copyToClipboard(`${subnet.firstUsableIp}-${subnet.lastUsableIp}`, 'range')}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
              >
                {copiedKey === 'range' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'range' ? 'Copied' : 'Copy Range'}</span>
              </button>
            </div>

            {/* Binary Bitstream Breakdown */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">{t.binaryRepresentation}</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t.binaryIp}</span>
                  <span className="text-cyan-300">{subnet.binaryIp}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                  <span className="text-slate-400">{t.binaryMask}</span>
                  <span className="text-emerald-300">{subnet.binaryMask}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RouterOS Configuration Scripts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                {t.mikrotikScriptsHeader}
              </h3>
            </div>

            {/* IP Address Assignment Script */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{t.mikrotikAddressScript}</span>
                <button
                  onClick={() => copyToClipboard(subnet.mikrotikAddressCommand, 'cmd_addr')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copiedKey === 'cmd_addr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto">
                <code>{subnet.mikrotikAddressCommand}</code>
              </div>
            </div>

            {/* IP Pool Script */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{t.mikrotikPoolScript}</span>
                <button
                  onClick={() => copyToClipboard(subnet.mikrotikPoolCommand, 'cmd_pool')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copiedKey === 'cmd_pool' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                <code>{subnet.mikrotikPoolCommand}</code>
              </div>
            </div>

            {/* DHCP Network Script */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{t.mikrotikDhcpScript}</span>
                <button
                  onClick={() => copyToClipboard(subnet.mikrotikDhcpNetworkCommand, 'cmd_dhcp')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copiedKey === 'cmd_dhcp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
                <code>{subnet.mikrotikDhcpNetworkCommand}</code>
              </div>
            </div>
          </div>

          {/* Subnet Division Splitter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Split className="w-4 h-4 text-indigo-400" />
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                    {t.subnetDividerTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{t.subnetDividerDesc}</p>
                </div>
              </div>

              {/* Target CIDR selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{t.targetPrefixLabel}</span>
                <select
                  value={targetCidr}
                  onChange={(e) => setTargetCidr(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {Array.from({ length: 33 - (subnet.cidr + 1) }, (_, i) => subnet.cidr + 1 + i).map((c) => (
                    <option key={c} value={c}>
                      /{c} ({Math.pow(2, 32 - c) > 2 ? Math.pow(2, 32 - c) - 2 : Math.pow(2, 32 - c)} hosts)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subnets table */}
            {dividedSubnets.length > 0 ? (
              <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-72">
                <table className="w-full text-xs text-left rtl:text-right font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="px-3 py-2.5">{t.colIndex}</th>
                      <th className="px-3 py-2.5">{t.colNetwork}</th>
                      <th className="px-3 py-2.5">{t.colUsableRange}</th>
                      <th className="px-3 py-2.5">{t.colBroadcast}</th>
                      <th className="px-3 py-2.5">{t.colHosts}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    {dividedSubnets.map((sub) => (
                      <tr key={sub.index} className="hover:bg-slate-850/50">
                        <td className="px-3 py-2 text-slate-400">{sub.index}</td>
                        <td className="px-3 py-2 text-emerald-400 font-bold">{sub.network}/{sub.cidr}</td>
                        <td className="px-3 py-2 text-slate-200">{sub.firstHost} - {sub.lastHost}</td>
                        <td className="px-3 py-2 text-sky-300">{sub.broadcast}</td>
                        <td className="px-3 py-2 text-indigo-400">{sub.hosts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                Select a target prefix larger than /{subnet.cidr} to view subnets.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
          Invalid IPv4 format. Please enter a valid address such as <code className="text-emerald-400">192.168.88.1/24</code>.
        </div>
      )}
    </div>
  );
};
