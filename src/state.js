// src/state.js
export const state = {
    fromCountry: '',
    toCountry: '',
    selectedProduct: '',
    currentStep: 1,
    exchangeRates: {},
    ratesLoaded: false,
    ratesError: null
  };
  
  export function resetState() {
    state.fromCountry = '';
    state.toCountry = '';
    state.selectedProduct = '';
    state.currentStep = 1;
  }
  
  export function setRates(rates) {
    state.exchangeRates = rates;
    state.ratesLoaded = true;
    state.ratesError = null;
  }
  
  export function setRatesError(message) {
    state.ratesLoaded = false;
    state.ratesError = message;
  }
  