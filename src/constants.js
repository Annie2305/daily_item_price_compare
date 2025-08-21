// src/constants.js
export const CURRENCY_SYMBOLS = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', KRW: '₩',
    INR: '₹', BRL: 'R$', CAD: 'C$', AUD: 'A$', SGD: 'S$',
    TWD: 'NT$', RUB: '₽', MXN: '$'
  };
  
  export const CURRENCY_CODES = {
    // Existing
    US: 'USD', UK: 'GBP', CA: 'CAD', AU: 'AUD', DE: 'EUR',
    FR: 'EUR', JP: 'JPY', CN: 'CNY', IN: 'INR', BR: 'BRL',
    MX: 'MXN', RU: 'RUB', TW: 'TWD', KR: 'KRW', SG: 'SGD',
    // Added list
    AE: 'AED', AR: 'ARS', AZ: 'AZN', BH: 'BHD', CH: 'CHF',
    CL: 'CLP', CO: 'COP', CR: 'CRC', CZ: 'CZK', DK: 'DKK',
    EG: 'EGP', EA: 'EUR', GT: 'GTQ', HK: 'HKD', HN: 'HNL',
    HU: 'HUF', ID: 'IDR', IL: 'ILS', JO: 'JOD', KW: 'KWD',
    LB: 'LBP', MD: 'MDL', MY: 'MYR', NI: 'NIO', NO: 'NOK',
    NZ: 'NZD', OM: 'OMR', PK: 'PKR', PE: 'PEN', PH: 'PHP',
    PL: 'PLN', QA: 'QAR', RO: 'RON', SA: 'SAR', SE: 'SEK',
    TH: 'THB', TR: 'TRY', UA: 'UAH', UY: 'UYU', VE: 'VES',
    VN: 'VND', ZA: 'ZAR'
  };
  
  export const countryNames = {
    // Existing
    US: 'United States', UK: 'United Kingdom', CA: 'Canada',
    AU: 'Australia', DE: 'Germany', FR: 'France', JP: 'Japan',
    CN: 'China', IN: 'India', BR: 'Brazil', MX: 'Mexico',
    RU: 'Russia', TW: 'Taiwan', KR: 'South Korea', SG: 'Singapore',
    // Added list (from screenshot)
    AE: 'United Arab Emirates', AR: 'Argentina', AZ: 'Azerbaijan',
    BH: 'Bahrain', CH: 'Switzerland', CL: 'Chile', CO: 'Colombia',
    CR: 'Costa Rica', CZ: 'Czech Republic', DK: 'Denmark',
    EG: 'Egypt', EA: 'Euro area', GT: 'Guatemala', HK: 'Hong Kong',
    HN: 'Honduras', HU: 'Hungary', ID: 'Indonesia', IL: 'Israel',
    JO: 'Jordan', KW: 'Kuwait', LB: 'Lebanon', MD: 'Moldova',
    MY: 'Malaysia', NI: 'Nicaragua', NO: 'Norway', NZ: 'New Zealand',
    OM: 'Oman', PK: 'Pakistan', PE: 'Peru', PH: 'Philippines',
    PL: 'Poland', QA: 'Qatar', RO: 'Romania', SA: 'Saudi Arabia',
    SE: 'Sweden', TH: 'Thailand', TR: 'Turkey', UA: 'Ukraine',
    UY: 'Uruguay', VE: 'Venezuela', VN: 'Vietnam', ZA: 'South Africa'
  };

  // Additional countries for latte USD dataset
  Object.assign(CURRENCY_CODES, {
    AD: 'EUR', AW: 'AWG', AT: 'EUR', BE: 'EUR', BO: 'BOB', BG: 'BGN',
    KH: 'KHR', CY: 'EUR', SV: 'USD', FI: 'EUR', GR: 'EUR', IE: 'EUR',
    IT: 'EUR', JM: 'JMD', LU: 'EUR', MC: 'EUR', MA: 'MAD', NL: 'EUR',
    PA: 'USD', PT: 'EUR', PR: 'USD', SK: 'EUR', ES: 'EUR', TT: 'TTD',
    BS: 'BSD'
  });

  Object.assign(countryNames, {
    AD: 'Andorra', AW: 'Aruba', AT: 'Austria', BE: 'Belgium', BO: 'Bolivia',
    BG: 'Bulgaria', KH: 'Cambodia', CY: 'Cyprus', SV: 'El Salvador',
    FI: 'Finland', GR: 'Greece', IE: 'Ireland', IT: 'Italy', JM: 'Jamaica',
    LU: 'Luxembourg', MC: 'Monaco', MA: 'Morocco', NL: 'Netherlands',
    PA: 'Panama', PT: 'Portugal', PR: 'Puerto Rico', SK: 'Slovakia',
    ES: 'Spain', TT: 'Trinidad and Tobago', BS: 'Bahamas'
  });
  
  export const productNames = {
    bigmac: 'Big Mac',
    latte: 'Starbucks Latte'
  };
  
  // 這裡保留你原本的假資料（之後可換 API）
  export const localPrices = {
    bigmac: {
      US: { amount: 5.50, currency: 'USD' },
      UK: { amount: 4.30, currency: 'GBP' },
      CA: { amount: 7.20, currency: 'CAD' },
      AU: { amount: 7.80, currency: 'AUD' },
      DE: { amount: 4.90, currency: 'EUR' },
      FR: { amount: 5.20, currency: 'EUR' },
      JP: { amount: 420, currency: 'JPY' },
      CN: { amount: 24.00, currency: 'CNY' },
      IN: { amount: 190, currency: 'INR' },
      BR: { amount: 18.50, currency: 'BRL' },
      MX: { amount: 67.00, currency: 'MXN' },
      RU: { amount: 149, currency: 'RUB' },
      TW: { amount: 120, currency: 'TWD' },
      KR: { amount: 5900, currency: 'KRW' },
      SG: { amount: 6.20, currency: 'SGD' }
    },
    latte: {
      US: { amount: 4.75, currency: 'USD' },
      UK: { amount: 3.65, currency: 'GBP' },
      CA: { amount: 5.95, currency: 'CAD' },
      AU: { amount: 5.80, currency: 'AUD' },
      DE: { amount: 3.90, currency: 'EUR' },
      FR: { amount: 4.10, currency: 'EUR' },
      JP: { amount: 480, currency: 'JPY' },
      CN: { amount: 32.00, currency: 'CNY' },
      IN: { amount: 320, currency: 'INR' },
      BR: { amount: 15.50, currency: 'BRL' },
      MX: { amount: 78.00, currency: 'MXN' },
      RU: { amount: 280, currency: 'RUB' },
      TW: { amount: 140, currency: 'TWD' },
      KR: { amount: 5500, currency: 'KRW' },
      SG: { amount: 5.40, currency: 'SGD' }
    }
  };
  