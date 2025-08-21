import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'data', 'rates-usd.json');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function fetchRates() {
  const key = process.env.EXCHANGERATES_API_KEY;
  const providers = [
    {
      name: 'frankfurter',
      url: 'https://api.frankfurter.app/latest?from=USD',
      normalize: (data) => ({ base: data.base || 'USD', date: data.date, rates: data.rates })
    },
    {
      name: 'exchangerate.host',
      url: 'https://api.exchangerate.host/latest?base=USD',
      normalize: (data) => ({ base: data.base || 'USD', date: data.date, rates: data.rates })
    },
    // If a key is provided, try exchangeratesapi.io as the highest-priority source
    ...(key ? [{
      name: 'exchangeratesapi.io',
      // Note: free plan forces base EUR; request without base and convert to USD locally
      url: `https://api.exchangeratesapi.io/v1/latest?access_key=${encodeURIComponent(key)}`,
      normalize: (data) => {
        if (data.error) throw new Error(data.error.type || 'API error');
        const base = data.base || 'EUR';
        const date = data.date;
        const eurRates = data.rates;
        if (!eurRates || typeof eurRates !== 'object') throw new Error('Invalid rates');
        if (!eurRates.USD) throw new Error('USD rate missing (plan may restrict)');
        const usdPerEur = eurRates.USD; // USD per EUR
        // Convert all EUR-based rates to USD-based: rateUSD->C = (C per EUR) / (USD per EUR)
        const usdBaseRates = Object.fromEntries(Object.entries(eurRates).map(([code, rate]) => [code, rate / usdPerEur]));
        usdBaseRates.USD = 1;
        return { base: 'USD', date, rates: usdBaseRates };
      }
    }] : [])
  ];

  const errors = [];
  // Prefer the paid/keyed provider if present by moving it to the front
  const ordered = providers.sort((a, b) => (a.name === 'exchangeratesapi.io' ? -1 : b.name === 'exchangeratesapi.io' ? 1 : 0));
  // eslint-disable-next-line no-console
  console.log(`Key present: ${Boolean(key)} | Provider order: ${ordered.map(p => p.name).join(' -> ')}`);
  for (const p of ordered) {
    try {
      // eslint-disable-next-line no-console
      console.log(`Trying provider: ${p.name}`);
      const raw = await fetchJson(p.url);
      const { base, date, rates } = p.normalize(raw) || {};
      if (!rates || typeof rates !== 'object') throw new Error('Invalid rates payload');
      // eslint-disable-next-line no-console
      console.log(`Fetched ${Object.keys(rates).length} rates from: ${p.name}`);
      return { base, date, rates, source: p.name };
    } catch (err) {
      errors.push(`${p.name}: ${err.message}`);
    }
  }

  throw new Error(`All providers failed ->\n${errors.join('\n')}`);
}

async function main() {
  const { base, date, rates } = await fetchRates();
  const payload = {
    success: true,
    timestamp: Date.now(),
    base,
    date,
    rates
  };

  // Ensure directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Wrote ${Object.keys(rates).length} rates to ${path.relative(repoRoot, outputPath)} (date=${date})`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


