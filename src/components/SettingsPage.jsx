import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, CreditCard, Save, Eye, EyeOff, Check, Lock, Smartphone } from 'lucide-react';
import { API_BASE } from '../config';

const SettingsPage = ({ user }) => {

  const [activeTab, setActiveTab] = useState('profile');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailState, setEmailState] = useState('');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessions] = useState([
    { device: 'Chrome on macOS', location: 'Mumbai, India', time: 'Current session', current: true },
    { device: 'Safari on iPhone', location: 'Delhi, India', time: '2 hours ago', current: false },
  ]);



  // Billing state
  const [currentPlan] = useState('pro');
  const plans = [
    { id: 'free', name: 'Free', price: '$0', period: '/mo', features: ['5 Market Assets', '1 AI Agent', 'Daily Summaries', 'Basic Charts'] },
    { id: 'pro', name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited Assets', '4 AI Agents', 'Real-time Alerts', 'Advanced Analytics', 'Priority Support'] },
    { id: 'enterprise', name: 'Enterprise', price: '$99', period: '/mo', features: ['Everything in Pro', 'Unlimited Agents', 'Custom Strategies', 'Dedicated Manager', 'API Access', 'White-label'] },
  ];



  useEffect(() => {
    const full = user?.name || '';
    setFirstName(full.split(' ')[0] || '');
    setLastName(full.split(' ').slice(1).join(' ') || '');
    setEmailState(user?.email || '');
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profile Details', icon: <User size={18} /> },
    { id: 'security', label: 'Security & Auth', icon: <Shield size={18} /> },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} /> },
  ];



  const inputClass = "w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm";
  const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-widest";

  const Toggle = ({ enabled, onToggle }) => (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Settings</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
            className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-8"
          >
            {/* ===== PROFILE ===== */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-4 border-slate-100 dark:border-slate-900 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-3xl font-bold text-slate-900">
                      {((firstName[0]||'') + (lastName[0]||'')).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{`${firstName} ${lastName}`.trim() || 'Your Name'}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{emailState}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClass}>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className={labelClass}>Email Address</label>
                    <input type="email" value={emailState} onChange={(e) => setEmailState(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex justify-end">
                  <button onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch(`${API_BASE}/api/auth/update-profile`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email: emailState })
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Update failed');
                      localStorage.setItem('user', JSON.stringify(data.user));
                      alert('Profile updated');
                    } catch (err) { alert(err.message); }
                  }} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2">
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* ===== SECURITY & AUTH ===== */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Change Password</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Update your password to keep your account secure.</p>
                  <div className="space-y-4 max-w-md">
                    {[
                      { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, key: 'current' },
                      { label: 'New Password', value: newPassword, setter: setNewPassword, key: 'new' },
                      { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, key: 'confirm' },
                    ].map(f => (
                      <div key={f.key} className="space-y-2">
                        <label className={labelClass}>{f.label}</label>
                        <div className="relative">
                          <input type={showPasswords[f.key] ? 'text' : 'password'} value={f.value} onChange={(e) => f.setter(e.target.value)} className={inputClass + ' pr-10'} placeholder="••••••••" />
                          <button onClick={() => setShowPasswords(p => ({ ...p, [f.key]: !p[f.key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            {showPasswords[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                    )}
                    <button onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); alert('Password updated successfully!'); }}
                      disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                      className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/20">
                      <Lock size={16} /><span>Update Password</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-8">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between bg-slate-100/80 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFactorEnabled ? 'bg-emerald-500/15 text-emerald-500' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800 dark:text-white">Authenticator App</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{twoFactorEnabled ? 'Enabled — your account is protected' : 'Add an extra layer of security'}</p>
                      </div>
                    </div>
                    <Toggle enabled={twoFactorEnabled} onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)} />
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-8">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Sessions</h3>
                    <div className="flex items-center gap-2">
                      <Toggle enabled={loginAlerts} onToggle={() => setLoginAlerts(!loginAlerts)} />
                      <span className="text-xs text-slate-500 font-medium">Login alerts</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {sessions.map((s, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-100/80 dark:bg-slate-800/40 rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{s.device}</p>
                          <p className="text-xs text-slate-500">{s.location} · {s.time}</p>
                        </div>
                        {s.current
                          ? <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">This device</span>
                          : <button className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors">Revoke</button>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

           

            {/* ===== BILLING & PLANS ===== */}
            {activeTab === 'billing' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Current Plan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">You're on the <span className="font-bold text-emerald-500">Pro</span> plan.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map(plan => (
                      <div key={plan.id} className={`rounded-2xl p-5 border transition-all ${plan.id === currentPlan
                        ? 'bg-emerald-500/5 border-emerald-500/30 ring-2 ring-emerald-500/20'
                        : 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'}`}
                      >
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{plan.name}</h4>
                        <div className="flex items-baseline gap-1 mt-1 mb-4">
                          <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{plan.price}</span>
                          <span className="text-sm text-slate-500">{plan.period}</span>
                        </div>
                        <ul className="space-y-2 mb-5">
                          {plan.features.map(f => (
                            <li key={f} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <Check size={12} className="text-emerald-500 shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                        <button className={`w-full py-2 rounded-xl text-sm font-bold transition-all ${plan.id === currentPlan
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-default'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-500 hover:text-slate-900'}`}
                        >
                          {plan.id === currentPlan ? 'Current Plan' : 'Upgrade'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Payment Method</h3>
                  <div className="flex items-center justify-between bg-slate-100/80 dark:bg-slate-800/40 rounded-xl px-4 py-3.5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">•••• •••• •••• 4242</p>
                        <p className="text-xs text-slate-500">Expires 12/27</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">Change</button>
                  </div>
                </div>
              </div>
            )}


          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
