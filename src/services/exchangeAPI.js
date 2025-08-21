// src/services/exchangeApi.js
export class ExchangeRateAPI {
    constructor() {
      this.apiKey = "433f21b0a4eda549e5657cbd3eb58fc6";
      // 官方建議的 endpoint 格式：
      // https://api.exchangeratesapi.io/v1/latest?access_key=API_KEY&base=USD
      this.apiUrl = `https://api.exchangeratesapi.io/v1/latest?access_key=${this.apiKey}&base=USD`;
      this.cacheKey = "exchange_rates_cache";
      this.cacheDuration = 24 * 60 * 60 * 1000; // 24 小時
    }
  
    async fetchRates() {
      const res = await fetch(this.apiUrl);
      if (!res.ok) throw new Error(`ExchangeRate API 錯誤: ${res.status}`);
      const data = await res.json();
  
      if (data.error) {
        throw new Error(`ExchangeRate API 錯誤: ${data.error.type}`);
      }
  
      return { rates: data.rates, base: data.base, date: data.date };
    }
  
    getCachedRates() {
      try {
        const cached = localStorage.getItem(this.cacheKey);
        if (!cached) return null;
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp > this.cacheDuration) {
          localStorage.removeItem(this.cacheKey);
          return null;
        }
        return data;
      } catch {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
    }
  
    cacheRates(rates) {
      const cacheData = {
        rates: rates.rates,
        timestamp: Date.now(),
        date: rates.date,
      };
      try {
        localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      } catch {}
    }
  
    async getRates(force = false) {
      if (force) localStorage.removeItem(this.cacheKey);
  
      const cached = this.getCachedRates();
      if (cached) return cached.rates;
  
      const fresh = await this.fetchRates();
      this.cacheRates(fresh);
      return fresh.rates;
    }
  }
  