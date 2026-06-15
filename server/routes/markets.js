const express = require('express');
const router = express.Router();

// Initial base prices matching Markets.jsx
const basePrices = {
  // Crypto
  'BTC/USD': 64230.50,
  'ETH/USD': 3450.20,
  'SOL/USD': 145.60,
  'ADA/USD': 0.45,
  'DOT/USD': 6.80,
  // Stocks
  'AAPL': 185.92,
  'NVDA': 942.10,
  'TSLA': 178.40,
  'MSFT': 420.55,
  'AMZN': 189.05,
  // Forex
  'EUR/USD': 1.0845,
  'GBP/USD': 1.2650,
  'USD/JPY': 155.20,
  'USD/INR': 83.50,
  'AUD/USD': 0.6620,
  'USD/CAD': 1.3680,
  // Commodities
  'XAU/USD': 2345.10,
  'XAG/USD': 28.50,
  'USOIL': 78.40,
  'NG': 2.55,
  'CU': 4.85
};

// In-memory live prices cache
const livePrices = {};
Object.keys(basePrices).forEach(sym => {
  livePrices[sym] = {
    price: basePrices[sym],
    change: 0,
    changePct: 0
  };
});

// Helper to update a symbol's price with a small random walk
function updatePriceRandomWalk(sym) {
  const current = livePrices[sym];
  const base = basePrices[sym];
  // Apply a tiny change (+/- 0.05%)
  const changePct = (Math.random() * 2 - 1) * 0.0005;
  const newPrice = +(current.price * (1 + changePct)).toFixed(4);
  const change = +(newPrice - base).toFixed(4);
  const changePctDisplay = +((change / base) * 100).toFixed(2);

  livePrices[sym] = {
    price: newPrice,
    change: change,
    changePct: changePctDisplay
  };
}

// Background task: Random walk update for non-stock assets
setInterval(() => {
  Object.keys(livePrices).forEach(sym => {
    const isStock = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN'].includes(sym);
    if (!isStock) {
      updatePriceRandomWalk(sym);
    }
  });
}, 2000);

// Background task: Fetch Finnhub stock quotes round-robin to avoid rate limit
const stocks = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN'];
let stockIndex = 0;

async function updateNextStock() {
  const apiKey = process.env.MARKET_API_KEY || process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    // If no API key, update stocks using random walk
    stocks.forEach(sym => updatePriceRandomWalk(sym));
    return;
  }

  const sym = stocks[stockIndex];
  stockIndex = (stockIndex + 1) % stocks.length;

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${apiKey}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Upstream error');
    const json = await resp.json();
    if (json && typeof json.c === 'number' && json.c > 0) {
      // Add a tiny micro-jitter (+/- 0.02%) to make the price look active/live even when after-hours
      const jitter = (Math.random() * 2 - 1) * 0.0002;
      const displayPrice = +(json.c * (1 + jitter)).toFixed(2);
      const realChange = json.d || 0;
      const realChangePct = json.dp || 0;
      const jitterPriceDiff = displayPrice - json.c;
      livePrices[sym] = {
        price: displayPrice,
        change: +(realChange + jitterPriceDiff).toFixed(2),
        changePct: +(realChangePct + (jitterPriceDiff / json.c) * 100).toFixed(2)
      };
    } else {
      updatePriceRandomWalk(sym);
    }
  } catch (err) {
    updatePriceRandomWalk(sym);
  }
}

// Check every 3 seconds to fetch stock quotes sequentially
setInterval(updateNextStock, 3000);

// GET /api/markets/prices?symbols=AAPL,BTC/USD
router.get('/prices', (req, res) => {
  try {
    const symbolsParam = req.query.symbols || '';
    if (!symbolsParam) {
      const results = {};
      Object.keys(livePrices).forEach(sym => {
        results[sym] = {
          symbol: sym,
          ...livePrices[sym]
        };
      });
      res.json({ prices: results });
      return;
    }
    const symbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean);
    const results = {};

    for (const sym of symbols) {
      if (livePrices[sym]) {
        results[sym] = {
          symbol: sym,
          ...livePrices[sym]
        };
      } else {
        const base = basePrices[sym] || 100;
        results[sym] = {
          symbol: sym,
          price: base,
          change: 0,
          changePct: 0
        };
      }
    }

    res.json({ prices: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/markets/sentiment
router.get('/sentiment', (req, res) => {
  try {
    let sumChangePct = 0;
    let count = 0;
    Object.keys(livePrices).forEach(sym => {
      if (livePrices[sym] && typeof livePrices[sym].changePct === 'number') {
        sumChangePct += livePrices[sym].changePct;
        count++;
      }
    });

    const avgChangePct = count > 0 ? (sumChangePct / count) : 0;
    
    // Fear & Greed index baseline is 50. Positive average change pushes towards Greed (max 95), negative towards Fear (min 10)
    let fearGreed = Math.round(50 + (avgChangePct * 15));
    fearGreed = Math.max(10, Math.min(95, fearGreed));

    // Dynamic Label
    let label = 'Neutral';
    if (fearGreed < 30) label = 'Extreme Fear';
    else if (fearGreed < 45) label = 'Fear';
    else if (fearGreed < 55) label = 'Neutral';
    else if (fearGreed < 75) label = 'Bullish';
    else label = 'Extreme Bullish';

    // AI Confidence Score ticks around 85-93%
    const confidence = Math.round(89 + Math.sin(Date.now() / 120000) * 4);

    // Volatility based on average absolute daily changes
    let absChangeSum = 0;
    Object.keys(livePrices).forEach(sym => {
      if (livePrices[sym] && typeof livePrices[sym].changePct === 'number') {
        absChangeSum += Math.abs(livePrices[sym].changePct);
      }
    });
    const avgAbsChange = count > 0 ? (absChangeSum / count) : 0;
    let volatility = 'Moderate';
    if (avgAbsChange < 0.15) volatility = 'Low';
    else if (avgAbsChange > 0.6) volatility = 'High';

    res.json({
      sentiment: {
        fearGreed,
        label,
        confidence,
        volatility
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
