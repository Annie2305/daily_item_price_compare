import fs from 'node:fs/promises';
import path from 'node:path';

const iso3ToCode = {
  ARE: 'AE', ARG: 'AR', AUS: 'AU', AZE: 'AZ', BHR: 'BH', BRA: 'BR',
  CAN: 'CA', CHE: 'CH', CHL: 'CL', CHN: 'CN', COL: 'CO', CRI: 'CR',
  CZE: 'CZ', DNK: 'DK', EGY: 'EG', EUZ: 'EA', GBR: 'UK', GTM: 'GT',
  HKG: 'HK', HND: 'HN', HUN: 'HU', IDN: 'ID', IND: 'IN', ISR: 'IL',
  JOR: 'JO', JPN: 'JP', KOR: 'KR', KWT: 'KW', LBN: 'LB', MDA: 'MD',
  MEX: 'MX', MYS: 'MY', NIC: 'NI', NOR: 'NO', NZL: 'NZ', OMN: 'OM',
  PAK: 'PK', PER: 'PE', PHL: 'PH', POL: 'PL', QAT: 'QA', ROU: 'RO',
  SAU: 'SA', SGP: 'SG', SWE: 'SE', THA: 'TH', TUR: 'TR', TWN: 'TW',
  UKR: 'UA', URY: 'UY', USA: 'US', VEN: 'VE', VNM: 'VN', ZAF: 'ZA'
};

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines.shift().split(',');
  const rows = lines.map(line => {
    const cols = line.split(',');
    const obj = {};
    header.forEach((h, i) => { obj[h] = cols[i]; });
    return obj;
  });
  return rows;
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node scripts/ingest_bigmac_csv.mjs <csv_path>');
    process.exit(1);
  }
  const abs = path.resolve(process.cwd(), input);
  const csv = await fs.readFile(abs, 'utf8');
  const rows = parseCsv(csv);

  const prices = {};
  for (const r of rows) {
    const iso3 = r.iso_a3;
    const code = iso3ToCode[iso3];
    if (!code) continue;
    const price = Number(r.local_price);
    if (!Number.isFinite(price)) continue;
    prices[code] = price;
  }

  const out = {
    source: 'The Economist Big Mac Index',
    currency: 'local',
    updated: new Date().toISOString().slice(0, 10),
    prices
  };

  const outPath = path.resolve(process.cwd(), 'data', 'bigmac.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${Object.keys(prices).length} Big Mac prices to data/bigmac.json`);
}

main().catch(err => { console.error(err); process.exit(1); });


