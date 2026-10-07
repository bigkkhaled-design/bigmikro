export type Language = 'ar' | 'en';

export interface OuiEntry {
  prefix: string; // e.g. "00:0C:42"
  vendor: string;
  isMikroTik: boolean;
  notes?: string;
  country?: string;
}

export interface MacAnalysis {
  input: string;
  isValid: boolean;
  normalized: string; // XX:XX:XX:XX:XX:XX
  formats: {
    colon: string; // 00:0C:42:1F:2E:3D
    dash: string; // 00-0C-42-1F-2E-3D
    cisco: string; // 000c.421f.2e3d
    raw: string; // 000c421f2e3d
    mikrotikCli: string; // 00:0C:42:1F:2E:3D
    binary: string;
  };
  oui: string; // "00:0C:42"
  vendor: string;
  isMikroTik: boolean;
  country?: string;
  notes?: string;
  isMulticast: boolean;
  isLocallyAdministered: boolean;
  ipv6LinkLocal: string; // fe80::...
}

export interface IpSubnetResult {
  ip: string;
  cidr: number;
  netmask: string;
  wildcard: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  ipType: 'private' | 'public' | 'loopback' | 'link-local' | 'multicast';
  binaryIp: string;
  binaryMask: string;
  mikrotikPoolCommand: string;
  mikrotikAddressCommand: string;
  mikrotikDhcpNetworkCommand: string;
}

export interface MikroTikPort {
  id: string;
  name: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'TCP/UDP';
  category: 'api' | 'management' | 'discovery' | 'vpn' | 'routing' | 'service';
  defaultEnabled: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  descriptionEn: string;
  descriptionAr: string;
  mikrotikServicePath?: string; // e.g. "/ip service"
  serviceName?: string; // e.g. "api", "api-ssl", "winbox", "www"
  cliCommandEnable?: string;
  cliCommandDisable?: string;
  cliCommandSetPort?: string;
  cliCommandRestrict?: string;
  bestPracticeEn: string;
  bestPracticeAr: string;
}

export interface NeighborDevice {
  id: string;
  identity: string;
  macAddress: string;
  ipAddress: string;
  boardName: string;
  version: string;
  architecture: string;
  uptime: string;
  interface: string;
  isMikroTik: boolean;
  notes?: string;
}
