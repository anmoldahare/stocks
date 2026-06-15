import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Zap, Shield } from 'lucide-react';

const activities = [
  {
    id: 1,
    agent: 'Alpha Scout',
    action: 'Detected Bullish Divergence on BTC/USD',
    time: '2 mins ago',
    icon: <Zap size={14} />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  },
  {
    id: 2,
    agent: 'Risk Sentinel',
    action: 'Auto-rebalanced TSLA position to 5% allocation',
    time: '14 mins ago',
    icon: <Shield size={14} />,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    id: 3,
    agent: 'Sentiment Bot',
    action: 'Social sentiment for NVDA shifted to "High Bullish"',
    time: '28 mins ago',
    icon: <Cpu size={14} />,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  }
];

const ActivityFeed = () => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Terminal size={18} className="text-emerald-500" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm">Agent Activity Log</h3>
        </div>
        <button className="text-xs text-slate-500 hover:text-emerald-500 transition-colors">View All</button>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 relative"
          >
            {index !== activities.length - 1 && (
              <div className="absolute left-4 top-10 bottom-0 w-[1px] bg-slate-800" />
            )}
            
            <div className={`mt-1 p-2 rounded-lg ${activity.bg} ${activity.color} flex-shrink-0`}>
              {activity.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-200">{activity.agent}</p>
                <span className="text-[10px] text-slate-500 font-medium">{activity.time}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{activity.action}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
