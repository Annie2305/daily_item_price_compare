// src/main.js
import { ExchangeRateAPI } from './services/exchangeAPI.js';
import { state, setRates, setRatesError } from './state.js';
import { populateCountrySelects, bindProductCards, bindNavigation, updateExchangeRateStatus } from './ui/dom.js';

const exchangeAPI = new ExchangeRateAPI();

async function loadExchangeRates(force = false) {
  try {
    updateExchangeRateStatus('loading', '🔄 Loading exchange rates...');
    const rates = await exchangeAPI.getRates(force);
    setRates(rates);

    const rateCount = Object.keys(rates).length;
    const lastUpdated = new Date().toLocaleString();
    updateExchangeRateStatus(
      'success',
      `✅ Exchange rates loaded (${rateCount} currencies) | Updated: ${lastUpdated}`,
      true,
      () => loadExchangeRates(true)
    );
  } catch (err) {
    console.error(err);
    setRatesError(err.message);
    updateExchangeRateStatus(
      'error',
      `❌ Failed to load exchange rates: ${err.message}`,
      true,
      () => loadExchangeRates(true)
    );
  }
}


function scheduleDailyUpdate() {
  const now = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 1, 0, 0); // 00:01
  const ms = next.getTime() - Date.now();

  setTimeout(() => {
    loadExchangeRates(true);
    setInterval(() => loadExchangeRates(true), 24 * 60 * 60 * 1000);
  }, ms);
}

async function init() {
  console.log('🚀 初始化 PriceCompare 應用程式...');
  populateCountrySelects();
  bindProductCards();
  bindNavigation();
  await loadExchangeRates();
  scheduleDailyUpdate();
  console.log('✅ 應用程式初始化完成');
}

init();
