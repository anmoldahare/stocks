import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Play, Pause, Settings2, Zap, Search, TrendingUp, TrendingDown, Clock, X, ChevronDown, ChevronUp, Activity } from 'lucide-react';

const ASSETS = {
  'Sentiment Analysis': ['BTC/USD', 'ETH/USD', 'SOL/USD', 'AAPL', 'TSLA'],
  'High Frequency': ['BTC/USD', 'ETH/USD', 'EUR/USD', 'GBP/USD', 'XAU/USD'],
  'Swing Trading': ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN'],
  'Options Hedging': ['SPY', 'QQQ', 'IWM', 'AAPL', 'NVDA'],
};

const TRADE_ACTIONS = ['BUY', 'SELL'];

const initialAgents = [
  { id: 1, name: 'Alpha Scanner', status: 'Active', type: 'Sentiment Analysis', basePerformance: 12.4, uptime: '99.9%', ping: '12ms', description: 'Scans global news and social media for early momentum signals.', riskLevel: 'Medium', maxTrades: 50 },
  { id: 2, name: 'Theta Scalper', status: 'Active', type: 'High Frequency', basePerformance: 8.2, uptime: '100%', ping: '4ms', description: 'Executes rapid trades based on micro-fluctuations in order books.', riskLevel: 'High', maxTrades: 200 },
  { id: 3, name: 'Omega Swing', status: 'Active', type: 'Swing Trading', basePerformance: -1.5, uptime: '98.2%', ping: '45ms', description: 'Identifies multi-day trends using advanced harmonic patterns.', riskLevel: 'Low', maxTrades: 10 },
  { id: 4, name: 'Delta Neutral', status: 'Active', type: 'Options Hedging', basePerformance: 4.1, uptime: '99.5%', ping: '18ms', description: 'Maintains portfolio neutrality across volatile earnings seasons.', riskLevel: 'Low', maxTrades: 30 },
];

const generateTrade = (agentType) => {
  const assets = ASSETS[agentType] || ASSETS['Sentiment Analysis'];
  const asset = assets[Math.floor(Math.random() * assets.length)];
  const action = TRADE_ACTIONS[Math.floor(Math.random() * TRADE_ACTIONS.length)];
  const amount = (Math.random() * 5000 + 100).toFixed(2);
  const pnl = (Math.random() * 200 - 80).toFixed(2); // slight positive bias
  const confidence = (Math.random() * 30 + 70).toFixed(0);

  return {
    id: Date.now() + Math.random(),
    asset,
    action,
    amount: `$${parseFloat(amount).toLocaleString()}`,
    pnl: parseFloat(pnl),
    confidence: parseInt(confidence),
    timestamp: new Date(),
  };
};

const AIAgents = ({ searchQuery = '' }) => {
  const [agents, setAgents] = useState(initialAgents);
  const [trades, setTrades] = useState({}); // { agentId: [trade, ...] }
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [configAgent, setConfigAgent] = useState(null);
  const intervalsRef = useRef({});

  const toggleAgentStatus = useCallback((id) => {
    setAgents(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' }
        : a
    ));
  }, []);

  // Simulate trades for active agents
  useEffect(() => {
    // Clear old intervals
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};

    agents.forEach(agent => {
      if (agent.status === 'Active') {
        // Different speeds per agent type
        const speeds = {
          'High Frequency': 1500,
          'Sentiment Analysis': 4000,
          'Options Hedging': 5000,
          'Swing Trading': 7000,
        };
        const interval = speeds[agent.type] || 4000;

        intervalsRef.current[agent.id] = setInterval(() => {
          const trade = generateTrade(agent.type);
          setTrades(prev => {
            const agentTrades = prev[agent.id] || [];
            return {
              ...prev,
              [agent.id]: [trade, ...agentTrades].slice(0, 20), // keep last 20
            };
          });
          // Update agent performance based on trade P&L
          setAgents(prev => prev.map(a => {
            if (a.id === agent.id) {
              const shift = trade.pnl * 0.01; // small impact per trade
              return { ...a, basePerformance: parseFloat((a.basePerformance + shift).toFixed(2)) };
            }
            return a;
          }));
        }, interval);
      }
    });

    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, [agents.map(a => `${a.id}-${a.status}`).join(',')]);

  const query = searchQuery.trim().toLowerCase();
  const filteredAgents = query
    ? agents.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.type.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      )
    : agents;

  const getTradeCount = (agentId) => (trades[agentId] || []).length;
  const getRecentTrades = (agentId) => (trades[agentId] || []).slice(0, 8);
  const getTotalPnl = (agentId) => {
    const agentTrades = trades[agentId] || [];
    return agentTrades.reduce((sum, t) => sum + t.pnl, 0);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">AI Agents</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and monitor your autonomous trading agents.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {agents.filter(a => a.status === 'Active').length}/{agents.length} Running
            </span>
          </div>
          
        </div>
      </motion.div>

      {filteredAgents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
            <Search className="text-slate-400 dark:text-slate-500" size={28} />
          </div>
          <p className="text-lg font-bold text-slate-500 dark:text-slate-400">No agents match "{searchQuery}"</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try searching by agent name, type, or description.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredAgents.map((agent, index) => {
          const isExpanded = expandedAgent === agent.id;
          const recentTrades = getRecentTrades(agent.id);
          const totalPnl = getTotalPnl(agent.id);
          const tradeCount = getTradeCount(agent.id);
          const perfStr = agent.basePerformance >= 0 ? `+${agent.basePerformance.toFixed(1)}%` : `${agent.basePerformance.toFixed(1)}%`;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
              className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-6 rounded-3xl hover:border-slate-300 dark:hover:border-white/10 transition-all group relative overflow-hidden"
            >
              {/* Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 rounded-full mix-blend-screen transition-opacity ${agent.status === 'Active' ? 'bg-emerald-500/20 opacity-100' : 'bg-slate-500/20 opacity-50'}`} />

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative ${agent.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <Cpu size={24} />
                    {agent.status === 'Active' && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{agent.name}</h3>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">{agent.type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setConfigAgent(configAgent === agent.id ? null : agent.id)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-white/5"
                  >
                    <Settings2 size={16} />
                  </button>
                  <button 
                    onClick={() => toggleAgentStatus(agent.id)}
                    className={`p-2 rounded-lg transition-colors border border-slate-200 dark:border-white/5 flex items-center justify-center ${agent.status === 'Active' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                  >
                    {agent.status === 'Active' ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${agent.status === 'Active' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {agent.status}
                </span>
                {tradeCount > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {tradeCount} trade{tradeCount !== 1 ? 's' : ''} executed
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 min-h-[40px]">{agent.description}</p>

              {/* Config Panel */}
              <AnimatePresence>
                {configAgent === agent.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-5"
                  >
                    <div className="bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-4 space-y-3 border border-slate-200 dark:border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Configuration</span>
                        <button onClick={() => setConfigAgent(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Risk Level</span>
                        <span className={`text-sm font-bold ${agent.riskLevel === 'High' ? 'text-red-500' : agent.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-emerald-500'}`}>
                          {agent.riskLevel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Max Daily Trades</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{agent.maxTrades}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Trading Assets</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{(ASSETS[agent.type] || []).length} pairs</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(ASSETS[agent.type] || []).map(a => (
                          <span key={a} className="text-[10px] px-2 py-0.5 bg-white dark:bg-slate-700 rounded-md font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Performance</p>
                  <motion.p 
                    key={perfStr}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={`font-bold ${agent.basePerformance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {perfStr}
                  </motion.p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Session P&L</p>
                  <p className={`font-bold ${totalPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Latency</p>
                  <div className="flex items-center space-x-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{agent.ping}</p>
                  </div>
                </div>
              </div>

              {/* Expand / Collapse Trade Feed */}
              {tradeCount > 0 && (
                <button
                  onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                  className="w-full flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-xs font-bold text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {isExpanded ? 'Hide' : 'Show'} Live Trades ({tradeCount})
                </button>
              )}

              {/* Live Trade Feed */}
              <AnimatePresence>
                {isExpanded && recentTrades.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {recentTrades.map((trade, i) => (
                        <motion.div
                          key={trade.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center justify-between bg-slate-100/60 dark:bg-slate-800/40 rounded-xl px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`px-1.5 py-0.5 rounded font-extrabold text-[10px] ${trade.action === 'BUY' 
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-red-500/15 text-red-600 dark:text-red-400'}`}
                            >
                              {trade.action}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-white">{trade.asset}</span>
                            <span className="text-slate-400">{trade.amount}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-bold ${trade.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock size={10} />
                              {formatTime(trade.timestamp)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom glow bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500/50 to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIAgents;
