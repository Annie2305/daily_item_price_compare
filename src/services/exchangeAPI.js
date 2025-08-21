// src/services/exchangeApi.js
export class ExchangeRateAPI {
    constructor() {
      // 首選：載入每日由後端/CI 產生的靜態檔案，避免每位使用者都打外部 API
      this.dailyStaticUrl = './data/rates-usd.json';

      // 後備：免費公共 API（不需要金鑰）
      this.fallbackPrimary = 'https://api.frankfurter.app/latest?from=USD';
      this.fallbackSecondary = 'https://api.exchangerate.host/latest?base=USD';

      // 舊的付費 API（避免在前端暴露金鑰，不再作為主要來源）
      // 保留為第三層後備，僅當其他來源都失敗時再嘗試，且只有在你確定允許暴露金鑰時才啟用
      this.apiKey = undefined; // 放棄前端金鑰，改由 CI 取得
      this.cacheKey = 'exchange_rates_cache';
      this.cacheDuration = 24 * 60 * 60 * 1000; // 24 小時
    }

    async fetchDailyFromStatic() {
      const res = await fetch(this.dailyStaticUrl, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Static rates load failed: ${res.status}`);
      const data = await res.json();
      if (!data || !data.rates) throw new Error('Static rates missing content');
      return { rates: data.rates, base: data.base || 'USD', date: data.date };
    }

    async fetchFromPublicApi(url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Public API error: ${res.status}`);
      const data = await res.json();
      // frankfurter returns { base, date, rates }
      // exchangerate.host returns { base, date, rates, success }
      if (!data || !data.rates) throw new Error('Public API invalid payload');
      return { rates: data.rates, base: data.base || 'USD', date: data.date };
    }

    getCached() {
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

    cache(rates) {
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

      const cached = this.getCached();
      if (cached) return cached.rates;

      // 1) 嘗試讀取每日靜態檔案（由 CI 每日更新）
      try {
        const staticRates = await this.fetchDailyFromStatic();
        this.cache(staticRates);
        return staticRates.rates;
      } catch {}

      // 2) 後備：公共 API（無需金鑰）
      try {
        const primary = await this.fetchFromPublicApi(this.fallbackPrimary);
        this.cache(primary);
        return primary.rates;
      } catch {}
      try {
        const secondary = await this.fetchFromPublicApi(this.fallbackSecondary);
        this.cache(secondary);
        return secondary.rates;
      } catch {}

      // 3) 最後手段：報錯
      throw new Error('Unable to load exchange rates from any source');
    }
}
