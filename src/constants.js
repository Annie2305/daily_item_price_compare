// src/constants.js
export const CURRENCY_SYMBOLS = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', KRW: '₩',
    INR: '₹', BRL: 'R$', CAD: 'C$', AUD: 'A$', SGD: 'S$',
    TWD: 'NT$', RUB: '₽', MXN: '$'
  };
  
  export const CURRENCY_CODES = {
    US: 'USD', UK: 'GBP', CA: 'CAD', AU: 'AUD', DE: 'EUR',
    FR: 'EUR', JP: 'JPY', CN: 'CNY', IN: 'INR', BR: 'BRL',
    MX: 'MXN', RU: 'RUB', TW: 'TWD', KR: 'KRW', SG: 'SGD'
  };
  
  export const countryNames = {
    US: 'United States', UK: 'United Kingdom', CA: 'Canada',
    AU: 'Australia', DE: 'Germany', FR: 'France', JP: 'Japan',
    CN: 'China', IN: 'India', BR: 'Brazil', MX: 'Mexico',
    RU: 'Russia', TW: 'Taiwan', KR: 'South Korea', SG: 'Singapore'
  };
  
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
  