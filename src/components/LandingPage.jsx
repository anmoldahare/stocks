import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, BrainCircuit, LineChart, Briefcase, Users } from 'lucide-react';
import Marquee from './Marquee';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-800 dark:text-white overflow-hidden font-sans transition-colors duration-200">
      <Marquee />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 px-6 max-w-7xl mx-auto text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 dark:bg-secondary/20 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
            Master the Market with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-secondary">
              Agentic Intelligence
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            Harness the power of autonomous AI agents to analyze sentiment, detect complex chart patterns, and autonomously rebalance your portfolio in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-primary hover:bg-emerald-500 text-slate-900 dark:text-white font-semibold py-3 px-8 rounded-full transition-all flex items-center justify-center group shadow-lg shadow-emerald-500/20"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="py-12 mt-24 pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col items-center">
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-10">
              Trusted by 10k+ Traders & Institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center space-x-2 font-bold text-lg"><BrainCircuit className="w-5 h-5 text-primary"/><span>QuantEdge</span></div>
            <div className="flex items-center space-x-2 font-bold text-lg"><LineChart className="w-5 h-5 text-primary"/><span>TradeFlow</span></div>
            <div className="flex items-center space-x-2 font-bold text-lg"><Briefcase className="w-5 h-5 text-primary"/><span>ApexCapital</span></div>
            <div className="flex items-center space-x-2 font-bold text-lg"><Users className="w-5 h-5 text-primary"/><span>AlphaRetail</span></div>
          </div>
        </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className=" py-10 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Unfair Advantage, Built-in.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Our AI agents work 24/7 scanning thousands of data points to give you the most precise market insights.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sentiment Analysis</h3>
            <p className="text-slate-400">
              Real-time news scanning across thousands of financial sources. Gauge market mood before it hits the charts.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-secondary/50 transition-colors group">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LineChart className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Technical Intelligence</h3>
            <p className="text-slate-400">
              AI-detected chart patterns and breakout predictions. Never miss a bullish flag or head-and-shoulders again.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Portfolio Co-pilot</h3>
            <p className="text-slate-400">
              Personalized rebalancing suggestions based on your risk tolerance and current market volatility.
            </p>
          </div>
        </div>
      </section>
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-20" />
    </div>
  );
};

export default LandingPage;
