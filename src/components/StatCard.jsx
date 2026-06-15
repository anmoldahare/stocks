import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon, trend }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
      
      <div className="flex items-start justify-between">
        <div className="p-2.5 bg-slate-800/50 rounded-xl text-emerald-500 border border-white/5 group-hover:border-emerald-500/50 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
          trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{change}%</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
