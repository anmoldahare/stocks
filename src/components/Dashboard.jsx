import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  LineChart,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import AIAgents from './AIAgents';
import Markets from './Markets';
import SettingsPage from './SettingsPage';

const Dashboard = ({ user, onLogout, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('markets');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#0D121F]/80 backdrop-blur-xl flex flex-col fixed inset-y-0 z-50 transition-colors duration-200">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-emerald-500/20">
              IA
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">InvestAI</span>
          </div>

          <nav className="space-y-2">
            <NavItem
              icon={<LineChart size={20} />}
              label="Markets"
              active={activeTab === 'markets'}
              onClick={() => setActiveTab('markets')}
            />
            <NavItem
              icon={<Cpu size={20} />}
              label="AI Agents"
              active={activeTab === 'agents'}
              onClick={() => setActiveTab('agents')}
            />
            <NavItem
              icon={<Settings size={20} />}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-2 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 bg-slate-50/50 dark:bg-[#0B0F1A]/50 sticky top-0 backdrop-blur-md z-40 transition-colors duration-200">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search assets, agents, or news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Live Market</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-1"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>

          

            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-white/10 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.email ? user.email.split('@')[0] : 'Pro Trader'}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-widest">{user?.email || 'Guest'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 border-2 border-slate-200 dark:border-white/10 shadow-lg shadow-emerald-500/20" />
            </div>
          </div>
        </header>

        {/* View Grid */}
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === 'agents' && <AIAgents searchQuery={searchQuery} />}
          {activeTab === 'markets' && <Markets searchQuery={searchQuery} />}
          {activeTab === 'settings' && <SettingsPage user={user} />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${active
        ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20 font-bold'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'
      }`}
  >
    <div className="flex items-center space-x-3">
      <span className={`${active ? 'text-slate-900' : 'text-slate-500 dark:text-slate-400 group-hover:text-emerald-500'} transition-colors`}>
        {icon}
      </span>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </div>
    {active && <ChevronRight size={14} />}
  </button>
);

export default Dashboard;
