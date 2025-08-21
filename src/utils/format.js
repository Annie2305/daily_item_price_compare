// src/utils/format.js
import { CURRENCY_SYMBOLS } from '../constants.js';

export function formatCurrency(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  let decimals = ['JPY', 'KRW'].includes(currency) ? 0 : 2;

  const formattedAmount = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return `${symbol}${formattedAmount}`;
}

export function convertToUSD(localAmount, fromCurrency, exchangeRates) {
  if (fromCurrency === 'USD') return localAmount;
  const rate = exchangeRates[fromCurrency];
  if (!rate) throw new Error(`找不到 ${fromCurrency} 的匯率`);
  return localAmount / rate;
}

export function convertUSDToLocal(usdAmount, toCurrency, exchangeRates) {
  if (toCurrency === 'USD') return usdAmount;
  const rate = exchangeRates[toCurrency];
  if (!rate) throw new Error(`找不到 ${toCurrency} 的匯率`);
  return usdAmount * rate;
}
