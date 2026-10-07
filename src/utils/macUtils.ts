import { MacAnalysis } from '../types';
import { OUI_DATABASE } from '../data/ouiDatabase';

// Clean non-hex characters
export function cleanMacString(input: string): string {
  return input.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
}

export function isValidMac(input: string): boolean {
  const cleaned = cleanMacString(input);
  return cleaned.length === 12;
}

export function formatColon(cleaned: string): string {
  return cleaned.match(/.{1,2}/g)?.join(':') || '';
}

export function formatDash(cleaned: string): string {
  return cleaned.match(/.{1,2}/g)?.join('-') || '';
}

export function formatCisco(cleaned: string): string {
  const lower = cleaned.toLowerCase();
  return lower.match(/.{1,4}/g)?.join('.') || '';
}

export function formatBinary(cleaned: string): string {
  return cleaned
    .match(/.{1,2}/g)
    ?.map(byte => parseInt(byte, 16).toString(2).padStart(8, '0'))
    .join(' ') || '';
}

export function generateIpv6LinkLocal(cleaned: string): string {
  if (cleaned.length !== 12) return 'N/A';
  // Insert FFFE in the middle
  const o = cleaned.match(/.{1,2}/g) || [];
  if (o.length !== 6) return 'N/A';

  // Invert 7th bit (universal/local bit)
  let firstByte = parseInt(o[0], 16);
  firstByte ^= 0x02;
  const firstByteHex = firstByte.toString(16).padStart(2, '0');

  const part1 = `${firstByteHex}${o[1]}`.toLowerCase();
  const part2 = `${o[2]}ff`.toLowerCase();
  const part3 = `fe${o[3]}`.toLowerCase();
  const part4 = `${o[4]}${o[5]}`.toLowerCase();

  return `fe80::${part1}:${part2}:${part3}:${part4}`;
}

export function analyzeMac(input: string): MacAnalysis {
  const cleaned = cleanMacString(input);
  const isValid = cleaned.length === 12;

  if (!isValid) {
    // If only partial OUI provided (e.g. 6 chars like "000C42" or "00:0C:42")
    const partialOui = cleaned.slice(0, 6);
    const ouiFormatted = partialOui.match(/.{1,2}/g)?.join(':') || '';
    const match = OUI_DATABASE.find(item => item.prefix === ouiFormatted);

    return {
      input,
      isValid: false,
      normalized: ouiFormatted,
      formats: {
        colon: ouiFormatted,
        dash: partialOui.match(/.{1,2}/g)?.join('-') || '',
        cisco: partialOui.toLowerCase(),
        raw: partialOui.toLowerCase(),
        mikrotikCli: '',
        binary: ''
      },
      oui: ouiFormatted,
      vendor: match ? match.vendor : 'Incomplete MAC / غير مكتمل',
      isMikroTik: match ? match.isMikroTik : false,
      country: match?.country,
      notes: match?.notes,
      isMulticast: false,
      isLocallyAdministered: false,
      ipv6LinkLocal: ''
    };
  }

  const colon = formatColon(cleaned);
  const dash = formatDash(cleaned);
  const cisco = formatCisco(cleaned);
  const binary = formatBinary(cleaned);
  const ipv6LinkLocal = generateIpv6LinkLocal(cleaned);

  // OUI prefix is first 3 bytes (6 hex chars)
  const oui = colon.substring(0, 8); // "XX:XX:XX"
  const matchedVendor = OUI_DATABASE.find(item => item.prefix.toUpperCase() === oui.toUpperCase());

  // Bit checks on 1st octet
  const firstByte = parseInt(cleaned.substring(0, 2), 16);
  const isMulticast = (firstByte & 0x01) === 1; // Least significant bit: 1 = Multicast, 0 = Unicast
  const isLocallyAdministered = (firstByte & 0x02) === 2; // 2nd least significant bit: 1 = Local, 0 = Universal (OUI)

  const isMikroTik = matchedVendor?.isMikroTik || oui.startsWith('00:0C:42') || oui.startsWith('48:8F:5A');

  return {
    input,
    isValid: true,
    normalized: colon,
    formats: {
      colon,
      dash,
      cisco,
      raw: cleaned.toLowerCase(),
      mikrotikCli: `/interface ethernet set [find default-name=ether1] mac-address="${colon}"`,
      binary
    },
    oui,
    vendor: matchedVendor ? matchedVendor.vendor : 'Unknown Vendor / جهة غير مسجلة',
    isMikroTik: !!isMikroTik,
    country: matchedVendor?.country,
    notes: matchedVendor?.notes || (isLocallyAdministered ? 'Locally Administered Address (LAA)' : 'Universally Administered (IEEE OUI)'),
    isMulticast,
    isLocallyAdministered,
    ipv6LinkLocal
  };
}

export function generateRandomMikrotikMac(): string {
  const mikrotikPrefixes = ['00:0C:42', '48:8F:5A', '64:D1:54', 'CC:2D:E0', 'D4:CA:6D', '74:4D:28'];
  const prefix = mikrotikPrefixes[Math.floor(Math.random() * mikrotikPrefixes.length)];
  const randomBytes = Array.from({ length: 3 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
  ).join(':');
  return `${prefix}:${randomBytes}`;
}

export function generateVrrpMac(vrid: number = 1): string {
  const validVrid = Math.min(255, Math.max(1, vrid));
  const hex = validVrid.toString(16).padStart(2, '0').toUpperCase();
  return `00:00:5E:00:01:${hex}`;
}
