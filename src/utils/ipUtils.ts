import { IpSubnetResult } from '../types';

export function ipToNumber(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

export function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

export function cidrToNetmask(cidr: number): string {
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  return numberToIp(mask);
}

export function cidrToWildcard(cidr: number): string {
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcard = ~mask >>> 0;
  return numberToIp(wildcard);
}

export function ipToBinary(ip: string): string {
  return ip
    .split('.')
    .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
    .join('.');
}

export function getIpClass(ip: string): string {
  const firstOctet = parseInt(ip.split('.')[0], 10);
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet === 127) return 'Loopback (A)';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
  return 'E (Experimental)';
}

export function getIpType(ip: string): 'private' | 'public' | 'loopback' | 'link-local' | 'multicast' {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts[0] === 127) return 'loopback';
  if (parts[0] === 169 && parts[1] === 254) return 'link-local';
  if (parts[0] >= 224 && parts[0] <= 239) return 'multicast';

  // RFC 1918 Private Ranges
  // 10.0.0.0/8
  if (parts[0] === 10) return 'private';
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return 'private';
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return 'private';

  return 'public';
}

export function calculateSubnet(input: string): IpSubnetResult | null {
  // Accepts "192.168.88.1/24" or "192.168.88.1" (defaults to /24)
  const trimmed = input.trim();
  let [ipStr, cidrStr] = trimmed.split('/');
  if (!ipStr) return null;

  // Validate IP octets
  const octets = ipStr.split('.');
  if (octets.length !== 4) return null;
  for (const oct of octets) {
    const val = parseInt(oct, 10);
    if (isNaN(val) || val < 0 || val > 255 || oct !== val.toString()) {
      return null;
    }
  }

  let cidr = cidrStr ? parseInt(cidrStr, 10) : 24;
  if (isNaN(cidr) || cidr < 0 || cidr > 32) {
    cidr = 24;
  }

  const ipNum = ipToNumber(ipStr);
  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardNum = ~maskNum >>> 0;

  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | wildcardNum) >>> 0;

  const networkAddress = numberToIp(networkNum);
  const broadcastAddress = numberToIp(broadcastNum);
  const netmask = numberToIp(maskNum);
  const wildcard = numberToIp(wildcardNum);

  const totalHosts = Math.pow(2, 32 - cidr);
  let usableHosts = 0;
  let firstUsableIp = '';
  let lastUsableIp = '';

  if (cidr === 32) {
    usableHosts = 1;
    firstUsableIp = ipStr;
    lastUsableIp = ipStr;
  } else if (cidr === 31) {
    // RFC 3021 point to point
    usableHosts = 2;
    firstUsableIp = networkAddress;
    lastUsableIp = broadcastAddress;
  } else {
    usableHosts = Math.max(0, totalHosts - 2);
    firstUsableIp = numberToIp(networkNum + 1);
    lastUsableIp = numberToIp(broadcastNum - 1);
  }

  const ipClass = getIpClass(ipStr);
  const ipType = getIpType(ipStr);
  const binaryIp = ipToBinary(ipStr);
  const binaryMask = ipToBinary(netmask);

  // MikroTik commands
  const mikrotikPoolCommand = `/ip pool add name="pool-${networkAddress.replace(/\./g, '_')}_${cidr}" ranges=${firstUsableIp}-${lastUsableIp}`;
  const mikrotikAddressCommand = `/ip address add address=${ipStr}/${cidr} interface=bridge comment="LAN-Subnet"`;
  const mikrotikDhcpNetworkCommand = `/ip dhcp-server network add address=${networkAddress}/${cidr} gateway=${ipStr} dns-server=8.8.8.8,1.1.1.1 comment="DHCP-Scope"`;

  return {
    ip: ipStr,
    cidr,
    netmask,
    wildcard,
    networkAddress,
    broadcastAddress,
    firstUsableIp,
    lastUsableIp,
    totalHosts,
    usableHosts,
    ipClass,
    ipType,
    binaryIp,
    binaryMask,
    mikrotikPoolCommand,
    mikrotikAddressCommand,
    mikrotikDhcpNetworkCommand,
  };
}

export interface SubnetBlock {
  index: number;
  network: string;
  cidr: number;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  hosts: number;
}

export function divideNetwork(baseNetwork: string, baseCidr: number, targetCidr: number): SubnetBlock[] {
  if (targetCidr <= baseCidr || targetCidr > 32) return [];

  const count = Math.pow(2, targetCidr - baseCidr);
  const blockSize = Math.pow(2, 32 - targetCidr);
  const baseNum = (ipToNumber(baseNetwork) & ((~0 << (32 - baseCidr)) >>> 0)) >>> 0;

  const results: SubnetBlock[] = [];
  const limit = Math.min(count, 64); // max 64 items preview

  for (let i = 0; i < limit; i++) {
    const net = (baseNum + i * blockSize) >>> 0;
    const bcast = (net + blockSize - 1) >>> 0;

    let first = '';
    let last = '';
    let usable = 0;

    if (targetCidr === 32) {
      first = numberToIp(net);
      last = numberToIp(net);
      usable = 1;
    } else if (targetCidr === 31) {
      first = numberToIp(net);
      last = numberToIp(bcast);
      usable = 2;
    } else {
      first = numberToIp(net + 1);
      last = numberToIp(bcast - 1);
      usable = blockSize - 2;
    }

    results.push({
      index: i + 1,
      network: numberToIp(net),
      cidr: targetCidr,
      firstHost: first,
      lastHost: last,
      broadcast: numberToIp(bcast),
      hosts: usable,
    });
  }

  return results;
}
