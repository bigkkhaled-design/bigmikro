// Online MAC Vendor Lookup API Service with intelligent caching & fallback

export interface ApiLookupResult {
  vendor: string;
  isMikroTik: boolean;
  source: 'online_api' | 'local_db';
  country?: string;
  prefix: string;
  error?: string;
}

const apiCache = new Map<string, ApiLookupResult>();

export async function lookupMacVendorApi(macClean: string): Promise<ApiLookupResult> {
  const prefix = macClean.slice(0, 6).toUpperCase();
  if (prefix.length < 6) {
    return {
      vendor: 'Invalid MAC Prefix',
      isMikroTik: false,
      source: 'local_db',
      prefix
    };
  }

  // Check in-memory cache
  if (apiCache.has(prefix)) {
    return apiCache.get(prefix)!;
  }

  const formattedPrefix = prefix.match(/.{1,2}/g)?.join(':') || prefix;

  // Try fetching from online MAC lookup API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`https://api.maclookup.app/v2/macs/${prefix}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.company) {
        const company = data.company;
        const isMikro = company.toLowerCase().includes('mikrotik') || 
                        company.toLowerCase().includes('routerboard');
        
        const result: ApiLookupResult = {
          vendor: company,
          isMikroTik: isMikro,
          source: 'online_api',
          country: data.country || undefined,
          prefix: formattedPrefix,
        };
        apiCache.set(prefix, result);
        return result;
      }
    }
  } catch (err) {
    // Online API failed (CORS, offline, timeout), will fallback to local database
  }

  // Second fallback online API attempt (macvendors.com)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`https://api.macvendors.com/${formattedPrefix}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const vendorText = await response.text();
      if (vendorText && !vendorText.includes('Not Found') && !vendorText.includes('error')) {
        const isMikro = vendorText.toLowerCase().includes('mikrotik') || 
                        vendorText.toLowerCase().includes('routerboard');

        const result: ApiLookupResult = {
          vendor: vendorText.trim(),
          isMikroTik: isMikro,
          source: 'online_api',
          prefix: formattedPrefix,
        };
        apiCache.set(prefix, result);
        return result;
      }
    }
  } catch (err) {
    // Fallback quietly to local DB
  }

  return {
    vendor: '',
    isMikroTik: false,
    source: 'local_db',
    prefix: formattedPrefix,
  };
}
