import { OuiEntry } from '../types';

export const OUI_DATABASE: OuiEntry[] = [
  // MikroTik Official OUIs
  { prefix: '00:0C:42', vendor: 'MikroTik (RouterBOARD)', isMikroTik: true, country: 'Latvia', notes: 'Classic MikroTik RouterBOARD OUI' },
  { prefix: '48:8F:5A', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'CCR & CRS & Cloud Router series' },
  { prefix: '64:D1:54', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'hAP ac / cAP series wireless' },
  { prefix: 'CC:2D:E0', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'RB3011 / RB4011 / RB5009 series' },
  { prefix: 'D4:CA:6D', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'hEX / PowerBox series' },
  { prefix: 'E4:8D:8C', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'SXT / Disc / Wireless Wire' },
  { prefix: 'B8:69:F4', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'CRS3xx Switch series' },
  { prefix: '18:FD:74', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'Chateau / 5G / LTE routers' },
  { prefix: '2C:C8:1B', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'NetMetal / BaseBox wireless' },
  { prefix: '74:4D:28', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'CCR2004 / CCR2116 100G Series' },
  { prefix: 'C4:AD:34', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'hAP ax2 / hAP ax3 Wi-Fi 6' },
  { prefix: '78:9A:18', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik Enterprise Cloud switches' },
  { prefix: 'DC:2C:6E', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik Gigabit Routerboards' },
  { prefix: '08:55:31', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik IoT / LoRaWAN Gateways' },
  { prefix: 'F4:1E:26', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik RouterBOARD' },
  { prefix: '98:9B:CB', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik RouterBOARD' },
  { prefix: '28:28:5D', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik RouterBOARD' },
  { prefix: '84:16:0C', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik RouterBOARD' },
  { prefix: '3C:90:01', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik RouterBOARD' },
  { prefix: '54:A0:50', vendor: 'MikroTik (RouterOS)', isMikroTik: true, country: 'Latvia', notes: 'MikroTik RouterBOARD' },

  // Ubiquiti Networks
  { prefix: '00:27:22', vendor: 'Ubiquiti Networks', isMikroTik: false, country: 'United States', notes: 'UniFi / EdgeRouter / AirMax' },
  { prefix: '04:18:D6', vendor: 'Ubiquiti Networks', isMikroTik: false, country: 'United States', notes: 'UniFi AP / Switch' },
  { prefix: '24:A4:3C', vendor: 'Ubiquiti Networks', isMikroTik: false, country: 'United States', notes: 'EdgeSwitch / Dream Machine' },
  { prefix: '68:D7:9A', vendor: 'Ubiquiti Networks', isMikroTik: false, country: 'United States', notes: 'UniFi AP' },
  { prefix: '74:83:C2', vendor: 'Ubiquiti Networks', isMikroTik: false, country: 'United States', notes: 'UniFi Protect / Cloud Key' },
  { prefix: '80:2A:A8', vendor: 'Ubiquiti Networks', isMikroTik: false, country: 'United States', notes: 'AirFiber / Wave' },
  { prefix: 'DC:9F:DB', vendor: 'Ubiquiti Networks', isMikroTik: false, country: 'United States', notes: 'UniFi Dream Router' },

  // Cisco Systems
  { prefix: '00:00:0C', vendor: 'Cisco Systems', isMikroTik: false, country: 'United States', notes: 'Cisco Catalyst / Core' },
  { prefix: '00:01:42', vendor: 'Cisco Systems', isMikroTik: false, country: 'United States', notes: 'Cisco Routers' },
  { prefix: '00:1B:D4', vendor: 'Cisco Systems', isMikroTik: false, country: 'United States', notes: 'Cisco Integrated Services' },
  { prefix: '70:81:05', vendor: 'Cisco Systems', isMikroTik: false, country: 'United States', notes: 'Cisco Meraki AP / MX' },

  // TP-Link
  { prefix: '50:C7:BF', vendor: 'TP-Link Technologies', isMikroTik: false, country: 'China', notes: 'Omada / Archer Routers' },
  { prefix: '60:32:B1', vendor: 'TP-Link Technologies', isMikroTik: false, country: 'China', notes: 'Deco Mesh System' },
  { prefix: 'E8:48:B8', vendor: 'TP-Link Technologies', isMikroTik: false, country: 'China', notes: 'Omada Switch' },
  { prefix: '14:EB:B6', vendor: 'TP-Link Technologies', isMikroTik: false, country: 'China', notes: 'TP-Link Wireless' },

  // Huawei
  { prefix: '00:18:82', vendor: 'Huawei Technologies', isMikroTik: false, country: 'China', notes: 'Huawei Enterprise Router' },
  { prefix: '20:08:89', vendor: 'Huawei Technologies', isMikroTik: false, country: 'China', notes: 'Huawei ONT / GPON' },
  { prefix: '48:46:FB', vendor: 'Huawei Technologies', isMikroTik: false, country: 'China', notes: 'Huawei AirEngine' },
  { prefix: '70:54:F5', vendor: 'Huawei Technologies', isMikroTik: false, country: 'China', notes: 'Huawei NetEngine' },

  // Raspberry Pi
  { prefix: 'B8:27:EB', vendor: 'Raspberry Pi Foundation', isMikroTik: false, country: 'United Kingdom', notes: 'Raspberry Pi 1/2/3' },
  { prefix: 'DC:A6:32', vendor: 'Raspberry Pi Trading', isMikroTik: false, country: 'United Kingdom', notes: 'Raspberry Pi 4' },
  { prefix: 'E4:5F:01', vendor: 'Raspberry Pi Trading', isMikroTik: false, country: 'United Kingdom', notes: 'Raspberry Pi 4 / 400' },
  { prefix: '28:CD:C1', vendor: 'Raspberry Pi Ltd', isMikroTik: false, country: 'United Kingdom', notes: 'Raspberry Pi 5' },

  // Intel
  { prefix: '00:1B:21', vendor: 'Intel Corporate', isMikroTik: false, country: 'United States', notes: 'Intel Gigabit NIC' },
  { prefix: '68:05:CA', vendor: 'Intel Corporate', isMikroTik: false, country: 'United States', notes: 'Intel Wi-Fi 6 AX200' },
  { prefix: '34:13:E8', vendor: 'Intel Corporate', isMikroTik: false, country: 'United States', notes: 'Intel Ethernet Server' },

  // Apple
  { prefix: 'AC:DE:48', vendor: 'Apple, Inc.', isMikroTik: false, country: 'United States', notes: 'MacBook / Mac Mini' },
  { prefix: 'BC:D0:74', vendor: 'Apple, Inc.', isMikroTik: false, country: 'United States', notes: 'iPhone / iPad' },
  { prefix: 'F0:18:98', vendor: 'Apple, Inc.', isMikroTik: false, country: 'United States', notes: 'Apple Devices' },

  // Espressif (IoT)
  { prefix: '24:0A:C4', vendor: 'Espressif Systems', isMikroTik: false, country: 'China', notes: 'ESP32 IoT Node' },
  { prefix: '30:AE:A4', vendor: 'Espressif Systems', isMikroTik: false, country: 'China', notes: 'ESP32 Wi-Fi Module' },
  { prefix: '84:CC:A8', vendor: 'Espressif Systems', isMikroTik: false, country: 'China', notes: 'ESP8266 IoT Chip' },

  // QEMU / Proxmox / Virtualization (Often used for MikroTik CHR)
  { prefix: '52:54:00', vendor: 'QEMU Virtual NIC / MikroTik CHR', isMikroTik: false, country: 'Virtual', notes: 'Common default for MikroTik Cloud Hosted Router on Proxmox/KVM' },
  { prefix: '00:50:56', vendor: 'VMware, Inc.', isMikroTik: false, country: 'United States', notes: 'VMware ESXi (MikroTik CHR VM)' },
  { prefix: '00:15:5D', vendor: 'Microsoft Hyper-V', isMikroTik: false, country: 'United States', notes: 'Hyper-V Virtual Adapter' },
];

export const MIKROTIK_KNOWN_MODELS = [
  { model: 'CCR2004-16G-2S+', type: 'Cloud Core Router', architecture: 'ARM64', ports: '16x 1G, 2x 10G SFP+' },
  { model: 'RB5009UG+S+IN', type: 'Heavy Duty Home Lab', architecture: 'ARM64', ports: '7x 1G, 1x 2.5G, 1x 10G SFP+' },
  { model: 'hAP ax3 (C53UiG+5HPaxD2HPaxD)', type: 'Wi-Fi 6 Home Router', architecture: 'ARM64', ports: '4x 1G, 1x 2.5G, Wi-Fi 6' },
  { model: 'hEX (RB750Gr3)', type: 'Compact Gigabit Router', architecture: 'MMIPS', ports: '5x Gigabit Ethernet' },
  { model: 'CRS326-24G-2S+RM', type: 'Cloud Router Switch', architecture: 'ARM', ports: '24x 1G, 2x 10G SFP+' },
  { model: 'CCR2116-12G-4S+', type: 'Enterprise Core Router', architecture: 'ARM64 (16 cores)', ports: '12x 1G, 4x 10G SFP+' },
  { model: 'Cloud Hosted Router (CHR)', type: 'Virtual Router Appliance', architecture: 'x86_64', ports: 'VirtIO / VMXNET3' },
  { model: 'RB3011UiAS-RM', type: 'Rackmount Multi-Port', architecture: 'ARM 32bit', ports: '10x 1G, 1x SFP, LCD' },
  { model: 'hAP ac2 (RBD52G-5HacD2HnD)', type: 'Dual-Band Gigabit', architecture: 'ARM 32bit', ports: '5x 1G, Wi-Fi 5' },
];
