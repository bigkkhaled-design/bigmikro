import React, { useState } from 'react';
import { Language, NeighborDevice } from '../types';
import { translations } from '../i18n/translations';
import { 
  Radio, 
  RefreshCw, 
  Plus, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Terminal, 
  Trash2, 
  ShieldCheck, 
  ExternalLink,
  Cpu
} from 'lucide-react';

interface NeighborDiscoveryTabProps {
  lang: Language;
}

const INITIAL_DEVICES: NeighborDevice[] = [
  {
    id: 'dev-1',
    identity: 'CCR2004-CoreGateway',
    macAddress: '48:8F:5A:21:44:88',
    ipAddress: '192.168.88.1',
    boardName: 'CCR2004-16G-2S+',
    version: '7.15.2 (stable)',
    architecture: 'ARM64',
    uptime: '42d 12:18:04',
    interface: 'sfp-sfpplus1',
    isMikroTik: true,
  },
  {
    id: 'dev-2',
    identity: 'RB5009-LabServer',
    macAddress: 'CC:2D:E0:6B:7A:12',
    ipAddress: '192.168.88.2',
    boardName: 'RB5009UG+S+IN',
    version: '7.14.3 (stable)',
    architecture: 'ARM64',
    uptime: '18d 04:55:19',
    interface: 'ether1',
    isMikroTik: true,
  },
  {
    id: 'dev-3',
    identity: 'hAP-ax3-OfficeWiFi',
    macAddress: 'C4:AD:34:55:12:34',
    ipAddress: '192.168.88.50',
    boardName: 'hAP ax3 (C53UiG)',
    version: '7.15.1 (stable)',
    architecture: 'ARM64',
    uptime: '06d 21:02:40',
    interface: 'ether2',
    isMikroTik: true,
  },
  {
    id: 'dev-4',
    identity: 'CRS326-CoreSwitch',
    macAddress: 'B8:69:F4:77:88:99',
    ipAddress: '192.168.88.3',
    boardName: 'CRS326-24G-2S+RM',
    version: '7.12.1 (stable)',
    architecture: 'ARM',
    uptime: '120d 08:33:51',
    interface: 'sfp-sfpplus2',
    isMikroTik: true,
  },
  {
    id: 'dev-5',
    identity: 'CHR-CloudVPN-Node',
    macAddress: '52:54:00:99:88:77',
    ipAddress: '10.200.0.1',
    boardName: 'Cloud Hosted Router (CHR)',
    version: '7.15.2 (stable)',
    architecture: 'x86_64',
    uptime: '89d 01:14:02',
    interface: 'ether1',
    isMikroTik: true,
  },
];

export const NeighborDiscoveryTab: React.FC<NeighborDiscoveryTabProps> = ({ lang }) => {
  const t = translations[lang];
  const [devices, setDevices] = useState<NeighborDevice[]>(INITIAL_DEVICES);
  const [isScanning, setIsScanning] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New device form
  const [newIdentity, setNewIdentity] = useState('');
  const [newMac, setNewMac] = useState('');
  const [newIp, setNewIp] = useState('');
  const [newBoard, setNewBoard] = useState('hEX (RB750Gr3)');
  const [newVersion, setNewVersion] = useState('7.15 (stable)');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Append a newly found device or refresh
      if (!devices.some(d => d.macAddress === '74:4D:28:90:AB:CD')) {
        setDevices((prev) => [
          ...prev,
          {
            id: `dev-${Date.now()}`,
            identity: 'CCR2116-CoreEdge',
            macAddress: '74:4D:28:90:AB:CD',
            ipAddress: '192.168.88.254',
            boardName: 'CCR2116-12G-4S+',
            version: '7.15.2 (stable)',
            architecture: 'ARM64 (16 cores)',
            uptime: '01d 04:12:33',
            interface: 'sfp28-1',
            isMikroTik: true,
          }
        ]);
      }
    }, 900);
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdentity || !newMac || !newIp) return;

    setDevices((prev) => [
      {
        id: `dev-${Date.now()}`,
        identity: newIdentity.trim(),
        macAddress: newMac.trim(),
        ipAddress: newIp.trim(),
        boardName: newBoard.trim(),
        version: newVersion.trim(),
        architecture: 'ARM',
        uptime: '0d 00:01:00',
        interface: 'ether1',
        isMikroTik: true,
      },
      ...prev,
    ]);

    setNewIdentity('');
    setNewMac('');
    setNewIp('');
    setIsModalOpen(false);
  };

  const handleDeleteDevice = (id: string) => {
    setDevices((prev) => prev.filter(d => d.id !== id));
  };

  const generateArpScript = () => {
    const lines = [
      '# BigMikro - Generated Static ARP Table Script for RouterOS',
      '# Prevents ARP spoofing / Poisoning by mapping MNDP neighbors',
      '/ip arp',
    ];
    devices.forEach((dev) => {
      lines.push(
        `add address=${dev.ipAddress} mac-address="${dev.macAddress}" interface=bridge comment="MNDP: ${dev.identity} (${dev.boardName})"`
      );
    });
    return lines.join('\n');
  };

  const handleExportCsv = () => {
    const headers = 'Identity,MAC Address,IP Address,Board Name,Version,Interface,Uptime\n';
    const rows = devices.map(d => `"${d.identity}","${d.macAddress}","${d.ipAddress}","${d.boardName}","${d.version}","${d.interface}","${d.uptime}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bigmikro_mndp_neighbors_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 flex items-center gap-1.5 font-mono">
                <Radio className="w-3.5 h-3.5" />
                MNDP Broadcast (Port 5678 UDP)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">{t.discoveryTitle}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{t.discoveryDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? t.scanning : t.scanSimulated}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>{t.addCustomDevice}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Discovered Devices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              {t.devicesFound} ({devices.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(generateArpScript(), 'arp_script')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
            >
              {copiedKey === 'arp_script' ? <Check className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'arp_script' ? t.copied : t.exportArpScript}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.exportCsv}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">{t.colIdentity}</th>
                <th className="px-4 py-3">{t.colMac}</th>
                <th className="px-4 py-3">{t.colIp}</th>
                <th className="px-4 py-3">{t.colBoard}</th>
                <th className="px-4 py-3">{t.colVersion}</th>
                <th className="px-4 py-3">{t.colUptime}</th>
                <th className="px-4 py-3 text-center">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 bg-slate-900/50">
              {devices.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-850/50 transition-colors">
                  {/* Identity */}
                  <td className="px-4 py-3 font-bold text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    <span>{dev.identity}</span>
                  </td>

                  {/* MAC */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-cyan-400 font-bold select-all">{dev.macAddress}</span>
                      <button
                        onClick={() => copyToClipboard(dev.macAddress, `mac_${dev.id}`)}
                        className="text-slate-500 hover:text-cyan-400 p-0.5"
                      >
                        {copiedKey === `mac_${dev.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>

                  {/* IP */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-semibold select-all">{dev.ipAddress}</span>
                      <button
                        onClick={() => copyToClipboard(dev.ipAddress, `ip_${dev.id}`)}
                        className="text-slate-500 hover:text-emerald-400 p-0.5"
                      >
                        {copiedKey === `ip_${dev.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>

                  {/* Board */}
                  <td className="px-4 py-3 text-slate-300 font-medium">
                    {dev.boardName}
                  </td>

                  {/* Version */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-950 text-sky-300 border border-slate-800">
                      {dev.version}
                    </span>
                  </td>

                  {/* Uptime */}
                  <td className="px-4 py-3 text-slate-400">
                    {dev.uptime}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteDevice(dev.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-slate-100 mb-4">
              {t.deviceModalTitle}
            </h3>

            <form onSubmit={handleAddDevice} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">{t.devIdentity}</label>
                <input
                  type="text"
                  required
                  value={newIdentity}
                  onChange={(e) => setNewIdentity(e.target.value)}
                  placeholder="e.g. MikroTik-RB4011-Tower"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">{t.devMac}</label>
                <input
                  type="text"
                  required
                  value={newMac}
                  onChange={(e) => setNewMac(e.target.value)}
                  placeholder="48:8F:5A:XX:XX:XX"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">{t.devIp}</label>
                <input
                  type="text"
                  required
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.88.10"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">{t.devBoard}</label>
                  <input
                    type="text"
                    value={newBoard}
                    onChange={(e) => setNewBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">{t.devVersion}</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
