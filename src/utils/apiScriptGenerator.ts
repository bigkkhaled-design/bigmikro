export interface ApiScriptOptions {
  host: string;
  port: number;
  username: string;
  useSsl: boolean;
  action: 'system_info' | 'list_interfaces' | 'add_firewall_rule' | 'add_user' | 'reboot';
}

export function generatePythonScript(options: ApiScriptOptions): string {
  const { host, port, username, useSsl, action } = options;

  let actionCode = '';
  if (action === 'system_info') {
    actionCode = `# Get System Resource Details
resources = api.get_resource('/system/resource')
info = resources.get()
print(f"RouterOS Version: {info[0].get('version')}")
print(f"Board Name: {info[0].get('board-name')}")
print(f"CPU Load: {info[0].get('cpu-load')}%")
print(f"Free Memory: {int(info[0].get('free-memory', 0)) // 1024 // 1024} MB")`;
  } else if (action === 'list_interfaces') {
    actionCode = `# Fetch all Network Interfaces
interfaces = api.get_resource('/interface')
for iface in interfaces.get():
    print(f"[{iface.get('type')}] {iface.get('name')} | Running: {iface.get('running')} | MAC: {iface.get('mac-address', 'N/A')}")`;
  } else if (action === 'add_firewall_rule') {
    actionCode = `# Add Firewall Filter Rule (Drop invalid)
fw = api.get_resource('/ip/firewall/filter')
fw.add(
    chain='input',
    connection_state='invalid',
    action='drop',
    comment='BigMikro Drop Invalid Connection'
)
print("Firewall rule added successfully!")`;
  } else if (action === 'add_user') {
    actionCode = `# Add Hotspot or Local User
users = api.get_resource('/user')
users.add(
    name='api_operator',
    group='read',
    password='ComplexPassword123!',
    comment='Created via BigMikro API'
)
print("User created successfully!")`;
  } else {
    actionCode = `# Reboot RouterOS
sys = api.get_resource('/system')
sys.call('reboot')
print("Reboot signal sent.")`;
  }

  return `#!/usr/bin/env python3
"""
BigMikro - RouterOS API Connection Script
Prerequisites: pip install routeros_api
Target Port: ${port} (${useSsl ? 'API-SSL' : 'API Plain'})
"""
import routeros_api

ROUTER_HOST = "${host}"
ROUTER_USER = "${username}"
ROUTER_PASS = "YOUR_PASSWORD"
PORT = ${port}
USE_SSL = ${useSsl ? 'True' : 'False'}

try:
    connection = routeros_api.RouterOsApiPool(
        ROUTER_HOST,
        username=ROUTER_USER,
        password=ROUTER_PASS,
        port=PORT,
        use_ssl=USE_SSL,
        plaintext_login=True
    )
    api = connection.get_api()
    print(f"Connected successfully to MikroTik at {ROUTER_HOST}:{PORT}")

    ${actionCode}

    connection.disconnect()
except Exception as e:
    print(f"Error connecting to MikroTik API: {e}")
`;
}

export function generateNodeScript(options: ApiScriptOptions): string {
  const { host, port, username, action } = options;

  let actionJs = '';
  if (action === 'system_info') {
    actionJs = `// Get System Resources
  const resources = await conn.write('/system/resource/print');
  console.log('System Resource:', resources);`;
  } else if (action === 'list_interfaces') {
    actionJs = `// List Ethernet Interfaces
  const interfaces = await conn.write('/interface/print');
  interfaces.forEach(i => console.log(\`\${i.name} (\${i.type}): \${i['mac-address'] || 'No MAC'}\`));`;
  } else {
    actionJs = `// Query IP addresses
  const ips = await conn.write('/ip/address/print');
  console.log('IP Addresses:', ips);`;
  }

  return `/**
 * BigMikro - Node.js RouterOS API Connection
 * Prerequisites: npm install node-routeros
 */
import { RouterOSAPI } from 'node-routeros';

const conn = new RouterOSAPI({
  host: '${host}',
  user: '${username}',
  password: 'YOUR_PASSWORD',
  port: ${port},
  timeout: 5000,
});

async function main() {
  try {
    await conn.connect();
    console.log('Connected to MikroTik RouterOS on port ${port}!');

    ${actionJs}

    conn.close();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

main();
`;
}

export function generateRestCurl(options: ApiScriptOptions): string {
  const { host, username, action } = options;

  let endpoint = '/rest/system/resource';
  if (action === 'list_interfaces') endpoint = '/rest/interface';
  if (action === 'add_firewall_rule') endpoint = '/rest/ip/firewall/filter';

  return `# RouterOS v7 REST API (HTTPS port 443 or HTTP port 80)
# Requirements: RouterOS 7.1+ with 'www' or 'www-ssl' enabled

curl -k -u "${username}:YOUR_PASSWORD" \\
  -X GET "https://${host}${endpoint}" \\
  -H "Content-Type: application/json"
`;
}

export function generateRouterOsCli(options: ApiScriptOptions): string {
  const { port } = options;

  return `# MikroTik RouterOS Terminal Security Script (.rsc)
# Run in MikroTik Terminal (Winbox -> New Terminal)

# 1. Check current API service status
/ip service print where name~"api"

# 2. Configure API service on port ${port} and restrict to local subnet
/ip service set api port=${port} address=192.168.88.0/24 disabled=no

# 3. Create dedicated API user with limited policies
/user group add name=api_managers policy=api,read,write,test,!password,!sensitive,!policy
/user add name=api_user group=api_managers password="SecurePassword2026!" comment="BigMikro API Access"

# 4. Optional: Allow API port in Firewall Filter Input
/ip firewall filter add chain=input protocol=tcp dst-port=${port} src-address=192.168.88.0/24 action=accept comment="Allow BigMikro API from LAN"
`;
}
