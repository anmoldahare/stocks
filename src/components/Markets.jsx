import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Globe, DollarSign, Star, ChevronDown, Search } from 'lucide-react';
import { API_BASE } from '../config';

const marketData = {
  Crypto: [
    { symbol: 'BTC/USD', name: 'Bitcoin', price: '$64,230.50', change: '+2.4%', isPositive: true, volume: '24.5B', sparkline: [40, 45, 42, 50, 48, 55, 60] },
    { symbol: 'ETH/USD', name: 'Ethereum', price: '$3,450.20', change: '+1.8%', isPositive: true, volume: '12.1B', sparkline: [30, 32, 35, 34, 40, 42, 45] },
    { symbol: 'SOL/USD', name: 'Solana', price: '$145.60', change: '+5.2%', isPositive: true, volume: '4.2B', sparkline: [20, 25, 22, 30, 35, 38, 45] },
    { symbol: 'ADA/USD', name: 'Cardano', price: '$0.45', change: '-1.1%', isPositive: false, volume: '1.1B', sparkline: [50, 48, 45, 42, 40, 38, 35] },
    { symbol: 'DOT/USD', name: 'Polkadot', price: '$6.80', change: '+0.5%', isPositive: true, volume: '800M', sparkline: [40, 42, 40, 45, 48, 45, 50] },
  ],
  Stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$185.92', change: '-0.5%', isPositive: false, volume: '58.2M', sparkline: [80, 75, 78, 72, 70, 68, 65] },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$942.10', change: '+5.2%', isPositive: true, volume: '34.8M', sparkline: [50, 55, 60, 65, 70, 85, 95] },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$178.40', change: '-1.2%', isPositive: false, volume: '42.1M', sparkline: [60, 58, 55, 50, 48, 45, 42] },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$420.55', change: '+1.4%', isPositive: true, volume: '22.5M', sparkline: [70, 72, 75, 74, 78, 80, 85] },
    { symbol: 'AMZN', name: 'Amazon.com', price: '$189.05', change: '+0.8%', isPositive: true, volume: '31.2M', sparkline: [65, 68, 70, 68, 72, 75, 78] },
  ],
  Forex: [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: '1.0845', change: '+0.2%', isPositive: true, volume: 'N/A', sparkline: [50, 52, 51, 53, 55, 54, 56] },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: '1.2650', change: '-0.1%', isPositive: false, volume: 'N/A', sparkline: [60, 58, 59, 57, 56, 55, 54] },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: '155.20', change: '+0.4%', isPositive: true, volume: 'N/A', sparkline: [70, 72, 75, 78, 80, 82, 85] },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: '0.6620', change: '+0.3%', isPositive: true, volume: 'N/A', sparkline: [40, 42, 45, 44, 46, 48, 50] },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', price: '1.3680', change: '-0.2%', isPositive: false, volume: 'N/A', sparkline: [55, 53, 50, 48, 45, 46, 44] },
  ],
  Commodities: [
    { symbol: 'XAU/USD', name: 'Gold', price: '$2,345.10', change: '+1.5%', isPositive: true, volume: 'N/A', sparkline: [80, 82, 85, 84, 88, 90, 95] },
    { symbol: 'XAG/USD', name: 'Silver', price: '$28.50', change: '+2.1%', isPositive: true, volume: 'N/A', sparkline: [60, 65, 70, 68, 75, 80, 85] },
    { symbol: 'USOIL', name: 'WTI Crude Oil', price: '$78.40', change: '-1.8%', isPositive: false, volume: 'N/A', sparkline: [70, 68, 65, 60, 58, 55, 50] },
    { symbol: 'NG', name: 'Natural Gas', price: '$2.55', change: '+0.5%', isPositive: true, volume: 'N/A', sparkline: [30, 32, 35, 34, 38, 40, 45] },
    { symbol: 'CU', name: 'Copper', price: '$4.85', change: '+1.2%', isPositive: true, volume: 'N/A', sparkline: [50, 55, 58, 60, 65, 70, 75] },
  ]
};

const Markets = ({ searchQuery = '' }) => {
  const [activeCategory, setActiveCategory] = useState('Crypto');
  const [liveData, setLiveData] = useState({});
  const [sentiment, setSentiment] = useState({
    fearGreed: 72,
    label: 'Bullish',
    confidence: 89,
    volatility: 'Moderate'
  });
  const allAssets = marketData[activeCategory].map(a => ({ ...a }));
  const query = searchQuery.trim().toLowerCase();
  const currentAssets = query
    ? allAssets.filter(a =>
        a.symbol.toLowerCase().includes(query) ||
        a.name.toLowerCase().includes(query)
      )
    : allAssets;

  // Fetch live sentiment on mount and poll every 5s
  useEffect(() => {
    let mounted = true;
    let timer;

    const fetchSentiment = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/markets/sentiment`);
        if (!res.ok) throw new Error('Sentiment response was not ok');
        const data = await res.json();
        if (!mounted) return;
        setSentiment(data.sentiment || data);
      } catch (err) {
        console.warn('Failed to fetch live sentiment', err.message);
      }
      timer = setTimeout(fetchSentiment, 5000);
    };

    fetchSentiment();

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);
  const [currency, setCurrency] = useState('USD');

  // Fetch live prices for all assets on mount and poll every 5s
  useEffect(() => {
    let mounted = true;
    let timer;

    const fetchPrices = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/markets/prices`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (!mounted) return;
        setLiveData(data.prices || {});
      } catch (err) {
        console.warn('Failed to fetch live prices', err.message);
      }
      timer = setTimeout(fetchPrices, 5000);
    };

    fetchPrices();

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
  };

  const convertPrice = (usdPrice, targetCurrency) => {
    if (usdPrice === null || usdPrice === undefined) return null;
    const usd = typeof usdPrice === 'string' ? parseFloat(usdPrice.replace(/[^0-9.-]/g, '')) : usdPrice;
    if (isNaN(usd)) return usdPrice;

    const eurUsd = liveData['EUR/USD']?.price || 1.08;
    const gbpUsd = liveData['GBP/USD']?.price || 1.26;
    const usdJpy = liveData['USD/JPY']?.price || 155.0;
    const usdInr = liveData['USD/INR']?.price || 83.5;

    let convertedVal = usd;
    switch (targetCurrency) {
      case 'EUR':
        convertedVal = usd * (1 / eurUsd);
        break;
      case 'GBP':
        convertedVal = usd * (1 / gbpUsd);
        break;
      case 'JPY':
        convertedVal = usd * usdJpy;
        break;
      case 'INR':
        convertedVal = usd * usdInr;
        break;
      case 'USD':
      default:
        convertedVal = usd;
        break;
    }

    const symbol = currencySymbols[targetCurrency];
    const fractionDigits = targetCurrency === 'JPY' ? 0 : 2;
    return `${symbol}${convertedVal.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`;
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Live Markets</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time data and AI-driven predictions across global assets.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-white dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-white/5 backdrop-blur-xl">
            {['Crypto', 'Stocks', 'Forex', 'Commodities'].map(t => (
              <button 
                key={t} 
                onClick={() => setActiveCategory(t)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${t === activeCategory ? 'bg-slate-200/60 dark:bg-white/10 text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer backdrop-blur-xl appearance-none pr-8 select-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Market Overview Cards */}
        <div className="lg:col-span-2 space-y-6">
          {currentAssets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
                <Search className="text-slate-400 dark:text-slate-500" size={28} />
              </div>
              <p className="text-lg font-bold text-slate-500 dark:text-slate-400">No results for "{searchQuery}"</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try searching for a different asset name or symbol.</p>
            </motion.div>
          )}
          {currentAssets.map((asset, index) => {
            // merge live data if available
            const live = liveData[asset.symbol];
            const rawUsdPrice = live && live.price !== null ? live.price : asset.price;
            const displayPrice = convertPrice(rawUsdPrice, currency);
            const changePct = live && live.changePct !== undefined ? (typeof live.changePct === 'number' ? (live.changePct + '%') : `${live.changePct}%`) : asset.change;
            const isPositive = live && live.changePct !== undefined ? (Number(live.changePct) >= 0) : asset.isPositive;

            return (
            <motion.div 
              key={asset.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex items-center justify-between hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center space-x-4 w-1/4">
                <button className="text-slate-400 dark:text-slate-600 hover:text-yellow-500 transition-colors">
                  <Star size={18} />
                </button>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">{asset.symbol}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{asset.name}</p>
                </div>
              </div>

              <div className="w-1/4 text-right">
                <p className="font-bold text-slate-800 dark:text-white text-lg">{displayPrice}</p>
                <p className={`text-xs font-medium flex items-center justify-end space-x-1 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{changePct}</span>
                </p>
              </div>

              <div className="hidden md:block w-1/4 px-4">
                {/* Mini Sparkline */}
                <div className="flex items-end justify-between h-8 space-x-1">
                  {asset.sparkline.map((val, i) => (
                    <div 
                      key={i} 
                      className={`w-full rounded-t-sm opacity-50 ${asset.isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden sm:block w-1/4 text-right pr-4">
                <p className="text-sm font-bold text-slate-300">{asset.volume}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Vol 24h</p>
              </div>

            </motion.div>
          )})}
        </div>

        {/* AI Market Sentiment */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 dark:bg-gradient-to-b dark:from-slate-900/60 dark:to-slate-900/20 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="text-emerald-600 dark:text-emerald-400" size={24} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Global Sentiment</h3>
            </div>

            {/* Dynamic gauge colors and rotation */}
            {(() => {
              const score = sentiment.fearGreed;
              let gaugeColorClass = "border-t-emerald-500 border-r-emerald-500";
              let textGradientClass = "from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-200";
              let labelColorClass = "text-emerald-600 dark:text-emerald-500";
              
              if (score < 40) {
                gaugeColorClass = "border-t-red-500 border-r-red-500";
                textGradientClass = "from-red-600 to-orange-400 dark:from-red-400 dark:to-orange-300";
                labelColorClass = "text-red-600 dark:text-red-500";
              } else if (score < 60) {
                gaugeColorClass = "border-t-yellow-500 border-r-yellow-500";
                textGradientClass = "from-yellow-600 to-amber-400 dark:from-yellow-400 dark:to-amber-200";
                labelColorClass = "text-yellow-600 dark:text-yellow-500";
              }
              
              const rotationAngle = -45 + (score / 100) * 180;

              return (
                <div className="flex items-center justify-center py-6">
                  <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
                    {/* Semi-circle Gauge */}
                    <div 
                      className={`absolute top-0 w-48 h-48 rounded-full border-[16px] border-b-slate-200 border-l-slate-200 dark:border-b-slate-800 dark:border-l-slate-800 ${gaugeColorClass} transition-transform duration-1000`}
                      style={{ transform: `rotate(${rotationAngle}deg)` }}
                    />
                    <div className="text-center pb-2 z-10">
                      <p className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass}`}>{score}</p>
                      <p className={`text-xs font-bold uppercase tracking-wider ${labelColorClass}`}>{sentiment.label}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Fear & Greed Index</span>
                <span className="font-bold text-slate-800 dark:text-white">{sentiment.label} ({sentiment.fearGreed})</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${sentiment.fearGreed < 40 ? 'bg-red-500' : sentiment.fearGreed < 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  style={{ width: `${sentiment.fearGreed}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">AI Confidence Score</span>
                <span className={`font-bold ${sentiment.fearGreed < 40 ? 'text-red-500 dark:text-red-400' : sentiment.fearGreed < 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{sentiment.confidence}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Market Volatility</span>
                <span className={`font-bold ${sentiment.volatility === 'High' ? 'text-red-500 dark:text-red-400' : sentiment.volatility === 'Low' ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{sentiment.volatility}</span>
              </div>
            </div>
          </motion.div>
          
          <button className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2">
            <Activity size={18} />
            <span>View Full Analysis Report</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Markets;
