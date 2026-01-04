
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Lock, User, AlertCircle, Loader, Globe, Clock, Server, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t, dir, language, setLanguage } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (!success) setError(t('login_error'));
    } catch (err) {
      setError('Connection Failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-hidden flex flex-col" dir={dir}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      {/* Top Navbar */}
      <header className="relative z-10 w-full px-6 md:px-12 py-6 flex justify-between items-center border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-transform hover:scale-110">
            <Shield size={22} className="text-white" />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-lg font-black text-white tracking-tighter uppercase leading-none">CyberShield AI</h1>
            <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mt-1">Defense Infrastructure Grid</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden lg:flex flex-col items-end border-r border-white/10 pr-6">
             <div className="flex items-center gap-2 text-blue-300 font-mono text-xs font-bold">
               <Clock size={14} />
               <span>{currentTime.toLocaleTimeString()}</span>
             </div>
             <span className="text-[10px] text-slate-500 uppercase tracking-tighter">System Terminal Active</span>
           </div>
           <button 
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="group flex items-center gap-2 text-xs font-bold px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 transition-all active:scale-95"
            >
              <Globe size={14} className="group-hover:rotate-12 transition-transform" />
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-0 rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 bg-slate-900/40 backdrop-blur-2xl">
          
          {/* Left Panel: Visual/Status */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/5 border-r border-white/5 relative group">
             <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Security Protocol V1.0
                </div>
                <h2 className="text-4xl font-black text-white leading-[1.1] tracking-tight">
                   The Smart Fortress of <span className="text-blue-500">Sudan</span>.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                   Advanced predictive defense grid utilizing Gemini 3 AI for infrastructure sovereignty.
                </p>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 transition-transform hover:translate-x-2">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                        <Server size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Khartoum Node</div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Sync Stable</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 transition-transform hover:translate-x-2 delay-75">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Firewall Core</div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Active Guard</div>
                    </div>
                </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full group-hover:bg-blue-500/30 transition-all"></div>
          </div>

          {/* Right Panel: Form */}
          <div className="md:col-span-7 p-8 md:p-16 flex flex-col justify-center bg-[#0f172a]/80">
            <div className="mb-10">
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{t('login_title')}</h3>
              <p className="text-slate-400 text-sm font-medium">{t('login_subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t('email_label')}</label>
                <div className="relative group">
                  <div className={`absolute top-0 bottom-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center text-slate-500 group-focus-within:text-blue-500 transition-colors`}>
                    <User size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 ${dir === 'rtl' ? 'pr-12' : 'pl-12'}`}
                    placeholder="operator@scicds.sd"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{t('password_label')}</label>
                <div className="relative group">
                  <div className={`absolute top-0 bottom-0 ${dir === 'rtl' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center text-slate-500 group-focus-within:text-blue-500 transition-colors`}>
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 ${dir === 'rtl' ? 'pr-12' : 'pl-12'}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-shake">
                  <AlertCircle size={18} className="text-red-500 shrink-0" />
                  <span className="text-red-500 text-xs font-bold">{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full relative overflow-hidden group bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-[0_15px_30px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.6)] active:scale-[0.98] disabled:opacity-70"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? <Loader size={18} className="animate-spin" /> : <Shield size={18} />}
                  {loading ? t('logging_in') : t('sign_in')}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t('restricted_access')}</p>
               <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full py-6 text-center border-t border-white/5 bg-slate-950/20 backdrop-blur-md">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">
          University of Africa - Faculty of CS - AI Research Project 2025
        </p>
      </footer>
    </div>
  );
};
