// src/ui/dom.js
import { state, resetState } from '../state.js';
import { countryNames, localPrices, productNames, CURRENCY_CODES } from '../constants.js';
import { formatCurrency, convertToUSD, convertUSDToLocal } from '../utils/format.js';

const el = {
  fromSelect: document.getElementById('fromCountry'),
  toSelect: document.getElementById('toCountry'),
  nextBtn: document.getElementById('nextToProducts'),
  backToCountriesBtn: document.getElementById('backToCountries'),
  backToProductsBtn: document.getElementById('backToProducts'),
  showBtn: document.getElementById('showComparison'),
  startOverBtn: document.getElementById('startOver'),
  progressFill: document.getElementById('progressFill'),
  statusBar: document.getElementById('exchangeRateStatus'),
  comparisonError: document.getElementById('comparisonError'),
  comparisonResult: document.getElementById('comparisonResult'),

  // result fields
  comparisonTitle: document.getElementById('comparisonTitle'),
  fromCountryName: document.getElementById('fromCountryName'),
  fromLocalPrice: document.getElementById('fromLocalPrice'),
  fromUsdPrice: document.getElementById('fromUsdPrice'),
  toCountryName: document.getElementById('toCountryName'),
  toLocalPrice: document.getElementById('toLocalPrice'),
  toUsdPrice: document.getElementById('toUsdPrice'),
  differenceIcon: document.getElementById('differenceIcon'),
  differenceText: document.getElementById('differenceText'),
  differenceAmount: document.getElementById('differenceAmount')
};

export function populateCountrySelects() {
  const opts = ['<option value="">Select origin country</option>'];
  const opts2 = ['<option value="">Select destination country</option>'];
  Object.entries(countryNames).forEach(([code, name]) => {
    opts.push(`<option value="${code}">${name}</option>`);
    opts2.push(`<option value="${code}">${name}</option>`);
  });
  el.fromSelect.innerHTML = opts.join('');
  el.toSelect.innerHTML = opts2.join('');
}

export function bindProductCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      state.selectedProduct = e.currentTarget.dataset.product;
      el.showBtn.disabled = false;
    });
  });
}

export function bindNavigation() {
  el.fromSelect.addEventListener('change', onCountryChange);
  el.toSelect.addEventListener('change', onCountryChange);
  el.nextBtn.addEventListener('click', () => goToStep(2));
  el.backToCountriesBtn.addEventListener('click', () => goToStep(1));
  el.backToProductsBtn.addEventListener('click', () => goToStep(2));
  el.startOverBtn.addEventListener('click', startOver);
  el.showBtn.addEventListener('click', () => {
    if (!state.ratesLoaded) {
      el.comparisonError.style.display = 'block';
      el.comparisonResult.style.display = 'none';
    } else {
      try {
        renderComparison();
        el.comparisonError.style.display = 'none';
        el.comparisonResult.style.display = 'block';
      } catch (err) {
        console.error('Comparison calculation failed:', err);
        el.comparisonError.style.display = 'block';
        el.comparisonResult.style.display = 'none';
      }
    }
    goToStep(3);
  });
}

function onCountryChange() {
  state.fromCountry = el.fromSelect.value;
  state.toCountry = el.toSelect.value;
  el.nextBtn.disabled = !(state.fromCountry && state.toCountry);
}

export function goToStep(step) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');
  state.currentStep = step;
  updateProgress(step === 1 ? 33 : step === 2 ? 66 : 100);
}

function updateProgress(pct) {
  el.progressFill.style.width = `${pct}%`;
}

export function updateExchangeRateStatus(type, message, showRefresh = false, onRefresh) {
  el.statusBar.className = `exchange-rate-status ${type}`;
  el.statusBar.innerHTML = `<span>${message}</span>` +
    (showRefresh ? `<button id="refreshRatesBtn">Refresh</button>` : '');
  if (showRefresh && onRefresh) {
    document.getElementById('refreshRatesBtn').addEventListener('click', onRefresh);
  }
}

export function renderComparison() {
  const product = state.selectedProduct;
  const from = state.fromCountry;
  const to = state.toCountry;

  // Prefer dynamic prices if present, otherwise fall back to static demo prices
  const dynamic = state.dynamicLocalPrices || {};
  let fromPrice;
  let toPrice;
  if (product === 'latte' && dynamic.latteUSD) {
    const usdFrom = dynamic.latteUSD[from];
    const usdTo = dynamic.latteUSD[to];
    if (usdFrom != null && usdTo != null) {
      const fromCur = CURRENCY_CODES[from] || 'USD';
      const toCur = CURRENCY_CODES[to] || 'USD';
      fromPrice = { amount: convertUSDToLocal(usdFrom, fromCur, state.exchangeRates), currency: fromCur };
      toPrice = { amount: convertUSDToLocal(usdTo, toCur, state.exchangeRates), currency: toCur };
    }
  }
  if (!fromPrice || !toPrice) {
    const dynLocal = dynamic[product];
    fromPrice = fromPrice || (dynLocal?.[from] ? { amount: dynLocal[from], currency: CURRENCY_CODES[from] } : localPrices[product][from]);
    toPrice = toPrice || (dynLocal?.[to] ? { amount: dynLocal[to], currency: CURRENCY_CODES[to] } : localPrices[product][to]);
  }
  if (!fromPrice || !toPrice) throw new Error('Price data not found for selected countries');

  const fromUSD = convertToUSD(fromPrice.amount, fromPrice.currency, state.exchangeRates);
  const toUSD = convertToUSD(toPrice.amount, toPrice.currency, state.exchangeRates);

  // 標題
  el.comparisonTitle.textContent = `${productNames[product]} Price Comparison`;

  // 來源國
  el.fromCountryName.textContent = countryNames[from];
  el.fromLocalPrice.textContent = formatCurrency(fromPrice.amount, fromPrice.currency);
  el.fromUsdPrice.textContent = `$${fromUSD.toFixed(2)}`;

  // 目的國
  el.toCountryName.textContent = countryNames[to];
  el.toLocalPrice.textContent = formatCurrency(toPrice.amount, toPrice.currency);
  el.toUsdPrice.textContent = `$${toUSD.toFixed(2)}`;

  // 差異
  const diff = toUSD - fromUSD;
  const pct = Math.abs((diff / fromUSD) * 100);
  if (Math.abs(diff) < 0.1) {
    el.differenceIcon.textContent = '⚖️';
    el.differenceText.textContent = 'Prices are similar';
    el.differenceText.className = 'difference-text same';
    el.differenceAmount.textContent = `Difference: ${Math.abs(diff).toFixed(2)}`;
  } else if (diff > 0) {
    el.differenceIcon.textContent = '📈';
    el.differenceText.textContent = `${pct.toFixed(0)}% more expensive`;
    el.differenceText.className = 'difference-text higher';
    el.differenceAmount.textContent = `Extra cost: ${diff.toFixed(2)}`;
  } else {
    el.differenceIcon.textContent = '📉';
    el.differenceText.textContent = `${pct.toFixed(0)}% cheaper`;
    el.differenceText.className = 'difference-text lower';
    el.differenceAmount.textContent = `You save: ${Math.abs(diff).toFixed(2)}`;
  }
}

export function startOver() {
  resetState();
  el.fromSelect.value = '';
  el.toSelect.value = '';
  el.nextBtn.disabled = true;
  document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
  el.showBtn.disabled = true;
  goToStep(1);
}
